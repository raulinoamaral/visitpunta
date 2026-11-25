import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { SLOT_KEYS, SLOTS, daysLeft, isActive, todayOfYear, type SlotKey } from '@/lib/placementSlots'
import styles from './SiteMap.module.css'

type Row = {
  id: number
  slot: SlotKey
  zone?: { id: number; name: string } | number | null
  item?: { relationTo: string; value: any } | null
  position?: number | null
  from?: string | null
  to?: string | null
  locale: 'all' | 'es' | 'pt'
}

const LOCALE_TAGS = { all: '', es: 'ES', pt: 'PT' }
const SOON_DAYS = 7

/** Admin → Mapa del sitio: every page and slot with what shows there today, in order */
export async function SiteMap({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, visibleEntities, permissions, locale } = initPageResult
  const { payload } = req
  const adminRoute = payload.config.routes.admin
  const [{ docs }, { docs: zones }] = await Promise.all([
    payload.find({ collection: 'placements', depth: 1, limit: 1000, sort: 'position', locale: 'es' }),
    payload.find({ collection: 'destinations', depth: 0, limit: 20, sort: 'createdAt', locale: 'es' }),
  ])
  const rows = docs as unknown as Row[]
  const today = todayOfYear()

  const zoneId = (row: Row) => (typeof row.zone === 'object' ? row.zone?.id : row.zone)
  const itemTitle = (row: Row) => row.item?.value?.name ?? row.item?.value?.title ?? '(sin título)'
  const itemLink = (row: Row) =>
    row.item && typeof row.item.value === 'object' ? `${adminRoute}/collections/${row.item.relationTo}/${row.item.value.id}` : null

  const soon = rows.filter((row) => {
    const left = daysLeft(row.to, today)
    return isActive(row.from, row.to, today) && left !== null && left <= SOON_DAYS
  })

  // Pages in order, zone slots repeated for each zone
  const groups: { title: string; slots: { slot: SlotKey; zone?: number }[] }[] = []
  for (const slot of SLOT_KEYS) {
    const definition = SLOTS[slot]
    if ('perZone' in definition && definition.perZone) continue
    let group = groups.find((entry) => entry.title === definition.page)
    if (!group) groups.push((group = { title: definition.page, slots: [] }))
    group.slots.push({ slot })
  }
  for (const zone of zones) {
    groups.push({
      title: `Zona · ${zone.name}`,
      slots: SLOT_KEYS.filter((slot) => 'perZone' in SLOTS[slot] && (SLOTS[slot] as { perZone?: boolean }).perZone).map((slot) => ({ slot, zone: zone.id })),
    })
  }

  const renderRow = (row: Row) => {
    const active = isActive(row.from, row.to, today)
    const link = itemLink(row)
    return (
      <li key={row.id} className={active ? styles.row : `${styles.row} ${styles.off}`}>
        <span className={styles.position}>{row.position ?? '·'}</span>
        {link ? (
          <Link href={link} className={styles.item}>
            {itemTitle(row)}
          </Link>
        ) : (
          <span className={styles.item}>{itemTitle(row)}</span>
        )}
        {row.locale !== 'all' && <span className={styles.tag}>{LOCALE_TAGS[row.locale]}</span>}
        {row.from && row.to && (
          <span className={styles.dates}>
            {row.from} → {row.to}
            {!active && ' · fuera de fecha'}
          </span>
        )}
        <Link href={`${adminRoute}/collections/placements/${row.id}`} className={styles.edit}>
          Editar
        </Link>
      </li>
    )
  }

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <div className={styles.map}>
          <header className={styles.header}>
            <h1>Mapa del sitio</h1>
            <p>Lo que aparece destacado en cada lugar del sitio, en orden. En gris, lo que hoy está fuera de fecha.</p>
            <Link href={`${adminRoute}/collections/placements/create`} className={styles.add}>
              + Nueva ubicación
            </Link>
          </header>

          {soon.length > 0 && (
            <section className={styles.soon}>
              <h2>Termina en los próximos {SOON_DAYS} días</h2>
              <ul>{soon.map(renderRow)}</ul>
            </section>
          )}

          {groups.map((group) => (
            <section key={group.title} className={styles.group}>
              <h2>{group.title}</h2>
              {group.slots.map(({ slot, zone }) => {
                const slotRows = rows
                  .filter((row) => row.slot === slot && (zone === undefined || zoneId(row) === zone))
                  .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
                return (
                  <div key={`${slot}-${zone ?? ''}`} className={styles.slot}>
                    <h3>{SLOTS[slot].label}</h3>
                    {slotRows.length > 0 ? <ul>{slotRows.map(renderRow)}</ul> : <p className={styles.empty}>Vacío: {SLOTS[slot].empty}</p>}
                  </div>
                )
              })}
            </section>
          ))}
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
