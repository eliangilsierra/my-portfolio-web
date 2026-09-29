import { MEDIA } from '@/config/motion';

type Feature = keyof typeof MEDIA;

/**
 * Stands in for the device: which motion-related media queries match. Returns a function that
 * flips a feature later and notifies subscribers, like the operating system would.
 */
export function mockMedia(features: Partial<Record<Feature, boolean>>) {
  const state = { ...features };
  const listeners = new Set<() => void>();
  const matches = (query: string) =>
    Object.entries(MEDIA).some(([feature, media]) => media === query && state[feature as Feature]);

  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return matches(query);
        },
        media: query,
        onchange: null,
        addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
        removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  );

  return (feature: Feature, value: boolean) => {
    state[feature] = value;
    listeners.forEach((listener) => {
      listener();
    });
  };
}

/** Places every element far below the viewport, so scroll reveals consider it unseen. */
export function placeBelowFold() {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 5000,
    bottom: 5400,
    left: 0,
    right: 800,
    width: 800,
    height: 400,
    x: 0,
    y: 5000,
    toJSON: () => ({}),
  });
}
