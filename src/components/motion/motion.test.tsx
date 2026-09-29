import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router';
import { mockMedia, placeBelowFold } from '@/test/media';
import { Flip } from 'gsap/Flip';
import { gsap, ScrollTrigger } from './gsap';
import { MotionProvider } from './MotionProvider';
import { RevealText } from './RevealText';
import { ScrollReveal } from './ScrollReveal';
import { useScrollLock } from './smooth-scroll';
import { SplitHeadline } from './SplitHeadline';
import { useFlip } from './useFlip';
import { useMagnetic } from './useMagnetic';
import { useFinePointer, usePointerMotion, usePrefersReducedMotion } from './useMediaQuery';

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.removeAttribute('class');
  document.documentElement.removeAttribute('style');
});

describe('media query hooks', () => {
  it('follow the device and update when it changes', () => {
    const setFeature = mockMedia({ finePointer: true });
    const { result } = renderHook(() => ({
      reduced: usePrefersReducedMotion(),
      fine: useFinePointer(),
      pointer: usePointerMotion(),
    }));

    expect(result.current).toEqual({ reduced: false, fine: true, pointer: true });

    act(() => setFeature('reducedMotion', true));

    expect(result.current).toEqual({ reduced: true, fine: true, pointer: false });
  });
});

describe('SplitHeadline', () => {
  it('reads as plain text and animates a hidden copy, one character at a time', () => {
    const { container } = render(
      <h1>
        <SplitHeadline text="Hola  mundo" delay={100} />
      </h1>,
    );

    expect(screen.getByRole('heading', { name: 'Hola mundo' })).toBeInTheDocument();
    const chars = container.querySelectorAll<HTMLElement>('.split-char');
    expect(chars).toHaveLength(9);
    expect(chars[8]?.style.getPropertyValue('--i')).toBe('8');
    expect(container.querySelectorAll('.split-word')).toHaveLength(2);
  });

  it('leaves the accessible text to the heading when asked to', () => {
    const { container } = render(<SplitHeadline text="Name" visualOnly />);

    expect(container.querySelector('.sr-only')).toBeNull();
  });
});

const nextFrame = () => act(() => new Promise((resolve) => requestAnimationFrame(resolve)));

describe('ScrollReveal', () => {
  it('hides unseen content, measured together in the next frame, until it scrolls into view', async () => {
    mockMedia({});
    placeBelowFold();
    render(
      <ScrollReveal items="li">
        <ul>
          <li>one</li>
          <li>two</li>
        </ul>
      </ScrollReveal>,
    );
    expect(screen.getByText('one').style.opacity).toBe('');

    await nextFrame();

    expect(screen.getByText('one').style.opacity).toBe('0');
    expect(screen.getByText('two').style.opacity).toBe('0');
  });

  it('leaves content that is already on screen, and everything under reduced motion, untouched', async () => {
    mockMedia({});
    const { rerender } = render(<ScrollReveal variant="clip">visible</ScrollReveal>);
    await nextFrame();
    expect(screen.getByText('visible').style.opacity).toBe('');

    mockMedia({ reducedMotion: true });
    placeBelowFold();
    rerender(<ScrollReveal variant="draw">visible</ScrollReveal>);
    await nextFrame();
    expect(screen.getByText('visible').style.transform).toBe('');
  });

  it('forgets a pending reveal when it unmounts before the frame', async () => {
    mockMedia({});
    placeBelowFold();
    const from = vi.spyOn(gsap, 'from');
    const { unmount } = render(<ScrollReveal>gone</ScrollReveal>);

    unmount();
    await nextFrame();

    expect(from).not.toHaveBeenCalled();
  });
});

describe('RevealText', () => {
  it('clips unseen text, then rises it line by line when it enters the viewport', async () => {
    mockMedia({});
    placeBelowFold();
    render(
      <RevealText as="h2" id="title">
        A title
      </RevealText>,
    );
    const heading = screen.getByRole('heading', { level: 2 });

    await nextFrame();
    expect(heading.style.clipPath).toContain('inset');

    const trigger = ScrollTrigger.getAll().find((candidate) => candidate.trigger === heading)!;
    act(() => {
      trigger.vars.onEnter?.(trigger);
    });

    expect(heading.style.clipPath).toBe('none');
    expect(heading).toHaveAttribute('id', 'title');
    expect(heading).toHaveTextContent('A title');
  });

  it('does not touch the text with reduced motion', () => {
    mockMedia({ reducedMotion: true });
    placeBelowFold();
    render(<RevealText>Plain</RevealText>);

    expect(screen.getByText('Plain').children).toHaveLength(0);
  });
});

function Magnet() {
  const ref = useMagnetic<HTMLButtonElement>(0.5);
  return <button ref={ref}>magnet</button>;
}

describe('useMagnetic', () => {
  it('leans towards the pointer and settles back when it leaves', async () => {
    mockMedia({ finePointer: true });
    render(<Magnet />);
    const button = screen.getByRole('button');

    fireEvent.pointerMove(button, { clientX: 400, clientY: 300 });
    await waitFor(() => expect(Number(gsap.getProperty(button, 'x'))).toBeGreaterThan(0));

    fireEvent.pointerLeave(button);
    await waitFor(() => expect(Number(gsap.getProperty(button, 'x'))).toBeCloseTo(0, 0));
  });

  it('does nothing on touch screens', () => {
    mockMedia({});
    render(<Magnet />);
    const button = screen.getByRole('button');

    fireEvent.pointerMove(button, { clientX: 400, clientY: 300 });

    expect(button.style.transform).toBe('');
  });
});

function FlipList({ items, onReady }: { items: string[]; onReady: (capture: () => void) => void }) {
  const { scope, capture } = useFlip<HTMLUListElement>(items.join());
  useEffect(() => onReady(capture));
  return (
    <ul ref={scope}>
      {items.map((item) => (
        <li key={item} data-flip-id={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}

describe('useFlip', () => {
  it('animates from the captured layout once the list has changed', () => {
    mockMedia({});
    const from = vi.spyOn(Flip, 'from');
    let capture: () => void = () => undefined;
    const { rerender } = render(<FlipList items={['a', 'b']} onReady={(fn) => (capture = fn)} />);

    capture();
    rerender(<FlipList items={['b', 'c']} onReady={(fn) => (capture = fn)} />);

    expect(from).toHaveBeenCalledTimes(1);
    const [, vars] = from.mock.calls[0]!;
    expect(() => {
      vars?.onEnter?.([screen.getByText('c')]);
    }).not.toThrow();
  });

  it('skips the animation with reduced motion', () => {
    mockMedia({ reducedMotion: true });
    const from = vi.spyOn(Flip, 'from');
    let capture: () => void = () => undefined;
    const { rerender } = render(<FlipList items={['a']} onReady={(fn) => (capture = fn)} />);

    capture();
    rerender(<FlipList items={['b']} onReady={(fn) => (capture = fn)} />);

    expect(from).not.toHaveBeenCalled();
  });
});

function LockButtons() {
  const { lock, unlock } = useScrollLock();
  return (
    <>
      <button onClick={lock}>lock</button>
      <button onClick={unlock}>unlock</button>
    </>
  );
}

describe('MotionProvider', () => {
  it('runs smooth scrolling for a mouse, and scroll locks pause it', () => {
    mockMedia({ finePointer: true });
    const { unmount } = render(
      <MemoryRouter>
        <MotionProvider>
          <LockButtons />
        </MotionProvider>
      </MemoryRouter>,
    );

    expect(document.documentElement).toHaveClass('lenis');

    fireEvent.click(screen.getByRole('button', { name: 'lock' }));
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(document.documentElement).toHaveClass('lenis-stopped');

    fireEvent.click(screen.getByRole('button', { name: 'unlock' }));
    expect(document.documentElement.style.overflow).toBe('');

    unmount();
    expect(document.documentElement).not.toHaveClass('lenis');
  });

  it('keeps native scrolling on touch screens and with reduced motion', () => {
    mockMedia({ finePointer: true, reducedMotion: true });
    render(
      <MemoryRouter>
        <MotionProvider>
          <LockButtons />
        </MotionProvider>
      </MemoryRouter>,
    );

    expect(document.documentElement).not.toHaveClass('lenis');
    fireEvent.click(screen.getByRole('button', { name: 'lock' }));
    expect(document.documentElement.style.overflow).toBe('hidden');
  });
});
