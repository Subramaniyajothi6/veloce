type FrameFn = (time: number) => void;

const subscribers = new Set<FrameFn>();
let running = false;

function tick(time: number) {
  if (!subscribers.size) {
    running = false;
    return;
  }
  subscribers.forEach((fn) => fn(time));
  requestAnimationFrame(tick);
}

/**
 * Subscribe to a single shared requestAnimationFrame loop
 * (one engine for parallax, gallery, manifesto, cursor, …).
 * Returns an unsubscribe function.
 */
export function onFrame(fn: FrameFn): () => void {
  subscribers.add(fn);
  if (!running) {
    running = true;
    requestAnimationFrame(tick);
  }
  return () => {
    subscribers.delete(fn);
  };
}
