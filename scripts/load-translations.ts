// Loads Portuguese versions of existing documents from a JSON file and publishes
// them in Portuguese. Shared fields (photos, zone, relations) are left untouched.
//
// NODE_ENV=production npx tsx --env-file=.env scripts/load-translations.ts <file.json>
//
// File shape: { places | experiences | articles | destinations: { <es slug>: {...} } }
// Experience "content" and article "layout" map each Spanish block index to its
// Portuguese text: a list of strings for a text block (one per Spanish text node,
// in order), a string for a quote, or an object of overrides for other blocks
// ({ title, context, caption, attribution, slides: [...], captions: [...] }).
// Blocks without an entry are copied as they are, with the same photos.
import fs from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

type TextList = string[]
type BlockOverrides = {
  title?: string
  context?: string
  caption?: string
  attribution?: string
  slides?: string[]
  captions?: (string | null)[]
}
type BlockTranslation = TextList | string | BlockOverrides
type ExperienceInput = {
  title: string
  slug: string
  tagline?: string
  summary?: string
  highlights?: string[]
  timingTitle?: string
  timing?: { moment: string; description: string }[]
  seoTitle?: string
  seoDescription?: string
  content: Record<string, BlockTranslation>
}
type ArticleInput = {
  title: string
  slug: string
  tagline?: string
  seoTitle?: string
  seoDescription?: string
  layout: Record<string, BlockTranslation>
}
type PlaceInput = {
  slug: string
  summary?: string
  location?: string
  description?: string
  highlights?: string[]
  seoTitle?: string
  seoDescription?: string
  /** Titles of the "related places" groups, in the Spanish order */
  relatedPlacesTitles?: string[]
}
type DestinationInput = {
  slug: string
  tagline?: string
  summary?: string
  description?: string
  seoTitle?: string
  seoDescription?: string
}

// Copies a value without Payload row ids, so the Portuguese rows get their own
function withoutIds<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withoutIds) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).filter(([key]) => key !== 'id').map(([key, v]) => [key, withoutIds(v)]),
    ) as T
  }
  return value
}

// Replaces the text nodes of a Lexical document ({ root }), in reading order
function replaceTexts(document: any, texts: TextList) {
  const copy = structuredClone(document)
  let index = 0
  const visit = (node: any) => {
    if (node.type === 'text') node.text = texts[index++]
    // Internal link targets are ids: the Portuguese page is resolved at render time
    if (node.type === 'link' && node.fields?.doc?.value && typeof node.fields.doc.value === 'object') {
      node.fields.doc.value = node.fields.doc.value.id
    }
    node.children?.forEach(visit)
  }
  visit(copy.root)
  if (index !== texts.length) throw new Error(`text count mismatch: Spanish has ${index}, Portuguese has ${texts.length}`)
  return copy
}

// Builds the Portuguese blocks from the Spanish ones
function translateBlocks(slug: string, blocks: any[], translations: Record<string, BlockTranslation>) {
  return (blocks ?? []).map((block: any, i: number) => {
    const translated = translations[String(i)]
    const copy = withoutIds(block)
    if (translated === undefined) {
      // Text and quotes must never fall back to Spanish
      if (block.blockType === 'textBlock' || block.blockType === 'quoteBlock') throw new Error(`${slug}: block ${i} is not translated`)
      return copy
    }
    if (block.blockType === 'textBlock') {
      if (!Array.isArray(translated)) throw new Error(`${slug}: block ${i} needs a text list`)
      return { ...copy, content: replaceTexts(block.content, translated) }
    }
    if (block.blockType === 'quoteBlock' && typeof translated === 'string') return { ...copy, text: translated }
    if (typeof translated !== 'object' || Array.isArray(translated)) throw new Error(`${slug}: block ${i} needs overrides`)
    const { slides, captions, ...fields } = translated
    const result = { ...copy, ...fields }
    if (slides) result.slides = copy.slides.map((slide: any, n: number) => ({ ...slide, text: slides[n] ?? slide.text }))
    if (captions) result.images = copy.images.map((image: any, n: number) => ({ ...image, caption: captions[n] ?? null }))
    return result
  })
}

async function run() {
  const file = process.argv[2]
  if (!file) throw new Error('Usage: load-translations.ts <file.json>')
  const input = JSON.parse(fs.readFileSync(file, 'utf8')) as {
    places?: Record<string, PlaceInput>
    experiences?: Record<string, ExperienceInput>
    articles?: Record<string, ArticleInput>
    destinations?: Record<string, DestinationInput>
  }
  const payload = await getPayload({ config })

  for (const [esSlug, pt] of Object.entries(input.places ?? {})) {
    const { docs } = await payload.find({ collection: 'places', locale: 'es', where: { slug: { equals: esSlug } }, limit: 1, depth: 0 })
    if (!docs[0]) throw new Error(`place not found: ${esSlug}`)
    const { relatedPlacesTitles, ...fields } = pt
    // The groups and their places are shared; only each group's title is translated
    const groups = (docs[0] as any).relatedPlaces ?? []
    if (relatedPlacesTitles && relatedPlacesTitles.length !== groups.length) {
      throw new Error(`${esSlug}: ${groups.length} related groups, ${relatedPlacesTitles.length} titles`)
    }
    await payload.update({
      collection: 'places',
      id: docs[0].id,
      locale: 'pt',
      data: {
        ...fields,
        highlights: pt.highlights?.map((text) => ({ text })),
        ...(relatedPlacesTitles && {
          relatedPlaces: groups.map((group: any, i: number) => ({ ...group, title: relatedPlacesTitles[i] })),
        }),
        published: true,
      } as any,
    })
    console.log(`place ${esSlug} → /pt/${pt.slug}`)
  }

  for (const [esSlug, pt] of Object.entries(input.destinations ?? {})) {
    const { docs } = await payload.find({ collection: 'destinations', locale: 'es', where: { slug: { equals: esSlug } }, limit: 1, depth: 0 })
    if (!docs[0]) throw new Error(`destination not found: ${esSlug}`)
    await payload.update({ collection: 'destinations', id: docs[0].id, locale: 'pt', data: { ...pt, published: true } as any })
    console.log(`destination ${esSlug} → /pt/${pt.slug}`)
  }

  for (const [esSlug, pt] of Object.entries(input.experiences ?? {})) {
    const { docs } = await payload.find({ collection: 'experiences', locale: 'es', where: { slug: { equals: esSlug } }, limit: 1, depth: 0 })
    const es = docs[0] as any
    if (!es) throw new Error(`experience not found: ${esSlug}`)

    const content = translateBlocks(esSlug, es.content, pt.content)

    await payload.update({
      collection: 'experiences',
      id: es.id,
      locale: 'pt',
      data: {
        title: pt.title,
        slug: pt.slug,
        tagline: pt.tagline,
        summary: pt.summary,
        timingTitle: pt.timingTitle,
        seoTitle: pt.seoTitle,
        seoDescription: pt.seoDescription,
        highlights: pt.highlights?.map((text) => ({ text })),
        timing: pt.timing,
        content,
        published: true,
      } as any,
    })
    console.log(`experience ${esSlug} → /pt/${pt.slug}`)
  }

  for (const [esSlug, pt] of Object.entries(input.articles ?? {})) {
    const { docs } = await payload.find({ collection: 'articles', locale: 'es', where: { slug: { equals: esSlug } }, limit: 1, depth: 0 })
    const es = docs[0] as any
    if (!es) throw new Error(`article not found: ${esSlug}`)
    const { layout, ...fields } = pt
    await payload.update({
      collection: 'articles',
      id: es.id,
      locale: 'pt',
      data: { ...fields, layout: translateBlocks(esSlug, es.layout, layout), published: true } as any,
    })
    console.log(`article ${esSlug} → /pt/${pt.slug}`)
  }
  process.exit(0)
}

run()
