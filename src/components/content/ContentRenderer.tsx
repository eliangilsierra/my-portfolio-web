import type { CalloutVariant, ContentBlock } from '@/domain/content-block';
import { useI18n } from '@/i18n/useI18n';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { slugify } from '@/lib/text';
import { cn } from '@/lib/utils';

const CALLOUT_STYLES: Record<CalloutVariant, { box: string; label: string }> = {
  info: { box: 'border-l-brand', label: 'text-brand' },
  warning: { box: 'border-l-warning', label: 'text-warning' },
  success: { box: 'border-l-success', label: 'text-success' },
};

function assertNever(block: never): never {
  throw new Error(`Unsupported content block: ${JSON.stringify(block)}`);
}

function Block({ block, t }: { block: ContentBlock; t: Dictionary }) {
  switch (block.type) {
    case 'h2':
      // Numbered by a CSS counter (reset on the renderer), like the sections of a specification.
      return (
        <h2
          id={slugify(block.text)}
          className="mt-16 mb-6 flex items-baseline gap-4 text-3xl leading-tight font-semibold tracking-tight [counter-increment:section] before:shrink-0 before:annotation before:text-brand before:content-[counter(section,decimal-leading-zero)] first:mt-0 md:text-4xl"
        >
          {block.text}
        </h2>
      );

    case 'h3':
      return (
        <h3 className="mt-10 mb-3 text-xl leading-snug font-semibold tracking-tight md:text-2xl">
          {block.text}
        </h3>
      );

    case 'p':
      return (
        <p className="max-w-[68ch] text-[1.075rem] leading-[1.75] text-foreground/85">
          {block.text}
        </p>
      );

    case 'ul':
      return (
        <ul className="max-w-[68ch] space-y-2.5 border-l border-border pl-5">
          {block.items.map((item) => (
            <li
              key={item}
              className="relative text-[1.05rem] leading-relaxed text-foreground/85 before:absolute before:top-[0.8em] before:-left-5 before:h-px before:w-3 before:bg-brand"
            >
              {item}
            </li>
          ))}
        </ul>
      );

    case 'callout': {
      const style = CALLOUT_STYLES[block.variant];
      return (
        <div
          role="note"
          className={cn(
            'my-10 max-w-[68ch] border border-l-2 border-border bg-card/80 p-5 md:p-6',
            style.box,
          )}
        >
          <p className={cn('mb-2 annotation', style.label)}>{t.callouts[block.variant]}</p>
          <p className="text-sm leading-relaxed">{block.text}</p>
        </div>
      );
    }

    case 'code':
      return (
        <div className="my-8 border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-2 annotation text-muted-foreground">
            <span>{block.language ?? 'text'}</span>
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="size-1.5 bg-border-strong/40" />
              <span className="size-1.5 bg-border-strong/40" />
              <span className="size-1.5 bg-brand" />
            </span>
          </div>
          {/* Long lines scroll sideways, so the block must be reachable (and scrollable) by keyboard. */}
          <pre
            role="group"
            aria-label={t.a11y.codeExample}
            tabIndex={0}
            className="overflow-x-auto p-4 text-sm leading-relaxed focus-ring md:p-5"
          >
            <code className="font-mono" data-language={block.language}>
              {block.text}
            </code>
          </pre>
        </div>
      );

    default:
      return assertNever(block);
  }
}

interface ContentRendererProps {
  content: ContentBlock[];
}

/** Renders structured content blocks. Text is rendered as React text, never as HTML. */
export function ContentRenderer({ content }: ContentRendererProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 [counter-reset:section]">
      {content.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} t={t} />
      ))}
    </div>
  );
}
