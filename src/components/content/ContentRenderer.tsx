import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ContentBlock } from '@/content/types';
import { cn } from '@/lib/utils';

type CalloutVariant = Extract<ContentBlock, { type: 'callout' }>['variant'];

const CALLOUT_ICONS: Record<CalloutVariant, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
};

const CALLOUT_STYLES: Record<CalloutVariant, string> = {
  info: 'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
  success: 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300',
};

function assertNever(block: never): never {
  throw new Error(`Unsupported content block: ${JSON.stringify(block)}`);
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="mb-4 mt-12 font-heading text-3xl font-bold first:mt-0">{block.text}</h2>
      );

    case 'h3':
      return <h3 className="mb-3 mt-8 font-heading text-2xl font-semibold">{block.text}</h3>;

    case 'p':
      return <p className="text-base leading-relaxed text-foreground/90">{block.text}</p>;

    case 'ul':
      return (
        <ul className="ml-6 list-disc space-y-2 marker:text-brand">
          {block.items.map((item) => (
            <li key={item} className="text-base leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );

    case 'callout': {
      const Icon = CALLOUT_ICONS[block.variant];
      return (
        <Alert className={cn('my-6', CALLOUT_STYLES[block.variant])}>
          <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <AlertDescription className="text-sm leading-relaxed">{block.text}</AlertDescription>
          </div>
        </Alert>
      );
    }

    case 'code':
      return (
        <pre className="my-6 overflow-x-auto rounded-xl border border-border bg-secondary/50 p-4">
          <code className="font-mono text-sm" data-language={block.language}>
            {block.text}
          </code>
        </pre>
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
  return (
    <div className="max-w-none space-y-6">
      {content.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}
