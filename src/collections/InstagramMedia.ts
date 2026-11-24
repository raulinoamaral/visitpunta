import type { CollectionConfig } from 'payload'

/**
 * Finished Instagram images and videos, exactly as they will be published.
 * Kept apart from the site's photo library: Instagram only accepts JPEG images,
 * while the site converts every photo to WebP. Files must be public (Instagram
 * downloads them from Spaces at publishing time).
 */
export const InstagramMedia: CollectionConfig = {
  slug: 'instagram-media',
  labels: { singular: 'Imagen de Instagram', plural: 'Imágenes de Instagram' },
  admin: {
    group: 'Instagram',
    useAsTitle: 'filename',
  },
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/jpeg', 'video/mp4'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
      admin: { description: 'Qué se ve en la imagen.' },
    },
  ],
}
