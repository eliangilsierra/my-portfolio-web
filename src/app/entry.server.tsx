import { renderToReadableStream } from 'react-dom/server';
import { ServerRouter, type EntryContext } from 'react-router';
import { logger } from '@/lib/logger';

/**
 * Renders a page to HTML at build time (see `prerender` in react-router.config.ts). There is no
 * runtime server, so unlike the framework default this waits for the whole document and needs no
 * crawler detection (`isbot`).
 */
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  let statusCode = responseStatusCode;

  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        statusCode = 500;
        logger.error('Rendering error while prerendering', error);
      },
    },
  );

  // Static generation: the document must be complete before it is written to disk.
  await body.allReady;

  responseHeaders.set('Content-Type', 'text/html');
  return new Response(body, { headers: responseHeaders, status: statusCode });
}
