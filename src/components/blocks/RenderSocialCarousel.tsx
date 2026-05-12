'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import styles from './RenderSocialCarousel.module.css'

type Slide = {
  image: { url: string; alt?: string }
  text: string
  id?: string
}

type Props = {
  title?: string | null
  slides: Slide[]
}

export default function RenderSocialCarousel({ title, slides }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const dragStart = useRef<number | null>(null)
  const scrollStart = useRef<number>(0)

  function onScroll() {
    const track = trackRef.current
    if (!track) return
    const index = Math.round(track.scrollLeft / track.offsetWidth)
    setActive(index)
  }

  function onPointerDown(e: React.PointerEvent) {
    const track = trackRef.current
    if (!track) return
    dragStart.current = e.clientX
    scrollStart.current = track.scrollLeft
    track.setPointerCapture(e.pointerId)
    track.style.scrollSnapType = 'none'
    track.style.scrollBehavior = 'auto'
  }

  function onPointerMove(e: React.PointerEvent) {
    if (dragStart.current === null) return
    const track = trackRef.current
    if (!track) return
    const delta = dragStart.current - e.clientX
    track.scrollLeft = scrollStart.current + delta
  }

  function onPointerUp() {
    const track = trackRef.current
    if (!track) return
    const index = Math.round(track.scrollLeft / track.offsetWidth)
    track.style.scrollSnapType = ''
    track.style.scrollBehavior = ''
    track.scrollLeft = index * track.offsetWidth
    dragStart.current = null
  }

  return (
    <div className={styles.wrapper}>
      {title && <p className={styles.title}>{title}</p>}
      <div className={styles.carousel}>
        <div
          className={styles.track}
          ref={trackRef}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {slides.map((slide, i) => (
            <div key={slide.id ?? i} className={styles.slide}>
              <Image
                src={slide.image.url}
                alt={slide.image.alt || slide.text}
                fill
                className={styles.image}
                draggable={false}
              />
              <div className={styles.overlay} />
              <p className={styles.text}>{slide.text}</p>
              <span className={styles.counter}>{i + 1}/{slides.length}</span>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <div className={styles.dots}>
            {slides.map((_, i) => (
              <span key={i} className={`${styles.dot} ${i === active ? styles.dotActive : ''}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
