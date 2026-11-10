'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { cn } from '@/lib/utils';

const SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ reveal */

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

/** Scroll-triggered fade + rise. Collapses to a no-op under reduced motion. */
export function Reveal({ children, className, delay = 0, y = 26, once = true }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.75, delay, ease: SMOOTH }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------- split text */

interface SplitHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  className?: string;
  delay?: number;
  stagger?: number;
  /** Set when a visually-hidden heading already carries the copy. */
  ariaHidden?: boolean;
}

/**
 * Word-by-word masked reveal for editorial headlines.
 * The full string is exposed via `aria-label` so screen readers never read
 * the fragmented spans.
 */
export function SplitHeading({
  text,
  as = 'h2',
  className,
  delay = 0,
  stagger = 0.045,
  ariaHidden = false,
}: SplitHeadingProps) {
  const reduce = useReducedMotion();
  const words = text.split(' ');

  const body = (
    <span aria-hidden className="inline">
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-flex overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: '112%', opacity: 0 },
              visible: { y: '0%', opacity: 1 },
            }}
            transition={{ duration: 0.95, delay: delay + i * stagger, ease: SMOOTH }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );

  const animationProps = {
    'aria-label': ariaHidden ? undefined : text,
    'aria-hidden': ariaHidden || undefined,
    className,
    initial: reduce ? undefined : ('hidden' as const),
    whileInView: 'visible' as const,
    viewport: { once: true, margin: '-8% 0px' },
  };

  if (as === 'h1') return <motion.h1 {...animationProps}>{body}</motion.h1>;
  if (as === 'h3') return <motion.h3 {...animationProps}>{body}</motion.h3>;
  if (as === 'p') return <motion.p {...animationProps}>{body}</motion.p>;
  if (as === 'div') return <motion.div {...animationProps}>{body}</motion.div>;
  return <motion.h2 {...animationProps}>{body}</motion.h2>;
}

/* --------------------------------------------------------------- magnetic */

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

/** Pulls the element toward the cursor with spring physics. */
export function Magnetic({
  children,
  className,
  strength = 0.28,
  href,
  onClick,
  ariaLabel,
}: MagneticProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 240, damping: 18, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 240, damping: 18, mass: 0.35 });

  if (reduce) {
    return href ? (
      <a href={href} aria-label={ariaLabel} className={className} onClick={onClick}>
        {children}
      </a>
    ) : (
      <button type="button" aria-label={ariaLabel} className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  const handleMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    rawX.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    rawY.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const inner = href ? (
    <a href={href} aria-label={ariaLabel} className={className} onClick={onClick}>
      {children}
    </a>
  ) : (
    <button type="button" aria-label={ariaLabel} className={className} onClick={onClick}>
      {children}
    </button>
  );

  return (
    <motion.span
      ref={ref}
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.97 }}
    >
      {inner}
    </motion.span>
  );
}

/* ------------------------------------------------------------------- tilt */

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
  glare?: boolean;
}

/** 3D perspective tilt with a pointer-following specular highlight. */
export function TiltCard({ children, className, max = 7, glare = true }: TiltCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareBg = useMotionTemplate`radial-gradient(320px circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.16), transparent 62%)`;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * max * 2);
    rotateX.set((0.5 - py) * max * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className="[perspective:1000px]">
      <motion.div
        ref={ref}
        className={cn('relative [transform-style:preserve-3d]', className)}
        style={{ rotateX, rotateY }}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        whileHover={{ z: 18 }}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ backgroundImage: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------- counters */

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.7,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;

    const render = (n: number) =>
      `${prefix}${n.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    if (reduce) {
      node.textContent = render(value);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: SMOOTH,
      onUpdate: (n) => {
        node.textContent = render(n);
      },
    });

    return () => controls.stop();
  }, [inView, value, decimals, prefix, suffix, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}0${suffix}`}
    </span>
  );
}

/* ----------------------------------------------------------------- marquee */

interface MarqueeProps {
  items: string[];
  className?: string;
}

/** Infinite CSS marquee; pauses on hover and under reduced motion. */
export function Marquee({ items, className }: MarqueeProps) {
  const row = [...items, ...items];

  return (
    <div className={cn('vl-mask-fade-x relative overflow-hidden', className)}>
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-10 whitespace-nowrap text-sm uppercase tracking-[0.22em] text-muted"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-current opacity-40" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
