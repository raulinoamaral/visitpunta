import { ACCOUNTS, POST_KINDS, type AccountHandle, type PostKind } from './instagramConstants'

/**
 * Publishes to Instagram through the Graph API (Facebook login path, like scripts/instagram/stats.mjs).
 * Each account needs its id and a page token with instagram_content_publish:
 * IG_USER_ID / IG_ACCESS_TOKEN (visitpunta) and IG_USER_ID_BR / IG_ACCESS_TOKEN_BR (visitpunta.br).
 * Instagram downloads every file from its public URL, so media must already be in Spaces.
 */

const API = 'https://graph.facebook.com/v23.0'
const POLL_INTERVAL_MS = 5000
const POLL_ATTEMPTS = 60 // videos can take a few minutes to process

export type PublishMedia = { url: string; isVideo: boolean }
export type PublishInput = { account: AccountHandle; kind: PostKind; caption?: string | null; media: PublishMedia[] }
export type PublishResult = { mediaId: string; permalink: string | null }

type Credentials = { userId: string; token: string }

function credentials(account: AccountHandle): Credentials {
  const suffix = account === ACCOUNTS.BRAZIL ? '_BR' : ''
  const userId = process.env[`IG_USER_ID${suffix}`]
  const token = process.env[`IG_ACCESS_TOKEN${suffix}`]
  if (!userId || !token) throw new Error(`Faltan IG_USER_ID${suffix} o IG_ACCESS_TOKEN${suffix} en el servidor.`)
  return { userId, token }
}

async function call(auth: Credentials, method: 'GET' | 'POST', pathname: string, params: Record<string, string>) {
  const { token } = auth
  const body = new URLSearchParams({ ...params, access_token: token })
  const url = method === 'GET' ? `${API}/${pathname}?${body}` : `${API}/${pathname}`
  const res = await fetch(url, method === 'POST' ? { method, body } : undefined)
  const json = await res.json()
  if (json.error) throw new Error(json.error.error_user_msg || json.error.message)
  return json
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// A container can only be published once Instagram finished downloading and processing it
async function waitUntilReady(auth: Credentials, containerId: string) {
  for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
    const { status_code: status, status: detail } = await call(auth, 'GET', containerId, { fields: 'status_code,status' })
    if (status === 'FINISHED') return
    if (status === 'ERROR' || status === 'EXPIRED') throw new Error(`Instagram no pudo procesar el archivo: ${detail ?? status}`)
    await wait(POLL_INTERVAL_MS)
  }
  throw new Error('Instagram tardó demasiado en procesar el archivo.')
}

async function createContainer(auth: Credentials, params: Record<string, string>) {
  const { id } = await call(auth, 'POST', `${auth.userId}/media`, params)
  return id as string
}

function mediaParam(item: PublishMedia): Record<string, string> {
  return item.isVideo ? { video_url: item.url } : { image_url: item.url }
}

async function buildContainer(auth: Credentials, { kind, caption, media }: PublishInput) {
  const text: Record<string, string> = caption?.trim() ? { caption: caption.trim() } : {}

  if (kind === POST_KINDS.STORY) {
    return createContainer(auth, { media_type: 'STORIES', ...mediaParam(media[0]) })
  }
  if (kind === POST_KINDS.REEL) {
    return createContainer(auth, { media_type: 'REELS', video_url: media[0].url, share_to_feed: 'true', ...text })
  }
  if (media.length === 1) {
    return createContainer(auth, { image_url: media[0].url, ...text })
  }

  const children: string[] = []
  for (const item of media) {
    const child = await createContainer(auth, { ...mediaParam(item), is_carousel_item: 'true' })
    await waitUntilReady(auth, child)
    children.push(child)
  }
  return createContainer(auth, { media_type: 'CAROUSEL', children: children.join(','), ...text })
}

export async function publishToInstagram(input: PublishInput): Promise<PublishResult> {
  if (input.media.length === 0) throw new Error('La pieza no tiene archivos.')
  const auth = credentials(input.account)

  const containerId = await buildContainer(auth, input)
  await waitUntilReady(auth, containerId)
  const { id: mediaId } = await call(auth, 'POST', `${auth.userId}/media_publish`, { creation_id: containerId })

  // Stories have no permalink; a failure here must not mark a published piece as failed
  let permalink: string | null = null
  try {
    permalink = (await call(auth, 'GET', mediaId, { fields: 'permalink' })).permalink ?? null
  } catch {
    permalink = null
  }
  return { mediaId, permalink }
}
