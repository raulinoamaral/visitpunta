import Image from 'next/image'
import styles from './HomeHero.module.css'

type Props = {
  image: string
  alt: string
  title: string
  small: string
  line: string
  caption: string
}

/** One photo, the name of the guide, and a thin line at the bottom saying what the photo shows */
export default function HomeHero({ image, alt, title, small, line, caption }: Props) {
  return (
    <section className={styles.hero}>
      <Image src={image} alt={alt} fill sizes="100vw" priority className={styles.image} />
      <div className={styles.shade} />

      <div className={styles.text}>
        <h1 className={styles.title}>
          {title}
          <span className={styles.small}>{small}</span>
        </h1>
        <p className={styles.line}>{line}</p>
      </div>

      <div className={styles.bar}>
        <span className={styles.caption}>{caption}</span>
      </div>
    </section>
  )
}
