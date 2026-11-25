import type { ReactNode } from 'react'
import styles from './Section.module.css'

type Props = {
  children: ReactNode
  /** Rows that slide run off the right edge of the page */
  bleed?: boolean
  /** The last section leaves room before the footer */
  last?: boolean
  /** Anchor, to link straight to the section */
  id?: string
}

export default function Section({ children, bleed, last, id }: Props) {
  return (
    <section id={id} className={[styles.section, bleed && styles.bleed, last && styles.last].filter(Boolean).join(' ')}>
      {children}
    </section>
  )
}
