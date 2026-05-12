import Image from 'next/image'
import styles from './RenderImageBlock.module.css'

type Props = {
  image: any
  caption?: string | null
  variant: 'default' | 'large'
}

export default function RenderImageBlock({ image, caption, variant }: Props) {
  return (
    <figure className={`${styles.figure} ${variant === 'large' ? styles.large : ''}`}>
      <div className={styles.imageWrapper}>
        <Image src={image.url} alt={image.alt || caption || ''} fill className={styles.image} />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
