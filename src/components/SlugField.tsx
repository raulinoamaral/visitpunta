'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'
import styles from './SlugField.module.css'

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function SlugField({ path, sourceField = 'name' }: { path: string; sourceField?: string }) {
  const { value, setValue } = useField<string>({ path })
  const name = useFormFields(([fields]) => fields[sourceField]?.value as string)
  const [isManual, setIsManual] = useState(false)

  useEffect(() => {
    if (!isManual && name) {
      setValue(toSlug(name))
    }
  }, [name, isManual])

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Slug</label>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          value={value ?? ''}
          onChange={(e) => {
            setIsManual(true)
            setValue(toSlug(e.target.value))
          }}
        />
        {isManual && (
          <button
            type="button"
            className={styles.reset}
            onClick={() => {
              setIsManual(false)
              if (name) setValue(toSlug(name))
            }}
          >
            ↺ Regenerar
          </button>
        )}
      </div>
      <p className={styles.description}>Se genera automáticamente desde el nombre. Podés editarlo manualmente.</p>
    </div>
  )
}
