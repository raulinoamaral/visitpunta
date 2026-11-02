// Read-only export of all editorial content (articles, places, experiences, destinations)
// to Markdown + raw JSON, used as the corpus for the editorial voice skill.
// Usage: NODE_ENV=production npx tsx --env-file=.env scripts/export-editorial-corpus.ts <outDir>
// Also regenerates the editorial skill inventory (.claude/skills/visitpunta-editorial/references/inventory.md).
// NODE_ENV=production prevents Payload's dev schema push from touching the database.
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const COLLECTIONS = ['articles', 'places', 'experiences', 'destinations'] as const

// Convert a Lexical node tree to plain Markdown-ish text.
function lexicalToText(node: any): string {
  if (!node) return ''
  if (node.type === 'text') return node.text ?? ''
  if (node.type === 'linebreak') return '\n'
  const children = (node.children ?? []).map(lexicalToText).join('')
  switch (node.type) {
    case 'root':
      return (node.children ?? []).map(lexicalToText).join('\n\n')
    case 'heading':
      return `${'#'.repeat(Number(String(node.tag).replace('h', '')) || 2)} ${children}`
    case 'quote':
      return `> ${children}`
    case 'list':
      return (node.children ?? []).map((li: any) => `- ${lexicalToText(li)}`).join('\n')
    case 'link':
    case 'autolink':
      return `[${children}](${node.fields?.url ?? ''})`
    default:
      return children
  }
}

const isLexical = (value: any) => value && typeof value === 'object' && value.root?.type === 'root'

// Render any document generically: scalar text fields, rich text, and layout blocks.
function renderValue(key: string, value: any, depth = 0): string {
  if (value == null || value === '') return ''
  if (isLexical(value)) return `**${key}:**\n\n${lexicalToText(value.root)}\n`
  if (typeof value === 'string') return `**${key}:** ${value}\n`
  if (typeof value === 'number' || typeof value === 'boolean') return `**${key}:** ${value}\n`
  if (Array.isArray(value)) {
    if (value.length && value[0]?.blockType) {
      return `**${key}:**\n\n` + value.map((block) => {
        const inner = Object.entries(block)
          .filter(([k]) => !['id', 'blockType', 'blockName'].includes(k))
          .map(([k, v]) => renderValue(k, v, depth + 1))
          .join('')
        return `[BLOCK ${block.blockType}]\n${inner}`
      }).join('\n') + '\n'
    }
    const parts = value.map((v) => (v && typeof v === 'object' ? (v.title ?? v.name ?? v.slug ?? '') : String(v))).filter(Boolean)
    return parts.length ? `**${key}:** ${parts.join(', ')}\n` : ''
  }
  if (typeof value === 'object') {
    // Relationships / uploads: show their label only.
    const label = value.title ?? value.name ?? value.alt ?? value.filename ?? value.slug
    if (label && depth > 0) return `**${key}:** ${label}\n`
    if (label) return `**${key}:** ${label}\n`
    return Object.entries(value).map(([k, v]) => renderValue(`${key}.${k}`, v, depth + 1)).join('')
  }
  return ''
}

const SKIP_KEYS = new Set(['id', 'createdAt', 'updatedAt', 'sizes', 'url', 'thumbnailURL'])

const INVENTORY_PATH = path.resolve('.claude/skills/visitpunta-editorial/references/inventory.md')

// Inventory columns per collection: [label field, extra fields].
const INVENTORY_COLUMNS: Record<string, [string, string[]]> = {
  destinations: ['name', []],
  experiences: ['title', ['destination']],
  places: ['name', ['type', 'destination']],
  articles: ['title', ['type', 'destinations']],
}

const relationLabel = (value: any): string => {
  if (Array.isArray(value)) return value.map(relationLabel).filter(Boolean).join(', ')
  if (value && typeof value === 'object') return value.name ?? value.title ?? ''
  return value == null ? '' : String(value)
}

// Build the Markdown inventory the editorial skill uses for internal links and placeBlocks.
function buildInventory(docsByCollection: Record<string, any[]>): string {
  const lines = [
    '# Inventario de contenido publicado en visitpunta.com',
    '',
    `Generado desde la base de producción el ${new Date().toISOString().slice(0, 10)}. Todas las URLs son \`/{slug}\`.`,
    'Usalo para `placeBlock`, `related`, `relatedArticles` y links internos. Si algo no está acá, no existe todavía: marcalo `[CREAR]`.',
  ]
  for (const [collection, [labelField, extras]] of Object.entries(INVENTORY_COLUMNS)) {
    const docs = [...(docsByCollection[collection] ?? [])].sort((a, b) =>
      `${a.type ?? ''}${a[labelField]}`.localeCompare(`${b.type ?? ''}${b[labelField]}`),
    )
    const header = ['nombre', 'slug', ...extras]
    lines.push('', `## ${collection} (${docs.length})`, '', `| ${header.join(' | ')} |`, `|${'---|'.repeat(header.length)}`)
    for (const doc of docs) {
      const label = `${doc[labelField] ?? ''}${doc.published === false ? ' (borrador)' : ''}`
      lines.push(`| ${[label, `/${doc.slug}`, ...extras.map((e) => relationLabel(doc[e]))].join(' | ')} |`)
    }
  }
  return lines.join('\n') + '\n'
}

async function run() {
  const outDir = process.argv[process.argv.length - 1]
  const payload = await getPayload({ config })
  const docsByCollection: Record<string, any[]> = {}

  for (const collection of COLLECTIONS) {
    const { docs } = await payload.find({ collection, limit: 0, pagination: false, depth: 1 })
    docsByCollection[collection] = docs
    const dir = path.join(outDir, collection)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(outDir, `${collection}.json`), JSON.stringify(docs, null, 2))

    for (const doc of docs as any[]) {
      const body = Object.entries(doc)
        .filter(([k]) => !SKIP_KEYS.has(k))
        .map(([k, v]) => renderValue(k, v))
        .join('')
      const name = doc.slug ?? String(doc.id)
      fs.writeFileSync(path.join(dir, `${name}.md`), `# ${doc.title ?? doc.name ?? name}\n\n${body}`)
    }
    console.log(`${collection}: ${docs.length}`)
  }

  fs.writeFileSync(INVENTORY_PATH, buildInventory(docsByCollection))
  console.log(`Inventory written to ${INVENTORY_PATH}`)
  process.exit(0)
}

run()
