/** Where-clause for documents published in the requested language. */
export const PUBLISHED = { published: { equals: true } } as const

/** A populated relation is shown only if it is a document published in this language. */
export function isPublishedDoc<T>(value: T): value is T & { published: true } {
  return typeof value === 'object' && value !== null && (value as { published?: boolean }).published === true
}
