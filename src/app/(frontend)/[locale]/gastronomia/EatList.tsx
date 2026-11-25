'use client'

import { useState } from 'react'
import CardGrid from '@/components/sections/CardGrid'
import CoffeeGrid from '@/components/sections/CoffeeGrid'
import NoteBand from '@/components/sections/NoteBand'
import Section from '@/components/sections/Section'
import SectionHead from '@/components/sections/SectionHead'
import SlideRow from '@/components/sections/SlideRow'
import ZoneFilter from '@/components/sections/ZoneFilter'
import type { SectionItem } from '@/components/sections/types'

export type EatNote = { href: string; image: string; alt: string; title: string; text?: string | null }
type Block = { title: string; line: string; items: SectionItem[] }

type Props = {
  restaurants: Block
  beach: Block
  coffee: Block
  beachNote: EatNote | null
  coffeeNote: EatNote | null
  zones: string[]
  labels: { all: string; zones: string; noteLabel: string; readNote: string }
}

/** One format per kind of place, a note between them, and a zone filter on top */
export default function EatList({ restaurants, beach, coffee, beachNote, coffeeNote, zones, labels }: Props) {
  const [zone, setZone] = useState<string | null>(null)
  const only = (items: SectionItem[]) => items.filter((item) => !zone || item.label === zone)
  const restaurantItems = only(restaurants.items)
  const beachItems = only(beach.items)
  const coffeeItems = only(coffee.items)

  return (
    <>
      <ZoneFilter zones={zones} value={zone} onChange={setZone} allLabel={labels.all} ariaLabel={labels.zones} />

      {restaurantItems.length > 0 && (
        <Section last={beachItems.length === 0 && coffeeItems.length === 0}>
          <SectionHead title={restaurants.title} line={restaurants.line} />
          <CardGrid items={restaurantItems} variant="tall" />
        </Section>
      )}

      {beachNote && beachItems.length > 0 && <NoteBand {...beachNote} label={labels.noteLabel} readLabel={labels.readNote} />}

      {beachItems.length > 0 && (
        <Section bleed last={coffeeItems.length === 0}>
          <SectionHead title={beach.title} line={beach.line} />
          <SlideRow items={beachItems} variant="wide" />
        </Section>
      )}

      {coffeeNote && coffeeItems.length > 0 && <NoteBand {...coffeeNote} label={labels.noteLabel} readLabel={labels.readNote} reverse />}

      {coffeeItems.length > 0 && (
        <Section last>
          <SectionHead title={coffee.title} line={coffee.line} />
          <CoffeeGrid items={coffeeItems} />
        </Section>
      )}
    </>
  )
}
