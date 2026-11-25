import type { CollectionConfig, TextFieldSingleValidation, Where } from 'payload'
import { revalidateOnChange, revalidateOnDelete } from '@/lib/revalidate'
import { DAY_MONTH, PLACEMENT_LOCALES, SLOT_KEYS, SLOTS, slotLabel, type SlotKey } from '@/lib/placementSlots'

const validateDayMonth: TextFieldSingleValidation = (value) =>
  !value || DAY_MONTH.test(value.trim()) || 'Formato día/mes, por ejemplo 15/11.'

/**
 * Everything that is featured somewhere on the site, in one place: where, what, in which order,
 * and (optionally) between which dates of every year. The site map in the admin reads this.
 */
export const Placements: CollectionConfig = {
  slug: 'placements',
  labels: { singular: 'Ubicación', plural: 'Ubicaciones' },
  admin: {
    group: 'Sitio',
    useAsTitle: 'title',
    defaultColumns: ['slot', 'zone', 'item', 'position', 'from', 'to', 'locale'],
    description: 'Qué aparece destacado en cada lugar del sitio. Para verlo todo junto: Mapa del sitio.',
    listSearchableFields: ['title'],
  },
  defaultSort: 'slot',
  hooks: {
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
    // A readable title for lists and search: "Home · Dónde dormir · 2"
    beforeChange: [
      ({ data }) => {
        if (data.slot) data.title = `${slotLabel(data.slot as SlotKey)} · ${data.position ?? ''}`.trim()
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { hidden: true },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'slot',
          type: 'select',
          required: true,
          index: true,
          label: 'Dónde',
          options: SLOT_KEYS.map((value) => ({ value, label: slotLabel(value) })),
          admin: { width: '60%' },
        },
        {
          name: 'zone',
          type: 'relationship',
          relationTo: 'destinations',
          label: 'Zona',
          admin: {
            width: '40%',
            condition: (data) => Boolean(data?.slot && (SLOTS as Record<string, { perZone?: boolean }>)[data.slot]?.perZone),
          },
          validate: (value: unknown, { siblingData }: { siblingData: { slot?: string } }) => {
            const needsZone = siblingData?.slot && (SLOTS as Record<string, { perZone?: boolean }>)[siblingData.slot]?.perZone
            return !needsZone || Boolean(value) || 'Elegí la zona.'
          },
        },
      ],
    },
    {
      name: 'item',
      type: 'relationship',
      relationTo: ['places', 'articles', 'experiences'],
      required: true,
      label: 'Qué',
      // Only what fits the chosen slot (hotels for "Dónde dormir", notes for "Notas"…)
      filterOptions: ({ relationTo, siblingData }) => {
        const slot = (siblingData as { slot?: SlotKey })?.slot
        if (!slot) return true
        const accepts = SLOTS[slot].accepts as readonly string[]
        if (!accepts.includes(relationTo)) return false
        return true as true | Where
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'position',
          type: 'number',
          label: 'Posición',
          defaultValue: 1,
          min: 1,
          admin: { width: '20%', description: '1 va primero.' },
        },
        {
          name: 'from',
          type: 'text',
          label: 'Desde',
          validate: validateDayMonth,
          admin: { width: '20%', placeholder: '15/11', description: 'Día/mes, opcional.' },
        },
        {
          name: 'to',
          type: 'text',
          label: 'Hasta',
          validate: validateDayMonth,
          admin: { width: '20%', placeholder: '2/1', description: 'Se repite todos los años.' },
        },
        {
          name: 'locale',
          type: 'select',
          label: 'Idioma',
          required: true,
          defaultValue: PLACEMENT_LOCALES.ALL,
          options: [
            { value: PLACEMENT_LOCALES.ALL, label: 'Los dos' },
            { value: PLACEMENT_LOCALES.ES, label: 'Solo español' },
            { value: PLACEMENT_LOCALES.PT, label: 'Solo portugués' },
          ],
          admin: { width: '40%' },
        },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Nota interna',
      admin: { description: 'Por qué está acá, hasta cuándo, lo que haga falta recordar. No se publica.' },
    },
  ],
}
