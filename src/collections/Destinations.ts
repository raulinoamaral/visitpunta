import type { CollectionConfig } from 'payload'
import { notifyIndexNow } from '@/lib/indexNow'
import { revalidateOnChange, revalidateOnDelete } from '@/lib/revalidate'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  hooks: { afterChange: [notifyIndexNow, revalidateOnChange], afterDelete: [revalidateOnDelete] },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
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
      name: 'published',
      type: 'checkbox',
      localized: true,
      label: 'Publicado en este idioma',
      // Per language: a destination only exists in a language once it is published there
      defaultValue: false,
    },
    {
      // Unnamed tabs only group the admin UI: the database schema stays the same
      type: 'tabs',
      tabs: [
        {
          label: 'Contenido',
          fields: [
            {
              name: 'tagline',
              type: 'text',
              localized: true,
              admin: {
                description: 'Frase breve que define el destino. Ej: "Entre la arena y el campo"',
              },
            },
            {
              name: 'summary',
              type: 'text',
              localized: true,
              admin: {
                description: 'Frase corta para cards y listados.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              admin: {
                description: 'Descripción completa del destino.',
              },
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
              name: 'heroCaption',
              type: 'text',
              localized: true,
              label: 'Línea de la foto de portada',
              admin: { description: 'Qué muestra la foto, en pocas palabras. Ej: El faro.' },
            },
          ],
        },
        {
          label: 'Página de la zona',
          fields: [
            {
              name: 'guide',
              type: 'relationship',
              relationTo: 'articles',
              label: 'La guía de la zona',
              admin: { description: 'Va en la franja de arriba, después del texto. Vacío: la primera guía de la zona.' },
            },
            {
              name: 'spotlight',
              type: 'relationship',
              relationTo: ['experiences', 'places'],
              label: 'Pausa a pantalla completa',
              admin: { description: 'Un lugar de la zona con el nombre en grande, entre Dónde dormir y Qué hacer. Vacío: no hay pausa.' },
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
                description: 'Si está vacío se usa el nombre del destino.',
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
