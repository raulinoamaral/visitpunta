'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { sectionHref } from '@/i18n/routes'
import styles from '@/app/(frontend)/[locale]/not-found.module.css'

/**
 * The 404 gets no params, and reading request headers would make every page
 * dynamic. The language comes from the URL instead ("/pt/…" or the root).
 */
export default function NotFoundContent() {
  const first = usePathname()?.split('/')[1] ?? ''
  const locale = isLocale(first) ? first : DEFAULT_LOCALE
  const t = getDictionary(locale)

  return (
    <main className={styles.page} data-solid-header>
      <div className={styles.content}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/avatar.svg" alt="" className={styles.iso} />
        <h1 className={styles.title}>{t.notFound.title}</h1>
        <p className={styles.subtitle}>{t.notFound.subtitle}</p>
        <nav className={styles.nav}>
          <Link href={sectionHref('stay', locale)} className={styles.link}>{t.nav.stay}</Link>
          <Link href={sectionHref('eat', locale)} className={styles.link}>{t.nav.eat}</Link>
          <Link href={sectionHref('explore', locale)} className={styles.link}>{t.nav.explore}</Link>
        </nav>
      </div>
    </main>
  )
}
