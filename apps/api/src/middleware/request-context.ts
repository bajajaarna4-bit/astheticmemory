import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      requestId: string;
    }
  }
}

/**
 * Gives every request a correlation id (reused when a proxy already supplied
 * one), echoes it back on the response, and logs completion with latency.
 * The id is what the error envelope returns so a user-facing failure can be
 * traced through the logs.
 */
export function requestContext() {
  return (req: Request, res: Response, next: NextFunction) => {
    const incoming = req.header('x-request-id');
    const requestId = incoming && incoming.length <= 64 ? incoming : randomUUID();

    res.locals.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    const startedAt = process.hrtime.bigint();

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
      const slow = durationMs > 750;

      if (slow || res.statusCode >= 500) {
        console.warn('[api] slow/failed request', {
          requestId,
          method: req.method,
          path: req.originalUrl,
          status: res.statusCode,
          durationMs: Math.round(durationMs),
        });
      }
    });

    next();
  };
}
