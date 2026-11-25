'use client'

import styles from './ZoneFilter.module.css'

type Props = {
  zones: string[]
  value: string | null
  onChange: (zone: string | null) => void
  allLabel: string
  ariaLabel: string
}

/** Pills to show only one zone; the list that owns it does the filtering */
export default function ZoneFilter({ zones, value, onChange, allLabel, ariaLabel }: Props) {
  return (
    <nav className={styles.filter} aria-label={ariaLabel}>
      <button type="button" className={value === null ? styles.active : undefined} onClick={() => onChange(null)}>
        {allLabel}
      </button>
      {zones.map((zone) => (
        <button type="button" key={zone} className={value === zone ? styles.active : undefined} onClick={() => onChange(zone)}>
          {zone}
        </button>
      ))}
    </nav>
  )
}
