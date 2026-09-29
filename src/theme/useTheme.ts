import { useCallback, useSyncExternalStore } from 'react';
import { SITE } from '@/config/site';
import {
  DARK_QUERY,
  applyTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
  systemPrefersDark,
  type Theme,
} from './theme';

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => {
    listener();
  });
}

function syncWithPreference(): void {
  applyTheme(resolveTheme(readStoredTheme(SITE.themeStorageKey), systemPrefersDark()));
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // The inline script in <head> normally has done this already; repeating it is harmless and keeps
  // the theme right where that script does not run (tests, embedded previews).
  syncWithPreference();

  const query = window.matchMedia(DARK_QUERY);
  const onSystemChange = () => {
    // A stored choice always wins over the operating system.
    if (readStoredTheme(SITE.themeStorageKey) === null) {
      syncWithPreference();
      notify();
    }
  };
  query.addEventListener('change', onSystemChange);

  return () => {
    listeners.delete(listener);
    query.removeEventListener('change', onSystemChange);
  };
}

/** The DOM is the source of truth, so the inline head script and this hook can never disagree. */
function getSnapshot(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

export function useTheme(): { theme: Theme; setTheme: (theme: Theme) => void } {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    storeTheme(SITE.themeStorageKey, next);
    applyTheme(next);
    notify();
  }, []);

  return { theme, setTheme };
}
