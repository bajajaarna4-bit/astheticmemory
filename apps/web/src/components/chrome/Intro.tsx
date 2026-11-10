'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const WORDMARK = 'VELORA'.split('');

/**
 * Cinematic first-load curtain.
 *
 * Runs once per session (sessionStorage), never blocks the document from being
 * read by crawlers, and degrades to a quick fade for reduced-motion users.
 */
export function Intro() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem('vl:intro') === 'seen') {
      setDone(true);
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const finish = () => {
      document.body.style.overflow = previousOverflow;
      sessionStorage.setItem('vl:intro', 'seen');
      setDone(true);
    };

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.to(rootRef.current, { opacity: 0, duration: 0.3, onComplete: finish });
        return;
      }

      const progress = { value: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      tl.from('.vl-intro-letter', {
        yPercent: 130,
        opacity: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.055,
      })
        .from('.vl-intro-meta', { opacity: 0, y: 12, duration: 0.5, stagger: 0.08 }, 0.35)
        .to(
          progress,
          {
            value: 100,
            duration: 1.2,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = Math.round(progress.value)
                  .toString()
                  .padStart(3, '0');
              }
            },
          },
          0.1,
        )
        .to('.vl-intro-bar', { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.1)
        .to('.vl-intro-brand', { yPercent: -120, opacity: 0, duration: 0.7, ease: 'power3.inOut' })
        .to(rootRef.current, { yPercent: -101, duration: 0.9, ease: 'power4.inOut' }, '-=0.25');
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-8 sm:px-10"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between text-[11px] uppercase tracking-[0.28em] text-fog/70">
        <span className="vl-intro-meta">House of seen</span>
        <span className="vl-intro-meta">Est. 2026</span>
      </div>

      <div className="vl-intro-brand flex flex-col items-center gap-8">
        <div className="flex overflow-hidden font-display text-[18vw] font-medium leading-[0.82] tracking-[-0.06em] text-paper sm:text-[13vw] lg:text-[10rem]">
          {WORDMARK.map((letter, i) => (
            <span key={`${letter}-${i}`} className="vl-intro-letter inline-block">
              {letter}
            </span>
          ))}
        </div>

        <div className="w-full max-w-md">
          <div className="h-px w-full bg-white/15">
            <div className="vl-intro-bar h-px w-full origin-left scale-x-0 bg-gradient-to-r from-violet via-coral to-aqua" />
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-fog/60">
            <span className="vl-intro-meta">Calibrating your feed</span>
            <span className="tabular-nums">
              <span ref={counterRef}>000</span>
              <span className="opacity-50">%</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between text-[11px] leading-relaxed text-fog/60">
        <p className="vl-intro-meta max-w-[16rem]">
          Social discovery, saved boards and ten-minute delivery in a single loop.
        </p>
        <p className="vl-intro-meta hidden sm:block">Mumbai · Bengaluru · Delhi NCR</p>
      </div>
    </div>
  );
}
