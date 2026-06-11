import { useEffect } from "react";
import { cancelSmoothScroll, smoothTo } from "@/lib/scroll";

/**
 * JS-driven eased anchor scrolling, cancelled by wheel/touch input.
 * Handles "#id" and same-page "/#id" links; cross-page hash links are
 * left to Next's <Link>. Registered in the capture phase so the
 * preventDefault() is visible to Link's own click handler.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const cancel = () => cancelSmoothScroll();
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.(
        'a[href*="#"]'
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const hashIndex = href.indexOf("#");
      if (hashIndex < 0) return;
      const path = href.slice(0, hashIndex);
      if (path && path !== window.location.pathname) return;
      const id = href.slice(hashIndex);
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      smoothTo(el.getBoundingClientRect().top + window.scrollY - 64);
      history.replaceState(null, "", id);
    };
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      document.removeEventListener("click", onClick, true);
    };
  }, []);
}
