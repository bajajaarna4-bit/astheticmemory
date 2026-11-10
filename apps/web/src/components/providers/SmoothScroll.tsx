'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * One owner for smooth scrolling.
 *
 * - Lenis drives the scroll position; GSAP's ticker drives Lenis so ScrollTrigger
 *   and Lenis never fight over rAF (the classic jitter bug).
 * - Anchor clicks are routed through `lenis.scrollTo` so in-page links stay
 *   smooth and offset correctly under the floating header.
 * - Users who ask for reduced motion get the native scrollbar untouched.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | null = null;

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      if (prefersReduced) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
      lenis?.scrollTo(target as HTMLElement, { offset: -84, duration: 1.15 });
    };

    document.addEventListener('click', onAnchorClick);

    if (prefersReduced) {
      return () => document.removeEventListener('click', onAnchorClick);
    }

    gsap.registerPlugin(ScrollTrigger);

    lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: true,
      syncTouch: false,
    });
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions once fonts/layout settle.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      window.clearTimeout(refresh);
      document.removeEventListener('click', onAnchorClick);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
