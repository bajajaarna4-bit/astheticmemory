import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Clock3,
  MapPin,
  RefreshCw,
  Replace,
  Timer,
  Zap,
} from 'lucide-react';
import { ProductArt } from '@/components/art/ProductArt';
import { Badge, SectionHeading } from '@/components/ui/surface';
import { AnimatedCounter, Reveal } from '@/components/ui/motion';
import { quickItems } from '@/lib/content/landing';
import { formatPrice } from '@/lib/utils';
import { Atmosphere } from '@/components/landing/Atmosphere';

const stockLabel = {
  in: { text: 'In stock', tone: 'aqua' as const },
  low: { text: 'Only 4 left', tone: 'amber' as const },
  swap: { text: 'Substitute ready', tone: 'violet' as const },
};

export function QuickSection() {
  return (
    <section id="quick" className="relative isolate overflow-hidden py-24 sm:py-32">
      <Atmosphere variant="cool" />

      <div className="vl-shell relative">
        <SectionHeading
          eyebrow="Quick commerce"
          title={
            <>
              Ten minutes is a promise,
              <br className="hidden sm:block" /> not a marketing line.
            </>
          }
          description="Every product is indexed against the dark stores inside your delivery ring. Availability, substitution and rider ETA are computed before you tap add."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          {/* left: store + live shelf */}
          <Reveal y={22}>
            <div className="h-full rounded-[2rem] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-aqua/12 text-aqua">
                    <MapPin className="h-5 w-5" strokeWidth={1.7} aria-hidden />
                    <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-aqua/25" aria-hidden />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Delivering to</p>
                    <p className="text-sm text-fg">Indiranagar · 560038</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-pill border border-white/10 px-3 py-1.5 text-[11px] text-muted transition-colors hover:text-fg"
                >
                  Change
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-aqua/[0.07] px-3.5 py-2.5 text-[11px] text-aqua">
                <span className="flex items-center gap-2">
                  <Boxes className="h-3.5 w-3.5" aria-hidden />
                  VELORA Dark Store 04 · 1.4 km
                </span>
                <span className="tabular-nums">3,182 SKUs</span>
              </div>

              <ul className="mt-4 space-y-2.5">
                {quickItems.map((item) => {
                  const stock = stockLabel[item.stock];
                  return (
                    <li
                      key={item.id}
                      className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-2.5 transition-colors hover:border-white/15"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                        <ProductArt shape={item.shape} accent={item.accent} label={item.name} scale={0.95} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-fg">{item.name}</p>
                        <p className="text-[11px] text-muted">{item.unit}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-sm tabular-nums text-fg">{formatPrice(item.price)}</span>
                        <Badge tone={stock.tone} size="sm">
                          {stock.text}
                        </Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/8 bg-ink/40 px-3.5 py-2.5 text-[11px] text-muted">
                <Replace className="h-3.5 w-3.5 text-violet-soft" aria-hidden />
                <span>
                  Smart substitution active — if something sells out mid-checkout, we swap to the
                  closest match and hold the price.
                </span>
              </div>
            </div>
          </Reveal>

          {/* right: ETA + reorder */}
          <div className="grid gap-5">
            <Reveal y={22} delay={0.08}>
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(150deg,rgb(53_231_210/0.14),rgb(124_92_255/0.10)_45%,transparent)] p-6 backdrop-blur-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-aqua">Median ETA</p>
                    <div className="mt-1 flex items-end gap-2">
                      <span className="font-display text-[4.5rem] leading-none text-fg">
                        <AnimatedCounter value={10} />
                      </span>
                      <span className="pb-3 text-sm text-muted">min</span>
                    </div>
                  </div>
                  <div className="relative grid h-16 w-16 place-items-center">
                    <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
                      <circle cx="32" cy="32" r="28" stroke="rgb(255 255 255 / 0.12)" strokeWidth="3" fill="none" />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#35E7D2"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="176"
                        strokeDashoffset="44"
                      />
                    </svg>
                    <Zap className="h-5 w-5 text-aqua" strokeWidth={1.8} aria-hidden />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Packing', value: '02:10' },
                    { label: 'Rider', value: '05:24' },
                    { label: 'Doorstep', value: '09:48' },
                  ].map((stage, index) => (
                    <div key={stage.label} className="rounded-2xl bg-ink/40 px-2 py-2.5">
                      <p className="text-[9px] uppercase tracking-[0.16em] text-muted">{stage.label}</p>
                      <p className="mt-1 text-xs tabular-nums text-fg">{stage.value}</p>
                      <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-aqua"
                          style={{ width: `${[100, 62, 18][index]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 text-[11px] text-muted">
                  <BadgeCheck className="h-3.5 w-3.5 text-aqua" aria-hidden />
                  98.4% of orders inside the ring land under 13 minutes
                </div>
              </div>
            </Reveal>

            <Reveal y={22} delay={0.16}>
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted">
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                    Smart reorder
                  </p>
                  <Badge tone="glass" size="sm">
                    <Clock3 className="h-3 w-3" aria-hidden />
                    Mondays
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-fg">
                  You buy <span className="text-aqua">oat milk</span> and cold brew every Monday
                  morning. Both are in stock at Store 04.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {quickItems.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className="h-9 w-9 overflow-hidden rounded-full border border-ink ring-1 ring-white/10"
                      >
                        <ProductArt shape={item.shape} accent={item.accent} label={item.name} scale={0.7} />
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex items-center gap-1.5 rounded-pill bg-fg px-4 py-2 text-[11px] font-medium text-bg transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <Timer className="h-3 w-3" aria-hidden />
                    Reorder in 10 min
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
