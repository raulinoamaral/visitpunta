import type { CollectionConfig } from 'payload'
import { TextBlock } from '@/blocks/TextBlock'
import { MediaBlock } from '@/blocks/MediaBlock'
import { QuoteBlock } from '@/blocks/QuoteBlock'
import { PlaceBlock } from '@/blocks/PlaceBlock'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'destination', 'published'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      required: true,
      unique: true,
      admin: {
        components: {
          Field: {
            path: '/components/SlugField#SlugField',
            clientProps: { sourceField: 'title' },
          },
        },
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = value || data?.title
            if (!source) return value
            return source
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-')
          },
        ],
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'destination',
          type: 'relationship',
          relationTo: 'destinations',
          admin: { width: '33%' },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: {
            width: '17%',
            description: 'Menor = primero.',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Destacado',
          defaultValue: false,
          admin: {
            width: '25%',
            description: 'Sección "Para empezar".',
          },
        },
        {
          name: 'published',
          type: 'checkbox',
          localized: true,
          label: 'Publicado en este idioma',
          // Per language: a page only exists in a language once it is published there
          defaultValue: false,
          admin: { width: '25%' },
        },
      ],
    },
    {
      // Unnamed tabs only group the admin UI: the database schema stays the same
      type: 'tabs',
      tabs: [
        {
          label: 'Contenido',
          fields: [
            {
              name: 'summary',
              type: 'text',
              localized: true,
              admin: {
                description: 'Frase corta para cards y listados.',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              localized: true,
              admin: {
                description: 'Frase corta destacada, tipo subtítulo.',
              },
            },
            {
              name: 'content',
              type: 'blocks',
              localized: true,
              blocks: [TextBlock, MediaBlock, QuoteBlock, PlaceBlock],
            },
            {
              name: 'highlights',
              type: 'array',
              localized: true,
              admin: {
                description: 'Puntos destacados de la experiencia.',
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Fotos',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'gallery',
              type: 'array',
              fields: [
                {
                  name: 'layout',
                  type: 'select',
                  required: true,
                  defaultValue: 'single',
                  options: [
                    { label: 'Single — 1 foto', value: 'single' },
                    { label: 'Duo — 2 fotos en línea', value: 'duo' },
                  ],
                },
                {
                  name: 'images',
                  type: 'array',
                  required: true,
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Lo práctico',
          fields: [
            {
              name: 'timingTitle',
              type: 'text',
              localized: true,
              defaultValue: 'Cuándo ir',
              admin: {
                description: 'Título de la sección (ej: "Cuándo ir", "Mejor momento").',
              },
            },
            {
              name: 'timing',
              type: 'array',
              localized: true,
              admin: {
                description: 'Momentos del día con una descripción corta.',
              },
              fields: [
                {
                  name: 'moment',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Ej: Mañana, Tarde, Atardecer',
                  },
                },
                {
                  name: 'description',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Ej: Más tranquila, buen momento para caminar',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Relacionados',
          fields: [
            {
              name: 'related',
              type: 'relationship',
              relationTo: ['places', 'experiences'],
              hasMany: true,
              admin: {
                description: 'Places y experiencias relacionadas.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              localized: true,
              admin: {
                description: 'Si está vacío se usa el título.',
              },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              localized: true,
              admin: {
                description: 'Si está vacío se usa el summary.',
              },
            },
          ],
        },
      ],
    },
  ],
}
