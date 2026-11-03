import FadeImage from '@/components/FadeImage'
import { IMAGE_SIZES } from '@/lib/imageSizes'
import GalleryCarousel from './GalleryCarousel'
import styles from './GalleryFeaturedSide.module.css'

type GalleryImage = {
  url: string
  alt?: string
  credit?: string
}

export default function GalleryFeaturedSide({ images }: { images: GalleryImage[] }) {
  const [main, ...stack] = images
  const all = [main, ...stack.slice(0, 2)].filter(Boolean)
  return (
    <>
      <div className={styles.grid}>
        <div className={styles.main}>
          {main && (
            <>
              <FadeImage src={main.url} alt={main.alt || ''} fill sizes={IMAGE_SIZES.twoThirds} className={styles.img} />
              {main.credit && <span className={styles.credit}>{main.credit}</span>}
            </>
          )}
        </div>
        <div className={styles.stack}>
          {stack.slice(0, 2).map((img, i) => (
            <div key={i} className={styles.stackImage}>
              <FadeImage src={img.url} alt={img.alt || ''} fill sizes={IMAGE_SIZES.card3} className={styles.img} />
              {img.credit && <span className={styles.credit}>{img.credit}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.mobile}>
        <GalleryCarousel images={all} />
      </div>
    </>
  )
}
