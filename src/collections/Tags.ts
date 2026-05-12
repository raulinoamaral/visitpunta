import type { CollectionConfig } from 'payload'
import { PLACE_TYPES } from '../lib/constants'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'type'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
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
