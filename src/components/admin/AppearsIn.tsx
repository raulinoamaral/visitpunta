'use client'

import { useConfig, useDocumentInfo } from '@payloadcms/ui'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { slotLabel, type SlotKey } from '@/lib/placementSlots'
import styles from './AppearsIn.module.css'

type Placement = { id: number; slot: SlotKey; position?: number; from?: string; to?: string; zone?: { name?: string } | number }

/** Sidebar of a place, note or experience: where it is featured on the site */
export function AppearsIn() {
  const { id, collectionSlug } = useDocumentInfo()
  const {
    config: { routes },
  } = useConfig()
  const [placements, setPlacements] = useState<Placement[] | null>(null)

  useEffect(() => {
    if (!id || !collectionSlug) return
    const params = new URLSearchParams({
      'where[item.relationTo][equals]': collectionSlug,
      'where[item.value][equals]': String(id),
      depth: '1',
      limit: '50',
    })
    fetch(`/api/placements?${params}`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { docs: [] }))
      .then((data) => setPlacements(data.docs ?? []))
  }, [id, collectionSlug])

  if (!id) return null

  return (
    <div className={styles.box}>
      <span className={styles.title}>Aparece en</span>
      {placements === null && <p className={styles.muted}>…</p>}
      {placements?.length === 0 && <p className={styles.muted}>No está destacado en ningún lugar.</p>}
      {placements && placements.length > 0 && (
        <ul>
          {placements.map((placement) => (
            <li key={placement.id}>
              <Link href={`${routes.admin}/collections/placements/${placement.id}`}>
                {slotLabel(placement.slot)}
                {typeof placement.zone === 'object' && placement.zone?.name ? ` (${placement.zone.name})` : ''} · {placement.position ?? 1}
              </Link>
              {placement.from && placement.to && (
                <span className={styles.muted}>
                  {' '}
                  {placement.from} → {placement.to}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      <Link href={`${routes.admin}/mapa`} className={styles.map}>
        Ver el mapa del sitio
      </Link>
    </div>
  )
}
