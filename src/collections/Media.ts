import type { CollectionConfig } from 'payload'
import sharp from 'sharp'

// Longest side of a stored photo: enough for a full-width hero on a retina screen
export const MAX_DIMENSION = 2560

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  hooks: {
    beforeOperation: [
      async ({ operation, req }) => {
        if (operation !== 'create' || !req.file) return
        const file = req.file
        console.log('[Media Hook] file:', file.name, file.mimetype, file.data?.length)

        // Vector and animated images stay as they are; sharp cannot decode iPhone HEIC
        const skip = ['image/svg+xml', 'image/gif', 'image/heic', 'image/heif'].includes(file.mimetype)
        if (skip) return

        try {
          const originalSize = file.data.length
          const { width = 0, height = 0 } = await sharp(file.data).metadata()
          const tooLarge = Math.max(width, height) > MAX_DIMENSION
          // A WebP that is already small enough is kept untouched
          if (file.mimetype === 'image/webp' && !tooLarge) return

          const converted = await sharp(file.data)
            .rotate()
            .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer()

          if (converted.length < originalSize || tooLarge) {
            file.name = file.name.replace(/\.[^.]+$/, '.webp')
            file.data = converted
            file.size = converted.length
            file.mimetype = 'image/webp'
            console.log('[Media Hook] converted to:', file.name, file.size)
          } else {
            console.log('[Media Hook] skipped conversion, webp larger:', converted.length, '>', originalSize)
          }
        } catch (err) {
          console.error('[Media Hook] conversion error:', err)
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Ej: © Hotel Fasano Punta del Este',
      },
    },
  ],
}
