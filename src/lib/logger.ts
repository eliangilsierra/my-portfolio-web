/**
 * Single entry point for diagnostics so a reporting service can be plugged in later
 * without touching call sites.
 */
export const logger = {
  warn: (message: string, ...context: unknown[]) =>
    console.warn(`[portfolio] ${message}`, ...context),
  error: (message: string, ...context: unknown[]) =>
    console.error(`[portfolio] ${message}`, ...context),
};
