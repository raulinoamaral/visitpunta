import Link from 'next/link'
import styles from './TextIndex.module.css'

export type IndexEntry = { id: string; href: string; title: string; label?: string; text?: string | null }

/** A list of text only: large titles, one line, an arrow. No photos */
export default function TextIndex({ entries }: { entries: IndexEntry[] }) {
  return (
    <ol className={styles.index}>
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link href={entry.href} className={styles.entry}>
            <div>
              {entry.label && <span className={styles.label}>{entry.label}</span>}
              <h3 className={styles.title}>{entry.title}</h3>
              {entry.text && <p className={styles.text}>{entry.text}</p>}
            </div>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
