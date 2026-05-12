'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import styles from './RenderSocialGallery.module.css'

type GalleryImage = {
  image: { url: string; alt?: string }
  caption?: string | null
  id?: string
}

type Props = {
  images: GalleryImage[]
}

export default function RenderSocialGallery({ images }: Props) {
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

  const currentCaption = images[active]?.caption

  return (
    <figure className={styles.wrapper}>
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
          {images.map((item, i) => (
            <div key={item.id ?? i} className={styles.slide}>
              <Image
                src={item.image.url}
                alt={item.image.alt || item.caption || ''}
                fill
                className={styles.image}
                draggable={false}
              />
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
      {currentCaption && <figcaption className={styles.caption}>{currentCaption}</figcaption>}
    </figure>
  )
}
