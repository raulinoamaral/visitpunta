// Every place on the site where something can be featured. Shared by the Placements collection,
// the site map in the admin and the pages (client-safe: no server imports)

export type PlacementCollection = 'articles' | 'places' | 'experiences'

export type SlotDefinition = {
  page: string
  label: string
  /** What can go in it */
  accepts: PlacementCollection[]
  /** Slots that exist once per zone */
  perZone?: boolean
  /** Only the first one is used */
  single?: boolean
  /** What the page does when the slot is empty, shown in the site map */
  empty: string
  /** For places: only hotels, or only places to eat */
  placeType?: 'dormir' | 'comer'
}

export const SLOTS = {
  'home.season': { page: 'Home', label: 'Estos días en Punta', accepts: ['articles', 'places', 'experiences'], empty: 'No aparece la sección.' },
  'home.stay': { page: 'Home', label: 'Dónde dormir', accepts: ['places'], empty: 'No aparece la sección.', placeType: 'dormir' },
  'home.spotlight': { page: 'Home', label: 'Destacado a pantalla completa', accepts: ['experiences', 'places'], single: true, empty: 'No hay destacado.' },
  'home.eat': { page: 'Home', label: 'Dónde comer', accepts: ['places'], empty: 'No aparece la sección.', placeType: 'comer' },
  'home.coffee': { page: 'Home', label: 'Para el café', accepts: ['places'], empty: 'No aparece la fila de cafés.', placeType: 'comer' },
  'home.todo': { page: 'Home', label: 'Qué hacer', accepts: ['experiences'], empty: 'No aparece la sección.' },
  'home.notes': { page: 'Home', label: 'Notas', accepts: ['articles'], empty: 'Las 4 últimas notas.' },
  'stay.first': { page: 'Alojamientos', label: 'Primeros de la lista', accepts: ['places'], empty: 'Todos los hoteles, en orden alfabético.', placeType: 'dormir' },
  'eat.first': { page: 'Gastronomía', label: 'Primeros de la lista', accepts: ['places'], empty: 'Todos los lugares, en orden alfabético.', placeType: 'comer' },
  'eat.beachNote': { page: 'Gastronomía', label: 'Nota antes de los paradores', accepts: ['articles'], single: true, empty: 'No hay franja antes de los paradores.' },
  'eat.coffeeNote': { page: 'Gastronomía', label: 'Nota antes de los cafés', accepts: ['articles'], single: true, empty: 'No hay franja antes de los cafés.' },
  'explore.start': { page: 'Recorridos', label: 'Para empezar', accepts: ['experiences', 'places'], empty: 'No aparece la sección.' },
  'explore.bandNote': { page: 'Recorridos', label: 'Guía de la franja', accepts: ['articles'], single: true, empty: 'No hay franja.' },
  'explore.guides': { page: 'Recorridos', label: 'Guías del final', accepts: ['articles'], empty: 'No aparece la sección.' },
  'zone.guide': { page: 'Zona', label: 'Guía', accepts: ['articles'], perZone: true, single: true, empty: 'La guía más reciente de la zona.' },
  'zone.spotlight': { page: 'Zona', label: 'Pausa a pantalla completa', accepts: ['experiences', 'places'], perZone: true, single: true, empty: 'No hay pausa.' },
  'zone.stayFirst': { page: 'Zona', label: 'Primeros en Dónde dormir', accepts: ['places'], perZone: true, empty: 'Todos los hoteles de la zona, en orden alfabético.', placeType: 'dormir' },
  'zone.eatFirst': { page: 'Zona', label: 'Primeros en Dónde comer', accepts: ['places'], perZone: true, empty: 'Todos los lugares de la zona, en orden alfabético.', placeType: 'comer' },
} as const satisfies Record<string, SlotDefinition>

export type SlotKey = keyof typeof SLOTS

export const SLOT_KEYS = Object.keys(SLOTS) as SlotKey[]

export const slotLabel = (slot: SlotKey) => `${SLOTS[slot].page} · ${SLOTS[slot].label}`

export const PLACEMENT_LOCALES = {
  ALL: 'all',
  ES: 'es',
  PT: 'pt',
} as const

export type PlacementLocale = (typeof PLACEMENT_LOCALES)[keyof typeof PLACEMENT_LOCALES]

// Day and month, the same every year: "15/11". A range can cross New Year (15/11 → 2/1)
export const DAY_MONTH = /^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])$/

const TIME_ZONE = 'America/Montevideo'

// Day of the year (1–366) for a "d/m" text, on a leap year so 29/2 is valid
export function dayOfYear(dayMonth: string): number | null {
  const [day, month] = dayMonth.split('/').map(Number)
  if (!day || !month) return null
  return Math.round((Date.UTC(2024, month - 1, day) - Date.UTC(2024, 0, 1)) / 86400000) + 1
}

export function todayOfYear(date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, day: 'numeric', month: 'numeric' }).formatToParts(date)
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '1'
  return dayOfYear(`${value('day')}/${value('month')}`) ?? 1
}

/** Whether a placement shows today: no dates means always */
export function isActive(from: string | null | undefined, to: string | null | undefined, today = todayOfYear()): boolean {
  if (!from || !to) return true
  const start = dayOfYear(from)
  const end = dayOfYear(to)
  if (start === null || end === null) return true
  return start <= end ? today >= start && today <= end : today >= start || today <= end
}

/** Days until a dated placement ends (for "ends soon" in the site map); null without dates */
export function daysLeft(to: string | null | undefined, today = todayOfYear()): number | null {
  if (!to) return null
  const end = dayOfYear(to)
  if (end === null) return null
  return (end - today + 366) % 366
}
