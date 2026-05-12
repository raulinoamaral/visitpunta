import Image from 'next/image'
import GalleryCarousel from './GalleryCarousel'
import styles from './GalleryFeaturedBottom.module.css'

type GalleryImage = {
  url: string
  alt?: string
  credit?: string
}

export default function GalleryFeaturedBottom({ images }: { images: GalleryImage[] }) {
  const top = images.slice(0, 2)
  const bottom = images.slice(2, 5)
  const all = images.slice(0, 5)
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.row2}>
          {top.map((img, i) => (
            <div key={i} className={styles.image}>
              <Image src={img.url} alt={img.alt || ''} fill className={styles.img} />
              {img.credit && <span className={styles.credit}>{img.credit}</span>}
            </div>
          ))}
        </div>
        <div className={styles.row3}>
          {bottom.map((img, i) => (
            <div key={i} className={styles.image}>
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
