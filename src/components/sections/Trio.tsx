import Image from 'next/image'
import Link from 'next/link'
import type { SectionItem } from './types'
import styles from './Trio.module.css'

/** One big photo and two stacked beside it, names on the photos */
export default function Trio({ items }: { items: SectionItem[] }) {
  return (
    <div className={styles.trio}>
      {items.slice(0, 3).map((item, index) => (
        <Link key={item.id} href={item.href} className={`${styles.item} ${index === 0 ? styles.main : ''}`}>
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes={index === 0 ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 40vw'}
            className={styles.photo}
          />
          <div className={styles.shade} />
          <div className={styles.overlay}>
            {item.label && <span className={styles.label}>{item.label}</span>}
            <h3 className={styles.title}>{item.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
