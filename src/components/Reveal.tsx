'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Reveal.module.css'

type Props = {
  children: React.ReactNode
  delay?: number
  className?: string
}

// Stagger delays (seconds) mapped to CSS classes, so no inline styles are needed
const DELAY_CLASSES: Record<number, string> = {
  0.1: styles.delay1,
  0.2: styles.delay2,
  0.3: styles.delay3,
}

/**
 * Lets a block rise and fade in when it scrolls into view. Content is always rendered
 * visible: only blocks that start below the fold are hidden, and only after the script
 * runs, so nothing stays invisible if JS fails. Skipped with prefers-reduced-motion.
 */
export default function Reveal({ children, delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'idle' | 'armed' | 'visible'>('idle')

  useEffect(() => {
    const element = ref.current
    if (!element || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Already on screen when the page opens: leave it alone
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return

    setState('armed')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('visible')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const stateClass = state === 'armed' ? styles.armed : state === 'visible' ? styles.visible : ''
  const delayClass = state === 'visible' ? DELAY_CLASSES[delay] ?? '' : ''

  return (
    <div ref={ref} className={[stateClass, delayClass, className].filter(Boolean).join(' ') || undefined}>
      {children}
    </div>
  )
}
