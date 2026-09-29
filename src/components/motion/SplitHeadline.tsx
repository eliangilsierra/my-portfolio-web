import type { CSSProperties } from 'react';

interface SplitHeadlineProps {
  text: string;
  /** Delay in milliseconds before the first character rises. */
  delay?: number;
  /**
   * Render only the animated copy. Use it when the heading already provides the accessible text,
   * for example when the visual layout splits one heading into several lines of different sizes.
   */
  visualOnly?: boolean;
}

interface SplitWord {
  key: string;
  /** Each character with its position in the whole text, which staggers the animation. */
  chars: { char: string; index: number }[];
}

function splitWords(text: string): SplitWord[] {
  const words = text.split(' ').filter(Boolean);
  let offset = 0;
  return words.map((word, position) => {
    const chars = Array.from(word, (char, index) => ({ char, index: offset + index }));
    offset += chars.length;
    return { key: `${position}-${word}`, chars };
  });
}

/**
 * A headline whose characters rise out of their words on load, in CSS, so it plays before
 * hydration (see `.split-word` / `.split-char` in styles/motion.css). Place it inside the heading
 * element: assistive technology reads the plain text, the animated copy is hidden from it.
 */
export function SplitHeadline({ text, delay = 0, visualOnly = false }: SplitHeadlineProps) {
  const words = splitWords(text);

  return (
    <>
      {!visualOnly && <span className="sr-only">{text}</span>}
      <span aria-hidden="true" style={{ '--split-delay': `${delay}ms` } as CSSProperties}>
        {words.map((word, position) => (
          <span key={word.key}>
            <span className="split-word">
              {word.chars.map(({ char, index }) => (
                <span key={index} className="split-char" style={{ '--i': index } as CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
            {position < words.length - 1 && ' '}
          </span>
        ))}
      </span>
    </>
  );
}
