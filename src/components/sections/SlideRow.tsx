import Image from 'next/image'
import Link from 'next/link'
import ScrollDrag from '@/components/ScrollDrag'
import type { SectionItem } from './types'
import styles from './SlideRow.module.css'

type Props = {
  items: SectionItem[]
  /** tall: 3:4 photos with the name on them · wide: 3:2 photos with the text under them */
  variant: 'tall' | 'wide'
}

/** A row that slides sideways, off the right edge of the page */
export default function SlideRow({ items, variant }: Props) {
  return (
    <ScrollDrag className={styles.row}>
      {items.map((item) =>
        variant === 'tall' ? (
          <Link key={item.id} href={item.href} className={styles.tall}>
            <Image src={item.image} alt={item.alt} fill sizes="(max-width: 768px) 72vw, 320px" className={styles.photo} />
            <div className={styles.shade} />
            <div className={styles.overlay}>
              {item.label && <span className={styles.overlayLabel}>{item.label}</span>}
              <h3 className={styles.overlayTitle}>{item.title}</h3>
            </div>
          </Link>
        ) : (
          <Link key={item.id} href={item.href} className={styles.wide}>
            <div className={styles.image}>
              <Image src={item.image} alt={item.alt} fill sizes="(max-width: 768px) 85vw, 560px" className={styles.photo} />
            </div>
            {item.label && <span className={styles.label}>{item.label}</span>}
            <h3 className={styles.title}>{item.title}</h3>
            {item.summary && <p className={styles.summary}>{item.summary}</p>}
          </Link>
        ),
      )}
    </ScrollDrag>
  )
}
