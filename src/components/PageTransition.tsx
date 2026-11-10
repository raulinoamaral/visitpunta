'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './PageTransition.module.css'

// The "pe" avatar, breathing slowly while the veil is up
const ICON = '/brand/avatar.svg'
// Only show the veil when a navigation is actually slow: prefetched pages arrive
// before this and switch directly, with no white flash in between
const SHOW_DELAY_MS = 150
// Never leave the veil up if a navigation is cancelled or fails
const SAFETY_MS = 8000

export default function PageTransition() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // The new page is here: cancel a pending veil and reveal the page
    if (showTimer.current) clearTimeout(showTimer.current)
    showTimer.current = null
    const timer = setTimeout(() => setIsVisible(false), 50)
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
      if (showTimer.current) clearTimeout(showTimer.current)
      showTimer.current = setTimeout(() => setIsVisible(true), SHOW_DELAY_MS)
    }

    // Capture phase: Next's <Link> calls preventDefault on bubbling, before a normal listener would run
    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
      if (showTimer.current) clearTimeout(showTimer.current)
    }
  }, [])

  return (
    <div className={`${styles.transition} ${isVisible ? styles.active : ''}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ICON} alt="" className={styles.icon} />
    </div>
  )
}
