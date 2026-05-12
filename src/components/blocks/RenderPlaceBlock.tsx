import Image from 'next/image'
import Link from 'next/link'
import styles from './RenderPlaceBlock.module.css'

type Props = {
  place: {
    name: string
    slug: string
    summary?: string | null
    heroImage?: { url: string; alt?: string } | null
    destination?: { name: string } | null
  }
  context?: string | null
}

export default function RenderPlaceBlock({ place, context }: Props) {
  return (
    <Link href={`/${place.slug}`} className={styles.card}>
      {place.heroImage?.url && (
        <div className={styles.imageWrapper}>
          <Image
            src={place.heroImage.url}
            alt={place.heroImage.alt || place.name}
            fill
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
