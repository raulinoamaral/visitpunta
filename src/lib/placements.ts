import type { Payload } from 'payload'
import type { Locale } from '@/i18n/config'
import { PUBLISHED } from '@/lib/published'
import { isActive, todayOfYear, type PlacementCollection, type SlotKey } from '@/lib/placementSlots'

/**
 * What the pages show in each slot, from Admin → Ubicaciones: only what is in date today,
 * meant for this language and published in it, in the chosen order.
 */

export type Placed = { collection: PlacementCollection; doc: any }

type PlacementRow = {
  slot: SlotKey
  item: { relationTo: PlacementCollection; value: number | { id: number } }
  position?: number | null
  from?: string | null
  to?: string | null
  locale: 'all' | 'es' | 'pt'
}

const idOf = (value: number | { id: number }) => (typeof value === 'object' ? value.id : value)

/** Several slots at once (one page): a map from slot to its documents, in order */
export async function getPlacements(
  payload: Payload,
  locale: Locale,
  slots: SlotKey[],
  zone?: number,
): Promise<Record<string, Placed[]>> {
  const { docs } = await payload.find({
    collection: 'placements',
    where: {
      and: [
        { slot: { in: slots } },
        { locale: { in: ['all', locale] } },
        ...(zone !== undefined ? [{ zone: { equals: zone } }] : []),
      ],
    },
    depth: 0,
    limit: 500,
    sort: 'position',
  })
  const today = todayOfYear()
  const rows = (docs as unknown as PlacementRow[]).filter((row) => isActive(row.from, row.to, today))

  // The documents themselves, once per collection, published in this language
  const ids = (collection: PlacementCollection) => [
    ...new Set(rows.filter((row) => row.item.relationTo === collection).map((row) => idOf(row.item.value))),
  ]
  const loaded = new Map<string, any>()
  await Promise.all(
    (['places', 'articles', 'experiences'] as PlacementCollection[]).map(async (collection) => {
      const wanted = ids(collection)
      if (wanted.length === 0) return
      const { docs: found } = await payload.find({
        collection,
        locale,
        where: { and: [PUBLISHED, { id: { in: wanted } }] },
        depth: 1,
        limit: wanted.length,
      })
      for (const doc of found) loaded.set(`${collection}-${doc.id}`, doc)
    }),
  )

  const result: Record<string, Placed[]> = Object.fromEntries(slots.map((slot) => [slot, []]))
  for (const row of rows) {
    const key = `${row.item.relationTo}-${idOf(row.item.value)}`
    const doc = loaded.get(key)
    const list = result[row.slot]
    if (doc && list && !list.some((entry) => entry.collection === row.item.relationTo && entry.doc.id === doc.id)) {
      list.push({ collection: row.item.relationTo, doc })
    }
  }
  return result
}

/** "Primeros de la lista": the chosen ones first, in their order, then the rest by name */
export function firstThenByName<T extends { id: number; name?: string; title?: string }>(docs: T[], first: Placed[]): T[] {
  const rank = new Map(first.map((entry, index) => [entry.doc.id, index]))
  const name = (doc: T) => (doc.name ?? doc.title ?? '').toLocaleLowerCase('es')
  return [...docs].sort((a, b) => {
    const rankA = rank.get(a.id)
    const rankB = rank.get(b.id)
    if (rankA !== undefined || rankB !== undefined) return (rankA ?? Infinity) - (rankB ?? Infinity)
    return name(a).localeCompare(name(b), 'es')
  })
}
