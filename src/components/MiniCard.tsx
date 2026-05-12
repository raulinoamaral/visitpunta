import Image from 'next/image'
import Link from 'next/link'
import styles from './MiniCard.module.css'

type Props = {
  image: string
  name: string
  href?: string
}

export default function MiniCard({ image, name, href }: Props) {
  const content = (
    <div className={styles.imageWrapper}>
      {image && <Image src={image} alt={name} fill className={styles.image} />}
      <div className={styles.overlay} />
      <h3 className={styles.name}>{name}</h3>
    </div>
  )

  if (href) {
    return <Link href={href} className={styles.card}>{content}</Link>
  }

  return <article className={styles.card}>{content}</article>
}
