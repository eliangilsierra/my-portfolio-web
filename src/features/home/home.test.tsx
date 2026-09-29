import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockMedia, placeBelowFold } from '@/test/media';
import { renderApp } from '@/test/render';
import { BlueprintField } from './hero/BlueprintField';

const createBlueprintField = vi.fn(() => vi.fn());
vi.mock('./hero/blueprint-field-gl', () => ({ createBlueprintField }));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  createBlueprintField.mockClear();
});

describe('home page', () => {
  it('shows the name, the featured work, the capabilities and the latest notes', async () => {
    mockMedia({});
    renderApp({ route: '/en' });

    expect(await screen.findByRole('heading', { level: 1, name: /hi, i am/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'SIVIA — AI Visual Inspection' })).toHaveAttribute(
      'href',
      '/en/projects/sivia-visual-inspection',
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Data & AI' })).toBeInTheDocument();
    expect(screen.getByText('PyTorch')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start a conversation/i })).toHaveAttribute(
      'href',
      '/en/contact',
    );
  });

  it('floats the cover of the project under the pointer, or with keyboard focus', async () => {
    mockMedia({ finePointer: true });
    renderApp({ route: '/en' });
    const link = await screen.findByRole('link', { name: 'SIVIA — AI Visual Inspection' });
    const row = link.closest('li')!;
    const covers = () =>
      Array.from(document.querySelectorAll<HTMLImageElement>('[aria-hidden="true"] img'));
    const visible = () => covers().filter((image) => image.classList.contains('opacity-100'));

    fireEvent.pointerEnter(row);
    expect(visible()).toHaveLength(1);

    fireEvent.pointerMove(row.parentElement!, { clientX: 300, clientY: 200 });
    fireEvent.pointerLeave(row.closest('ol')!.parentElement!.parentElement!);
    expect(visible()).toHaveLength(0);

    fireEvent.focus(link);
    expect(visible()).toHaveLength(1);
    fireEvent.blur(link);
    expect(visible()).toHaveLength(0);
  });

  it('drifts the hero layers against a mouse pointer', async () => {
    mockMedia({ finePointer: true });
    renderApp({ route: '/en' });
    const hero = (await screen.findByRole('heading', { level: 1 })).closest('section')!;

    fireEvent.pointerMove(hero, { clientX: 0, clientY: 0 });

    const layer = hero.querySelector<HTMLElement>('[data-depth]')!;
    await waitFor(() => expect(layer.style.transform).not.toBe(''));
  });

  it('assembles the capability map with the scroll when it starts out of view', async () => {
    mockMedia({});
    placeBelowFold();
    renderApp({ route: '/en' });

    await screen.findByRole('heading', { level: 3, name: 'Frontend' });

    const bus = document.querySelector<HTMLElement>('[data-cap-bus]')!;
    await waitFor(() => expect(bus.style.transform).toContain('scale'));
  });
});

describe('BlueprintField', () => {
  it('wakes the WebGL field on the first mouse movement, and stops it on unmount', async () => {
    mockMedia({ finePointer: true });
    vi.stubGlobal('WebGL2RenderingContext', {});
    vi.stubGlobal('requestIdleCallback', (callback: () => void) => {
      callback();
      return 1;
    });
    vi.stubGlobal('cancelIdleCallback', vi.fn());
    const { container, unmount } = render(<BlueprintField />);
    const canvas = container.querySelector('canvas')!;

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(createBlueprintField).not.toHaveBeenCalled();

    fireEvent.pointerMove(window);
    await waitFor(() => expect(canvas).toHaveAttribute('data-ready', 'true'));
    const dispose = createBlueprintField.mock.results[0]!.value as () => void;

    unmount();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('keeps the CSS grid without WebGL 2, when saving data, on touch screens or with reduced motion', async () => {
    mockMedia({ finePointer: true });
    render(<BlueprintField />).unmount();

    vi.stubGlobal('WebGL2RenderingContext', {});
    Object.defineProperty(navigator, 'connection', {
      value: { saveData: true },
      configurable: true,
    });
    render(<BlueprintField />).unmount();
    Reflect.deleteProperty(navigator, 'connection');

    mockMedia({});
    render(<BlueprintField />).unmount();

    mockMedia({ finePointer: true, reducedMotion: true });
    render(<BlueprintField />).unmount();

    fireEvent.pointerMove(window);
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(createBlueprintField).not.toHaveBeenCalled();
  });

  it('uses a short timeout where requestIdleCallback is missing', async () => {
    mockMedia({ finePointer: true });
    vi.stubGlobal('WebGL2RenderingContext', {});
    Reflect.deleteProperty(window, 'requestIdleCallback');
    const { container } = render(<BlueprintField />);

    fireEvent.pointerMove(window);

    await waitFor(() =>
      expect(container.querySelector('canvas')).toHaveAttribute('data-ready', 'true'),
    );
  });
});
