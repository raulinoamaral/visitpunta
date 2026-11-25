import { APIError, type Payload, type PayloadRequest } from 'payload'
import { MAX_CAPTION, POST_KINDS, POST_STATUS, type PostKind } from '@/lib/instagramConstants'
import { publishToInstagram } from '@/lib/instagramPublish'
import type { InstagramMedia, InstagramPost } from '@/payload-types'

/** Shared by the approval hook, the 10-minute clock and the "Publicar ahora" endpoint. */

type MediaRow = { file?: number | { id: number } | null }
type Publishable = { kind?: string | null; caption?: string | null; media?: MediaRow[] | null }

// A piece must be publishable as it is: the right number and type of files for its kind
export async function assertPublishable(data: Publishable, req: PayloadRequest) {
  const rows = data.media ?? []
  const ids = rows.map((row) => (typeof row.file === 'object' ? row.file?.id : row.file)).filter(Boolean) as number[]
  if (ids.length === 0) throw new APIError('Falta la imagen o el video.', 400)

  const { docs } = await req.payload.find({
    collection: 'instagram-media',
    where: { id: { in: ids } },
    depth: 0,
    limit: ids.length,
    req,
  })
  const videos = docs.filter((doc) => doc.mimeType?.startsWith('video/')).length
  const kind = data.kind as PostKind

  if (kind === POST_KINDS.REEL && (ids.length !== 1 || videos !== 1)) {
    throw new APIError('Un reel lleva un solo video.', 400)
  }
  if (kind === POST_KINDS.STORY && ids.length !== 1) {
    throw new APIError('Una historia lleva una sola imagen o un solo video.', 400)
  }
  if (kind === POST_KINDS.POST && videos > 0) {
    throw new APIError('Un post lleva solo imágenes. Para video, elegí Reel.', 400)
  }
  if (kind !== POST_KINDS.STORY && (data.caption ?? '').length > MAX_CAPTION) {
    throw new APIError(`El texto pasa los ${MAX_CAPTION} caracteres.`, 400)
  }
}

/**
 * Publishes one piece (loaded with depth 2, so its files carry their URL).
 * It is marked "publishing" first, so the clock never takes it twice;
 * it ends "published" with its link, or "failed" with the error (never retried on its own).
 */
export async function publishPost(payload: Payload, post: InstagramPost) {
  await payload.update({
    collection: 'instagram-posts',
    id: post.id,
    data: { status: POST_STATUS.PUBLISHING },
  })
  try {
    const media = (post.media ?? []).map((row) => {
      const file = row.file as InstagramMedia
      if (!file?.url) throw new Error('Un archivo no tiene URL pública.')
      return { url: file.url, isVideo: Boolean(file.mimeType?.startsWith('video/')) }
    })
    const { mediaId, permalink } = await publishToInstagram({ account: post.account, kind: post.kind, caption: post.caption, media })
    await payload.update({
      collection: 'instagram-posts',
      id: post.id,
      data: {
        status: POST_STATUS.PUBLISHED,
        result: { publishedAt: new Date().toISOString(), permalink, mediaId, error: null },
      },
    })
    return { published: true, permalink, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    payload.logger.error(`Instagram: piece ${post.id} failed: ${message}`)
    await payload.update({
      collection: 'instagram-posts',
      id: post.id,
      data: { status: POST_STATUS.FAILED, result: { error: message } },
    })
    return { published: false, permalink: null, error: message }
  }
}
