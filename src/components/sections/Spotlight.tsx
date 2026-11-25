import Image from 'next/image'
import Link from 'next/link'
import styles from './Spotlight.module.css'

type Props = { href: string; image: string; alt: string; title: string; label?: string; line?: string | null }

/** One place across the whole page, its name oversized: a pause between sections */
export default function Spotlight({ href, image, alt, title, label, line }: Props) {
  return (
    <Link href={href} className={styles.spotlight}>
      <Image src={image} alt={alt} fill sizes="100vw" className={styles.photo} />
      <div className={styles.shade} />
      <div className={styles.text}>
        {label && <span className={styles.label}>{label}</span>}
        <h2 className={styles.title}>{title}</h2>
        {line && <p className={styles.line}>{line}</p>}
      </div>
    </Link>
  )
}
