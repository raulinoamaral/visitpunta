import Image from 'next/image'
import Link from 'next/link'
import type { SectionItem } from './types'
import styles from './CardGrid.module.css'

type Props = {
  items: SectionItem[]
  /** wide: 3:2 photos, two across (hotels) · tall: 4:5, three across (restaurants) · places: 3:2, three across */
  variant: 'wide' | 'tall' | 'places'
  /** Label of the Booking link under each hotel */
  bookingLabel?: string
}

/** Cards where the photo leads: zone or type, the name, one line, and Booking for hotels */
export default function CardGrid({ items, variant, bookingLabel }: Props) {
  return (
    <div className={`${styles.grid} ${styles[variant]}`}>
      {items.map((item) => (
        <article key={item.id}>
          <Link href={item.href} className={styles.link}>
            <div className={styles.image}>
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes={variant === 'wide' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
                className={styles.photo}
              />
            </div>
            {item.label && <span className={styles.label}>{item.label}</span>}
            <h3 className={styles.title}>{item.title}</h3>
            {item.summary && <p className={styles.summary}>{item.summary}</p>}
          </Link>
          {item.booking && bookingLabel && (
            <a href={item.booking} target="_blank" rel="noopener sponsored" className={styles.booking}>
              {bookingLabel}
            </a>
          )}
        </article>
      ))}
    </div>
  )
}
