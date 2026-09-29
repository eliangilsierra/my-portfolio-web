export type Theme = 'light' | 'dark';

const DARK_QUERY = '(prefers-color-scheme: dark)';

export function readStoredTheme(storageKey: string): Theme | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies): follow the system instead.
    return null;
  }
}

export function storeTheme(storageKey: string, theme: Theme): void {
  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {
    // Persisting the preference is best effort.
  }
}

export function systemPrefersDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

/** A stored choice wins; otherwise follow the operating system. */
export function resolveTheme(stored: Theme | null, prefersDark: boolean): Theme {
  return stored ?? (prefersDark ? 'dark' : 'light');
}

export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void {
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

/**
 * Inline script for `<head>`: applies the theme before the first paint so a dark-mode visitor never
 * sees a light flash. It mirrors `resolveTheme` + `applyTheme`, so keep the two in sync.
 */
export function createThemeInitScript(storageKey: string): string {
  return `(function(){try{var s=localStorage.getItem(${JSON.stringify(storageKey)});var d=s?s==='dark':matchMedia(${JSON.stringify(DARK_QUERY)}).matches;var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light'}catch(e){}})()`;
}

export { DARK_QUERY };
