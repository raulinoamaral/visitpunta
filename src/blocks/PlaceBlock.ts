import type { Block } from 'payload'

export const PlaceBlock: Block = {
  slug: 'placeBlock',
  labels: { singular: 'Lugar recomendado', plural: 'Lugares recomendados' },
  fields: [
    {
      name: 'place',
      type: 'relationship',
      relationTo: ['places', 'experiences', 'destinations'],
      required: true,
    },
    {
      name: 'context',
      type: 'text',
      admin: {
        description: 'Línea de contexto. Ej: "Para quedarse cerca" o "Ideal para almorzar después".',
      },
    },
  ],
}
