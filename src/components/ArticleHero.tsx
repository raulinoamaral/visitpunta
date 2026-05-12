import Image from 'next/image'
import styles from './ArticleHero.module.css'

type Props = {
  title: string
  excerpt?: string
  imageUrl: string
}

export default function ArticleHero({ title, excerpt, imageUrl }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
      </div>
      <div className={styles.imageWrapper}>
        <Image src={imageUrl} alt={title} fill className={styles.image} priority />
      </div>
      <div className={styles.mobileOverlay} />
    </section>
  )
}
