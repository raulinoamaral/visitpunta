'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > window.innerHeight * 0.7)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <Link href="/">
        <Image
          src="/visit-punta-del-este.svg"
          alt="Visit Punta del Este"
          width={180}
          height={52}
          className={styles.logo}
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
