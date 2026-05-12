import Image from 'next/image'
import MediaCarousel from './MediaCarousel'
import styles from './RenderMediaBlock.module.css'

type MediaItem = {
  image: { url: string; alt?: string; width?: number; height?: number }
  caption?: string | null
  id?: string
}

type Props = {
  images: MediaItem[]
  variant?: string
  stack?: boolean
}

export default function RenderMediaBlock({ images, variant, stack }: Props) {
  const allPortrait = images.every((item) => {
    const w = Number(item.image.width) || 0
    const h = Number(item.image.height) || 0
    return w > 0 && h > 0 && h > w
  })

  return (
    <figure className={`${styles.figure} ${variant === 'large' || variant === 'bleed' ? styles.large : ''}`}>

      {/* Desktop: grid */}
      <div
        className={`${styles.grid} ${stack ? styles.stacked : ''} ${allPortrait ? styles.portrait : ''}`}
        data-count={images.length}
      >
        {images.map((item, i) => (
          <div key={item.id ?? i} className={styles.imageWrapper}>
            <Image
              src={item.image.url}
              alt={item.image.alt || item.caption || ''}
              fill
              className={styles.image}
            />
            {item.caption && <span className={styles.caption}>{item.caption}</span>}
          </div>
        ))}
      </div>

      {/* Mobile: carousel (hidden when stack mode) */}
      {!stack && (
        <div className={styles.mobile}>
          <MediaCarousel images={images} />
        </div>
      )}

    </figure>
  )
}
