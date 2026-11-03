export const LOCALES = ['es', 'pt'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'es'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/** Value for <html lang> and hreflang. Portuguese targets Brazil. */
export const HTML_LANG: Record<Locale, string> = {
  es: 'es',
  pt: 'pt-BR',
}

/**
 * Builds a public URL path for a locale. Spanish lives at the root,
 * Portuguese under /pt. `path` is a slug or "" for the homepage.
 */
export function localePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+/, '')
  if (locale === DEFAULT_LOCALE) return `/${clean}`
  return clean ? `/${locale}/${clean}` : `/${locale}`
}
