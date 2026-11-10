'use client';

import { ArrowUpRight, Star, Timer } from 'lucide-react';
import { ProductArt } from '@/components/art/ProductArt';
import { Badge } from '@/components/ui/surface';
import { TiltCard } from '@/components/ui/motion';
import { formatPrice } from '@/lib/utils';
import type { Accent, ArtShape } from '@/lib/content/landing';

export interface ProductCardProps {
  name: string;
  brand?: string;
  price: number;
  compareAt?: number;
  accent: Accent;
  shape: ArtShape;
  badge?: string;
  fulfillment?: 'quick' | 'marketplace';
  rating?: number;
  className?: string;
  compact?: boolean;
}

/**
 * The single shoppable card used by the hero, discovery, quick-commerce and
 * marketplace surfaces. One component = one hover language = one place to fix.
 */
export function ProductCard({
  name,
  brand,
  price,
  compareAt,
  accent,
  shape,
  badge,
  fulfillment,
  rating,
  className,
  compact = false,
}: ProductCardProps) {
  return (
    <TiltCard className={className} max={compact ? 6 : 9}>
      <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-2 shadow-lift backdrop-blur-xl transition-colors duration-300 hover:border-white/20">
        <div className="relative overflow-hidden rounded-[1.15rem]">
          <div className={compact ? 'aspect-[5/4]' : 'aspect-[4/5]'}>
            <ProductArt shape={shape} accent={accent} label={name} scale={compact ? 0.9 : 1} />
          </div>

          <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-2">
            {fulfillment === 'quick' ? (
              <Badge tone="aqua" size="sm" className="backdrop-blur-md">
                <Timer className="h-3 w-3" aria-hidden />
                10 min
              </Badge>
            ) : (
              <Badge tone="glass" size="sm">
                {badge ?? 'Marketplace'}
              </Badge>
            )}
            {rating !== undefined && (
              <span className="flex items-center gap-1 rounded-pill bg-ink/60 px-2 py-1 text-[10px] text-fg backdrop-blur-md">
                <Star className="h-3 w-3 fill-amber text-amber" aria-hidden />
                {rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* hover CTA */}
          <span className="pointer-events-none absolute bottom-2 right-2 flex h-9 w-9 translate-y-3 items-center justify-center rounded-full bg-fg text-bg opacity-0 shadow-lg transition-all duration-300 ease-smooth group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </div>

        <div className="flex items-end justify-between gap-3 px-2 pb-1 pt-3">
          <div className="min-w-0">
            {brand && <p className="truncate text-[10px] uppercase tracking-[0.18em] text-muted">{brand}</p>}
            <h3 className="truncate text-sm font-medium text-fg">{name}</h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm tabular-nums text-fg">{formatPrice(price)}</p>
            {compareAt && (
              <p className="text-[11px] tabular-nums text-muted line-through">{formatPrice(compareAt)}</p>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
