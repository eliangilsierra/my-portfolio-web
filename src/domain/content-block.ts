export const CALLOUT_VARIANTS = ['info', 'warning', 'success'] as const;

export type CalloutVariant = (typeof CALLOUT_VARIANTS)[number];

/** A unit of long-form content. Text is plain text: it is never interpreted as HTML. */
export type ContentBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'callout'; variant: CalloutVariant; text: string }
  | { type: 'code'; language?: string | undefined; text: string };
