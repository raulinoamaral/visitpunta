import Image from 'next/image'
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
              <Image src={main.url} alt={main.alt || ''} fill className={styles.img} />
              {main.credit && <span className={styles.credit}>{main.credit}</span>}
            </>
          )}
        </div>
        <div className={styles.stack}>
          {stack.slice(0, 2).map((img, i) => (
            <div key={i} className={styles.stackImage}>
              <Image src={img.url} alt={img.alt || ''} fill className={styles.img} />
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
