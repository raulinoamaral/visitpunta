import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Pages are cached (ISR) and most of them show several collections at once (cards, related content,
 * listings, the home), so any content change refreshes the whole site right away. The timed
 * revalidation stays only as a fallback.
 */
function revalidateSite() {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Outside a Next.js request (local scripts) there is no cache to clear
  }
}

export const revalidateOnChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidateSite()
  return doc
}

export const revalidateOnDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateSite()
  return doc
}

export const revalidateGlobalOnChange: GlobalAfterChangeHook = ({ doc }) => {
  revalidateSite()
  return doc
}
