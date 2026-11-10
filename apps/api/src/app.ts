import cors from 'cors';
import express, { type RequestHandler } from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { ApiError, errorHandler } from './lib/http';
import { requestContext } from './middleware/request-context';
import { healthRouter } from './routes/health';
import { metaRouter } from './routes/meta';

/**
 * Composes the HTTP surface. Kept as a factory (rather than a module-level
 * singleton) so tests can boot an isolated instance on an ephemeral port.
 */
export function createApp() {
  const config = env();
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: config.CORS_ORIGINS,
      credentials: true,
      maxAge: 86_400,
    }),
  );

  app.use(express.json({ limit: '1mb' }) as RequestHandler);
  app.use(express.urlencoded({ extended: true, limit: '1mb' }) as RequestHandler);
  app.use(requestContext());

  app.get('/', (_req, res) => {
    res.redirect(302, '/v1/meta');
  });

  app.use('/health', healthRouter);
  app.use('/v1/meta', metaRouter);
  // Same probes under the versioned prefix for clients that only know /v1.
  app.use('/v1/health', healthRouter);

  app.use((req, _res, next) => {
    next(ApiError.notFound(`No route for ${req.method} ${req.originalUrl}`));
  });

  app.use(errorHandler());

  return app;
}
