'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

type Props = {
  /** Target language code, e.g. "pt" */
  locale: string
  /** hreflang of the target language, e.g. "pt-BR" */
  hrefLang: string
  /** Fallback when the current page has no version in that language */
  homeHref: string
  label: string
}

/**
 * Links to the current page in the other language. It reads the page's own
 * <link rel="alternate" hreflang> (the one search engines see), so alternates
 * are defined once, in each page's metadata. Falls back to that language's home.
 */
export default function LanguageSwitch({ locale, hrefLang, homeHref, label }: Props) {
  const pathname = usePathname()
  const [href, setHref] = useState(homeHref)

  useEffect(() => {
    // Wait a frame so the head reflects the page we just navigated to
    const frame = requestAnimationFrame(() => {
      const alternate = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hrefLang}"]`)
      setHref(alternate ? new URL(alternate.href).pathname : homeHref)
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hrefLang, homeHref])

  return (
    <Link href={href} className={styles.language} hrefLang={hrefLang} aria-label={label}>
      {locale.toUpperCase()}
    </Link>
  )
}
