import Image from 'next/image'
import GalleryCarousel from './GalleryCarousel'
import styles from './GalleryDuo.module.css'

type GalleryImage = {
  url: string
  alt?: string
  credit?: string
}

export default function GalleryDuo({ images }: { images: GalleryImage[] }) {
  const imgs = images.slice(0, 2)
  return (
    <>
      <div className={styles.grid}>
        {imgs.map((img, i) => (
          <div key={i} className={styles.image}>
            <Image src={img.url} alt={img.alt || ''} fill className={styles.img} />
            {img.credit && <span className={styles.credit}>{img.credit}</span>}
          </div>
        ))}
      </div>
      <div className={styles.mobile}>
        <GalleryCarousel images={imgs} />
      </div>
    </>
  )
}
