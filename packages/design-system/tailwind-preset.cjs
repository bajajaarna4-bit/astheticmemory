/**
 * VELORA Tailwind preset.
 *
 * Colours are exposed as `rgb(var(--vl-*) / <alpha-value>)` so the same utility
 * class works in dark and light mode and supports opacity modifiers
 * (`bg-panel/40`, `text-fg/60`, ...). The raw values live in `styles/theme.css`.
 */

/** @type {import('tailwindcss').Config['theme']} */
const theme = {
  extend: {
    screens: {
      xs: '380px',
      '3xl': '1920px',
      '4xl': '2560px',
    },
    colors: {
      // ---- semantic (theme-aware) ----
      bg: 'rgb(var(--vl-bg) / <alpha-value>)',
      fg: 'rgb(var(--vl-fg) / <alpha-value>)',
      muted: 'rgb(var(--vl-muted) / <alpha-value>)',
      panel: 'rgb(var(--vl-panel) / <alpha-value>)',
      elevated: 'rgb(var(--vl-elevated) / <alpha-value>)',
      line: 'rgb(var(--vl-line) / <alpha-value>)',

      // ---- brand (theme-independent) ----
      violet: {
        DEFAULT: '#7C5CFF',
        deep: '#4B2BFF',
        soft: '#B4A4FF',
      },
      coral: {
        DEFAULT: '#FF6B6B',
        deep: '#FF3D6E',
      },
      aqua: {
        DEFAULT: '#35E7D2',
        deep: '#0FBBA9',
      },
      amber: {
        DEFAULT: '#FFC46E',
      },
      ink: {
        DEFAULT: '#05060C',
        soft: '#0A0C16',
        raised: '#11131F',
        line: '#20243A',
      },
      fog: {
        DEFAULT: '#A8AEC6',
        dim: '#6E7690',
      },
      paper: {
        DEFAULT: '#F4F3FA',
        raised: '#FFFFFF',
        line: '#D9D7E6',
      },
    },
    fontFamily: {
      display: ['var(--font-display)', 'Space Grotesk', 'system-ui', 'sans-serif'],
      sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
    fontSize: {
      // fluid editorial display sizes
      'display-xs': ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      'display-sm': ['clamp(2.25rem, 5.5vw, 3.5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
      'display-md': ['clamp(2.75rem, 7vw, 5rem)', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
      'display-lg': ['clamp(3.25rem, 9vw, 7rem)', { lineHeight: '0.94', letterSpacing: '-0.045em' }],
      'display-xl': ['clamp(4rem, 12vw, 10rem)', { lineHeight: '0.9', letterSpacing: '-0.05em' }],
    },
    borderRadius: {
      '4xl': '2rem',
      '5xl': '2.5rem',
      '6xl': '3rem',
      pill: '999px',
    },
    spacing: {
      gutter: 'var(--vl-gutter)',
      section: 'var(--vl-section-y)',
      nav: 'var(--vl-nav-h)',
    },
    maxWidth: {
      shell: '82rem',
      prose: '68ch',
    },
    boxShadow: {
      glass: 'inset 0 1px 0 0 rgb(255 255 255 / 0.08), 0 24px 70px -28px rgb(0 0 0 / 0.75)',
      float: '0 40px 90px -40px rgb(0 0 0 / 0.9), 0 14px 34px -18px rgb(0 0 0 / 0.65)',
      lift: '0 18px 40px -22px rgb(0 0 0 / 0.8)',
      'glow-violet': '0 0 0 1px rgb(124 92 255 / 0.28), 0 26px 70px -18px rgb(124 92 255 / 0.55)',
      'glow-coral': '0 0 0 1px rgb(255 107 107 / 0.28), 0 26px 70px -18px rgb(255 107 107 / 0.5)',
      'glow-aqua': '0 0 0 1px rgb(53 231 210 / 0.28), 0 26px 70px -18px rgb(53 231 210 / 0.45)',
      innerline: 'inset 0 0 0 1px rgb(255 255 255 / 0.06)',
    },
    backdropBlur: {
      xs: '2px',
      '3xl': '48px',
    },
    // Finer alpha steps than Tailwind's defaults, so glass layers can be tuned
    // precisely (border-white/12, bg-panel/38, ...).
    opacity: {
      2: '0.02',
      4: '0.04',
      6: '0.06',
      8: '0.08',
      12: '0.12',
      15: '0.15',
      18: '0.18',
      22: '0.22',
      28: '0.28',
      32: '0.32',
      35: '0.35',
      38: '0.38',
      42: '0.42',
      45: '0.45',
      55: '0.55',
      65: '0.65',
      68: '0.68',
      85: '0.85',
      88: '0.88',
      92: '0.92',
      96: '0.96',
    },
    backgroundImage: {
      'mesh-violet':
        'radial-gradient(at 18% 12%, rgb(124 92 255 / 0.35) 0px, transparent 52%), radial-gradient(at 82% 18%, rgb(255 61 110 / 0.22) 0px, transparent 48%), radial-gradient(at 50% 92%, rgb(53 231 210 / 0.18) 0px, transparent 55%)',
      'mesh-aurora':
        'conic-gradient(from 180deg at 50% 50%, #4B2BFF 0deg, #7C5CFF 90deg, #35E7D2 180deg, #FF6B6B 270deg, #4B2BFF 360deg)',
      'sheen': 'linear-gradient(115deg, transparent 25%, rgb(255 255 255 / 0.14) 45%, transparent 65%)',
      'grid-fade':
        'linear-gradient(to right, rgb(255 255 255 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.045) 1px, transparent 1px)',
    },
    transitionTimingFunction: {
      smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    keyframes: {
      'float-y': {
        '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
        '50%': { transform: 'translate3d(0, -14px, 0)' },
      },
      breathe: {
        '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
        '50%': { opacity: '0.9', transform: 'scale(1.06)' },
      },
      shimmer: {
        '100%': { transform: 'translateX(100%)' },
      },
      'gradient-pan': {
        '0%, 100%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
      },
      'pulse-ring': {
        '0%': { transform: 'scale(0.7)', opacity: '0.7' },
        '80%, 100%': { transform: 'scale(2.1)', opacity: '0' },
      },
      marquee: {
        from: { transform: 'translateX(0)' },
        to: { transform: 'translateX(-50%)' },
      },
      'spin-slow': {
        to: { transform: 'rotate(360deg)' },
      },
      'fade-up': {
        from: { opacity: '0', transform: 'translate3d(0, 18px, 0)' },
        to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
      },
    },
    animation: {
      'float-y': 'float-y 7s ease-in-out infinite',
      breathe: 'breathe 6s ease-in-out infinite',
      shimmer: 'shimmer 2.2s infinite',
      'gradient-pan': 'gradient-pan 14s ease infinite',
      'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
      marquee: 'marquee 38s linear infinite',
      'spin-slow': 'spin-slow 26s linear infinite',
      'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
    },
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme,
  plugins: [],
};
