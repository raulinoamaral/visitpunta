import Image from 'next/image'
import styles from './GallerySingle.module.css'

type GalleryImage = {
  url: string
  alt?: string
  credit?: string
}

export default function GallerySingle({ images }: { images: GalleryImage[] }) {
  const img = images[0]
  if (!img) return null
  return (
    <div className={styles.image}>
      <Image src={img.url} alt={img.alt || ''} fill className={styles.img} />
      {img.credit && <span className={styles.credit}>{img.credit}</span>}
    </div>
  )
}
