// Shared by the Instagram collection, the publishing task and the admin components (client-safe)

export const POST_KINDS = {
  POST: 'post', // one photo, or a carousel of 2 to 10
  REEL: 'reel',
  STORY: 'story',
} as const

export type PostKind = (typeof POST_KINDS)[keyof typeof POST_KINDS]

export const POST_STATUS = {
  DRAFT: 'draft',
  APPROVED: 'approved',
  CHANGES: 'changes',
  DISCARDED: 'discarded',
  PUBLISHING: 'publishing',
  PUBLISHED: 'published',
  FAILED: 'failed',
} as const

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS]

export const KIND_LABELS: Record<PostKind, string> = {
  post: 'Post',
  reel: 'Reel',
  story: 'Historia',
}

export const STATUS_LABELS: Record<PostStatus, string> = {
  draft: 'Borrador',
  approved: 'Aprobado',
  changes: 'Cambio pedido',
  discarded: 'Descartado',
  publishing: 'Publicando',
  published: 'Publicado',
  failed: 'Error',
}

export const MAX_CAROUSEL = 10
export const MAX_CAPTION = 2200

// The Instagram accounts this admin publishes to. Each one has its own credentials on the server:
// IG_USER_ID / IG_ACCESS_TOKEN for the main account, IG_USER_ID_BR / IG_ACCESS_TOKEN_BR for the Brazilian one
export const ACCOUNTS = {
  MAIN: 'visitpunta',
  BRAZIL: 'visitpunta.br',
} as const

export type AccountHandle = (typeof ACCOUNTS)[keyof typeof ACCOUNTS]

export const ACCOUNT_LABELS: Record<AccountHandle, string> = {
  visitpunta: '@visitpunta · español',
  'visitpunta.br': '@visitpunta.br · português',
}

// Short tag for the calendar cards
export const ACCOUNT_TAGS: Record<AccountHandle, string> = {
  visitpunta: 'ES',
  'visitpunta.br': 'BR',
}
