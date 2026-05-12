'use client'

import { useState } from 'react'
import GastroCard from './GastroCard'
import styles from './ExpandableGastroGrid.module.css'

type Place = {
  id: string
  name: string
  destination: string
  description: string
  image: string
  tag?: string
  href: string
}

type Props = {
  featured: Place[]
  rest: Place[]
}

export default function ExpandableGastroGrid({ featured, rest }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div className={styles.grid}>
        {featured.map((place) => (
          <GastroCard
            key={place.id}
            name={place.name}
            destination={place.destination}
            description={place.description}
            image={place.image}
            tag={place.tag}
            href={place.href}
          />
        ))}
        {expanded && rest.map((place, i) => (
          <div
            key={place.id}
            className={styles.revealCard}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <GastroCard
              name={place.name}
              destination={place.destination}
              description={place.description}
              image={place.image}
              href={place.href}
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
