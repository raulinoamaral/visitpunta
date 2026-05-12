'use client'

import { useRef } from 'react'
import styles from './ScrollDrag.module.css'

type Props = {
  children: React.ReactNode
  className?: string
}

export default function ScrollDrag({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const dragStart = useRef<number | null>(null)
  const scrollStart = useRef<number>(0)
  const dragged = useRef(false)

  function onPointerDown(e: React.PointerEvent) {
    const el = ref.current
    if (!el) return
    dragStart.current = e.clientX
    scrollStart.current = el.scrollLeft
    dragged.current = false
  }

  function onPointerMove(e: React.PointerEvent) {
    if (dragStart.current === null) return
    const el = ref.current
    if (!el) return
    const delta = dragStart.current - e.clientX
    if (Math.abs(delta) > 5) dragged.current = true
    el.scrollLeft = scrollStart.current + delta
  }

  function onPointerUp() {
    dragStart.current = null
  }

  function onClick(e: React.MouseEvent) {
    if (dragged.current) e.preventDefault()
  }

  return (
    <div
      ref={ref}
      className={`${styles.scrollDrag} ${className || ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClick}
    >
      {children}
    </div>
  )
}
