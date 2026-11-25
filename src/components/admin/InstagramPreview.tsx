'use client'

import { useAllFormFields, useDocumentInfo, useField, useForm, useFormModified } from '@payloadcms/ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ACCOUNTS,
  KIND_LABELS,
  POST_KINDS,
  POST_STATUS,
  STATUS_LABELS,
  type AccountHandle,
  type PostKind,
  type PostStatus,
} from '@/lib/instagramConstants'
import styles from './InstagramPreview.module.css'

type FileInfo = { url: string; isVideo: boolean }

const CAPTION_PREVIEW = 125 // Instagram cuts the caption with "… más" around here

// Always Uruguay time, so the server render and the browser agree
const whenFormat = new Intl.DateTimeFormat('es-UY', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'America/Montevideo',
})

function formatWhen(value?: string) {
  if (!value) return 'Sin fecha'
  const text = whenFormat.format(new Date(value))
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// The array rows live in the form state as "media.0.file", "media.1.file"…, in order
function useMediaIds(fields: Record<string, { value?: unknown }>) {
  return useMemo(
    () =>
      Object.keys(fields)
        .map((key) => key.match(/^media\.(\d+)\.file$/))
        .filter((match): match is RegExpMatchArray => Boolean(match))
        .sort((a, b) => Number(a[1]) - Number(b[1]))
        .map((match) => {
          const value = fields[match[0]]?.value
          return typeof value === 'object' && value ? (value as { id: number }).id : (value as number)
        })
        .filter(Boolean),
    [fields],
  )
}

export function InstagramPreview() {
  const [fields] = useAllFormFields()
  const { submit } = useForm()
  const modified = useFormModified()
  const { id } = useDocumentInfo()
  const [sending, setSending] = useState(false)
  const { setValue: setStatus } = useField<PostStatus>({ path: 'status' })
  const [files, setFiles] = useState<Record<number, FileInfo>>({})
  const [slide, setSlide] = useState(0)
  const slidesRef = useRef<HTMLDivElement>(null)
  const requested = useRef(new Set<number>())

  const account = (fields.account?.value as AccountHandle) ?? ACCOUNTS.MAIN
  const kind = (fields.kind?.value as PostKind) ?? POST_KINDS.POST
  const status = (fields.status?.value as PostStatus) ?? POST_STATUS.DRAFT
  const caption = (fields.caption?.value as string) ?? ''
  const scheduledAt = fields.scheduledAt?.value as string | undefined
  const note = fields.note?.value as string | undefined
  const permalink = fields['result.permalink']?.value as string | undefined
  const error = fields['result.error']?.value as string | undefined
  const mediaIds = useMediaIds(fields)

  // Fetch the public URL of each file once (a failed fetch is not retried in a loop)
  useEffect(() => {
    const missing = mediaIds.filter((id) => !requested.current.has(id))
    if (missing.length === 0) return
    missing.forEach((id) => requested.current.add(id))
    Promise.all(
      missing.map(async (id) => {
        const res = await fetch(`/api/instagram-media/${id}?depth=0`, { credentials: 'include' })
        if (!res.ok) return null
        const doc = await res.json()
        return [id, { url: doc.url, isVideo: String(doc.mimeType).startsWith('video/') }] as const
      }),
    ).then((entries) => {
      setFiles((current) => ({ ...current, ...Object.fromEntries(entries.filter(Boolean) as [number, FileInfo][]) }))
    })
  }, [mediaIds])

  const media = mediaIds.map((id) => files[id]).filter(Boolean)
  const isVertical = kind !== POST_KINDS.POST
  const isClosed = status === POST_STATUS.PUBLISHED || status === POST_STATUS.PUBLISHING

  // Publishes right away: saves pending edits, then waits for Instagram (a few seconds per image)
  const publishNow = async () => {
    if (!id || !window.confirm(`¿Publicar ahora en @${account}? Sale en Instagram en el momento.`)) return
    setSending(true)
    try {
      if (modified) await submit()
      const res = await fetch(`/api/instagram-posts/${id}/publish`, { method: 'POST', credentials: 'include' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok && res.status !== 502) window.alert(body.error ?? 'No se pudo publicar.')
    } catch {
      // The connection can drop on a long carousel while the server keeps publishing: the reload shows where it is
    }
    window.location.reload()
  }

  const changeStatus = (next: PostStatus) => {
    setStatus(next)
    void submit({ overrides: { status: next } })
  }

  const askForChanges = () => {
    setStatus(POST_STATUS.CHANGES)
    const feedback = document.getElementById('field-feedback') as HTMLTextAreaElement | null
    feedback?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    feedback?.focus()
  }

  const onScroll = () => {
    const el = slidesRef.current
    if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth))
  }

  // Arrows and dots, for a mouse without sideways scroll
  const goTo = (index: number) => {
    const el = slidesRef.current
    if (el) el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
  }

  const shortCaption = caption.length > CAPTION_PREVIEW ? `${caption.slice(0, CAPTION_PREVIEW).trimEnd()}` : caption

  return (
    <div className={styles.preview}>
      <div className={styles.phone}>
        <div className={styles.screen}>
          {!isVertical && (
            <div className={styles.head}>
              <span className={styles.avatar}>pe</span>
              <b>{account}</b>
              <span className={styles.dots}>···</span>
            </div>
          )}

          <div className={styles.carousel}>
          <div
            ref={slidesRef}
            onScroll={onScroll}
            className={`${styles.slides} ${isVertical ? styles.vertical : ''}`}
          >
            {media.length === 0 && <div className={styles.empty}>Todavía no hay imágenes</div>}
            {media.map((item, index) =>
              item.isVideo ? (
                <video key={index} className={styles.slide} src={item.url} controls muted playsInline loop />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={index} className={styles.slide} src={item.url} alt="" />
              ),
            )}
          </div>
          {slide > 0 && (
            <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => goTo(slide - 1)} aria-label="Anterior">
              ‹
            </button>
          )}
          {slide < media.length - 1 && (
            <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => goTo(slide + 1)} aria-label="Siguiente">
              ›
            </button>
          )}
          {media.length > 1 && (
            <span className={styles.counter}>
              {slide + 1}/{media.length}
            </span>
          )}
          </div>

          {kind === POST_KINDS.POST && (
            <>
              <div className={styles.icons}>
                <span>♡</span>
                <span>◯</span>
                <span>➤</span>
                <span className={styles.save}>⌑</span>
              </div>
              {media.length > 1 && (
                <div className={styles.pager}>
                  {media.map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      className={index === slide ? styles.on : undefined}
                      onClick={() => goTo(index)}
                      aria-label={`Imagen ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {kind !== POST_KINDS.STORY && (
            <p className={styles.caption}>
              <b>{account}</b> {shortCaption}
              {caption.length > CAPTION_PREVIEW && <span className={styles.more}>… más</span>}
            </p>
          )}
        </div>
      </div>

      <div className={styles.side}>
        <div className={styles.tags}>
          <span className={styles.pill}>@{account}</span>
          <span className={styles.pill}>
            {KIND_LABELS[kind]}
            {kind === POST_KINDS.POST && media.length > 1 ? ` · ${media.length} imágenes` : ''}
          </span>
          <span className={`${styles.status} ${styles[status]}`}>{STATUS_LABELS[status]}</span>
        </div>
        <p className={styles.when}>{formatWhen(scheduledAt)}</p>

        {status === POST_STATUS.PUBLISHED && (
          <p className={styles.done}>
            Publicado.{' '}
            {permalink && (
              <a href={permalink} target="_blank" rel="noreferrer">
                Ver en Instagram
              </a>
            )}
          </p>
        )}
        {(sending || status === POST_STATUS.PUBLISHING) && (
          <p className={styles.done}>Publicando en Instagram… puede tardar unos segundos por imagen.</p>
        )}
        {status === POST_STATUS.FAILED && error && <p className={styles.error}>No se pudo publicar: {error}</p>}

        {!isClosed && !sending && (
          <div className={styles.actions}>
            {status !== POST_STATUS.APPROVED ? (
              <button type="button" className={styles.approve} onClick={() => changeStatus(POST_STATUS.APPROVED)}>
                {status === POST_STATUS.FAILED ? 'Reintentar' : 'Aprobar'}
              </button>
            ) : (
              <button type="button" className={styles.button} onClick={() => changeStatus(POST_STATUS.DRAFT)}>
                Quitar aprobación
              </button>
            )}
            <button type="button" className={styles.button} onClick={askForChanges}>
              Pedir cambio
            </button>
            <button type="button" className={styles.button} onClick={publishNow} disabled={!id}>
              Publicar ahora
            </button>
            {status !== POST_STATUS.DISCARDED && (
              <button type="button" className={`${styles.button} ${styles.discard}`} onClick={() => changeStatus(POST_STATUS.DISCARDED)}>
                Descartar
              </button>
            )}
          </div>
        )}
        {status === POST_STATUS.APPROVED && (
          <p className={styles.hint}>Sale sola a la hora indicada (puede demorar hasta 10 minutos).</p>
        )}
        {status === POST_STATUS.CHANGES && (
          <p className={styles.hint}>Escribí abajo qué cambiarías y tocá Guardar.</p>
        )}

        {note && (
          <div className={styles.note}>
            <b>Nota para vos</b>
            <p>{note}</p>
          </div>
        )}
      </div>
    </div>
  )
}
