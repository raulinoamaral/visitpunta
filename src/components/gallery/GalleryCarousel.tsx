'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import styles from './GalleryCarousel.module.css'

type GalleryImage = {
  url: string
  alt?: string
  credit?: string
}

export default function GalleryCarousel({ images }: { images: GalleryImage[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const dragStart = useRef<number | null>(null)
  const scrollStart = useRef<number>(0)
  const dragged = useRef(false)

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
    dragged.current = false
    track.style.scrollSnapType = 'none'
  }

  function onPointerMove(e: React.PointerEvent) {
    if (dragStart.current === null) return
    const track = trackRef.current
    if (!track) return
    const delta = dragStart.current - e.clientX
    if (Math.abs(delta) > 5) dragged.current = true
    track.scrollLeft = scrollStart.current + delta
  }

  function onPointerUp() {
    const track = trackRef.current
    if (!track) return
    const index = Math.round(track.scrollLeft / track.offsetWidth)
    track.style.scrollSnapType = ''
    track.scrollLeft = index * track.offsetWidth
    dragStart.current = null
  }

  return (
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
        {images.map((img, i) => (
          <div key={i} className={styles.slide}>
            <Image src={img.url} alt={img.alt || ''} fill className={styles.image} draggable={false} />
            {img.credit && <span className={styles.credit}>{img.credit}</span>}
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i === active ? styles.dotActive : ''}`} />
          ))}
        </div>
      )}
    </div>
  )
}
