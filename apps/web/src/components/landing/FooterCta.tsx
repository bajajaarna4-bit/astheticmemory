'use client';

import { useState } from 'react';
import { ArrowRight, Check, Github, Instagram, Twitter } from 'lucide-react';
import { Atmosphere } from '@/components/landing/Atmosphere';
import { Badge } from '@/components/ui/surface';
import { Reveal, SplitHeading } from '@/components/ui/motion';

const columns = [
  {
    title: 'Product',
    links: ['The loop', 'Discovery', 'Quick commerce', 'Marketplace', 'Studio'],
  },
  {
    title: 'Company',
    links: ['Manifesto', 'Careers', 'Press', 'Brand'],
  },
  {
    title: 'Trust',
    links: ['Privacy', 'Terms', 'Returns', 'Seller policy'],
  },
];

export function FooterCta() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  return (
    <footer id="waitlist" className="relative isolate overflow-hidden pt-24 sm:pt-32">
      <Atmosphere variant="warm" />

      <div className="vl-shell relative">
        <Reveal y={20} className="flex justify-center">
          <Badge tone="glass" size="md">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua" aria-hidden />
            Early access · Phase 1 preview
          </Badge>
        </Reveal>

        <SplitHeading
          as="h2"
          text="The loop is open."
          className="mt-7 text-center font-display text-display-md text-fg"
        />
        <SplitHeading
          as="h2"
          text="Step into it."
          delay={0.15}
          className="vl-text-gradient text-center font-display text-display-md"
        />

        <p className="mx-auto mt-6 max-w-prose text-center text-sm leading-relaxed text-muted sm:text-base">
          We are onboarding creators, sellers and delivery partners in three cities. Leave an email
          and we will open a store for you.
        </p>

        <div className="mx-auto mt-9 w-full max-w-xl">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!email) return;
              setJoined(true);
            }}
            className="vl-glass flex flex-col gap-2 rounded-pill p-2 sm:flex-row sm:items-center"
          >
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@studio.com"
              className="h-11 flex-1 rounded-pill bg-transparent px-5 text-sm text-fg placeholder:text-muted/70 focus:outline-none"
            />
            <button
              type="submit"
              className="group flex h-11 items-center justify-center gap-2 rounded-pill bg-fg px-6 text-sm font-medium text-bg transition-all duration-300 hover:shadow-glow-violet"
            >
              {joined ? (
                <>
                  You are in
                  <Check className="h-4 w-4 text-aqua" aria-hidden />
                </>
              ) : (
                <>
                  Request access
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                </>
              )}
            </button>
          </form>
          <p className="mt-3 text-center text-[11px] text-muted" role="status">
            {joined
              ? 'Saved locally for this preview — the waitlist API lands with the auth module.'
              : 'No spam. One email when your city opens.'}
          </p>
        </div>

        {/* footer body */}
        <div className="mt-20 grid gap-10 border-t border-white/8 pt-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="font-display text-lg tracking-[0.24em] text-fg">VELORA</p>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted">
              Social discovery, shoppable boards and ten-minute delivery in one loop. Built for the
              way inspiration actually turns into a purchase.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Instagram, Twitter, Github].map((Icon, index) => (
                <a
                  key={index}
                  href="#waitlist"
                  aria-label={['Instagram', 'Twitter', 'Github'][index]}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-muted transition-colors hover:border-white/25 hover:text-fg"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted">{column.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#top" className="text-xs text-fg/70 transition-colors hover:text-fg">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/8 py-8 text-[11px] text-muted sm:flex-row">
          <p>© 2026 VELORA Labs. A design-and-engineering concept build.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua" aria-hidden />
            All systems nominal · mock data
          </p>
        </div>
      </div>
    </footer>
  );
}
