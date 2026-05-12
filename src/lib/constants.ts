export const PLACE_TYPES = {
  DORMIR: 'dormir',
  COMER: 'comer',
  SPOTS: 'spots',
} as const

export const ARTICLE_TYPES = [
  { label: 'Guía', value: 'guide' },
  { label: 'Selección', value: 'selection' },
  { label: 'Experiencia', value: 'experience' },
  { label: 'Temporada', value: 'season' },
] as const

export const ARTICLE_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  ARTICLE_TYPES.map(({ value, label }) => [value, label])
)
