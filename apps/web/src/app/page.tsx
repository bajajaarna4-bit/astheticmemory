import { Hero } from '@/components/landing/Hero';
import { LoopSection } from '@/components/landing/LoopSection';
import { DiscoverySection } from '@/components/landing/DiscoverySection';
import { QuickSection } from '@/components/landing/QuickSection';
import { MarketplaceSection } from '@/components/landing/MarketplaceSection';
import { AiSection } from '@/components/landing/AiSection';
import { StudioSection } from '@/components/landing/StudioSection';
import { FooterCta } from '@/components/landing/FooterCta';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VELORA',
  url: 'https://velora.app',
  description:
    'Social discovery, saved boards and ten-minute quick commerce in a single shoppable loop.',
  sameAs: ['https://instagram.com/velora', 'https://x.com/velora'],
};

export default function HomePage() {
  return (
    <>
      <main id="main">
        <Hero />
        <LoopSection />
        <DiscoverySection />
        <QuickSection />
        <MarketplaceSection />
        <AiSection />
        <StudioSection />
      </main>
      <FooterCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
