import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { HTML_LANG } from '@/i18n/config'
import styles from './ArticleHeader.module.css'

type Props = {
  locale: Locale
  title: string
  tagline?: string | null
  /** Kind of note (Guía, Temporada…), linking to its group in the notes index */
  typeLabel?: string
  notesHref: string
  type?: string
  zones: string[]
  /** "Actualizada en {date}" */
  updatedTemplate: string
  updatedAt: string
}

/** Title of a note: what it is and where, the title, its line, and when it was last updated */
export default function ArticleHeader({ locale, title, tagline, typeLabel, notesHref, type, zones, updatedTemplate, updatedAt }: Props) {
  const month = new Intl.DateTimeFormat(HTML_LANG[locale], { month: 'long', year: 'numeric', timeZone: 'America/Montevideo' }).format(
    new Date(updatedAt),
  )
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>
        {typeLabel && (
          <Link href={type ? `${notesHref}#${type}` : notesHref} className={styles.type}>
            {typeLabel}
          </Link>
        )}
        {typeLabel && zones.length > 0 && <span aria-hidden="true"> · </span>}
        {zones.join(', ')}
      </p>
      <h1 className={styles.title}>{title}</h1>
      {tagline && <p className={styles.tagline}>{tagline}</p>}
      <p className={styles.updated}>
        <time dateTime={updatedAt}>{updatedTemplate.replace('{date}', month)}</time>
      </p>
    </header>
  )
}
