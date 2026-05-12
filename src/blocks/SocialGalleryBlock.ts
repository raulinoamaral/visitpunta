import type { Block } from 'payload'

export const SocialGalleryBlock: Block = {
  slug: 'socialGallery',
  labels: { singular: 'Galería social', plural: 'Galerías social' },
  fields: [
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
}
