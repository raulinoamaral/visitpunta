import Image from 'next/image'
import styles from './PageHero.module.css'

type Props = {
  image: string
  title: string
  subtitle?: string
}

export default function PageHero({ image, title, subtitle }: Props) {
  return (
    <section className={styles.hero}>
      <Image src={image} alt={title} fill className={styles.image} priority />
      <div className={styles.overlay} />
      <div className={styles.text}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </section>
  )
}
