'use client'

import { useState } from 'react'
import PlaceCard from './PlaceCard'
import styles from './ExpandableGrid.module.css'

type Place = {
  id: string
  name: string
  destination: string
  description: string
  image: string
  href: string
}

type Props = {
  featured: Place[]
  rest: Place[]
}

export default function ExpandableGrid({ featured, rest }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div className={styles.grid}>
        {featured.map((place) => (
          <PlaceCard
            key={place.id}
            name={place.name}
            destination={place.destination}
            description={place.description}
            image={place.image}
            href={place.href}
          />
        ))}
        {expanded && rest.map((place, i) => (
          <div
            key={place.id}
            className={styles.revealCard}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <PlaceCard
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
