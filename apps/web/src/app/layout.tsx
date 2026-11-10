import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
// Self-hosted variable fonts: no build-time request to Google, no CLS on first
// paint, and the exact same files in every environment (including offline CI).
import '@fontsource-variable/space-grotesk/index.css';
import '@fontsource-variable/inter/index.css';
import '@velora/design-system/styles.css';
import './globals.css';

import { Header } from '@/components/chrome/Header';
import { Dock } from '@/components/chrome/Dock';
import { CartOrb } from '@/components/chrome/CartOrb';
import { Cursor } from '@/components/chrome/Cursor';
import { Intro } from '@/components/chrome/Intro';
import { SmoothScroll } from '@/components/providers/SmoothScroll';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://velora.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'VELORA — See it. Save it. Have it in ten.',
    template: '%s · VELORA',
  },
  description:
    'VELORA fuses a social feed, visual discovery, ten-minute quick commerce and a full marketplace into one shoppable loop. Every post, pin and reel is a product.',
  applicationName: 'VELORA',
  keywords: [
    'shoppable social',
    'quick commerce',
    'visual discovery',
    'creator commerce',
    'marketplace',
    '10 minute delivery',
  ],
  authors: [{ name: 'VELORA Labs' }],
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'VELORA',
    title: 'VELORA — See it. Save it. Have it in ten.',
    description:
      'Social discovery, saved boards and ten-minute delivery in a single loop. Every reel is shoppable.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VELORA — See it. Save it. Have it in ten.',
    description: 'Social discovery, saved boards and ten-minute delivery in a single loop.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#05060C' },
    { media: '(prefers-color-scheme: light)', color: '#F4F3FA' },
  ],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-pill focus:bg-fg focus:px-5 focus:py-3 focus:text-sm focus:text-bg"
        >
          Skip to content
        </a>

        <Intro />
        <Cursor />

        <SmoothScroll>
          <Header />
          {children}
          <Dock />
          <CartOrb />
        </SmoothScroll>
      </body>
    </html>
  );
}
