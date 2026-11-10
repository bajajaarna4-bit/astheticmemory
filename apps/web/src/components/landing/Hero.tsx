import { ArrowDownRight, Play, Sparkles } from 'lucide-react';
import { Atmosphere } from '@/components/landing/Atmosphere';
import { HeroStage } from '@/components/landing/HeroStage';
import { Badge } from '@/components/ui/surface';
import { Magnetic, SplitHeading, AnimatedCounter, Reveal } from '@/components/ui/motion';
import { buttonStyles } from '@/components/ui/button';
import { heroStats } from '@/lib/content/landing';

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pb-28 pt-28 sm:pt-36 lg:pb-36">
      <Atmosphere variant="quiet" />

      <div className="vl-shell relative z-10 grid items-center gap-16 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-6">
        <div className="max-w-2xl">
          <Reveal y={12}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="aqua" dot>
                Live in Mumbai · Bengaluru · Delhi NCR
              </Badge>
              <Badge tone="glass">
                <Sparkles className="h-3 w-3 text-violet-soft" aria-hidden />
                Shoppable social
              </Badge>
            </div>
          </Reveal>

          <h1 className="sr-only">See it. Save it. Have it in ten.</h1>

          <SplitHeading
            as="div"
            ariaHidden
            text="See it. Save it."
            delay={0.1}
            className="mt-7 font-display text-display-lg text-fg"
          />
          <SplitHeading
            as="div"
            ariaHidden
            text="Have it in ten."
            delay={0.3}
            className="vl-text-gradient font-display text-display-lg"
          />

          <Reveal delay={0.35} y={18}>
            <p className="mt-7 max-w-prose text-pretty text-base leading-relaxed text-muted sm:text-[17px]">
              VELORA folds a social feed, a discovery engine and two fulfilment speeds into one
              surface. Every reel is shoppable, every board is a shopping list, and everything
              within your ring arrives in ten minutes.
            </p>
          </Reveal>

          <Reveal delay={0.45} y={16}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic href="#loop" className={buttonStyles({ tone: 'accent', size: 'lg' })}>
                Enter the loop
                <ArrowDownRight className="h-4 w-4" aria-hidden />
              </Magnetic>
              <Magnetic
                href="#discover"
                strength={0.2}
                className={buttonStyles({ tone: 'glass', size: 'lg' })}
              >
                <Play className="h-4 w-4" aria-hidden />
                Watch a shoppable reel
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.55} y={14}>
            <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/8 pt-7 sm:grid-cols-4">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-display text-2xl text-fg sm:text-[28px]">
                    <AnimatedCounter
                      value={stat.value}
                      decimals={Number.isInteger(stat.value) ? 0 : 1}
                      suffix={stat.suffix}
                    />
                  </dd>
                  <dt className="mt-1 text-[11px] leading-snug text-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={30} className="relative">
          <HeroStage />
        </Reveal>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center lg:flex">
        <span className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-muted">
          <span className="relative h-10 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-4 animate-[float-y_2.6s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-violet-soft to-transparent" />
          </span>
          Scroll to unfold
        </span>
      </div>
    </section>
  );
}
