import { Router } from 'express';
import { APP_META, MODULES, PHASES } from '../config/app-meta';

export const metaRouter = Router();

/**
 * Contract discovery endpoint. The web app calls this at boot in Phase 2 to
 * gate features behind server-reported availability instead of build flags.
 */
metaRouter.get('/', (_req, res) => {
  res.json({
    ok: true,
    data: {
      ...APP_META,
      modules: MODULES,
      phases: PHASES,
      endpoints: {
        health: '/health',
        ready: '/health/ready',
        meta: '/v1/meta',
      },
    },
  });
});
