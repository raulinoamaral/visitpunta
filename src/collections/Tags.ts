import type { CollectionConfig } from 'payload'
import { PLACE_TYPES } from '../lib/constants'
import { revalidateOnChange, revalidateOnDelete } from '@/lib/revalidate'

export const Tags: CollectionConfig = {
  slug: 'tags',
  hooks: { afterChange: [revalidateOnChange], afterDelete: [revalidateOnDelete] },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'type'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Dormir', value: PLACE_TYPES.DORMIR },
        { label: 'Comer', value: PLACE_TYPES.COMER },
      ],
    },
  ],
}
