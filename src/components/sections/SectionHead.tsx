import Link from 'next/link'
import styles from './SectionHead.module.css'

type Props = {
  title: string
  line?: string
  link?: { href: string; label: string }
}

/** Section title over a thin rule, a line with voice under it, an optional "see all" link */
export default function SectionHead({ title, line, link }: Props) {
  return (
    <header className={styles.head}>
      <div className={styles.row}>
        <h2 className={styles.title}>{title}</h2>
        {link && (
          <Link href={link.href} className={styles.more}>
            {link.label}
          </Link>
        )}
      </div>
      {line && <p className={styles.line}>{line}</p>}
    </header>
  )
}
