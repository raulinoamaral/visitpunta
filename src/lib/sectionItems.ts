import type { Payload } from 'payload'
import type { SectionItem } from '@/components/sections/types'
import { localePath, type Locale } from '@/i18n/config'
import { withBookingAid } from '@/lib/booking'
import { PLACE_TYPES } from '@/lib/constants'

/**
 * Shared by the section pages (Alojamientos, Gastronomía, Recorridos) and the zone pages.
 */

// Zones in the order the filters show them
export const ZONE_ORDER = ['Punta del Este', 'José Ignacio', 'La Barra', 'Punta Ballena']

/** A place, experience or article as a card. Null when it has no slug or photo */
export function toSectionItem(doc: any, locale: Locale, label?: string): SectionItem | null {
  const media = doc?.cardImage?.url ? doc.cardImage : doc?.heroImage
  if (!doc?.slug || !media?.url) return null
  return {
    id: String(doc.id),
    title: doc.name ?? doc.title,
    href: localePath(locale, doc.slug),
    image: media.url,
    alt: media.alt || doc.name || doc.title,
    label: label ?? doc.destination?.name ?? undefined,
    summary: doc.summary ?? doc.tagline ?? undefined,
    booking: doc.type === PLACE_TYPES.DORMIR && doc.cta?.url ? withBookingAid(doc.cta.url) : null,
  }
}

export function toSectionItems(docs: any[], locale: Locale, label?: (doc: any) => string | undefined): SectionItem[] {
  return docs.map((doc) => toSectionItem(doc, locale, label?.(doc))).filter((item): item is SectionItem => Boolean(item))
}

/** The zones present in these items, in filter order */
export function zonesOf(items: SectionItem[]): string[] {
  const present = new Set(items.map((item) => item.label))
  return ZONE_ORDER.filter((zone) => present.has(zone))
}

/** Ids of the coffee tag(s): labels are per language, so they are looked up in Spanish */
export async function coffeeTagIds(payload: Payload): Promise<Set<number>> {
  const { docs } = await payload.find({ collection: 'tags', locale: 'es', where: { label: { like: 'caf' } }, depth: 0, limit: 10 })
  return new Set(docs.map((tag) => tag.id))
}

/** A place tagged only as a café (a café that is also a restaurant stays with the restaurants) */
export function isOnlyCoffee(doc: any, coffeeIds: Set<number>): boolean {
  const ids = (doc.tags ?? []).map((tag: any) => (typeof tag === 'object' ? tag.id : tag))
  return ids.length > 0 && ids.every((id: number) => coffeeIds.has(id))
}

// Beaches are experiences named "Playa …" (Spanish) or "Praia …" (Portuguese)
const BEACH = /^(Playa|Praia) /
export const isBeach = (title: string) => BEACH.test(title)
export const withoutBeachWord = (title: string) => title.replace(BEACH, '')
