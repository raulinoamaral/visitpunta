import Image from 'next/image'
import Link from 'next/link'
import type { SectionItem } from './types'
import styles from './CoffeeGrid.module.css'

/** Small square photos with the name and, if given, the zone */
export default function CoffeeGrid({ items, title }: { items: SectionItem[]; title?: string }) {
  return (
    <div className={styles.wrap}>
      {title && <h3 className={styles.heading}>{title}</h3>}
      <div className={styles.grid}>
        {items.map((item) => (
          <Link key={item.id} href={item.href} className={styles.card}>
            <div className={styles.image}>
              <Image src={item.image} alt={item.alt} fill sizes="(max-width: 768px) 45vw, 220px" className={styles.photo} />
            </div>
            <span className={styles.name}>{item.title}</span>
            {item.label && <span className={styles.label}>{item.label}</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}
