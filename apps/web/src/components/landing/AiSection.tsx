'use client';

import { motion } from 'framer-motion';
import {
  Bot,
  Captions,
  LineChart,
  ScanSearch,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { Badge, SectionHeading } from '@/components/ui/surface';
import { Reveal } from '@/components/ui/motion';
import { assistantDemo } from '@/lib/content/landing';

const capabilities = [
  {
    icon: Wand2,
    title: 'Auto captions & tags',
    body: 'Creators publish once; captions, hashtags and product tags are suggested from the frame content.',
  },
  {
    icon: ScanSearch,
    title: 'Visual search',
    body: 'Image → embedding → nearest catalogue neighbours, filtered by live stock in your ring.',
  },
  {
    icon: LineChart,
    title: 'Price-drop forecast',
    body: 'Historical price curves and stock velocity predict the next 14 days before you buy.',
  },
  {
    icon: Captions,
    title: 'Review intelligence',
    body: 'Thousands of reviews compressed into fit, quality and durability signals per variant.',
  },
];

export function AiSection() {
  return (
    <section id="intelligence" className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(124_92_255/0.18),transparent_65%)]" aria-hidden />

      <div className="vl-shell">
        <SectionHeading
          eyebrow="Intelligence"
          title="Ask for a feeling. Get a cart."
          description="The assistant reasons over your taste graph, live inventory and budget — then returns shoppable looks instead of links."
          align="center"
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          {/* assistant */}
          <Reveal y={24}>
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-violet to-coral text-white">
                    <Bot className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs text-fg">VELORA assistant</p>
                    <p className="text-[10px] text-muted">tuned to your taste graph</p>
                  </div>
                </div>
                <Badge tone="aqua" size="sm" dot>
                  live
                </Badge>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="max-w-[85%] rounded-3xl rounded-br-lg bg-fg/[0.09] px-4 py-3 text-sm text-fg">
                  {assistantDemo.prompt}
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {assistantDemo.thinking.map((line, index) => (
                  <motion.li
                    key={line}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 + index * 0.18, duration: 0.5 }}
                    className="flex items-center gap-2 text-[11px] text-muted"
                  >
                    <span className="relative grid h-4 w-4 place-items-center rounded-full bg-violet/20">
                      <span className="h-1 w-1 rounded-full bg-violet-soft" />
                      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-violet/30" />
                    </span>
                    {line}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-4 max-w-[92%] rounded-3xl rounded-bl-lg border border-white/8 bg-ink/50 px-4 py-3">
                <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-aqua">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  3 looks found
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-fg/90">{assistantDemo.reply}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {assistantDemo.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-pill border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] text-fg/80"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/8 bg-ink/40 px-3 py-2.5">
                <Sparkles className="h-3.5 w-3.5 text-muted" aria-hidden />
                <span className="text-[11px] text-muted">Ask anything — budget, occasion, or a vibe</span>
                <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-fg text-[10px] text-bg">
                  ↑
                </span>
              </div>
            </div>
          </Reveal>

          {/* capability list */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {capabilities.map(({ icon: Icon, title, body }, index) => (
              <Reveal key={title} y={18} delay={0.06 * index}>
                <div className="group flex h-full items-start gap-4 rounded-3xl border border-white/8 bg-white/[0.02] p-4 transition-colors duration-300 hover:border-white/18">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/5 text-violet-soft transition-colors group-hover:text-aqua">
                    <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm text-fg">{title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted">{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
