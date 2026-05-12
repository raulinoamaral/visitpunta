import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  images: {
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
