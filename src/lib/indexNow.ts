import type { CollectionAfterChangeHook } from 'payload'
import { isLocale, localePath } from '@/i18n/config'
import { SITE_URL } from '@/lib/structuredData'

// Public key: Bing checks it at /<key>.txt (file in public/) to confirm the site is ours
const INDEXNOW_KEY = '98bd397d1d5dd5b664fcc7f1593480fb'

/**
 * Tells Bing (and the other IndexNow engines) right away when a published page is created or edited,
 * so new pages reach its index (and ChatGPT search) in minutes instead of weeks. Fire and forget.
 */
export const notifyIndexNow: CollectionAfterChangeHook = ({ doc, req }) => {
  const locale = req.locale
  if (!doc?.published || !doc?.slug || !locale || !isLocale(locale)) return doc
  const url = `${SITE_URL}${localePath(locale, doc.slug)}`
  fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: [url],
    }),
  }).catch((error) => req.payload.logger.warn(`IndexNow: ${error.message}`))
  return doc
}
