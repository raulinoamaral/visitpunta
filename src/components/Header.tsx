'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LanguageSwitch from './LanguageSwitch'
import MenuOverlay from './MenuOverlay'
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
  // Pages without a hero photo start with the header already in its dark colors
  const onWhite = usePathname() === sectionHref('notes', locale)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  const links = [
    { href: sectionHref('stay', locale), label: t.nav.stay },
    { href: sectionHref('eat', locale), label: t.nav.eat },
    { href: sectionHref('explore', locale), label: t.nav.explore },
  ]

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
    <header className={`${styles.header} ${scrolled || onWhite ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}>
      <Link href={localePath(locale)} aria-label={t.nav.home} className={styles.brand}>
        <Logo />
      </Link>

      <nav className={styles.nav}>
        {/* Phones: these move into the menu */}
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={styles.navLink}>{link.label}</Link>
        ))}
        <LanguageSwitch
          locale={otherLocale}
          hrefLang={HTML_LANG[otherLocale]}
          homeHref={localePath(otherLocale)}
          label={t.nav.switchLanguage}
        />
        <MenuOverlay links={links} menuLabel={t.nav.menu} closeLabel={t.nav.close} />
      </nav>
    </header>
  )
}
