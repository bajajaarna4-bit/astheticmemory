'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Morphing cursor.
 *
 * Only enabled for fine pointers and only after mount (so it can never block
 * interaction if JS fails). The native cursor is hidden through a `data-cursor`
 * flag on <html> rather than inline styles, which keeps the fallback intact.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<'idle' | 'link' | 'media'>('idle');

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.45 });
  const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.45 });
  const dotX = useSpring(x, { stiffness: 900, damping: 40 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.documentElement.dataset.cursor = 'custom';

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-cursor="media"]')) {
        setMode('media');
      } else if (target?.closest('a, button, [role="button"], input, select, textarea')) {
        setMode('link');
      } else {
        setMode('idle');
      }
    };

    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      delete document.documentElement.dataset.cursor;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const ringSize = mode === 'media' ? 76 : mode === 'link' ? 52 : 34;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block" aria-hidden="true">
      <motion.div
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 mix-blend-difference"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: ringSize,
          height: ringSize,
          backgroundColor: mode === 'media' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        {mode === 'media' && (
          <span className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-[0.16em] text-white">
            view
          </span>
        )}
      </motion.div>

      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
        style={{ x: dotX, y: dotY }}
        animate={{ scale: mode === 'idle' ? 1 : 0 }}
      />
    </div>
  );
}
