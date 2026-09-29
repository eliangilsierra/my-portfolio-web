import {
  applyTheme,
  createThemeInitScript,
  readStoredTheme,
  resolveTheme,
  storeTheme,
} from './theme';

const KEY = 'theme';

describe('resolveTheme', () => {
  it('prefers the stored choice over the system', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('follows the system when nothing is stored', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });
});

describe('stored theme', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('round-trips valid values and ignores anything else', () => {
    storeTheme(KEY, 'dark');
    expect(readStoredTheme(KEY)).toBe('dark');

    window.localStorage.setItem(KEY, 'sepia');
    expect(readStoredTheme(KEY)).toBeNull();
  });

  it('survives storage being unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(readStoredTheme(KEY)).toBeNull();
    expect(() => {
      storeTheme(KEY, 'dark');
    }).not.toThrow();
  });
});

describe('applyTheme', () => {
  it('toggles the dark class and the colour scheme', () => {
    const root = document.createElement('html');

    applyTheme('dark', root);
    expect(root).toHaveClass('dark');
    expect(root.style.colorScheme).toBe('dark');

    applyTheme('light', root);
    expect(root).not.toHaveClass('dark');
    expect(root.style.colorScheme).toBe('light');
  });
});

describe('createThemeInitScript', () => {
  function runScript() {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call -- executing the very script the page inlines
    new Function(createThemeInitScript(KEY))();
  }

  afterEach(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
  });

  it('applies a stored dark theme before paint', () => {
    window.localStorage.setItem(KEY, 'dark');

    runScript();

    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('lets a stored light theme beat a dark system preference', () => {
    window.localStorage.setItem(KEY, 'light');
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);

    runScript();

    expect(document.documentElement).not.toHaveClass('dark');
    vi.restoreAllMocks();
  });

  it('follows the system when nothing is stored', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);

    runScript();

    expect(document.documentElement).toHaveClass('dark');
    vi.restoreAllMocks();
  });

  it('never throws, even when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(() => {
      runScript();
    }).not.toThrow();
    vi.restoreAllMocks();
  });
});
