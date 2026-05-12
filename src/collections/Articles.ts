import type { CollectionConfig } from 'payload'
import { ARTICLE_TYPES } from '@/lib/constants'
import { TextBlock } from '@/blocks/TextBlock'
import { MediaBlock } from '@/blocks/MediaBlock'
import { QuoteBlock } from '@/blocks/QuoteBlock'
import { PlaceBlock } from '@/blocks/PlaceBlock'
import { SocialCarouselBlock } from '@/blocks/SocialCarouselBlock'
import { SocialVideoBlock } from '@/blocks/SocialVideoBlock'
import { SocialGalleryBlock } from '@/blocks/SocialGalleryBlock'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'published', 'featured'],
  },
  fields: [
    // ── Identidad ──────────────────────────────────────────
    {
      name: 'title',
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
          name: 'type',
          type: 'select',
          required: true,
          options: [...ARTICLE_TYPES],
          admin: { width: '25%' },
        },
        {
          name: 'destinations',
          type: 'relationship',
          relationTo: 'destinations',
          hasMany: true,
          admin: { width: '25%' },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: {
            width: '15%',
            description: 'Menor = primero.',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Destacado',
          defaultValue: false,
          admin: {
            width: '15%',
            description: 'Home.',
          },
        },
        {
          name: 'published',
          type: 'checkbox',
          label: 'Publicado',
          defaultValue: true,
          admin: { width: '25%' },
        },
      ],
    },

    // ── Hero ────────────────────────────────────────────────
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },

    // ── Contenido principal ─────────────────────────────────
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Frase corta para cards y listados.',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [TextBlock, MediaBlock, QuoteBlock, PlaceBlock, SocialCarouselBlock, SocialVideoBlock, SocialGalleryBlock],
    },

    // ── Relacionados ────────────────────────────────────────
    {
      name: 'related',
      type: 'relationship',
      relationTo: ['places', 'experiences'],
      hasMany: true,
      admin: {
        description: 'Places y experiencias relacionadas.',
      },
    },
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        description: 'Otros artículos relacionados.',
      },
    },

    // ── SEO ─────────────────────────────────────────────────
    {
      name: 'seoTitle',
      type: 'text',
      admin: {
        description: 'Si está vacío se usa el título del artículo.',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      admin: {
        description: 'Si está vacío se usa el tagline.',
      },
    },
  ],
}
