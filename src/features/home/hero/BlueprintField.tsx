import { useEffect, useRef } from 'react';
import { usePointerMotion } from '@/components/motion/useMediaQuery';
import { cn } from '@/lib/utils';

/** How long the browser may stay busy before the field starts anyway (ms). */
const IDLE_TIMEOUT = 1500;

interface NetworkInformation {
  saveData?: boolean;
}

/** WebGL 2 is available and the visitor has not asked to save data. */
function canRunField(): boolean {
  if (typeof WebGL2RenderingContext === 'undefined') return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return connection?.saveData !== true;
}

function whenIdle(callback: () => void): () => void {
  if ('requestIdleCallback' in window) {
    const handle = window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT });
    return () => window.cancelIdleCallback(handle);
  }
  // Safari has no requestIdleCallback: a short timeout keeps the field off the critical path.
  const handle = setTimeout(callback, IDLE_TIMEOUT / 5);
  return () => clearTimeout(handle);
}

/**
 * The hero backdrop. A CSS graph-paper grid is always there (prerendered, no JavaScript). With a
 * mouse, the first pointer movement wakes a WebGL canvas with a living version of the same grid:
 * its lens follows the pointer, so there is nothing to gain before the pointer moves. The renderer
 * is a separate chunk loaded then, when the browser is idle, so it never competes with the first
 * paint; touch screens, reduced motion and data saving keep the CSS grid.
 */
export function BlueprintField({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const enabled = usePointerMotion();

  useEffect(() => {
    const element = canvas.current;
    if (!element || !enabled || !canRunField()) return;

    let dispose: (() => void) | undefined;
    let cancelIdle: (() => void) | undefined;
    let cancelled = false;

    const wake = () => {
      cancelIdle = whenIdle(() => {
        void import('./blueprint-field-gl').then(({ createBlueprintField }) => {
          if (cancelled) return;
          dispose = createBlueprintField(element);
          element.dataset.ready = 'true';
        });
      });
    };
    window.addEventListener('pointermove', wake, { once: true, passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener('pointermove', wake);
      cancelIdle?.();
      dispose?.();
      delete element.dataset.ready;
    };
  }, [enabled]);

  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 -z-10', className)}>
      <canvas
        ref={canvas}
        className="peer absolute inset-0 size-full opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100"
      />
      <div className="absolute inset-0 bp-grid bp-grid-fade transition-opacity duration-1000 peer-data-[ready=true]:opacity-0" />
    </div>
  );
}
