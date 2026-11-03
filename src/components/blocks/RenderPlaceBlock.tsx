import FadeImage from '@/components/FadeImage'
import { IMAGE_SIZES } from '@/lib/imageSizes'
import Link from 'next/link'
import styles from './RenderPlaceBlock.module.css'

type Props = {
  href: string
  place: {
    name: string
    summary?: string | null
    heroImage?: { url: string; alt?: string } | null
    destination?: { name: string } | null
  }
  context?: string | null
}

export default function RenderPlaceBlock({ href, place, context }: Props) {
  return (
    <Link href={href} className={styles.card}>
      {place.heroImage?.url && (
        <div className={styles.imageWrapper}>
          <FadeImage
            src={place.heroImage.url}
            alt={place.heroImage.alt || place.name}
            fill sizes={IMAGE_SIZES.content}
            className={styles.image}
          />
          <div className={styles.overlay} />
          <div className={styles.imageText}>
            {context && <span className={styles.context}>{context}</span>}
            <h3 className={styles.name}>{place.name}</h3>
            {place.summary && <p className={styles.summary}>{place.summary}</p>}
          </div>
        </div>
      )}
    </Link>
  )
}
