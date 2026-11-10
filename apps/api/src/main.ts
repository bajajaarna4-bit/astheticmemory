import 'dotenv/config';
import { prisma } from '@velora/db';
import { createApp } from './app';
import { env } from './config/env';

const SHUTDOWN_GRACE_MS = 8000;

function bootstrap() {
  const config = env();
  const app = createApp();

  const server = app.listen(config.PORT, () => {
    console.log(`[api] VELORA API listening on http://localhost:${config.PORT} (${config.NODE_ENV})`);
    console.log(`[api] contract: http://localhost:${config.PORT}/v1/meta`);
  });

  const shutdown = (signal: string) => {
    console.log(`[api] ${signal} received — draining connections`);
    server.close(() => {
      void prisma
        .$disconnect()
        .catch(() => undefined)
        .finally(() => process.exit(0));
    });

    // Never hang a container restart on a stuck socket.
    const timer = setTimeout(() => process.exit(1), SHUTDOWN_GRACE_MS);
    timer.unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    console.error('[api] unhandled rejection', reason);
  });
}

bootstrap();
