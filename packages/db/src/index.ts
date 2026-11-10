import { PrismaClient } from '@prisma/client';

/**
 * Prisma singleton. In dev, Next/tsx hot-reload re-evaluates modules; caching
 * the client on globalThis prevents a new pool per reload until Postgres runs
 * out of connections.
 */
const globalForPrisma = globalThis as unknown as { veloraPrisma?: PrismaClient };

export const prisma =
  globalForPrisma.veloraPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.veloraPrisma = prisma;
}

// Re-export the generated namespace so apps only depend on @velora/db.
export * from '@prisma/client';
export { Prisma } from '@prisma/client';

/** Money never leaves the database as a float: everything is minor units. */
export const rupeesToPaise = (rupees: number): number => Math.round(rupees * 100);

/** Formats paise for logs and plain-text surfaces (not for UI — the web app has its own formatter). */
export function formatPaise(paise: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

/**
 * pgvector writes cannot go through the query builder (the column is
 * `Unsupported`). This helper is the one sanctioned escape hatch; callers build
 * the vector literal themselves so the adapter stays storage-agnostic.
 */
export function toVectorLiteral(embedding: readonly number[]): string {
  return `[${embedding.map((value) => Number(value).toFixed(6)).join(',')}]`;
}
