'use client'

import { useState } from 'react'
import CardGrid from '@/components/sections/CardGrid'
import Section from '@/components/sections/Section'
import SectionHead from '@/components/sections/SectionHead'
import ZoneFilter from '@/components/sections/ZoneFilter'
import type { SectionItem } from '@/components/sections/types'

export type StaySection = { title: string; line?: string; items: SectionItem[] }

type Props = {
  sections: StaySection[]
  zones: string[]
  labels: { all: string; zones: string; booking: string }
}

/** Hotels by kind of stay, with a zone filter that hides what is elsewhere */
export default function StayList({ sections, zones, labels }: Props) {
  const [zone, setZone] = useState<string | null>(null)
  const visible = sections
    .map((section) => ({ ...section, items: section.items.filter((item) => !zone || item.label === zone) }))
    .filter((section) => section.items.length > 0)

  return (
    <>
      <ZoneFilter zones={zones} value={zone} onChange={setZone} allLabel={labels.all} ariaLabel={labels.zones} />
      {visible.map((section, index) => (
        <Section key={section.title} last={index === visible.length - 1}>
          <SectionHead title={section.title} line={section.line} />
          <CardGrid items={section.items} variant="wide" bookingLabel={labels.booking} />
        </Section>
      ))}
    </>
  )
}
