/**
 * Typed surface for `tokens.cjs` (JavaScript is used so both the Tailwind preset
 * and the app can consume the same values without a build step).
 */

export type VeloraColors = {
  ink: string;
  inkSoft: string;
  inkRaised: string;
  inkLine: string;
  violet: string;
  violetDeep: string;
  violetSoft: string;
  coral: string;
  coralDeep: string;
  aqua: string;
  aquaDeep: string;
  amber: string;
  white: string;
  fog: string;
  fogDim: string;
  paper: string;
  paperRaised: string;
  paperLine: string;
};

export type VeloraMotion = {
  duration: {
    instant: number;
    fast: number;
    base: number;
    slow: number;
    cinematic: number;
  };
  ease: {
    out: string;
    inOut: string;
    expo: string;
    elastic: string;
  };
  bezier: {
    smooth: [number, number, number, number];
    spring: [number, number, number, number];
    inOut: [number, number, number, number];
  };
  stagger: { tight: number; base: number; loose: number };
};

export declare const colors: VeloraColors;
export declare const motion: VeloraMotion;
export declare const radii: Record<string, string>;
export declare const breakpoints: Record<string, string>;
export declare const layout: {
  container: string;
  gutter: string;
  sectionY: string;
  navHeight: string;
  cartOrb: string;
};
export declare const zIndex: Record<
  'base' | 'sticky' | 'nav' | 'orb' | 'overlay' | 'cursor' | 'intro',
  number
>;
export declare const brand: { name: string; tagline: string };
