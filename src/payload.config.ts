import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Articles } from './collections/Articles'
import { Experiences } from './collections/Experiences'
import { Destinations } from './collections/Destinations'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Places } from './collections/Places'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'

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
  },
  plugins: [
    s3Storage({
      collections: {
        media: {
          generateFileURL: (args: any) => {
            return `${process.env.R2_PUBLIC_URL}/${args.filename}`
          },
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
  collections: [Users, Media, Places, Tags, Articles, Destinations, Pages, Experiences],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
})
