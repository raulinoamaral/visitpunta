'use client'

import { useState } from 'react'
import CardGrid from '@/components/sections/CardGrid'
import NoteBand from '@/components/sections/NoteBand'
import Section from '@/components/sections/Section'
import SectionHead from '@/components/sections/SectionHead'
import SlideRow from '@/components/sections/SlideRow'
import TextIndex, { type IndexEntry } from '@/components/sections/TextIndex'
import Trio from '@/components/sections/Trio'
import ZoneFilter from '@/components/sections/ZoneFilter'
import type { SectionItem } from '@/components/sections/types'

export type ExploreNote = { href: string; image: string; alt: string; title: string; text?: string | null }

type Props = {
  start: SectionItem[]
  beaches: SectionItem[]
  places: SectionItem[]
  breakNote: ExploreNote | null
  guides: IndexEntry[]
  zones: string[]
  labels: Record<
    'all' | 'zones' | 'start' | 'startLine' | 'beaches' | 'beachesLine' | 'places' | 'placesLine' | 'guides' | 'guidesLine' | 'guideLabel' | 'readGuide',
    string
  >
}

/** Four formats with a guide in between: a trio to start, beaches that slide, places, guides as text */
export default function ExploreList({ start, beaches, places, breakNote, guides, zones, labels }: Props) {
  const [zone, setZone] = useState<string | null>(null)
  const only = (items: SectionItem[]) => items.filter((item) => !zone || item.label === zone)
  const startItems = only(start)
  const beachItems = only(beaches)
  const placeItems = only(places)

  return (
    <>
      <ZoneFilter zones={zones} value={zone} onChange={setZone} allLabel={labels.all} ariaLabel={labels.zones} />

      {startItems.length > 0 && (
        <Section>
          <SectionHead title={labels.start} line={labels.startLine} />
          <Trio items={startItems} />
        </Section>
      )}

      {beachItems.length > 0 && (
        <Section bleed>
          <SectionHead title={labels.beaches} line={labels.beachesLine} />
          <SlideRow items={beachItems} variant="tall" />
        </Section>
      )}

      {breakNote && <NoteBand {...breakNote} label={labels.guideLabel} readLabel={labels.readGuide} />}

      {placeItems.length > 0 && (
        <Section last={guides.length === 0}>
          <SectionHead title={labels.places} line={labels.placesLine} />
          <CardGrid items={placeItems} variant="places" />
        </Section>
      )}

      {guides.length > 0 && (
        <Section last>
          <SectionHead title={labels.guides} line={labels.guidesLine} />
          <TextIndex entries={guides} />
        </Section>
      )}
    </>
  )
}
