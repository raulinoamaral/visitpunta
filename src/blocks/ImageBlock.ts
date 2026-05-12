import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'imageBlock',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
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
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Large', value: 'large' },
      ],
    },
  ],
}
