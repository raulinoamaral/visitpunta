import type { Field, TextFieldSingleValidation } from 'payload'

// Day and month, the same every year: "15/11"
const DAY_MONTH = /^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])$/

const validateDayMonth: TextFieldSingleValidation = (value) =>
  !value || DAY_MONTH.test(value.trim()) || 'Formato día/mes, por ejemplo 15/11.'

/**
 * When a piece shows up in the home's "Estos días en Punta" block. Day and month only,
 * so it comes back on its own every year. A range can cross New Year (15/11 → 2/1).
 */
export const homeSeasonField: Field = {
  name: 'homeSeason',
  type: 'group',
  label: 'Estos días en Punta (home)',
  admin: {
    position: 'sidebar',
    description: 'Aparece sola en la home entre estas fechas, todos los años. Vacío: nunca.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'from',
          type: 'text',
          label: 'Desde',
          validate: validateDayMonth,
          admin: { width: '50%', placeholder: '15/11' },
        },
        {
          name: 'to',
          type: 'text',
          label: 'Hasta',
          validate: validateDayMonth,
          admin: { width: '50%', placeholder: '2/1' },
        },
      ],
    },
  ],
}
