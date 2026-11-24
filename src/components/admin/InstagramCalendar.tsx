'use client'

import { useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ACCOUNT_TAGS,
  ACCOUNTS,
  KIND_LABELS,
  POST_KINDS,
  STATUS_LABELS,
  type AccountHandle,
  type PostKind,
  type PostStatus,
} from '@/lib/instagramConstants'
import styles from './InstagramCalendar.module.css'

type CalendarPost = {
  id: number
  title: string
  account: AccountHandle
  kind: PostKind
  status: PostStatus
  scheduledAt: string
  media?: { file?: { url?: string; mimeType?: string } | number | null }[]
}

const DAY_MS = 24 * 60 * 60 * 1000

// Monday 00:00 (local time) of the week that contains `date`
function startOfWeek(date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  return start
}

const dayLabel = new Intl.DateTimeFormat('es-UY', { weekday: 'short', day: 'numeric' })
const monthLabel = new Intl.DateTimeFormat('es-UY', { day: 'numeric', month: 'long' })
const timeLabel = new Intl.DateTimeFormat('es-UY', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'America/Montevideo' })

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString()
}

export function InstagramCalendar() {
  const {
    config: { routes },
  } = useConfig()
  const base = `${routes.admin}/collections/instagram-posts`
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [posts, setPosts] = useState<CalendarPost[]>([])
  const [loading, setLoading] = useState(true)
  // null shows both accounts
  const [account, setAccount] = useState<AccountHandle | null>(null)

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => new Date(weekStart.getTime() + i * DAY_MS)), [weekStart])

  useEffect(() => {
    const end = new Date(weekStart.getTime() + 7 * DAY_MS)
    const params = new URLSearchParams({
      'where[scheduledAt][greater_than_equal]': weekStart.toISOString(),
      'where[scheduledAt][less_than]': end.toISOString(),
      sort: 'scheduledAt',
      depth: '1',
      limit: '100',
    })
    if (account) params.set('where[account][equals]', account)
    setLoading(true)
    fetch(`/api/instagram-posts?${params}`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { docs: [] }))
      .then((data) => setPosts(data.docs ?? []))
      .finally(() => setLoading(false))
  }, [weekStart, account])

  const moveWeek = (weeks: number) => setWeekStart(new Date(weekStart.getTime() + weeks * 7 * DAY_MS))
  const lastDay = days[6]
  const today = new Date()

  return (
    <section className={styles.calendar}>
      <div className={styles.bar}>
        <div className={styles.nav}>
          <button type="button" onClick={() => moveWeek(-1)} aria-label="Semana anterior">
            ‹
          </button>
          <strong>
            {monthLabel.format(weekStart)} – {monthLabel.format(lastDay)}
          </strong>
          <button type="button" onClick={() => moveWeek(1)} aria-label="Semana siguiente">
            ›
          </button>
          {!sameDay(weekStart, startOfWeek(today)) && (
            <button type="button" className={styles.today} onClick={() => setWeekStart(startOfWeek(today))}>
              Hoy
            </button>
          )}
        </div>
        <div className={styles.accounts}>
          <button type="button" className={account === null ? styles.active : undefined} onClick={() => setAccount(null)}>
            Todas
          </button>
          {(Object.values(ACCOUNTS) as AccountHandle[]).map((handle) => (
            <button
              type="button"
              key={handle}
              className={account === handle ? styles.active : undefined}
              onClick={() => setAccount(handle)}
            >
              @{handle}
            </button>
          ))}
        </div>
        <div className={styles.legend}>
          <span className={styles.draft}>Borrador</span>
          <span className={styles.approved}>Aprobado</span>
          <span className={styles.published}>Publicado</span>
        </div>
      </div>

      <div className={`${styles.week} ${loading ? styles.loading : ''}`}>
        {days.map((day) => {
          const dayPosts = posts.filter((post) => sameDay(new Date(post.scheduledAt), day))
          return (
            <div key={day.toISOString()} className={`${styles.day} ${sameDay(day, today) ? styles.isToday : ''}`}>
              <h3>{dayLabel.format(day)}</h3>
              {dayPosts.map((post) => {
                const first = post.media?.[0]?.file
                const file = typeof first === 'object' ? first : null
                const vertical = post.kind !== POST_KINDS.POST
                const count = post.media?.length ?? 0
                return (
                  <Link
                    key={post.id}
                    href={`${base}/${post.id}`}
                    className={`${styles.card} ${post.status === 'discarded' ? styles.discardedCard : ''}`}
                  >
                    <span className={styles.kind}>
                      {ACCOUNT_TAGS[post.account]} · {KIND_LABELS[post.kind]}
                      {post.kind === POST_KINDS.POST && count > 1 ? ` · ${count}` : ''}
                    </span>
                    {file?.url &&
                      (file.mimeType?.startsWith('video/') ? (
                        <video className={vertical ? styles.thumbTall : styles.thumb} src={file.url} muted preload="metadata" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className={vertical ? styles.thumbTall : styles.thumb} src={file.url} alt="" />
                      ))}
                    <span className={styles.meta}>
                      <b>{post.title}</b>
                      <span className={`${styles.state} ${styles[post.status]}`}>
                        {STATUS_LABELS[post.status]} {timeLabel.format(new Date(post.scheduledAt))}
                      </span>
                    </span>
                  </Link>
                )
              })}
            </div>
          )
        })}
      </div>
      <Link href={`${base}/create`} className={styles.add}>
        + Nueva pieza
      </Link>
    </section>
  )
}
