'use client';

import { ArrowUpRight, ShieldCheck, Star, Store, TrendingDown, Truck } from 'lucide-react';
import { ProductArt } from '@/components/art/ProductArt';
import { Badge, SectionHeading } from '@/components/ui/surface';
import { Marquee, Reveal, TiltCard } from '@/components/ui/motion';
import { deals } from '@/lib/content/landing';
import { formatPrice } from '@/lib/utils';

const promises = [
  { icon: Truck, label: 'Marketplace delivery', value: '2–6 days' },
  { icon: ShieldCheck, label: 'Returns window', value: '7 days, pickup' },
  { icon: TrendingDown, label: 'Price-drop watch', value: 'notified' },
  { icon: Store, label: 'Seller storefronts', value: 'verified' },
];

const categories = [
  'Fashion',
  'Beauty',
  'Home',
  'Electronics',
  'Jewellery',
  'Footwear',
  'Kitchen',
  'Fitness',
  'Fragrance',
  'Stationery',
];

export function MarketplaceSection() {
  return (
    <section id="marketplace" className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="vl-shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Marketplace"
            title="Everything else, with the receipts."
            description="Reviews are summarised, price history is public, and every seller is accountable. The same cart that ships in ten minutes also ships across the country."
          />
          <a
            href="#waitlist"
            className="group inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-fg"
          >
            Browse the catalogue
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {deals.map((deal, index) => (
            <Reveal key={deal.id} y={26} delay={index * 0.08}>
              <TiltCard max={6}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-2.5 backdrop-blur-xl">
                  <div className="relative overflow-hidden rounded-[1.35rem]">
                    <div className="aspect-[4/3]">
                      <ProductArt shape={deal.shape} accent={deal.accent} label={deal.name} />
                    </div>
                    <div className="absolute inset-x-2 top-2 flex items-center justify-between">
                      <Badge tone="glass" size="sm">
                        {Math.round((1 - deal.price / deal.compareAt) * 100)}% off
                      </Badge>
                      <span className="flex items-center gap-1 rounded-pill bg-ink/60 px-2 py-1 text-[10px] text-fg backdrop-blur">
                        <Star className="h-3 w-3 fill-amber text-amber" aria-hidden />
                        {deal.rating.toFixed(1)} · {deal.reviews.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[10px] uppercase tracking-[0.18em] text-muted">
                          {deal.seller}
                        </p>
                        <h3 className="mt-1 truncate text-[15px] text-fg">{deal.name}</h3>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm tabular-nums text-fg">{formatPrice(deal.price)}</p>
                        <p className="text-[11px] tabular-nums text-muted line-through">
                          {formatPrice(deal.compareAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/8 bg-ink/40 p-3">
                      <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-violet-soft">
                        <span className="h-1 w-1 rounded-full bg-violet-soft" aria-hidden />
                        Review summary
                      </p>
                      <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-muted">
                        {deal.reviewsSummary}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 text-[11px] text-muted">
                      <span className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5" aria-hidden /> Ships in 24h
                      </span>
                      <span className="flex items-center gap-1 text-fg transition-colors group-hover:text-aqua">
                        View
                        <ArrowUpRight className="h-3 w-3" aria-hidden />
                      </span>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map(({ icon: Icon, label, value }, index) => (
            <Reveal key={label} y={14} delay={0.05 * index}>
              <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-fg/80">
                  <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] text-muted">{label}</p>
                  <p className="text-xs text-fg">{value}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-16 border-y border-white/8 py-5">
        <Marquee items={categories} />
      </div>
    </section>
  );
}
