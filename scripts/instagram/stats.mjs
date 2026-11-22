/**
 * Reads the account's recent posts and their insights from the Instagram Graph API (read-only).
 * Tokens live outside the repo in ~/.config/instagram/accounts.json (non-expiring page tokens).
 *   node scripts/instagram/stats.mjs visitcabopolonio [limit]
 */
import fs from 'fs'
import os from 'os'
import path from 'path'

const [username, limit = '12'] = process.argv.slice(2)
if (!username) throw new Error('Usage: node scripts/instagram/stats.mjs <username> [limit]')
const accounts = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/instagram/accounts.json'), 'utf8'))
const account = accounts[username]
if (!account) throw new Error(`No token for ${username}`)

const API = 'https://graph.facebook.com/v23.0'
async function get(pathname, params = {}) {
  const url = new URL(`${API}/${pathname}`)
  for (const [k, v] of Object.entries({ ...params, access_token: account.token })) url.searchParams.set(k, v)
  const res = await fetch(url)
  const body = await res.json()
  if (body.error) throw new Error(body.error.message)
  return body
}

// Metrics available for every feed post type; reels add their own on top
const POST_METRICS = ['reach', 'views', 'saved', 'shares', 'likes', 'comments', 'total_interactions']
const BASIC_METRICS = ['reach', 'saved', 'likes', 'comments']

const profile = await get(account.ig_id, { fields: 'username,followers_count,media_count' })
const media = await get(`${account.ig_id}/media`, {
  fields: 'id,caption,media_type,media_product_type,timestamp,permalink',
  limit,
})

const rows = []
for (const post of media.data) {
  let metrics = {}
  // Older posts and some reels reject part of the list: retry with the basic set
  for (const list of [POST_METRICS, BASIC_METRICS]) {
    try {
      const insights = await get(`${post.id}/insights`, { metric: list.join(',') })
      metrics = Object.fromEntries(insights.data.map((m) => [m.name, m.values?.[0]?.value ?? m.total_value?.value]))
      break
    } catch (error) {
      metrics = { error: error.message }
    }
  }
  rows.push({
    date: post.timestamp.slice(0, 10),
    type: post.media_product_type === 'REELS' ? 'reel' : post.media_type.toLowerCase(),
    caption: (post.caption ?? '').split('\n')[0].slice(0, 50),
    ...metrics,
    link: post.permalink,
  })
}

console.log(`@${profile.username} · ${profile.followers_count} seguidores · ${profile.media_count} posts`)
console.table(rows.map(({ link, ...row }) => row))
