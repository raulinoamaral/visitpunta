import type { GlobalConfig } from 'payload'
import { PLACE_TYPES } from '@/lib/constants'
import { revalidateGlobalOnChange } from '@/lib/revalidate'

const PER_LANGUAGE = 'En portugués, si lo dejás vacío, se usa lo mismo que en español.'

/**
 * What the home shows, chosen by hand. Every list is per language; an empty Portuguese list
 * falls back to the Spanish one, and an empty Spanish list falls back to the featured items.
 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  hooks: { afterChange: [revalidateGlobalOnChange] },
  fields: [
    {
      name: 'heroCaption',
      type: 'text',
      localized: true,
      label: 'Línea de la foto de portada',
      admin: { description: 'Qué muestra la foto. Ej: La bahía.' },
    },
    {
      name: 'season',
      type: 'relationship',
      relationTo: ['articles', 'places', 'experiences'],
      hasMany: true,
      localized: true,
      maxRows: 5,
      label: 'Estos días en Punta (fijar a mano)',
      admin: {
        description:
          'Opcional. Vacío: la home muestra sola lo que tiene fechas en "Estos días en Punta" (barra lateral de cada nota, lugar o experiencia). Si elegís algo acá, manda esto. El primero va grande.',
      },
    },
    {
      name: 'stay',
      type: 'relationship',
      relationTo: 'places',
      hasMany: true,
      localized: true,
      maxRows: 6,
      label: 'Dónde dormir',
      filterOptions: { type: { equals: PLACE_TYPES.DORMIR } },
      admin: { description: `De 3 a 6 hoteles, en este orden. Vacío: los destacados. ${PER_LANGUAGE}` },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'spotlight',
          type: 'relationship',
          relationTo: ['experiences', 'places'],
          localized: true,
          label: 'Destacado a pantalla completa',
          admin: { width: '50%', description: 'Un lugar o experiencia, con su nombre en grande.' },
        },
        {
          name: 'spotlightQuote',
          type: 'text',
          localized: true,
          label: 'Frase del destacado',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'eat',
      type: 'relationship',
      relationTo: 'places',
      hasMany: true,
      localized: true,
      maxRows: 6,
      label: 'Dónde comer',
      filterOptions: { type: { equals: PLACE_TYPES.COMER } },
      admin: { description: `4 restaurantes (o 6). Vacío: los destacados. ${PER_LANGUAGE}` },
    },
    {
      name: 'coffee',
      type: 'relationship',
      relationTo: 'places',
      hasMany: true,
      localized: true,
      maxRows: 6,
      label: 'Para el café',
      filterOptions: { type: { equals: PLACE_TYPES.COMER } },
      admin: { description: `Hasta 6 cafés. ${PER_LANGUAGE}` },
    },
    {
      name: 'todo',
      type: 'relationship',
      relationTo: 'experiences',
      hasMany: true,
      localized: true,
      maxRows: 10,
      label: 'Qué hacer',
      admin: { description: `Playas, lugares, paseos. Vacío: las destacadas. ${PER_LANGUAGE}` },
    },
    {
      name: 'notes',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      localized: true,
      maxRows: 4,
      label: 'Notas',
      admin: { description: `4 notas. Vacío: las 4 últimas. ${PER_LANGUAGE}` },
    },
  ],
}
