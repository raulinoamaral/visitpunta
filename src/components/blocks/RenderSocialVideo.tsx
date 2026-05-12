'use client'

import styles from './RenderSocialVideo.module.css'

type Props = {
  source: 'embed' | 'upload'
  embedUrl?: string | null
  videoFile?: { url: string } | null
  caption?: string | null
}

function getEmbedSrc(url: string): string | null {
  // TikTok
  const tiktokMatch = url.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/)
  if (tiktokMatch) {
    return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`
  }

  // Instagram Reel
  const igMatch = url.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/)
  if (igMatch) {
    return `https://www.instagram.com/p/${igMatch[1]}/embed`
  }

  // YouTube Shorts
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([\w-]+)/)
  if (ytShortsMatch) {
    return `https://www.youtube.com/embed/${ytShortsMatch[1]}`
  }

  // YouTube regular
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }

  return null
}

export default function RenderSocialVideo({ source, embedUrl, videoFile, caption }: Props) {
  return (
    <figure className={styles.wrapper}>
      <div className={styles.container}>
        {source === 'embed' && embedUrl && (() => {
          const src = getEmbedSrc(embedUrl)
          if (!src) return null
          return (
            <iframe
              src={src}
              className={styles.iframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )
        })()}

        {source === 'upload' && videoFile?.url && (
          <video
            src={videoFile.url}
            className={styles.video}
            controls
            playsInline
          />
        )}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
