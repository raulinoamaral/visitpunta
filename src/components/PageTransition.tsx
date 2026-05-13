'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './PageTransition.module.css'

export default function PageTransition() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fade in (reveal new page) when pathname changes
    setIsVisible(true)
    const timer = setTimeout(() => setIsVisible(false), 50)
    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    // Intercept all internal link clicks
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || target.target === '_blank') return

      setIsVisible(true)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className={`${styles.transition} ${isVisible ? styles.active : ''}`}>
      <img src="/ISO-COLOR.svg" alt="" className={styles.logo} />
    </div>
  )
}
