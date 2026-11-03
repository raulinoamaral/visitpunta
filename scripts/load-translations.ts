// Loads Portuguese versions of existing documents from a JSON file and publishes
// them in Portuguese. Shared fields (photos, zone, relations) are left untouched.
//
// NODE_ENV=production npx tsx --env-file=.env scripts/load-translations.ts <file.json>
//
// File shape: { places: { <es slug>: {...} }, experiences: { <es slug>: {...} } }
// Experience "content" maps each Spanish block index to its Portuguese text:
// a list of strings for a text block (one per Spanish text node, in order) or a
// string for a quote. Media and place blocks are copied with the same photos.
import fs from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

type TextList = string[]
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
  content: Record<string, TextList | string>
}
type PlaceInput = {
  slug: string
  summary?: string
  location?: string
  description?: string
  highlights?: string[]
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

async function run() {
  const file = process.argv[2]
  if (!file) throw new Error('Usage: load-translations.ts <file.json>')
  const input = JSON.parse(fs.readFileSync(file, 'utf8')) as {
    places?: Record<string, PlaceInput>
    experiences?: Record<string, ExperienceInput>
  }
  const payload = await getPayload({ config })

  for (const [esSlug, pt] of Object.entries(input.places ?? {})) {
    const { docs } = await payload.find({ collection: 'places', locale: 'es', where: { slug: { equals: esSlug } }, limit: 1, depth: 0 })
    if (!docs[0]) throw new Error(`place not found: ${esSlug}`)
    await payload.update({
      collection: 'places',
      id: docs[0].id,
      locale: 'pt',
      data: {
        ...pt,
        highlights: pt.highlights?.map((text) => ({ text })),
        published: true,
      } as any,
    })
    console.log(`place ${esSlug} → /pt/${pt.slug}`)
  }

  for (const [esSlug, pt] of Object.entries(input.experiences ?? {})) {
    const { docs } = await payload.find({ collection: 'experiences', locale: 'es', where: { slug: { equals: esSlug } }, limit: 1, depth: 0 })
    const es = docs[0] as any
    if (!es) throw new Error(`experience not found: ${esSlug}`)

    const content = (es.content ?? []).map((block: any, i: number) => {
      const translated = pt.content[String(i)]
      const copy = withoutIds(block)
      if (block.blockType === 'textBlock') {
        if (!Array.isArray(translated)) throw new Error(`${esSlug}: block ${i} needs a text list`)
        return { ...copy, content: replaceTexts(block.content, translated) }
      }
      if (block.blockType === 'quoteBlock') {
        if (typeof translated !== 'string') throw new Error(`${esSlug}: block ${i} needs a quote`)
        return { ...copy, text: translated }
      }
      return copy
    })

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
  process.exit(0)
}

run()
