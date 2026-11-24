/**
 * Loads a finished Instagram piece into the admin as a DRAFT, for the user to approve.
 * Used by the visitpunta-instagram skill after rendering.
 *
 * Reads content/instagram/<piece>.json: the rendered files come from its "out" folder
 * (01.jpg, 02.jpg… or post.files for a reel/story video), the rest from its "post" block:
 *   "post": {
 *     "title": "Dónde comer en La Barra", "account": "visitpunta" | "visitpunta.br" (default visitpunta),
 *     "kind": "post" | "reel" | "story",
 *     "scheduledAt": "2026-11-28T11:00:00-03:00",
 *     "caption": "…", "note": "…", "link": "/la-barra",
 *     "files": ["~/Downloads/…/reel.mp4"]   (optional, overrides the "out" folder)
 *   }
 *
 * Re-running it updates the same piece (matched by title and account) only while it is a draft or has a
 * change request; approved, published or discarded pieces are never touched.
 *
 * Run: INSTAGRAM_FILE=content/instagram/08-donde-comer-la-barra.json npx payload run src/scripts/stage-instagram.ts
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ACCOUNTS, POST_KINDS, POST_STATUS, type AccountHandle, type PostKind } from '@/lib/instagramConstants'

type Spec = {
  out?: string
  post?: {
    title: string
    account?: AccountHandle
    kind?: PostKind
    scheduledAt: string
    caption?: string
    note?: string
    link?: string
    files?: string[]
  }
}

const EDITABLE = [POST_STATUS.DRAFT, POST_STATUS.CHANGES] as string[]
const MIME: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4' }

const expandHome = (file: string) => (file.startsWith('~/') ? path.join(os.homedir(), file.slice(2)) : path.resolve(file))

const specFile = process.env.INSTAGRAM_FILE
if (!specFile) throw new Error('Set INSTAGRAM_FILE=content/instagram/<piece>.json')
const spec: Spec = JSON.parse(fs.readFileSync(specFile, 'utf8'))
const post = spec.post
if (!post?.title || !post.scheduledAt) throw new Error('The file needs a "post" block with title and scheduledAt')

const kind = post.kind ?? POST_KINDS.POST
const account = post.account ?? ACCOUNTS.MAIN
if (!(Object.values(ACCOUNTS) as string[]).includes(account)) throw new Error(`Unknown account: ${account}`)
const files = post.files?.length
  ? post.files.map(expandHome)
  : fs
      .readdirSync(expandHome(spec.out ?? ''))
      .filter((name) => /^\d+\.jpe?g$/i.test(name))
      .sort()
      .map((name) => path.join(expandHome(spec.out ?? ''), name))
if (files.length === 0) throw new Error('No rendered files found')

const payload = await getPayload({ config })

const { docs: existing } = await payload.find({
  collection: 'instagram-posts',
  where: { and: [{ title: { equals: post.title } }, { account: { equals: account } }] },
  depth: 0,
  limit: 1,
})
const current = existing[0]
if (current && !EDITABLE.includes(current.status)) {
  console.log(`STOPPED: "${post.title}" is ${current.status}; it is not changed.`)
  process.exit(0)
}

// Unique names in the bucket: the piece slug plus the file's own name
const slug = path.basename(specFile, '.json')
const media = []
for (const file of files) {
  const extension = path.extname(file).toLowerCase()
  const mimetype = MIME[extension]
  if (!mimetype) throw new Error(`Instagram only takes JPEG images and MP4 videos: ${file}`)
  const data = fs.readFileSync(file)
  const uploaded = await payload.create({
    collection: 'instagram-media',
    data: {},
    file: { data, mimetype, name: `${slug}-${path.basename(file)}`, size: data.length },
  })
  media.push({ file: uploaded.id })
}

const data = {
  title: post.title,
  account,
  kind,
  scheduledAt: new Date(post.scheduledAt).toISOString(),
  caption: post.caption ?? '',
  note: post.note ?? '',
  linkPath: post.link ?? '',
  media,
  feedback: '',
  status: POST_STATUS.DRAFT,
}

const saved = current
  ? await payload.update({ collection: 'instagram-posts', id: current.id, data })
  : await payload.create({ collection: 'instagram-posts', data })

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3200'
console.log(`${current ? 'UPDATED' : 'CREATED'} draft "${saved.title}" (${files.length} files)`)
console.log(`${site}/admin/collections/instagram-posts/${saved.id}`)
process.exit(0)
