'use client'

import { useState } from 'react'
import MiniCard from './MiniCard'
import styles from './ExpandableMiniGrid.module.css'

type Item = {
  id: string
  name: string
  image: string
  href: string
}

type Props = {
  featured: Item[]
  rest: Item[]
}

export default function ExpandableMiniGrid({ featured, rest }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div className={styles.grid}>
        {featured.map((item) => (
          <MiniCard
            key={item.id}
            name={item.name}
            image={item.image}
            href={item.href}
          />
        ))}
        {!expanded && rest.length > 0 && (
          <button className={styles.moreInline} onClick={() => setExpanded(true)}>
            Seguir viendo →
          </button>
        )}
        {expanded && rest.map((item, i) => (
          <div
            key={item.id}
            className={styles.revealCard}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <MiniCard
              name={item.name}
              image={item.image}
              href={item.href}
            />
          </div>
        ))}
      </div>
      {!expanded && rest.length > 0 && (
        <button className={styles.more} onClick={() => setExpanded(true)}>
          Seguir viendo →
        </button>
      )}
    </>
  )
}
