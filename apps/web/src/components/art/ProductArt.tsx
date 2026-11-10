import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { Accent, ArtShape } from '@/lib/content/landing';

/**
 * Generative product artwork.
 *
 * Phase 1 has no media pipeline yet, so every card renders a stylised gradient
 * plate with a minimal line-art silhouette. Deterministic by `shape` + `accent`,
 * zero network requests, crisp at any size, and it keeps the bundle free of
 * placeholder JPEGs.
 */

const accentVar: Record<Accent, string> = {
  violet: '--vl-violet',
  coral: '--vl-coral',
  aqua: '--vl-aqua',
  amber: '--vl-amber',
};

const silhouettes: Record<ArtShape, ReactNode> = {
  lamp: (
    <>
      <path d="M62 78 L138 78 L120 34 L80 34 Z" />
      <path d="M100 78 L100 148" />
      <path d="M78 152 Q100 140 122 152" />
      <circle cx="100" cy="62" r="26" opacity="0.35" />
    </>
  ),
  sneaker: (
    <>
      <path d="M34 132 C48 116 62 112 78 116 L104 96 C112 90 122 92 126 100 L132 118 C150 122 166 130 168 142 L168 150 L34 150 Z" />
      <path d="M78 116 L96 132" />
      <path d="M96 132 L112 128" />
    </>
  ),
  bag: (
    <>
      <path d="M50 86 L150 86 L160 156 L40 156 Z" />
      <path d="M76 86 C76 60 124 60 124 86" />
      <path d="M40 112 L160 112" opacity="0.5" />
    </>
  ),
  watch: (
    <>
      <circle cx="100" cy="100" r="40" />
      <circle cx="100" cy="100" r="28" opacity="0.45" />
      <path d="M84 60 L88 26 L112 26 L116 60" />
      <path d="M84 140 L88 174 L112 174 L116 140" />
      <path d="M100 84 L100 102 L114 108" />
    </>
  ),
  bottle: (
    <>
      <path d="M84 68 L116 68 L116 152 Q116 166 100 166 Q84 166 84 152 Z" />
      <path d="M90 68 L90 48 L110 48 L110 68" />
      <path d="M84 104 L116 104" opacity="0.45" />
    </>
  ),
  chair: (
    <>
      <path d="M66 36 L134 42 L128 116 L62 108 Z" />
      <path d="M56 124 L142 124 L148 140 L52 140 Z" />
      <path d="M66 140 L60 174" />
      <path d="M138 140 L146 174" />
    </>
  ),
  headphones: (
    <>
      <path d="M52 122 L52 96 C52 66 74 46 100 46 C126 46 148 66 148 96 L148 122" />
      <rect x="36" y="112" width="30" height="46" rx="14" />
      <rect x="134" y="112" width="30" height="46" rx="14" />
    </>
  ),
  vase: (
    <>
      <path d="M88 46 L112 46 L112 58 C132 72 138 92 134 116 C130 142 116 158 100 158 C84 158 70 142 66 116 C62 92 68 72 88 58 Z" />
      <path d="M70 108 Q100 122 130 108" opacity="0.45" />
    </>
  ),
  camera: (
    <>
      <rect x="34" y="74" width="132" height="86" rx="16" />
      <circle cx="100" cy="118" r="30" />
      <circle cx="100" cy="118" r="15" opacity="0.55" />
      <path d="M74 74 L84 56 L116 56 L126 74" />
    </>
  ),
};

interface ProductArtProps {
  shape: ArtShape;
  accent: Accent;
  className?: string;
  /** Renders the silhouette larger / cropped, useful for tall card ratios. */
  scale?: number;
  label?: string;
}

export function ProductArt({ shape, accent, className, scale = 1, label }: ProductArtProps) {
  const varName = accentVar[accent];

  return (
    <div
      className={cn('relative isolate h-full w-full overflow-hidden', className)}
      style={{
        backgroundImage: `radial-gradient(120% 100% at 12% 0%, rgb(var(${varName}) / 0.55), transparent 62%),
          radial-gradient(90% 80% at 92% 104%, rgb(var(--vl-fg) / 0.09), transparent 58%),
          linear-gradient(160deg, rgb(var(--vl-elevated)) 0%, rgb(var(--vl-bg)) 100%)`,
      }}
      role="img"
      aria-label={label ?? `${shape} product visual`}
    >
      {/* soft light blob */}
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full blur-3xl"
        style={{ background: `rgb(var(${varName}) / 0.35)` }}
      />

      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        style={{ transform: `scale(${scale})`, transformOrigin: '50% 55%' }}
        fill="none"
        stroke="rgb(255 255 255 / 0.62)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <g fill="rgb(255 255 255 / 0.055)">{silhouettes[shape]}</g>
      </svg>

      {/* glass sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/[0.06]" />
    </div>
  );
}
