import { localePath, type Locale } from './config'

/**
 * Fixed section pages and their public slug in each language. The route folders
 * use the Spanish slug; the middleware maps the other languages onto them.
 */
export const SECTION_SLUGS = {
  stay: { es: 'alojamientos', pt: 'hospedagem' },
  eat: { es: 'gastronomia', pt: 'gastronomia' },
  explore: { es: 'recorridos', pt: 'passeios' },
  // Index of every article; linked only from the home, not from the menu
  notes: { es: 'notas', pt: 'leituras' },
} as const satisfies Record<string, Record<Locale, string>>

export type SectionKey = keyof typeof SECTION_SLUGS

export function sectionHref(section: SectionKey, locale: Locale): string {
  return localePath(locale, SECTION_SLUGS[section][locale])
}
