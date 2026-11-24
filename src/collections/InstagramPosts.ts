import { APIError, type CollectionBeforeChangeHook, type CollectionConfig } from 'payload'
import {
  ACCOUNT_LABELS,
  ACCOUNTS,
  KIND_LABELS,
  MAX_CAPTION,
  MAX_CAROUSEL,
  POST_KINDS,
  POST_STATUS,
  STATUS_LABELS,
  type AccountHandle,
  type PostKind,
  type PostStatus,
} from '@/lib/instagramConstants'

type MediaRow = { file?: number | { id: number } | null }

// An approved piece must be publishable as it is: checked when it gets approved, not on every draft save
const checkPublishable: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const becomingApproved = data.status === POST_STATUS.APPROVED && originalDoc?.status !== POST_STATUS.APPROVED
  if (!becomingApproved) return data

  const rows: MediaRow[] = data.media ?? []
  const ids = rows.map((row) => (typeof row.file === 'object' ? row.file?.id : row.file)).filter(Boolean) as number[]
  if (ids.length === 0) throw new APIError('Falta la imagen o el video.', 400)

  const { docs } = await req.payload.find({
    collection: 'instagram-media',
    where: { id: { in: ids } },
    depth: 0,
    limit: ids.length,
    req,
  })
  const videos = docs.filter((doc) => doc.mimeType?.startsWith('video/')).length
  const kind = data.kind as PostKind

  if (kind === POST_KINDS.REEL && (ids.length !== 1 || videos !== 1)) {
    throw new APIError('Un reel lleva un solo video.', 400)
  }
  if (kind === POST_KINDS.STORY && ids.length !== 1) {
    throw new APIError('Una historia lleva una sola imagen o un solo video.', 400)
  }
  if (kind === POST_KINDS.POST && videos > 0) {
    throw new APIError('Un post lleva solo imágenes. Para video, elegí Reel.', 400)
  }
  if (kind !== POST_KINDS.STORY && (data.caption ?? '').length > MAX_CAPTION) {
    throw new APIError(`El texto pasa los ${MAX_CAPTION} caracteres.`, 400)
  }
  return data
}

export const InstagramPosts: CollectionConfig = {
  slug: 'instagram-posts',
  labels: { singular: 'Pieza', plural: 'Publicaciones' },
  admin: {
    group: 'Instagram',
    useAsTitle: 'title',
    defaultColumns: ['title', 'account', 'kind', 'scheduledAt', 'status'],
    description: 'Solo se publica lo aprobado, a la hora indicada.',
    components: {
      beforeListTable: ['/components/admin/InstagramCalendar#InstagramCalendar'],
    },
  },
  defaultSort: '-scheduledAt',
  hooks: { beforeChange: [checkPublishable] },
  fields: [
    {
      name: 'preview',
      type: 'ui',
      admin: {
        components: { Field: '/components/admin/InstagramPreview#InstagramPreview' },
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título',
      admin: { description: 'Para reconocerla en el calendario. No se publica.' },
    },
    {
      name: 'account',
      type: 'select',
      required: true,
      index: true,
      defaultValue: ACCOUNTS.MAIN,
      label: 'Cuenta',
      options: (Object.values(ACCOUNTS) as AccountHandle[]).map((value) => ({ value, label: ACCOUNT_LABELS[value] })),
    },
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: POST_KINDS.POST,
          label: 'Tipo',
          options: Object.values(POST_KINDS).map((value) => ({ value, label: KIND_LABELS[value] })),
          admin: { width: '50%' },
        },
        {
          name: 'scheduledAt',
          type: 'date',
          required: true,
          index: true,
          label: 'Fecha y hora',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm', timeIntervals: 15 },
          },
        },
      ],
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Texto',
      maxLength: MAX_CAPTION,
      admin: { description: 'Las historias no llevan texto.', condition: (data) => data.kind !== POST_KINDS.STORY },
    },
    {
      name: 'media',
      type: 'array',
      label: 'Imágenes o video',
      labels: { singular: 'Imagen', plural: 'Imágenes' },
      minRows: 1,
      maxRows: MAX_CAROUSEL,
      admin: { description: 'Arrastrá para cambiar el orden. Post: de 1 a 10 imágenes. Reel: un video. Historia: una imagen o un video.' },
      fields: [{ name: 'file', type: 'upload', relationTo: 'instagram-media', required: true, label: 'Archivo' }],
    },
    {
      name: 'feedback',
      type: 'textarea',
      label: 'Pedido de cambio',
      admin: { description: 'Qué cambiarías. Claude lo lee y arma una versión nueva.' },
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Nota para vos',
      admin: { description: 'Lo que conviene saber de esta pieza (link de la bio, a qué página lleva).' },
    },
    {
      name: 'linkPath',
      type: 'text',
      label: 'Página a la que lleva',
      admin: { description: 'Ej: /que-playa-elegir-en-punta-del-este. Vacío si no lleva a ninguna.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      index: true,
      defaultValue: POST_STATUS.DRAFT,
      label: 'Estado',
      options: (Object.keys(STATUS_LABELS) as PostStatus[]).map((value) => ({ value, label: STATUS_LABELS[value] })),
      admin: { position: 'sidebar' },
    },
    {
      name: 'result',
      type: 'group',
      label: 'Publicación',
      admin: { position: 'sidebar', readOnly: true },
      fields: [
        { name: 'publishedAt', type: 'date', label: 'Publicado', admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'permalink', type: 'text', label: 'Link en Instagram' },
        { name: 'mediaId', type: 'text', label: 'ID en Instagram' },
        { name: 'error', type: 'textarea', label: 'Error' },
      ],
    },
  ],
}
