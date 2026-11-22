/**
 * Reads Google Search Console data for a site (read-only), with a service account.
 * The key lives outside the repo: ~/.config/google/search-console.json (service account JSON).
 * The service account's email must be added as a (restricted) user of the property in Search Console.
 *
 *   node scripts/seo/search-console.mjs visitpunta.com [days=28]
 *     → top queries, top pages, "almost there" queries (position 8–20), low-CTR pages, countries
 *   node scripts/seo/search-console.mjs visitpunta.com 28 query "ballenas"
 *     → only queries containing that text
 */
import crypto from 'crypto'
import fs from 'fs'
import os from 'os'
import path from 'path'

const [domain, days = '28', filterDimension, filterText] = process.argv.slice(2)
if (!domain) throw new Error('Usage: node scripts/seo/search-console.mjs <domain> [days] [query|page <text>]')
const key = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/google/search-console.json'), 'utf8'))

// Service account → access token (signed JWT, no extra dependencies)
async function accessToken() {
  const now = Math.floor(Date.now() / 1000)
  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url')
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url')
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` }),
  })
  const body = await res.json()
  if (!body.access_token) throw new Error(`Token error: ${JSON.stringify(body)}`)
  return body.access_token
}

const token = await accessToken()
const api = async (url, body) => {
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json
}

// The property can be a domain property (sc-domain:) or a URL prefix: use whichever the account can see
const { siteEntry = [] } = await api('https://www.googleapis.com/webmasters/v3/sites')
const site = siteEntry.find((s) => s.siteUrl === `sc-domain:${domain}`) || siteEntry.find((s) => s.siteUrl.includes(domain))
if (!site) throw new Error(`No access to ${domain}. Visible properties: ${siteEntry.map((s) => s.siteUrl).join(', ') || 'none'}`)

// Data lags ~2-3 days
const day = (offset) => new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10)
const range = { startDate: day(Number(days) + 3), endDate: day(3) }

async function query(dimensions, rowLimit = 25, extra = {}) {
  const filters = filterDimension && filterText
    ? [{ filters: [{ dimension: filterDimension, operator: 'contains', expression: filterText }] }]
    : undefined
  const { rows = [] } = await api(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site.siteUrl)}/searchAnalytics/query`,
    { ...range, dimensions, rowLimit, dimensionFilterGroups: filters, ...extra },
  )
  return rows.map((r) => ({
    ...Object.fromEntries(dimensions.map((d, i) => [d, d === 'page' ? r.keys[i].replace(/^https?:\/\/[^/]+/, '') || '/' : r.keys[i]])),
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: `${(r.ctr * 100).toFixed(1)}%`,
    position: Number(r.position.toFixed(1)),
  }))
}

console.log(`${site.siteUrl} · ${range.startDate} → ${range.endDate}${filterText ? ` · ${filterDimension} contains "${filterText}"` : ''}`)

const queries = await query(['query'], 500)
console.log('\nTop queries'); console.table(queries.slice(0, 25))
console.log('\nTop pages'); console.table(await query(['page'], 20))
console.log('\nAlmost there (position 8–20, by impressions)')
console.table(queries.filter((q) => q.position >= 8 && q.position <= 20).sort((a, b) => b.impressions - a.impressions).slice(0, 20))
const pages = await query(['page'], 200)
console.log('\nLow CTR (100+ impressions, CTR under 2%)')
console.table(pages.filter((p) => p.impressions >= 100 && parseFloat(p.ctr) < 2).slice(0, 15))
console.log('\nCountries'); console.table(await query(['country'], 10))
