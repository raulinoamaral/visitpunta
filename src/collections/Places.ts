import type { CollectionConfig } from 'payload'

export const Places: CollectionConfig = {
  slug: 'places',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'destination', 'featured'],
  },
  fields: [
    // ── Identidad ──────────────────────────────────────────
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
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Dormir', value: 'dormir' },
            { label: 'Comer', value: 'comer' },
            { label: 'Spots', value: 'spots' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'destination',
          type: 'relationship',
          relationTo: 'destinations',
          admin: { width: '33%' },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Destacado',
          defaultValue: false,
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      filterOptions: ({ data }) => {
        if (!data?.type) return true
        return { type: { equals: data.type } }
      },
    },

    // ── Hero ────────────────────────────────────────────────
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'cardImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Imagen para cards y listados. Si está vacío se usa la hero image.',
      },
    },

    // ── Contenido (como se ve en la ficha) ──────────────────
    {
      name: 'summary',
      type: 'text',
      admin: {
        description: 'Frase corta para cards y listados.',
      },
    },
    {
      name: 'location',
      type: 'textarea',
      admin: {
        description: 'Descripción de la ubicación del lugar.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Descripción completa para la página del lugar.',
      },
    },

    // ── Galería ─────────────────────────────────────────────
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'layout',
          type: 'select',
          required: true,
          defaultValue: 'duo',
          options: [
            { label: 'Duo — 2 fotos', value: 'duo' },
            { label: 'Grid — 3 fotos en fila', value: 'grid' },
            { label: 'Featured Bottom — 2 arriba + 3 abajo', value: 'featured-bottom' },
            { label: 'Featured Side — 1 grande + 2 apiladas', value: 'featured-side' },
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

    // ── Highlights ──────────────────────────────────────────
    {
      name: 'highlights',
      type: 'array',
      admin: {
        description: 'Para hoteles: "Por qué alojarse aquí". Para restaurantes: "Tené en cuenta".',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },

    // ── CTA ─────────────────────────────────────────────────
    {
      name: 'cta',
      type: 'group',
      fields: [
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'URL de reserva (Booking, etc.). Si está vacío no se muestra el botón.',
          },
        },
        {
          name: 'mapsUrl',
          type: 'text',
          admin: {
            description: 'URL de Google Maps. Si está vacío no se muestra el link.',
          },
        },
      ],
    },

    // ── Relacionados ────────────────────────────────────────
    {
      name: 'relatedPlaces',
      type: 'array',
      admin: {
        description: 'Grupos de lugares relacionados con título editorial.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Ej: "Para quedarse cerca", "Para comer después".',
          },
        },
        {
          name: 'places',
          type: 'relationship',
          relationTo: ['places', 'experiences'],
          hasMany: true,
          required: true,
        },
      ],
    },
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
    },

    // ── SEO ─────────────────────────────────────────────────
    {
      name: 'seoTitle',
      type: 'text',
      admin: {
        description: 'Si está vacío se usa el nombre del lugar.',
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
