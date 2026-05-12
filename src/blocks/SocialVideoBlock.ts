import type { Block } from 'payload'

export const SocialVideoBlock: Block = {
  slug: 'socialVideo',
  labels: { singular: 'Video social', plural: 'Videos social' },
  fields: [
    {
      name: 'source',
      type: 'radio',
      required: true,
      defaultValue: 'embed',
      options: [
        { label: 'Embed (TikTok, Instagram, YouTube)', value: 'embed' },
        { label: 'Video subido', value: 'upload' },
      ],
    },
    {
      name: 'embedUrl',
      type: 'text',
      admin: {
        description: 'URL del video de TikTok, Instagram Reel o YouTube Shorts.',
        condition: (_, siblingData) => siblingData?.source === 'embed',
      },
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'upload',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Texto debajo del video (opcional).',
      },
    },
  ],
}
