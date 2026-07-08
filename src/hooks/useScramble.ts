import { useEffect } from "react";
import { prefersReduced } from "@/lib/motion";

/**
 * Decode/scramble entrance for section headings (`.h2`), unifying the whole
 * site with the 3D car-title effect. No-op under reduced motion / without JS.
 *
 * Each VISUAL line decodes in place, top to bottom. The catch: the display
 * font is proportional, so random glyphs are a different width than the real
 * letters and re-wrap the heading mid-scramble — a character can flash onto
 * the wrong line and then jump to its real one. To stop that, the heading is
 * rebuilt as one NON-WRAPPING block per measured visual line (inline markup
 * such as the `.text-outline` span is preserved), so a line's scramble can
 * never push text onto another line. Lines resolve left-to-right, staggered
 * top-down; the original responsive markup is restored once done.
 */
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function useScramble() {
  useEffect(() => {
    if (prefersReduced() || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".h2"));
    if (!els.length) return;

    const rafs = new Map<HTMLElement, number>();
    const restores = new Map<HTMLElement, () => void>();
    const isSpace = (ch: string) => ch === " " || ch.charCodeAt(0) === 0xa0;
    const rnd = () => CHARSET[(Math.random() * CHARSET.length) | 0];

    const play = (el: HTMLElement) => {
      const h0 = el.offsetHeight;
      const w0 = el.offsetWidth;
      const originalHTML = el.innerHTML;

      // collect every character with its owner element (for inline markup)
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      let tn: Node | null;
      while ((tn = walker.nextNode())) {
        if ((tn.nodeValue ?? "").length) textNodes.push(tn as Text);
      }
      if (!textNodes.length) return;

      // measure each char's visual line from the real, laid-out text
      const range = document.createRange();
      const chars: { ch: string; owner: Element; line: number; top: number }[] = [];
      const tops: number[] = [];
      for (const node of textNodes) {
        const text = node.nodeValue ?? "";
        const owner = node.parentElement ?? el;
        for (let i = 0; i < text.length; i++) {
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const top = Math.round(range.getBoundingClientRect().top / 4);
          chars.push({ ch: text[i], owner, line: 0, top });
          if (!isSpace(text[i])) tops.push(top);
        }
      }
      const order = [...new Set(tops)].sort((a, b) => a - b);
      const lineOf = new Map(order.map((t, i) => [t, i]));
      const lineCount = Math.max(1, order.length);
      let lastLine = 0; // spaces inherit the previous glyph's line
      for (const c of chars) {
        c.line = isSpace(c.ch) ? lastLine : lineOf.get(c.top) ?? lastLine;
        if (!isSpace(c.ch)) lastLine = c.line;
      }

      // rebuild as one non-wrapping block per line, preserving inline owners
      const counts = new Array(lineCount).fill(0);
      const infos: { node: Text; text: string; base: number; line: number }[] = [];
      const wraps: HTMLElement[] = [];
      el.replaceChildren();
      for (let L = 0; L < lineCount; L++) {
        const w = document.createElement("span");
        w.style.display = "block";
        w.style.whiteSpace = "nowrap";
        wraps.push(w);
        el.appendChild(w);
      }
      let curLine = -1;
      let curOwner: Element | null = null;
      let container: HTMLElement | null = null;
      let buffer = "";
      let base = 0;
      const flush = () => {
        if (!buffer || !container) return;
        const t = document.createTextNode(buffer);
        container.appendChild(t);
        infos.push({ node: t, text: buffer, base, line: curLine });
        buffer = "";
      };
      for (const c of chars) {
        if (c.line !== curLine || c.owner !== curOwner) {
          flush();
          curLine = c.line;
          curOwner = c.owner;
          if (c.owner !== el) {
            const clone = c.owner.cloneNode(false) as HTMLElement;
            wraps[curLine].appendChild(clone);
            container = clone;
          } else {
            container = wraps[curLine];
          }
          base = counts[curLine];
        }
        buffer += c.ch;
        counts[curLine]++;
      }
      flush();

      // schedule: each line decodes over its own window, next starts at 80%
      const start = new Array(lineCount).fill(0);
      const dur = new Array(lineCount).fill(0);
      let cursor = 0;
      for (let L = 0; L < lineCount; L++) {
        start[L] = Math.round(cursor);
        dur[L] = Math.max(16, counts[L] * 2);
        cursor = start[L] + dur[L] * 0.8;
      }
      const totalFrames = Math.max(...start.map((s, L) => s + dur[L]));

      // freeze the box so a wide scramble can't nudge anything around it.
      // width matters as much as height here: the rebuilt lines are nowrap and
      // random glyphs are wider than the real letters, so without a pinned width
      // the heading's intrinsic size balloons and, in a content-sized grid/flex
      // track, steals space from a neighbouring column (the hero image jumps).
      const prevH = el.style.height;
      const prevW = el.style.width;
      const prevO = el.style.overflow;
      el.style.height = `${h0}px`;
      el.style.width = `${w0}px`;
      el.style.overflow = "hidden";

      const restore = () => {
        const r = rafs.get(el);
        if (r) cancelAnimationFrame(r);
        rafs.delete(el);
        el.innerHTML = originalHTML;
        el.style.height = prevH;
        el.style.width = prevW;
        el.style.overflow = prevO;
        restores.delete(el);
      };
      restores.set(el, restore);

      let frame = 0;
      const tick = () => {
        frame++;
        for (const info of infos) {
          const localF = frame - start[info.line];
          const resolved =
            localF < 0 ? 0 : Math.floor((localF / dur[info.line]) * counts[info.line]);
          let out = "";
          for (let i = 0; i < info.text.length; i++) {
            const ch = info.text[i];
            out += isSpace(ch) ? ch : info.base + i < resolved ? ch : rnd();
          }
          info.node.nodeValue = out;
        }
        if (frame < totalFrames) rafs.set(el, requestAnimationFrame(tick));
        else restore(); // settle by restoring the original responsive markup
      };
      rafs.set(el, requestAnimationFrame(tick));
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            play(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.25 }
    );
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      restores.forEach((restore) => restore());
      restores.clear();
      rafs.forEach((r) => cancelAnimationFrame(r));
      rafs.clear();
    };
  }, []);
}
