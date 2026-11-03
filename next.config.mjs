import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Old hand-made pages, now served from Payload (permanent, keeps search rankings)
  async redirects() {
    return [
      { source: '/alojamientos/fasano', destination: '/hotel-fasano', permanent: true },
      { source: '/gastronomia/la-huella', destination: '/la-huella', permanent: true },
      { source: '/alojamientos/the-grand-hotel', destination: '/alojamientos', permanent: true },
      { source: '/articulos/donde-dormir-en-punta', destination: '/alojamientos', permanent: true },
      // Articles used to live under /articulos; they are served at the root now
      { source: '/articulos/:slug', destination: '/:slug', permanent: true },
    ]
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  images: {
    // No 3840px variant: no layout here needs more than 2048px
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Keep resized photos for a week (Spaces only says one hour), so they are not reprocessed so often
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'pub-3ca9af00cc3b4034b7d7d3232089d941.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'visitpunta.nyc3.cdn.digitaloceanspaces.com',
      },
    ],
  },
}

export default withPayload(nextConfig)
