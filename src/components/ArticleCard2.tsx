import Image from 'next/image'
import Link from 'next/link'
import { ARTICLE_TYPE_LABELS } from '@/lib/constants'
import styles from './ArticleCard2.module.css'

type Props = {
  title: string
  slug: string
  type?: string
  tagline?: string
  image?: string
}

export default function ArticleCard2({ title, slug, type, tagline, image }: Props) {
  return (
    <Link href={`/${slug}`} className={styles.card}>
      {image && (
        <div className={styles.imageWrapper}>
          <Image src={image} alt={title} fill className={styles.image} />
        </div>
      )}
      <div className={styles.text}>
        {type && (
          <span className={styles.type}>
            {ARTICLE_TYPE_LABELS[type] || type}
          </span>
        )}
        <h3 className={styles.name}>{title}</h3>
        {tagline && <p className={styles.tagline}>{tagline}</p>}
      </div>
    </Link>
  )
}
