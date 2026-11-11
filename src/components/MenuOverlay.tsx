'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './MenuOverlay.module.css'

type Props = {
  links: { href: string; label: string }[]
  menuLabel: string
  closeLabel: string
}

/** Phones only: the sections open in a panel above the bottom header */
export default function MenuOverlay({ links, menuLabel, closeLabel }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close when navigating
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Lock page scroll and allow closing with Escape while open
  useEffect(() => {
    if (!isOpen) return
    document.body.classList.add('menu-open')
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <>
      {/* Hamburger: two lines that turn into an X */}
      <button
        type="button"
        className={`${styles.toggle} ${isOpen ? styles.toggleOpen : ''}`}
        aria-expanded={isOpen}
        aria-controls="site-menu"
        aria-label={isOpen ? closeLabel : menuLabel}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={styles.bar} aria-hidden="true" />
        <span className={styles.bar} aria-hidden="true" />
      </button>

      <div id="site-menu" className={`${styles.overlay} ${isOpen ? styles.open : ''}`} hidden={!isOpen}>
        <nav className={styles.list}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.item}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
