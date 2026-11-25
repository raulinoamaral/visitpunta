import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Articles } from './collections/Articles'
import { Experiences } from './collections/Experiences'
import { InstagramMedia } from './collections/InstagramMedia'
import { InstagramPosts } from './collections/InstagramPosts'
import { Destinations } from './collections/Destinations'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Places } from './collections/Places'
import { Placements } from './collections/Placements'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { Home } from './globals/Home'
import { INSTAGRAM_CRON, INSTAGRAM_QUEUE, publishInstagramTask } from './jobs/publishInstagram'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Visit Punta',
    },
    components: {
      afterNavLinks: ['/components/admin/SiteMapLink#SiteMapLink'],
      views: {
        siteMap: { Component: '/components/admin/SiteMap#SiteMap', path: '/mapa' },
      },
    },
  },
  plugins: [
    s3Storage({
      collections: {
        media: {
          generateFileURL: (args: any) => {
            return `${process.env.R2_PUBLIC_URL}/${args.filename}`
          },
        },
        'instagram-media': {
          prefix: 'instagram',
          generateFileURL: ({ filename, prefix }) => `${process.env.R2_PUBLIC_URL}/${prefix}/${filename}`,
        },
      },
      acl: 'public-read',
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: process.env.R2_ENDPOINT || '',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: 'nyc3',
        requestHandler: { requestTimeout: 120000 },
      },
    }),
  ],
  collections: [Users, Media, Places, Tags, Articles, Destinations, Pages, Experiences, InstagramPosts, InstagramMedia, Placements],
  globals: [Home],
  jobs: {
    tasks: [publishInstagramTask],
    // Only the production server starts the clock: a local `next dev` on the same database
    // must never queue or publish anything (gate autoRun itself: schedules are queued before shouldAutoRun runs)
    autoRun: () => (process.env.INSTAGRAM_PUBLISH === 'true' ? [{ cron: INSTAGRAM_CRON, queue: INSTAGRAM_QUEUE }] : []),
  },
  localization: {
    locales: [
      { label: 'Español', code: 'es' },
      { label: 'Português', code: 'pt' },
    ],
    defaultLocale: 'es',
    // No fallback: a page without Portuguese content must not exist under /pt
    fallback: false,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // Schema changes always go through migrations, in dev and production
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
})
