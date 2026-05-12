import { getPayload } from 'payload'
import config from './payload.config'

const PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-3ca9af00cc3b4034b7d7d3232089d941.r2.dev'

async function fixUrls() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'media',
    limit: 200,
    depth: 0,
  })

  console.log(`Found ${docs.length} media docs`)

  for (const doc of docs) {
    if (doc.url && !doc.url.startsWith('http')) {
      const newUrl = `${PUBLIC_URL}/${doc.filename}`
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: { url: newUrl } as any,
      })
      console.log(`Updated: ${doc.filename} -> ${newUrl}`)
    }
  }

  console.log('Done!')
  process.exit(0)
}

fixUrls()
