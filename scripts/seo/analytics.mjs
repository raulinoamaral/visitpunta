/**
 * Reads Google Analytics 4 data for a site (read-only), with the same service account as Search Console.
 * Key: ~/.config/google/search-console.json · Property ids: ~/.config/google/analytics.json ({ "visitpunta.com": "123456789" })
 * The service account's email must be a Viewer of the GA4 property.
 *
 *   node scripts/seo/analytics.mjs visitpunta.com [days=28]
 *     → totals, top pages, where people come from (incl. Instagram and AI assistants), countries
 */
import crypto from 'crypto'
import fs from 'fs'
import os from 'os'
import path from 'path'

const [domain, days = '28'] = process.argv.slice(2)
if (!domain) throw new Error('Usage: node scripts/seo/analytics.mjs <domain> [days]')
const configDir = path.join(os.homedir(), '.config/google')
const key = JSON.parse(fs.readFileSync(path.join(configDir, 'search-console.json'), 'utf8'))
const properties = JSON.parse(fs.readFileSync(path.join(configDir, 'analytics.json'), 'utf8'))
const propertyId = properties[domain]
if (!propertyId) throw new Error(`No GA4 property id for ${domain} in ~/.config/google/analytics.json`)

// Service account → access token (signed JWT, no extra dependencies)
async function accessToken() {
  const now = Math.floor(Date.now() / 1000)
  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url')
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
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

async function report(dimensions, metrics, { limit = 20, filter } = {}) {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'yesterday' }],
      dimensions: dimensions.map((name) => ({ name })),
      metrics: metrics.map((name) => ({ name })),
      orderBys: [{ metric: { metricName: metrics[0] }, desc: true }],
      limit,
      ...(filter && { dimensionFilter: filter }),
    }),
  })
  const body = await res.json()
  if (body.error) throw new Error(body.error.message)
  return (body.rows || []).map((r) => ({
    ...Object.fromEntries(dimensions.map((d, i) => [d, r.dimensionValues[i].value])),
    ...Object.fromEntries(metrics.map((m, i) => [m, Math.round(Number(r.metricValues[i].value) * 10) / 10])),
  }))
}

const PAGE_METRICS = ['screenPageViews', 'activeUsers', 'averageSessionDuration']
console.log(`GA4 ${domain} (property ${propertyId}) · last ${days} days`)
console.log('\nTotals'); console.table(await report([], ['activeUsers', 'sessions', 'screenPageViews', 'engagementRate']))
console.log('\nTop pages'); console.table(await report(['pagePath'], PAGE_METRICS, { limit: 25 }))
console.log('\nWhere people come from'); console.table(await report(['sessionSource', 'sessionMedium'], ['sessions', 'engagementRate'], { limit: 20 }))
console.log('\nAI assistants (ChatGPT, Perplexity, Gemini, Copilot, Claude)')
console.table(await report(['sessionSource', 'landingPage'], ['sessions'], {
  filter: { filter: { fieldName: 'sessionSource', stringFilter: { matchType: 'FULL_REGEXP', value: '.*(chatgpt|openai|perplexity|gemini|copilot|claude|bard).*', caseSensitive: false } } },
}))
console.log('\nInstagram'); console.table(await report(['sessionSource', 'landingPage'], ['sessions'], {
  filter: { filter: { fieldName: 'sessionSource', stringFilter: { matchType: 'FULL_REGEXP', value: '(ig|.*instagram.*)', caseSensitive: false } } },
}))
console.log('\nCountries'); console.table(await report(['country'], ['activeUsers'], { limit: 10 }))
