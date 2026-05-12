import type { Block } from 'payload'

export const SocialCarouselBlock: Block = {
  slug: 'socialCarousel',
  labels: { singular: 'Carrusel social', plural: 'Carruseles social' },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Título opcional. Ej: "5 cosas que saber antes de ir".',
      },
    },
    {
      name: 'slides',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'text',
          type: 'text',
          required: true,
          maxLength: 80,
          admin: {
            description: 'Frase corta, máximo 80 caracteres.',
          },
        },
      ],
    },
  ],
}
