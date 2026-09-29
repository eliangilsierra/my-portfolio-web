/**
 * Scroll reveals only hide what the visitor cannot see yet. Content already on screen when the
 * page hydrates stays exactly as prerendered, so nothing flashes out and back in.
 *
 * Every reveal on a page asks at once, during hydration. Answering them one by one would interleave
 * layout reads with style writes (layout thrashing), so questions are queued and answered together
 * in the next frame: all measurements first, then every callback.
 */
const queue = new Map<Element, () => void>();
let frame = 0;

function flush(): void {
  frame = 0;
  const viewportBottom = window.innerHeight;
  const unseen = [...queue].filter(
    ([element]) => element.getBoundingClientRect().top > viewportBottom,
  );
  queue.clear();
  for (const [, reveal] of unseen) reveal();
}

/**
 * Calls `reveal` in the next frame if `element` is below the fold then. Returns a function that
 * cancels the request (for components that unmount before the frame).
 */
export function whenBelowFold(element: Element, reveal: () => void): () => void {
  queue.set(element, reveal);
  frame ||= requestAnimationFrame(flush);
  return () => {
    queue.delete(element);
  };
}
