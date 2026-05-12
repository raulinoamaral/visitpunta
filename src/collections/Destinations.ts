import type { CollectionConfig } from 'payload'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    // ── Basic info ──────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        components: {
          Field: '/components/SlugField#SlugField',
        },
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = value || data?.name
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

    // ── Hero ────────────────────────────────────────────────
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },

    // ── Content ─────────────────────────────────────────────
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Frase breve que define el destino. Ej: "Entre la arena y el campo"',
      },
    },
    {
      name: 'summary',
      type: 'text',
      admin: {
        description: 'Frase corta para cards y listados.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Descripción completa del destino.',
      },
    },

    // ── SEO ─────────────────────────────────────────────────
    {
      name: 'seoTitle',
      type: 'text',
      admin: {
        description: 'Si está vacío se usa el nombre del destino.',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      admin: {
        description: 'Si está vacío se usa el summary.',
      },
    },
  ],
}
