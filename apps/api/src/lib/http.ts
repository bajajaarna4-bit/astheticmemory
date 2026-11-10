import type { NextFunction, Request, Response } from 'express';
import { isProduction } from '../config/env';

/** Predictable error envelope shared by every endpoint. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Not allowed') {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static conflict(message: string, details?: unknown) {
    return new ApiError(409, 'CONFLICT', message, details);
  }
}

/** Wraps async handlers so rejected promises reach the error middleware. */
export function asyncHandler<T extends Request>(
  handler: (req: T, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: T, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}

export function errorHandler() {
  return (error: unknown, req: Request, res: Response, _next: NextFunction) => {
    const requestId = res.locals.requestId as string | undefined;

    if (error instanceof ApiError) {
      res.status(error.status).json({
        ok: false,
        error: { code: error.code, message: error.message, details: error.details },
        requestId,
      });
      return;
    }

    // Unknown errors: log the stack, never leak it to the client in production.
    console.error('[api] unhandled error', { requestId, path: req.path, error });

    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: isProduction() ? 'Something went wrong' : String(error),
      },
      requestId,
    });
  };
}
