'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, ImagePlus, ScanSearch, Sparkles } from 'lucide-react';
import { ProductArt } from '@/components/art/ProductArt';
import { Badge, SectionHeading } from '@/components/ui/surface';
import { Reveal } from '@/components/ui/motion';
import { pins } from '@/lib/content/landing';
import { cn, formatPrice } from '@/lib/utils';

const moods = ['All', 'Quiet luxury', 'Monsoon', 'Beach wedding', 'Studio desk', 'Late night'];

const heights: Record<'tall' | 'mid' | 'short', string> = {
  tall: 'aspect-[3/4.4]',
  mid: 'aspect-[3/3.4]',
  short: 'aspect-[3/2.6]',
};

export function DiscoverySection() {
  const [mood, setMood] = useState('All');

  return (
    <section id="discover" className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="vl-shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Discovery"
            title="A canvas, not a catalogue."
            description="Pins are products. Boards are intent. The moment you save something, VELORA starts watching stock, price and restock odds for you."
          />
          <Reveal y={10} className="lg:pb-2">
            <Badge tone="violet" size="md">
              <ScanSearch className="h-3.5 w-3.5" aria-hidden />
              Visual search · beta
            </Badge>
          </Reveal>
        </div>

        {/* mood chips */}
        <div className="mt-10 -mx-1 flex flex-wrap gap-2">
          {moods.map((item) => {
            const active = mood === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setMood(item)}
                aria-pressed={active}
                className={cn(
                  'relative rounded-pill border px-4 py-2 text-xs transition-all duration-300',
                  active
                    ? 'border-transparent text-ink'
                    : 'border-white/10 text-muted hover:border-white/25 hover:text-fg',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="mood-chip"
                    className="absolute inset-0 rounded-pill bg-fg"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item}</span>
              </button>
            );
          })}
        </div>

        {/* masonry */}
        <div className="mt-8 columns-2 gap-4 [column-fill:_balance] md:columns-3 lg:columns-4">
          {pins.map((pin, index) => (
            <motion.article
              key={pin.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-white/8 bg-white/[0.025]"
              data-cursor="media"
            >
              <div className={cn('relative overflow-hidden', heights[pin.height])}>
                <div className="h-full w-full transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.04]">
                  <ProductArt shape={pin.shape} accent={pin.accent} label={pin.title} scale={0.92} />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />

                <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-500 ease-smooth group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex items-center justify-between gap-2 rounded-pill bg-ink/70 px-3 py-2 backdrop-blur-md">
                    <span className="text-[11px] text-fg">More like this</span>
                    <Bookmark className="h-3.5 w-3.5 text-fg/70" aria-hidden />
                  </div>
                </div>

                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-pill bg-ink/60 px-2 py-1 text-[10px] text-fg/85 backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-aqua" aria-hidden />
                  {pin.saves}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 px-3.5 py-3">
                <p className="line-clamp-2 text-xs leading-snug text-fg/85">{pin.title}</p>
                <span className="shrink-0 text-xs tabular-nums text-muted">{formatPrice(pin.price)}</span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* visual search block */}
        <Reveal y={24} className="mt-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet/20 blur-3xl" aria-hidden />
            <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <span className="vl-eyebrow">
                  <span className="h-px w-6 bg-current opacity-50" aria-hidden />
                  Visual search
                </span>
                <h3 className="mt-4 font-display text-display-xs text-fg">
                  Screenshot it. VELORA finds the object.
                </h3>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">
                  Drop an image and the vision model isolates the product, matches it against the
                  catalogue embeddings, and returns the closest 40 items with live availability.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge tone="glass">pgvector · 1536d</Badge>
                  <Badge tone="glass">40 neighbours</Badge>
                  <Badge tone="aqua">stock-aware</Badge>
                </div>
              </div>

              <div className="rounded-3xl border border-dashed border-white/15 bg-ink/40 p-5">
                <div className="flex items-center gap-3 text-muted">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5">
                    <ImagePlus className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs text-fg">Drop an image</p>
                    <p className="text-[11px] text-muted">PNG, JPG · up to 8MB</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2">
                  {pins.slice(0, 4).map((pin) => (
                    <div key={pin.id} className="overflow-hidden rounded-xl border border-white/8">
                      <div className="aspect-square">
                        <ProductArt shape={pin.shape} accent={pin.accent} label={pin.title} scale={0.9} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/[0.04] px-3 py-2 text-[11px] text-muted">
                  <span>Match confidence</span>
                  <span className="tabular-nums text-aqua">96.2%</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
