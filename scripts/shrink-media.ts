// Shrinks oversized photos already uploaded to Payload, keeping each file's name,
// format and URL. Default is a dry run that writes nothing remote.
//
// Dry run: NODE_ENV=production npx tsx --env-file=.env scripts/shrink-media.ts <workDir>
// Apply:   NODE_ENV=production npx tsx --env-file=.env scripts/shrink-media.ts <workDir> --apply
//
// With --apply, every original is first saved to <workDir>/originals, then the smaller
// version replaces it in Spaces and the media row gets the new width, height and size.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { MAX_DIMENSION } from '../src/collections/Media'

// Files above this size are re-encoded even when their dimensions are fine
const MAX_BYTES = 1_000_000
const ENCODERS: Record<string, (image: sharp.Sharp) => sharp.Sharp> = {
  'image/jpeg': (image) => image.jpeg({ quality: 82, mozjpeg: true }),
  'image/webp': (image) => image.webp({ quality: 80 }),
}

async function run() {
  const args = process.argv.slice(2)
  const apply = args.includes('--apply')
  const workDir = args.find((a) => !a.startsWith('--'))
  if (!workDir) throw new Error('Usage: shrink-media.ts <workDir> [--apply]')
  const previewDir = path.join(workDir, 'preview')
  const originalsDir = path.join(workDir, 'originals')
  fs.mkdirSync(previewDir, { recursive: true })
  fs.mkdirSync(originalsDir, { recursive: true })

  const payload = await getPayload({ config })
  const s3 = new S3Client({
    endpoint: process.env.R2_ENDPOINT,
    region: 'nyc3',
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  })

  const { docs } = await payload.find({ collection: 'media', limit: 0, pagination: false, depth: 0 })
  const candidates = docs.filter(
    (m) =>
      m.mimeType &&
      ENCODERS[m.mimeType] &&
      (Math.max(m.width ?? 0, m.height ?? 0) > MAX_DIMENSION || (m.filesize ?? 0) > MAX_BYTES),
  )
  console.log(`${apply ? 'APPLY' : 'DRY RUN'}: ${candidates.length} of ${docs.length} photos to shrink`)

  let before = 0
  let after = 0
  for (const media of candidates) {
    const response = await fetch(media.url!)
    if (!response.ok) {
      console.log(`  skip ${media.filename}: download failed (${response.status})`)
      continue
    }
    const original = Buffer.from(await response.arrayBuffer())
    const resized = await ENCODERS[media.mimeType!](
      sharp(original).rotate().resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true }),
    ).toBuffer({ resolveWithObject: true })

    if (resized.data.length >= original.length) {
      console.log(`  keep ${media.filename}: already as small as it gets`)
      continue
    }
    before += original.length
    after += resized.data.length
    fs.writeFileSync(path.join(previewDir, media.filename!), resized.data)
    console.log(
      `  ${media.filename}: ${media.width}x${media.height} ${Math.round(original.length / 1024)} KB → ` +
        `${resized.info.width}x${resized.info.height} ${Math.round(resized.data.length / 1024)} KB`,
    )

    if (!apply) continue
    // Keep the original before replacing it
    fs.writeFileSync(path.join(originalsDir, media.filename!), original)
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: media.filename!,
        Body: resized.data,
        ContentType: media.mimeType!,
        ACL: 'public-read',
      }),
    )
    await payload.db.pool.query('UPDATE media SET width = $1, height = $2, filesize = $3 WHERE id = $4', [
      resized.info.width,
      resized.info.height,
      resized.data.length,
      media.id,
    ])
  }

  console.log(`Total: ${Math.round(before / 1048576)} MB → ${Math.round(after / 1048576)} MB`)
  process.exit(0)
}

run()
