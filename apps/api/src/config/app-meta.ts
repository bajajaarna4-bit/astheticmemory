/**
 * Single source of truth for the public API contract (name, version, roadmap).
 * `GET /v1/meta` serves this object, so clients can discover which phases have
 * landed without reading the release notes.
 */
export const APP_META = {
  name: 'VELORA',
  tagline: 'See it. Save it. Have it in ten.',
  version: '0.1.0',
  apiVersion: 'v1',
} as const;

export type ModuleStatus = 'live' | 'scaffolded' | 'planned';

export interface ModuleMeta {
  key: string;
  label: string;
  phase: number;
  status: ModuleStatus;
  summary: string;
}

/** Progress ledger for the seven delivery phases. */
export const PHASES = [
  { phase: 1, label: 'Foundation', status: 'live', summary: 'Architecture, schema, design system, landing page.' },
  { phase: 2, label: 'Social', status: 'scaffolded', summary: 'Auth, feed, stories, reels, profiles, DMs.' },
  { phase: 3, label: 'Discovery', status: 'planned', summary: 'Masonry discovery, boards, visual search.' },
  { phase: 4, label: 'Marketplace', status: 'planned', summary: 'PDP, cart, checkout, orders, returns.' },
  { phase: 5, label: 'Quick commerce', status: 'planned', summary: 'Dark stores, live inventory, rider tracking.' },
  { phase: 6, label: 'Intelligence', status: 'planned', summary: 'Ranking, assistant, studio, admin.' },
  { phase: 7, label: 'Polish', status: 'planned', summary: 'Performance, a11y, animation pass, deploy.' },
] as const;

export const MODULES: ModuleMeta[] = [
  { key: 'social', label: 'Social', phase: 2, status: 'scaffolded', summary: 'Shoppable feed, reels, stories, follows, comments.' },
  { key: 'discovery', label: 'Discovery', phase: 3, status: 'scaffolded', summary: 'Boards, masonry, mood browsing, visual search.' },
  { key: 'quick', label: 'Quick commerce', phase: 5, status: 'scaffolded', summary: 'Dark stores, ETA engine, rider tracking.' },
  { key: 'marketplace', label: 'Marketplace', phase: 4, status: 'scaffolded', summary: 'Catalogue, sellers, reviews, cart, orders.' },
  { key: 'studio', label: 'Creator & seller studio', phase: 6, status: 'planned', summary: 'Analytics, tagging, payouts, inventory.' },
  { key: 'admin', label: 'Admin', phase: 6, status: 'planned', summary: 'Moderation, order ops, platform analytics.' },
  { key: 'intelligence', label: 'Intelligence', phase: 6, status: 'planned', summary: 'Ranking, assistant, ETA, substitutions.' },
];
