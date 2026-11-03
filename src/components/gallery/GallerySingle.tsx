import FadeImage from '@/components/FadeImage'
import { IMAGE_SIZES } from '@/lib/imageSizes'
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
      <FadeImage src={img.url} alt={img.alt || ''} fill sizes={IMAGE_SIZES.full} className={styles.img} />
      {img.credit && <span className={styles.credit}>{img.credit}</span>}
    </div>
  )
}
