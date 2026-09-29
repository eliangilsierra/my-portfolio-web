import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup, configure } from '@testing-library/react';

// Routes are code-split, so the first render of a page waits for a dynamic import. The default
// one-second wait is too tight when the whole suite is loading modules in parallel.
configure({ asyncUtilTimeout: 5000 });

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

// jsdom does not implement matchMedia, which the theme hook relies on.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- lib.dom types matchMedia as always present
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// jsdom does not implement scrolling.
window.scrollTo = () => undefined;

// jsdom has no ResizeObserver, which the smooth scroller (Lenis) measures the page with.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- lib.dom types it as always present
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {
      return undefined;
    }
    unobserve() {
      return undefined;
    }
    disconnect() {
      return undefined;
    }
  };
}
