import FadeImage from '@/components/FadeImage'
import { IMAGE_SIZES } from '@/lib/imageSizes'
import { formatCredit } from '@/lib/credit'
import MediaCarousel from './MediaCarousel'
import styles from './RenderMediaBlock.module.css'

type MediaItem = {
  image: { url: string; alt?: string; width?: number; height?: number; credit?: string | null }
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

  // Bleed photos span the screen; the rest sit in the text column, split by how many share the row
  const sizes =
    variant === 'bleed' || variant === 'large'
      ? IMAGE_SIZES.full
      : images.length > 1 && !stack
        ? IMAGE_SIZES.half
        : IMAGE_SIZES.content

  return (
    <figure className={`${styles.figure} ${variant === 'large' || variant === 'bleed' ? styles.large : ''}`}>

      {/* Desktop: grid */}
      <div
        className={`${styles.grid} ${stack ? styles.stacked : ''} ${allPortrait ? styles.portrait : ''}`}
        data-count={images.length}
      >
        {images.map((item, i) => (
          <div key={item.id ?? i}>
            <div className={styles.imageWrapper}>
              <FadeImage
                src={item.image.url}
                alt={item.image.alt || item.caption || ''}
                fill
                sizes={sizes}
                className={styles.image}
              />
              {/* Same credit as in the places' galleries: small, over the photo */}
              {item.image.credit && <span className={styles.credit}>{formatCredit(item.image.credit)}</span>}
            </div>
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
