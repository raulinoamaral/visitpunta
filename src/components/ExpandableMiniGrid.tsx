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
  items: Item[]
  initialCount?: number
  loadCount?: number
}

export default function ExpandableMiniGrid({ items, initialCount = 3, loadCount = 4 }: Props) {
  const [visible, setVisible] = useState(initialCount)
  const hasMore = visible < items.length

  function loadMore() {
    setVisible((prev) => Math.min(prev + loadCount, items.length))
  }

  return (
    <>
      <div className={styles.grid}>
        {items.slice(0, visible).map((item, i) => (
          <div
            key={item.id}
            className={i >= visible - loadCount && visible > initialCount ? styles.revealCard : undefined}
            style={i >= visible - loadCount && visible > initialCount ? { animationDelay: `${(i - (visible - loadCount)) * 0.08}s` } : undefined}
          >
            <MiniCard
              name={item.name}
              image={item.image}
              href={item.href}
            />
          </div>
        ))}
        {hasMore && (
          <button className={styles.moreInline} onClick={loadMore}>
            Seguir viendo →
          </button>
        )}
      </div>
      {hasMore && (
        <button className={styles.more} onClick={loadMore}>
          Seguir viendo →
        </button>
      )}
    </>
  )
}
