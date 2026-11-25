import Image from 'next/image'
import Link from 'next/link'
import styles from './NoteBand.module.css'

type Props = {
  href: string
  image: string
  alt: string
  label: string
  title: string
  text?: string | null
  readLabel: string
  /** Photo on the right instead of the left */
  reverse?: boolean
}

/** A note across the page on a sand band: breaks a list and leads to the longer read */
export default function NoteBand({ href, image, alt, label, title, text, readLabel, reverse }: Props) {
  return (
    <section className={styles.band}>
      <Link href={href} className={`${styles.note} ${reverse ? styles.reverse : ''}`}>
        <div className={styles.image}>
          <Image src={image} alt={alt} fill sizes="(max-width: 768px) 100vw, 55vw" className={styles.photo} />
        </div>
        <div className={styles.text}>
          <span className={styles.label}>{label}</span>
          <h2 className={styles.title}>{title}</h2>
          {text && <p className={styles.summary}>{text}</p>}
          <span className={styles.read}>{readLabel}</span>
        </div>
      </Link>
    </section>
  )
}
