/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@velora/design-system'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    // Phase 1 renders generative artwork. Remote patterns are pre-wired for the
    // CDN that Phase 2 will upload media to.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.velora.app' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
