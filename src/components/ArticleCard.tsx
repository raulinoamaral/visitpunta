import Image from 'next/image'
import styles from './ArticleCard.module.css'

type Props = {
  image: string
  title: string
  href: string
}

export default function ArticleCard({ image, title, href }: Props) {
  return (
    <a href={href} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image src={image} alt={title} fill className={styles.image} />
      </div>
      <h3 className={styles.title}>{title}</h3>
    </a>
  )
}
