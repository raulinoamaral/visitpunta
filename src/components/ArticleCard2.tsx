import FadeImage from '@/components/FadeImage'
import { IMAGE_SIZES } from '@/lib/imageSizes'
import Link from 'next/link'
import styles from './ArticleCard2.module.css'

type Props = {
  title: string
  href: string
  /** Already translated article type, e.g. "Guía" */
  typeLabel?: string
  tagline?: string
  image?: string
}

export default function ArticleCard2({ title, href, typeLabel, tagline, image }: Props) {
  return (
    <Link href={href} className={styles.card}>
      {image && (
        <div className={styles.imageWrapper}>
          <FadeImage src={image} alt={title} fill sizes={IMAGE_SIZES.card3} className={styles.image} />
        </div>
      )}
      <div className={styles.text}>
        {typeLabel && <span className={styles.type}>{typeLabel}</span>}
        <h3 className={styles.name}>{title}</h3>
        {tagline && <p className={styles.tagline}>{tagline}</p>}
      </div>
    </Link>
  )
}
