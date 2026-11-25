'use client'

import { useDocumentInfo, useField } from '@payloadcms/ui'
import { useEffect } from 'react'

/**
 * New placement opened from the site map ("+ Agregar"): the slot and zone come in the URL
 * (?slot=stay.first&zone=3) and are set once, so only "Qué" is left to choose. Renders nothing.
 */
export function PrefillPlacement() {
  const { id } = useDocumentInfo()
  const { setValue: setSlot } = useField<string>({ path: 'slot' })
  const { setValue: setZone } = useField<number>({ path: 'zone' })
  const { setValue: setPosition } = useField<number>({ path: 'position' })

  useEffect(() => {
    if (id) return
    const params = new URLSearchParams(window.location.search)
    const slot = params.get('slot')
    const zone = params.get('zone')
    const position = params.get('position')
    if (slot) setSlot(slot)
    if (zone) setZone(Number(zone))
    if (position) setPosition(Number(position))
    // Only once, when the form opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return null
}
