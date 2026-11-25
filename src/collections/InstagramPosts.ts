import type { CollectionBeforeChangeHook, CollectionConfig, Endpoint } from 'payload'
import { assertPublishable, publishPost } from '@/lib/instagramPost'
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
  type PostStatus,
} from '@/lib/instagramConstants'

// An approved piece must be publishable as it is: checked when it gets approved, not on every draft save
const checkPublishable: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const becomingApproved = data.status === POST_STATUS.APPROVED && originalDoc?.status !== POST_STATUS.APPROVED
  if (becomingApproved) await assertPublishable(data, req)
  return data
}

// "Publicar ahora": publishes the saved piece right away and answers when Instagram has it (logged-in users only)
const publishNowEndpoint: Endpoint = {
  path: '/:id/publish',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'No autorizado' }, { status: 401 })
    const post = await req.payload.findByID({ collection: 'instagram-posts', id: String(req.routeParams?.id), depth: 2 })
    if (post.status === POST_STATUS.PUBLISHING || post.status === POST_STATUS.PUBLISHED) {
      return Response.json({ error: 'Esta pieza ya se está publicando o ya salió.' }, { status: 409 })
    }
    try {
      await assertPublishable(post, req)
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 })
    }
    // The calendar shows it on the day it actually went out
    await req.payload.update({ collection: 'instagram-posts', id: post.id, data: { scheduledAt: new Date().toISOString() } })
    const result = await publishPost(req.payload, post)
    return Response.json(result, { status: result.published ? 200 : 502 })
  },
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
  endpoints: [publishNowEndpoint],
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
