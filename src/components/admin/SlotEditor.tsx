'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './SiteMap.module.css'

export type SlotRow = {
  id: number
  title: string
  itemHref: string | null
  position: number
  dates: string | null
  active: boolean
  localeTag: string
}

export type SlotOption = { key: string; relationTo: string; id: number; title: string }

type Props = {
  slot: string
  zone?: number
  rows: SlotRow[]
  options: SlotOption[]
  /** Slots that hold one thing: adding replaces nothing, it only shows when empty */
  single: boolean
  emptyText: string
  adminRoute: string
}

/** One slot of the site map, managed in place: reorder, remove, add from the full list */
export default function SlotEditor({ slot, zone, rows, options, single, emptyText, adminRoute }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [choice, setChoice] = useState('')
  const [error, setError] = useState<string | null>(null)

  const api = async (path: string, method: 'POST' | 'PATCH' | 'DELETE', body?: object) => {
    const res = await fetch(`/api/placements${path}`, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      throw new Error(json?.errors?.[0]?.message ?? 'No se pudo guardar.')
    }
  }

  const run = async (action: () => Promise<void>) => {
    setBusy(true)
    setError(null)
    try {
      await action()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  // Swaps the positions of two neighbours; equal positions get distinct ones first
  const move = (index: number, step: -1 | 1) =>
    run(async () => {
      const ordered = rows.map((row, i) => ({ ...row, position: i + 1 }))
      const other = ordered[index + step]
      const current = ordered[index]
      if (!other) return
      await Promise.all(
        ordered.map((row) => {
          const position = row.id === current.id ? other.position : row.id === other.id ? current.position : row.position
          const original = rows.find((entry) => entry.id === row.id)?.position
          return position === original ? null : api(`/${row.id}`, 'PATCH', { position })
        }),
      )
    })

  const remove = (row: SlotRow) => {
    if (!window.confirm(`¿Sacar "${row.title}" de acá?`)) return
    void run(() => api(`/${row.id}`, 'DELETE'))
  }

  const add = () => {
    const option = options.find((entry) => entry.key === choice)
    if (!option) return
    const position = rows.reduce((max, row) => Math.max(max, row.position), 0) + 1
    void run(async () => {
      await api('', 'POST', {
        slot,
        ...(zone !== undefined && { zone }),
        item: { relationTo: option.relationTo, value: option.id },
        position,
        locale: 'all',
      })
      setChoice('')
    })
  }

  return (
    <div className={busy ? styles.busy : undefined}>
      {rows.length === 0 && <p className={styles.empty}>Vacío: {emptyText}</p>}
      {rows.length > 0 && (
        <ul>
          {rows.map((row, index) => (
            <li key={row.id} className={row.active ? styles.row : `${styles.row} ${styles.off}`}>
              <span className={styles.position}>{index + 1}</span>
              {row.itemHref ? (
                <Link href={row.itemHref} className={styles.item}>
                  {row.title}
                </Link>
              ) : (
                <span className={styles.item}>{row.title}</span>
              )}
              {row.localeTag && <span className={styles.tag}>{row.localeTag}</span>}
              {row.dates && <span className={styles.dates}>{row.dates}</span>}
              <span className={styles.actions}>
                {!single && (
                  <>
                    <button type="button" onClick={() => move(index, -1)} disabled={busy || index === 0} aria-label="Subir">
                      ↑
                    </button>
                    <button type="button" onClick={() => move(index, 1)} disabled={busy || index === rows.length - 1} aria-label="Bajar">
                      ↓
                    </button>
                  </>
                )}
                <Link href={`${adminRoute}/collections/placements/${row.id}`} className={styles.edit} title="Fechas e idioma">
                  Fechas
                </Link>
                <button type="button" onClick={() => remove(row)} disabled={busy} aria-label="Sacar" className={styles.remove}>
                  ×
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {(!single || rows.length === 0) && options.length > 0 && (
        <div className={styles.addRow}>
          <select value={choice} onChange={(event) => setChoice(event.target.value)} disabled={busy}>
            <option value="">Elegir para agregar…</option>
            {options.map((option) => (
              <option key={option.key} value={option.key}>
                {option.title}
              </option>
            ))}
          </select>
          <button type="button" onClick={add} disabled={busy || !choice}>
            Agregar
          </button>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
