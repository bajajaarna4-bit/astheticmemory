'use client';

import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Bookmark, Heart, MapPin, Play, Share2, ShoppingBag, Timer } from 'lucide-react';
import { ProductArt } from '@/components/art/ProductArt';
import { Badge, SectionHeading } from '@/components/ui/surface';
import { loopSteps, pins, quickItems } from '@/lib/content/landing';
import { cn, formatPrice } from '@/lib/utils';

/* ------------------------------------------------------------------ visuals */

function FeedVisual() {
  return (
    <div className="relative h-full w-full">
      {[0, 1, 2].map((i) => {
        const pin = pins[i];
        const quick = quickItems[i];
        if (!pin || !quick) return null;
        return (
          <motion.div
            key={pin.id}
            initial={{ opacity: 0, y: 28, rotate: i * 3 - 3 }}
            animate={{ opacity: 1, y: 0, rotate: i * 3 - 3 }}
            transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute w-[62%] overflow-hidden rounded-3xl border border-white/10 bg-elevated/80 shadow-float backdrop-blur-xl',
              i === 0 && 'left-2 top-4 z-30',
              i === 1 && 'left-[19%] top-[22%] z-20',
              i === 2 && 'left-[35%] top-[42%] z-10',
            )}
          >
            <div className="aspect-[4/5]">
              <ProductArt shape={pin.shape} accent={pin.accent} label={pin.title} />
            </div>
            <div className="flex items-center justify-between px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-gradient-to-br from-violet to-coral" />
                <span className="text-[10px] text-muted">@studio{rng(i)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Heart className={cn('h-3.5 w-3.5', i === 1 && 'fill-coral text-coral')} aria-hidden />
                <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
              </div>
            </div>
            <div className="absolute right-3 top-3">
              <Badge tone="aqua" size="sm">
                <Timer className="h-3 w-3" aria-hidden /> {quick.eta} min
              </Badge>
            </div>
          </motion.div>
        );
      })}

      <div className="absolute bottom-3 left-1/2 z-40 -translate-x-1/2">
        <span className="flex items-center gap-2 rounded-pill bg-ink/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-fg/80 backdrop-blur">
          <Play className="h-3 w-3 fill-fg" aria-hidden />
          For you · playing
        </span>
      </div>
    </div>
  );
}

function rng(i: number) {
  return ['nine', 'atama', 'sable'][i] ?? 'studio';
}

function TagVisual() {
  const product = pins[2];

  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="relative w-[62%]">
        <div className="overflow-hidden rounded-[1.6rem] border border-white/12 shadow-float">
          <div className="aspect-[4/5]">
            <ProductArt shape="bag" accent="coral" label="Serein tote" scale={1.05} />
          </div>
        </div>

        {/* connector */}
        <svg className="pointer-events-none absolute -right-24 top-10 h-24 w-28" viewBox="0 0 120 100" fill="none" aria-hidden>
          <path d="M4 70 C 40 70, 40 20, 112 20" stroke="rgb(255 107 107 / 0.55)" strokeDasharray="4 5" />
          <circle cx="4" cy="70" r="3.5" fill="#FF6B6B" />
          <circle cx="112" cy="20" r="3.5" fill="#FF6B6B" />
        </svg>

        <div className="absolute -right-24 top-6 w-28 rounded-2xl border border-coral/30 bg-coral/12 p-2.5 backdrop-blur-xl">
          <p className="text-[9px] uppercase tracking-[0.16em] text-coral">Tagged</p>
          <p className="mt-1 text-[11px] leading-tight text-fg">Serein Tote</p>
          <p className="mt-1 text-[11px] tabular-nums text-fg/80">
            {product ? formatPrice(product.price) : '₹5,990'}
          </p>
        </div>

        <div className="absolute -left-8 bottom-8 flex items-center gap-2 rounded-pill border border-white/10 bg-ink/80 px-3 py-1.5 text-[10px] text-fg/80 backdrop-blur-xl">
          <Heart className="h-3 w-3 fill-coral text-coral" aria-hidden />
          Double-tap to save
        </div>
      </div>
    </div>
  );
}

function BoardVisual() {
  const tiles = pins.slice(0, 4);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-[86%] rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-4 shadow-float backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Board</p>
            <p className="mt-1 font-display text-lg text-fg">Monsoon moodboard</p>
          </div>
          <Badge tone="violet" size="sm">
            <Bookmark className="h-3 w-3" aria-hidden /> 14
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 * i, duration: 0.4 }}
              className={cn('overflow-hidden rounded-2xl border border-white/8', i === 0 ? 'row-span-2' : '')}
            >
              <div className={i === 0 ? 'aspect-[3/5]' : 'aspect-[3/2]'}>
                <ProductArt shape={tile.shape} accent={tile.accent} label={tile.title} scale={0.85} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-aqua/10 px-3 py-2 text-[10px] text-aqua">
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="h-3 w-3" aria-hidden /> 3 of 14 in stock nearby
          </span>
          <span className="tabular-nums">10 min</span>
        </div>
      </div>
    </div>
  );
}

function DoorVisual() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-[86%] overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-float backdrop-blur-xl">
        <div className="relative aspect-[4/3]">
          {/* map plate */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgb(53_231_210/0.20),transparent_58%),radial-gradient(circle_at_75%_75%,rgb(124_92_255/0.20),transparent_60%)]" />
          <div className="vl-grid-lines absolute inset-0 opacity-60" />

          <svg viewBox="0 0 320 240" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
            <path
              d="M46 186 C 96 186, 96 130, 150 128 C 206 126, 208 70, 272 62"
              stroke="rgb(255 255 255 / 0.3)"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              strokeLinecap="round"
            >
              {/* marching ants reads as movement without shipping a motion path */}
              <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1.4s" repeatCount="indefinite" />
            </path>
            <circle cx="46" cy="186" r="6" fill="#35E7D2" />
            <circle cx="272" cy="62" r="7" fill="#FF6B6B" />
            <circle cx="272" cy="62" r="14" stroke="rgb(255 107 107 / 0.45)" strokeWidth="1.5" />

            {/* rider marker + pulse */}
            <circle cx="196" cy="108" r="5" fill="#ffffff" />
            <circle cx="196" cy="108" r="11" stroke="rgb(255 255 255 / 0.4)" strokeWidth="1">
              <animate attributeName="r" values="8;18;8" dur="2.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.55;0;0.55" dur="2.6s" repeatCount="indefinite" />
            </circle>
          </svg>

          <div className="absolute left-3 top-3 rounded-2xl border border-white/10 bg-ink/70 px-3 py-2 backdrop-blur-md">
            <p className="text-[9px] uppercase tracking-[0.18em] text-muted">Rider</p>
            <p className="text-[11px] text-fg">Aarav · 1.4 km away</p>
          </div>

          <div className="absolute bottom-3 right-3 rounded-2xl border border-aqua/30 bg-aqua/12 px-3 py-2 text-aqua backdrop-blur-md">
            <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em]">
              <MapPin className="h-3 w-3" aria-hidden /> Arriving
            </p>
            <p className="font-display text-xl leading-tight tabular-nums text-fg">09:48</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/8 px-4 py-3 text-[11px]">
          <span className="text-muted">Left Indiranagar dark store</span>
          <span className="text-fg">Out for delivery</span>
          <Share2 className="h-3.5 w-3.5 text-muted" aria-hidden />
        </div>
      </div>
    </div>
  );
}

const visuals = [FeedVisual, TagVisual, BoardVisual, DoorVisual];

/* ------------------------------------------------------------------ section */

export function LoopSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(loopSteps.length - 1, Math.max(0, Math.floor(value * loopSteps.length)));
    setActive((current) => (current === next ? current : next));
  });

  const railScale = useTransform(scrollYProgress, [0, 1], [0.04, 1]);
  const Visual = visuals[active] ?? FeedVisual;

  return (
    <section id="loop" className="relative isolate">
      <div className="vl-shell pt-24 sm:pt-32">
        <SectionHeading
          eyebrow="The loop"
          title={
            <>
              One surface. Four beats.
              <br className="hidden sm:block" /> Two fulfilment speeds.
            </>
          }
          description="Inspiration is worthless if it dies in a screenshot. VELORA keeps the object attached to the moment you discovered it — through the feed, the tag, the board, and the door."
        />
      </div>

      {/* desktop: pinned scene */}
      <div ref={trackRef} className="relative hidden lg:block lg:h-[360vh]">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="vl-shell grid w-full grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-16">
            {/* steps */}
            <div className="relative">
              <div className="absolute left-0 top-2 h-full w-px bg-white/10">
                <motion.div
                  className="w-px origin-top bg-gradient-to-b from-violet via-coral to-aqua"
                  style={{ height: '100%', scaleY: railScale }}
                />
              </div>

              <ol className="space-y-8 pl-8">
                {loopSteps.map((step, index) => (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      aria-current={active === index}
                      className="group block w-full text-left"
                    >
                      <p
                        className={cn(
                          'text-[11px] uppercase tracking-[0.24em] transition-colors duration-500',
                          active === index ? 'text-aqua' : 'text-muted',
                        )}
                      >
                        {step.kicker}
                      </p>
                      <h3
                        className={cn(
                          'mt-2 font-display text-2xl leading-tight transition-colors duration-500 xl:text-[28px]',
                          active === index ? 'text-fg' : 'text-fg/35',
                        )}
                      >
                        {step.title}
                      </h3>
                      <motion.p
                        animate={{
                          opacity: active === index ? 1 : 0,
                          height: active === index ? 'auto' : 0,
                        }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-md overflow-hidden text-sm leading-relaxed text-muted"
                      >
                        <span className="mt-3 block">{step.body}</span>
                      </motion.p>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            {/* stage */}
            <div className="relative aspect-[5/4] w-full rounded-[2.5rem] border border-white/8 bg-white/[0.02] p-6 shadow-float backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-mesh-violet opacity-50" aria-hidden />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full"
                >
                  <Visual />
                </motion.div>
              </AnimatePresence>

              <div className="absolute -bottom-4 left-8 flex items-center gap-2">
                <Badge tone="glass" className="backdrop-blur-md">
                  {active + 1} / {loopSteps.length}
                </Badge>
                <Badge tone="violet" className="backdrop-blur-md">
                  loop
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile / reduced motion: stacked beats */}
      <div className="vl-shell mt-10 space-y-4 pb-4 lg:hidden">
        {loopSteps.map((step, index) => {
          const StepVisual = visuals[index] ?? FeedVisual;
          return (
            <article
              key={step.id}
              className="relative overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/[0.025] p-5"
            >
              <p className="text-[10px] uppercase tracking-[0.24em] text-aqua">{step.kicker}</p>
              <h3 className="mt-2 font-display text-xl leading-tight text-fg">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              <div className="relative mt-5 aspect-[5/4] rounded-2xl border border-white/8 bg-white/[0.02] p-3">
                <StepVisual />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
