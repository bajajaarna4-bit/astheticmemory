'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import dynamic from 'next/dynamic';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Radio, Timer } from 'lucide-react';
import { ProductCard } from '@/components/commerce/ProductCard';
import { ProductArt } from '@/components/art/ProductArt';
import { heroProducts } from '@/lib/content/landing';

// The WebGL scene is ~180KB and only mounts when the hero is actually visible.
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export function HeroStage() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [mountScene, setMountScene] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 70, damping: 18, mass: 0.6 });
  const springY = useSpring(pointerY, { stiffness: 70, damping: 18, mass: 0.6 });

  const frontX = useTransform(springX, (value) => value * 1.6);
  const frontY = useTransform(springY, (value) => value * 1.6);
  const backX = useTransform(springX, (value) => value * -0.8);
  const backY = useTransform(springY, (value) => value * -0.8);
  const tiltX = useTransform(springY, (value) => value * -0.12);
  const tiltY = useTransform(springX, (value) => value * 0.16);

  useEffect(() => {
    if (reduce) return;
    const node = stageRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setMountScene(Boolean(entry?.isIntersecting)),
      { rootMargin: '240px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce]);

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(px * 26);
    pointerY.set(py * 26);
  };

  const reset = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const [lamp, runner] = heroProducts;

  return (
    <div
      ref={stageRef}
      onPointerMove={reduce ? undefined : onPointerMove}
      onPointerLeave={reset}
      className="relative mx-auto aspect-[4/5] w-full max-w-[34rem] [perspective:1400px] sm:aspect-square lg:aspect-[4/5]"
    >
      {/* ambient disc */}
      <div className="vl-aurora-ring absolute inset-[12%] rounded-full" aria-hidden />
      <div className="absolute inset-[8%] rounded-full border border-white/8" aria-hidden />
      <div className="absolute inset-[16%] rounded-full border border-white/5" aria-hidden />

      {/* 3D layer */}
      <div className="absolute inset-0">
        {mountScene && !reduce ? (
          <HeroScene />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-40 w-40 animate-float-y overflow-hidden rounded-full opacity-70">
              <ProductArt shape="lamp" accent="aqua" label="Product cluster" />
            </div>
          </div>
        )}
      </div>

      {/* floating product tag, front layer */}
      <motion.div
        style={{ x: frontX, y: frontY, rotateX: tiltX, rotateY: tiltY, rotate: -5 }}
        className="absolute -left-2 top-6 w-[9.5rem] sm:-left-6 sm:top-10 sm:w-44"
      >
        {lamp && (
          <ProductCard
            name={lamp.name}
            brand={lamp.brand}
            price={lamp.price}
            accent={lamp.accent}
            shape={lamp.shape}
            fulfillment="quick"
            rating={lamp.rating}
            compact
          />
        )}
      </motion.div>

      {/* second card, back layer */}
      <motion.div
        style={{ x: backX, y: backY, rotate: 6 }}
        className="absolute -right-1 bottom-14 w-[8.5rem] sm:-right-4 sm:bottom-20 sm:w-40"
      >
        {runner && (
          <ProductCard
            name={runner.name}
            brand={runner.brand}
            price={runner.price}
            accent={runner.accent}
            shape={runner.shape}
            badge="Tagged in a reel"
            rating={runner.rating}
            compact
          />
        )}
      </motion.div>

      {/* live ETA puck */}
      <motion.div
        style={{ x: frontX, y: frontY }}
        className="absolute inset-x-6 bottom-0 sm:inset-x-10"
      >
        <div className="vl-glass flex items-center gap-3 rounded-2xl px-4 py-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-aqua/15 text-aqua">
            <Timer className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-aqua/30" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted">
              <Radio className="h-3 w-3 text-aqua" aria-hidden />
              Indiranagar dark store
            </p>
            <p className="mt-0.5 truncate text-sm text-fg">
              Lamp + tote arrive in <span className="text-aqua">9 minutes</span>
            </p>
          </div>
          <span className="hidden shrink-0 text-xs tabular-nums text-muted sm:block">1.4 km</span>
        </div>
      </motion.div>
    </div>
  );
}
