'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'
import styles from './FadeImage.module.css'

/**
 * next/image that fades in once the file has actually loaded, so photos never appear
 * half-drawn. Drop-in replacement: same props as next/image. Not for the page hero
 * (it is the LCP image and must paint right away; heroes get a gentle settle instead).
 */
export default function FadeImage({ className, onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <Image
      {...props}
      alt={alt}
      className={`${className ?? ''} ${styles.fade} ${loaded ? styles.loaded : ''}`}
      onLoad={(event) => {
        setLoaded(true)
        onLoad?.(event)
      }}
    />
  )
}
