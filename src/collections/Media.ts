import type { CollectionConfig } from 'payload'
import sharp from 'sharp'

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

        const skip = file.mimetype === 'image/webp' || file.mimetype === 'image/heic' || file.mimetype === 'image/heif'
        if (skip) return

        try {
          const originalSize = file.data.length
          const converted = await sharp(file.data)
            .rotate()
            .webp({ quality: 80 })
            .toBuffer()

          if (converted.length < originalSize) {
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
