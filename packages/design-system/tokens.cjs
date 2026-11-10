/**
 * VELORA design tokens - framework-agnostic source of truth.
 *
 * Consumed by:
 *   - `tailwind-preset.cjs` -> CSS utility classes
 *   - `styles/theme.css`    -> CSS custom properties (runtime themeable)
 *   - app code             -> GSAP / Framer Motion timings, canvas colours
 *
 * Rule: never hardcode a brand colour or duration in a component. Import it.
 */

/** Hex palette. Mirrored as `--vl-*` custom properties in `styles/theme.css`. */
const colors = {
  // Core surfaces (dark is the default mode)
  ink: '#05060C',
  inkSoft: '#0A0C16',
  inkRaised: '#11131F',
  inkLine: '#20243A',

  // Brand accents
  violet: '#7C5CFF',
  violetDeep: '#4B2BFF',
  violetSoft: '#B4A4FF',
  coral: '#FF6B6B',
  coralDeep: '#FF3D6E',
  aqua: '#35E7D2',
  aquaDeep: '#0FBBA9',
  amber: '#FFC46E',

  // Neutrals
  white: '#FFFFFF',
  fog: '#A8AEC6',
  fogDim: '#6E7690',
  paper: '#F4F3FA',
  paperRaised: '#FFFFFF',
  paperLine: '#D9D7E6',
};

/** Motion: one place to keep timing coherent across GSAP + Framer Motion. */
const motion = {
  duration: {
    instant: 0.12,
    fast: 0.24,
    base: 0.42,
    slow: 0.72,
    cinematic: 1.2,
  },
  ease: {
    out: 'power3.out',
    inOut: 'power2.inOut',
    expo: 'expo.out',
    elastic: 'elastic.out(1, 0.5)',
  },
  /** Cubic-bezier values for CSS / Framer Motion. */
  bezier: {
    smooth: [0.22, 1, 0.36, 1],
    spring: [0.34, 1.56, 0.64, 1],
    inOut: [0.65, 0, 0.35, 1],
  },
  stagger: {
    tight: 0.04,
    base: 0.08,
    loose: 0.16,
  },
};

const radii = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.25rem',
  xl: '1.75rem',
  '2xl': '2.25rem',
  '3xl': '3rem',
  pill: '999px',
};

const breakpoints = {
  xs: '380px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
  '4xl': '2560px',
};

/** Layout rhythm used by sections so vertical spacing stays musical. */
const layout = {
  container: '82rem',
  gutter: 'clamp(1.25rem, 4vw, 4rem)',
  sectionY: 'clamp(6rem, 12vh, 11rem)',
  navHeight: '4.5rem',
  cartOrb: '4.25rem',
};

const zIndex = {
  base: 0,
  sticky: 20,
  nav: 40,
  orb: 45,
  overlay: 60,
  cursor: 90,
  intro: 100,
};

const brand = {
  name: 'VELORA',
  tagline: 'See it. Save it. Have it in ten.',
};

module.exports = { colors, motion, radii, breakpoints, layout, zIndex, brand };
