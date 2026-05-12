import type { Block } from 'payload'
import { lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'

export const TextBlock: Block = {
  slug: 'textBlock',
  labels: { singular: 'Texto', plural: 'Textos' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          LinkFeature({
            fields: ({ defaultFields }) => defaultFields,
            enabledCollections: ['places', 'experiences', 'destinations', 'articles'],
          }),
        ],
      }),
    },
  ],
}
