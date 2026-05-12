import type { Block } from 'payload'

export const QuoteBlock: Block = {
  slug: 'quoteBlock',
  labels: { singular: 'Cita', plural: 'Citas' },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      admin: {
        description: 'El texto de la cita.',
      },
    },
    {
      name: 'attribution',
      type: 'text',
      admin: {
        description: 'Autor o fuente (opcional).',
      },
    },
  ],
}
