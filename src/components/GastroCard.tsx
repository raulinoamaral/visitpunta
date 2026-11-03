import FadeImage from '@/components/FadeImage'
import { IMAGE_SIZES } from '@/lib/imageSizes'
import Link from 'next/link'
import styles from './GastroCard.module.css'

type Props = {
  image: string
  name: string
  destination?: string
  description?: string
  tag?: string
  href?: string
}

export default function GastroCard({ image, name, destination, description, tag, href }: Props) {
  const content = (
    <>
      {image && (
        <div className={styles.imageWrapper}>
          <FadeImage src={image} alt={name} fill sizes={IMAGE_SIZES.card3} className={styles.image} />
          <div className={styles.overlay} />
          <div className={styles.imageText}>
            {tag && <span className={styles.tag}>{tag}</span>}
            <h3 className={styles.name}>{name}</h3>
          </div>
        </div>
      )}
      <div className={styles.body}>
        {destination && <span className={styles.destination}>{destination}</span>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </>
  )

  if (href) {
    return <Link href={href} className={styles.card}>{content}</Link>
  }

  return <article className={styles.card}>{content}</article>
}
