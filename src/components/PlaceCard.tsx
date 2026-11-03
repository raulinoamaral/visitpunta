import FadeImage from '@/components/FadeImage'
import { IMAGE_SIZES } from '@/lib/imageSizes'
import Link from 'next/link'
import styles from './PlaceCard.module.css'

type Props = {
  image: string
  name: string
  destination?: string
  description?: string
  href?: string
}

export default function PlaceCard({ image, name, destination, description, href }: Props) {
  const content = (
    <>
      {image && (
        <div className={styles.imageWrapper}>
          <FadeImage src={image} alt={name} fill sizes={IMAGE_SIZES.card4} className={styles.image} />
        </div>
      )}
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
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
