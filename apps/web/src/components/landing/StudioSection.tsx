import { ArrowUpRight, BadgeCheck, Coins, Package, Plus, Sparkles, Tag, TrendingUp } from 'lucide-react';
import { ProductArt } from '@/components/art/ProductArt';
import { Badge, SectionHeading } from '@/components/ui/surface';
import { AnimatedCounter, Reveal } from '@/components/ui/motion';
import { studioMetrics } from '@/lib/content/landing';

/** Static 12-point revenue curve (₹ lakh) — replaced by real analytics in Phase 6. */
const series = [12, 18, 15, 24, 22, 31, 28, 38, 35, 46, 52, 61];
const max = Math.max(...series);

function buildPath(values: number[], width = 320, height = 110) {
  const step = width / (values.length - 1);
  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / max) * height;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

const linePath = buildPath(series);
const areaPath = `${linePath} L320 110 L0 110 Z`;

const tags = [
  { label: 'Serein Tote', top: '24%', left: '18%', accent: 'coral' as const },
  { label: 'Lumen Runner', top: '56%', left: '52%', accent: 'violet' as const },
  { label: 'Halo Chrono', top: '38%', left: '72%', accent: 'amber' as const },
];

export function StudioSection() {
  return (
    <section id="studio" className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="vl-shell">
        <SectionHeading
          eyebrow="Creator & seller studio"
          title="The business side lives in the same app."
          description="Analytics, tagging, inventory, payouts and affiliate links — no spreadsheets, no third-party dashboard, no revenue you cannot see."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* analytics */}
          <Reveal y={22}>
            <div className="h-full rounded-[2rem] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Attributed revenue</p>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="font-display text-4xl text-fg">
                      <AnimatedCounter value={27} prefix="₹" suffix="L" />
                    </span>
                    <span className="flex items-center gap-1 pb-1.5 text-[11px] text-aqua">
                      <TrendingUp className="h-3 w-3" aria-hidden />
                      +31% MoM
                    </span>
                  </div>
                </div>
                <Badge tone="glass" size="sm">
                  Last 30 days
                </Badge>
              </div>

              <div className="mt-6 rounded-2xl border border-white/8 bg-ink/40 p-4">
                <svg viewBox="0 0 320 110" className="h-28 w-full" fill="none" aria-hidden>
                  <defs>
                    <linearGradient id="vl-revenue-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.42" />
                      <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="vl-revenue-line" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#35E7D2" />
                      <stop offset="60%" stopColor="#7C5CFF" />
                      <stop offset="100%" stopColor="#FF6B6B" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3].map((i) => (
                    <line
                      key={i}
                      x1="0"
                      x2="320"
                      y1={(110 / 4) * i + 6}
                      y2={(110 / 4) * i + 6}
                      stroke="rgb(255 255 255 / 0.06)"
                    />
                  ))}
                  <path d={areaPath} fill="url(#vl-revenue-fill)" />
                  <path d={linePath} stroke="url(#vl-revenue-line)" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="320" cy={110 - (series[series.length - 1]! / max) * 110} r="3.5" fill="#fff" />
                </svg>
                <div className="mt-2 flex justify-between text-[9px] uppercase tracking-[0.16em] text-muted">
                  <span>Jan</span>
                  <span>Apr</span>
                  <span>Jul</span>
                  <span>Oct</span>
                  <span>Dec</span>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3">
                {studioMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/8 bg-white/[0.02] px-3.5 py-3">
                    <dt className="text-[10px] text-muted">{metric.label}</dt>
                    <dd className="mt-1 flex items-baseline justify-between gap-2">
                      <span className="text-sm text-fg">{metric.value}</span>
                      <span className="text-[9px] text-aqua">{metric.delta}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* tagging */}
          <div className="grid gap-5">
            <Reveal y={22} delay={0.08}>
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted">
                    <Tag className="h-3.5 w-3.5" aria-hidden />
                    Post to product
                  </p>
                  <Badge tone="violet" size="sm">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    AI suggested
                  </Badge>
                </div>

                <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-white/8">
                  <ProductArt shape="bag" accent="coral" label="Reel frame" scale={1.12} />
                  {tags.map((tag, index) => (
                    <span
                      key={tag.label}
                      className="absolute flex items-center gap-1.5 rounded-pill border border-white/40 bg-ink/50 px-2.5 py-1 text-[10px] text-white backdrop-blur-md"
                      style={{ top: tag.top, left: tag.left, zIndex: 10 + index }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
                      {tag.label}
                    </span>
                  ))}
                  <span className="absolute bottom-2 left-2 rounded-pill bg-ink/70 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-fg/70 backdrop-blur">
                    Reel · 00:14
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="flex flex-1 items-center gap-2 rounded-pill border border-dashed border-white/15 px-3 py-2 text-[11px] text-muted">
                    <Plus className="h-3 w-3" aria-hidden />
                    Tag another product
                  </span>
                  <button
                    type="button"
                    className="rounded-pill bg-fg px-4 py-2 text-[11px] font-medium text-bg transition-transform hover:scale-[1.02]"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal y={22} delay={0.16}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4">
                  <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted">
                    <Coins className="h-3.5 w-3.5" aria-hidden />
                    Next payout
                  </p>
                  <p className="mt-2 font-display text-xl text-fg">₹1,84,220</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-aqua">
                    <BadgeCheck className="h-3 w-3" aria-hidden />
                    settles Friday
                  </p>
                </div>
                <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4">
                  <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted">
                    <Package className="h-3.5 w-3.5" aria-hidden />
                    Inventory alerts
                  </p>
                  <p className="mt-2 font-display text-xl text-fg">3 SKUs</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-amber">
                    restock before Friday
                    <ArrowUpRight className="h-3 w-3" aria-hidden />
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
