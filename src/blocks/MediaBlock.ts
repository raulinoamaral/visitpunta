import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  labels: { singular: 'Imagen(es)', plural: 'Imágenes' },
  fields: [
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 3,
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
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'breakout',
      options: [
        { label: 'Inline — ancho de texto', value: 'inline' },
        { label: 'Breakout — un poco más ancha', value: 'breakout' },
        { label: 'Bleed — borde a borde', value: 'bleed' },
      ],
    },
  ],
}
