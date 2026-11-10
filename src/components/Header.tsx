'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import LanguageSwitch from './LanguageSwitch'
import { HTML_LANG, localePath, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { sectionHref } from '@/i18n/routes'
import Logo from './Logo'
import styles from './Header.module.css'

type Props = {
  locale: Locale
}

export default function Header({ locale }: Props) {
  const t = getDictionary(locale)
  const otherLocale: Locale = locale === 'es' ? 'pt' : 'es'
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY
      setScrolled(currentY > window.innerHeight * 0.7)
      setHidden(currentY > 100 && currentY > lastScrollY.current)
      lastScrollY.current = currentY
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}>
      <Link href={localePath(locale)} aria-label={t.nav.home} className={styles.brand}>
        <span className={styles.wordmark}>
          <Logo />
        </span>
        {/* Phones: three sections and the language leave no room for the wordmark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/avatar.svg" alt="" className={styles.avatar} />
      </Link>

      <nav className={styles.nav}>
        <Link href={sectionHref('stay', locale)} className={styles.navLink}>{t.nav.stay}</Link>
        <Link href={sectionHref('eat', locale)} className={styles.navLink}>{t.nav.eat}</Link>
        <Link href={sectionHref('explore', locale)} className={styles.navLink}>{t.nav.explore}</Link>
        <LanguageSwitch
          locale={otherLocale}
          hrefLang={HTML_LANG[otherLocale]}
          homeHref={localePath(otherLocale)}
          label={t.nav.switchLanguage}
        />
      </nav>
    </header>
  )
}
