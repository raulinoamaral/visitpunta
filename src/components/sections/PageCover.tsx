import Image from 'next/image'
import styles from './PageCover.module.css'

type Props = {
  image: string
  alt: string
  title: string
  line?: string | null
  /** What the photo shows, on a thin line at the bottom */
  caption?: string | null
  /** Zones get a taller cover than section pages */
  tall?: boolean
}

export default function PageCover({ image, alt, title, line, caption, tall }: Props) {
  return (
    <section className={`${styles.cover} ${tall ? styles.tall : ''}`}>
      <Image src={image} alt={alt} fill sizes="100vw" priority className={styles.image} />
      <div className={styles.shade} />
      <div className={`${styles.text} ${caption ? styles.withCaption : ''}`}>
        <h1 className={styles.title}>{title}</h1>
        {line && <p className={styles.line}>{line}</p>}
      </div>
      {caption && <div className={styles.bar}>{caption}</div>}
    </section>
  )
}
