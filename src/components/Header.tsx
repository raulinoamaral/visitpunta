'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
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
      <Link href="/">
        <Image
          src="/visit-punta-del-este.svg"
          alt="Visit Punta del Este"
          width={180}
          height={52}
          className={styles.logo}
          priority
        />
        <Image
          src="/ISO-COLOR.svg"
          alt="Visit Punta del Este"
          width={40}
          height={40}
          className={styles.logoMobile}
          priority
        />
      </Link>

      <nav className={styles.nav}>
        <Link href="/alojamientos" className={styles.navLink}>Alojamientos</Link>
        <Link href="/gastronomia" className={styles.navLink}>Gastronomía</Link>
        <Link href="/recorridos" className={styles.navLink}>Recorridos</Link>
      </nav>
    </header>
  )
}
