import { prisma } from '@velora/db';
import { Router } from 'express';
import { APP_META } from '../config/app-meta';
import { env } from '../config/env';
import { asyncHandler } from '../lib/http';

const DB_PROBE_TIMEOUT_MS = 1500;

type ProbeResult = 'ok' | 'unreachable' | 'timeout' | 'not_configured';

/** Races the query against a timeout so a hung socket cannot stall a probe. */
async function probeDatabase(): Promise<ProbeResult> {
  const query = prisma.$queryRaw`SELECT 1`.then(
    () => 'ok' as const,
    () => 'unreachable' as const,
  );

  const timeout = new Promise<ProbeResult>((resolve) => {
    const timer = setTimeout(() => resolve('timeout'), DB_PROBE_TIMEOUT_MS);
    timer.unref?.();
  });

  return Promise.race([query, timeout]);
}

export const healthRouter = Router();

/** Liveness: the process is up and serving traffic. Never touches the database. */
healthRouter.get('/', (_req, res) => {
  res.json({
    ok: true,
    data: {
      status: 'live',
      service: APP_META.name,
      version: APP_META.version,
      environment: env().NODE_ENV,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * Readiness: 200 only when the datastore answers. Phase 1 keeps Postgres
 * optional for local UI work, so the response lists each dependency
 * individually instead of failing the whole process.
 */
healthRouter.get(
  '/ready',
  asyncHandler(async (_req, res) => {
    const config = env();
    const database = config.DATABASE_URL ? await probeDatabase() : 'not_configured';
    const cache: ProbeResult = config.REDIS_URL ? 'ok' : 'not_configured';
    const ready = database === 'ok';

    res.status(ready ? 200 : 503).json({
      ok: ready,
      data: {
        status: ready ? 'ready' : 'degraded',
        checks: { database, cache },
        timestamp: new Date().toISOString(),
      },
    });
  }),
);
