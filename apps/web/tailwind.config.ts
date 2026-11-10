import type { Config } from 'tailwindcss';
import preset from '@velora/design-system/tailwind-preset';

const config: Config = {
  presets: [preset as unknown as Config],
  content: [
    './src/**/*.{ts,tsx,mdx}',
    // design-system ships no markup yet, but keep the path ready for shared components
    '../../packages/design-system/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      screens: { xs: '380px' },
    },
  },
};

export default config;
