'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './PageTransition.module.css'

// Never leave the veil up if a navigation is cancelled or fails
const SAFETY_MS = 8000
// Prefetched pages arrive almost instantly: keep the veil up long enough to finish fading in
const MIN_VISIBLE_MS = 450

export default function PageTransition() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const shownAt = useRef(0)

  useEffect(() => {
    // The new page is here: reveal it, once the veil has been up for the minimum time
    const elapsed = Date.now() - shownAt.current
    const timer = setTimeout(() => setIsVisible(false), Math.max(50, MIN_VISIBLE_MS - elapsed))
    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (!isVisible) return
    const timer = setTimeout(() => setIsVisible(false), SAFETY_MS)
    return () => clearTimeout(timer)
  }, [isVisible])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as HTMLElement).closest('a')
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return
      const href = link.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      const url = new URL(href, window.location.href)
      // Only internal pages, and not the page we're already on
      if (url.origin !== window.location.origin || url.pathname.startsWith('/admin')) return
      if (url.pathname === window.location.pathname) return
      shownAt.current = Date.now()
      setIsVisible(true)
    }

    // Capture phase: Next's <Link> calls preventDefault on bubbling, before a normal listener would run
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  return (
    <div className={`${styles.transition} ${isVisible ? styles.active : ''}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ISO-COLOR.svg" alt="" className={styles.logo} />
    </div>
  )
}
