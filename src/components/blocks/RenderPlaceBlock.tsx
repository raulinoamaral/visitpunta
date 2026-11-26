import FadeImage from '@/components/FadeImage'
import { IMAGE_SIZES } from '@/lib/imageSizes'
import Link from 'next/link'
import styles from './RenderPlaceBlock.module.css'

type Image = { url: string; alt?: string | null }

type Props = {
  href: string
  place: {
    name: string
    heroImage?: Image | null
    gallery?: Image[]
  }
  context?: string | null
  moreLabel: string
}

/**
 * A place recommended inside a note: the note's own text names it and tells the story,
 * so this block only shows the place (one big clean photo, plus two more from its gallery
 * when it has them) and a quiet link to its page. No overlay, no second description.
 */
export default function RenderPlaceBlock({ href, place, context, moreLabel }: Props) {
  const extra = (place.gallery ?? []).filter((image) => image?.url).slice(0, 2)

  return (
    <figure className={styles.block}>
      {place.heroImage?.url && (
        <Link href={href} className={styles.main} aria-label={`${moreLabel} ${place.name}`}>
          <FadeImage
            src={place.heroImage.url}
            alt={place.heroImage.alt || place.name}
            fill
            sizes={IMAGE_SIZES.content}
            className={styles.image}
          />
        </Link>
      )}
      {extra.length === 2 && (
        <div className={styles.pair}>
          {extra.map((image) => (
            <Link key={image.url} href={href} className={styles.side} tabIndex={-1} aria-hidden>
              <FadeImage src={image.url} alt={image.alt || place.name} fill sizes={IMAGE_SIZES.content} className={styles.image} />
            </Link>
          ))}
        </div>
      )}
      <figcaption className={styles.caption}>
        {context && <span className={styles.context}>{context}</span>}
        <Link href={href} className={styles.more}>
          {moreLabel} {place.name} <span aria-hidden>→</span>
        </Link>
      </figcaption>
    </figure>
  )
}
