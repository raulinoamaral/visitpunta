import type { CollectionConfig } from 'payload'
import { revalidateOnChange, revalidateOnDelete } from '@/lib/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  hooks: { afterChange: [revalidateOnChange], afterDelete: [revalidateOnDelete] },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
