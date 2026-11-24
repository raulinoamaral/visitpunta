import type { TaskConfig } from 'payload'
import { POST_STATUS } from '@/lib/instagramConstants'
import { publishToInstagram } from '@/lib/instagramPublish'
import type { InstagramMedia } from '@/payload-types'

export const INSTAGRAM_QUEUE = 'instagram'
// Seconds field first: second 0 of every 10th minute
export const INSTAGRAM_CRON = '0 */10 * * * *'

/**
 * Every 10 minutes: publishes the approved pieces whose time has come.
 * A piece is marked "publishing" before it goes out, so an overlapping run never posts it twice;
 * if publishing fails it is marked "failed" with the error, and never retried on its own.
 */
export const publishInstagramTask: TaskConfig<{ input: Record<string, never>; output: { published: number } }> = {
  slug: 'publishInstagram',
  label: 'Publicar en Instagram',
  schedule: [{ cron: INSTAGRAM_CRON, queue: INSTAGRAM_QUEUE }],
  retries: 0,
  handler: async ({ req }) => {
    const { payload } = req
    const { docs } = await payload.find({
      collection: 'instagram-posts',
      where: {
        and: [{ status: { equals: POST_STATUS.APPROVED } }, { scheduledAt: { less_than_equal: new Date().toISOString() } }],
      },
      sort: 'scheduledAt',
      depth: 2,
      limit: 5,
    })

    let published = 0
    for (const post of docs) {
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
        published++
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        payload.logger.error(`Instagram: piece ${post.id} failed: ${message}`)
        await payload.update({
          collection: 'instagram-posts',
          id: post.id,
          data: { status: POST_STATUS.FAILED, result: { error: message } },
        })
      }
    }
    return { output: { published } }
  },
}
