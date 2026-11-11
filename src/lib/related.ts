import type { Payload, Where } from 'payload'
import type { Locale } from '@/i18n/config'
import { PUBLISHED } from './published'

type MentionableCollection = 'places' | 'experiences'

const MENTIONABLE = new Set<string>(['places', 'experiences'])

const relationId = (value: unknown) =>
  typeof value === 'object' && value !== null ? (value as { id?: unknown }).id : value

/**
 * Every place or experience an article points to: place blocks, its `related` list
 * and internal links inside the text. Polymorphic relations all share the
 * `{ relationTo, value }` shape, so one walk over the raw data finds them all.
 */
function collectMentions(node: unknown, found: Set<string>) {
  if (Array.isArray(node)) {
    node.forEach((child) => collectMentions(child, found))
    return
  }
  if (typeof node !== 'object' || node === null) return
  const record = node as Record<string, unknown>
  if (typeof record.relationTo === 'string' && 'value' in record) {
    if (MENTIONABLE.has(record.relationTo)) found.add(`${record.relationTo}:${relationId(record.value)}`)
    // A populated document is not part of the article: do not walk into it
    return
  }
  Object.values(record).forEach((child) => collectMentions(child, found))
}

/** Published articles that mention a place or experience, newest first */
export async function findArticlesMentioning(
  payload: Payload,
  locale: Locale,
  collection: MentionableCollection,
  id: number,
  limit = 3,
) {
  const { docs: candidates } = await payload.find({
    collection: 'articles',
    locale,
    where: PUBLISHED,
    select: { layout: true, related: true },
    depth: 0,
    limit: 200,
    sort: '-createdAt',
  })

  const key = `${collection}:${id}`
  const mentioningIds = candidates
    .filter((article) => {
      const found = new Set<string>()
      collectMentions([article.layout, article.related], found)
      return found.has(key)
    })
    .map((article) => article.id)
    .slice(0, limit)

  if (mentioningIds.length === 0) return []

  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    where: { and: [PUBLISHED, { id: { in: mentioningIds } }] },
    depth: 1,
    limit,
    sort: '-createdAt',
  })
  return docs
}

/**
 * Fallback for "keep reading" when nothing was picked by hand:
 * articles sharing a zone come first, then those of the same type.
 */
export async function findSimilarArticles(
  payload: Payload,
  locale: Locale,
  article: { id: number; type?: string | null; destinations?: unknown[] | null },
  limit = 3,
) {
  const destinationIds = (article.destinations || []).map(relationId).filter(Boolean) as number[]
  const matches: Where[] = []
  if (destinationIds.length > 0) matches.push({ destinations: { in: destinationIds } })
  if (article.type) matches.push({ type: { equals: article.type } })
  if (matches.length === 0) return []

  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    where: { and: [PUBLISHED, { id: { not_equals: article.id } }, { or: matches }] },
    depth: 1,
    limit: 50,
    sort: '-createdAt',
  })

  const sharesZone = (doc: { destinations?: unknown[] | null }) =>
    (doc.destinations || []).some((d) => destinationIds.includes(relationId(d) as number))
  const score = (doc: (typeof docs)[number]) =>
    (sharesZone(doc) ? 2 : 0) + (doc.type === article.type ? 1 : 0)

  // Stable sort keeps newest first within the same score
  return [...docs].sort((a, b) => score(b) - score(a)).slice(0, limit)
}
