/**
 * What earns interaction in the niche: recent posts of reference accounts (content/instagram/referencias.json),
 * ranked by interaction relative to each account's followers. Read-only, Business Discovery API.
 * Only public likes and comments exist for other accounts (no reach, saves or shares).
 *   node scripts/instagram/references.mjs <our-username> [posts-per-account]
 */
import fs from 'fs'
import os from 'os'
import path from 'path'

const [username, perAccount = '25'] = process.argv.slice(2)
if (!username) throw new Error('Usage: node scripts/instagram/references.mjs <our-username> [posts-per-account]')
const accounts = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/instagram/accounts.json'), 'utf8'))
const me = accounts[username]
if (!me) throw new Error(`No token for ${username}`)
const { accounts: refs } = JSON.parse(fs.readFileSync('content/instagram/referencias.json', 'utf8'))

async function discover(handle) {
  const fields = `business_discovery.username(${handle}){username,followers_count,media_count,media.limit(${perAccount}){caption,like_count,comments_count,media_type,media_product_type,timestamp,permalink}}`
  const url = new URL(`https://graph.facebook.com/v23.0/${me.ig_id}`)
  url.searchParams.set('fields', fields)
  url.searchParams.set('access_token', me.token)
  const body = await (await fetch(url)).json()
  if (body.error) throw new Error(body.error.message)
  return body.business_discovery
}

const summary = []
const posts = []
for (const handle of refs) {
  try {
    const account = await discover(handle)
    const media = account.media?.data ?? []
    const rates = media.map((m) => ((m.like_count ?? 0) + (m.comments_count ?? 0)) / account.followers_count * 100)
    summary.push({
      account: account.username,
      followers: account.followers_count,
      posts: account.media_count,
      'avg interaction %': rates.length ? +(rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(2) : 0,
    })
    media.forEach((m, i) => posts.push({
      account: account.username,
      date: m.timestamp.slice(0, 10),
      type: m.media_product_type === 'REELS' ? 'reel' : m.media_type.toLowerCase(),
      'interaction %': +rates[i].toFixed(2),
      likes: m.like_count ?? '-',
      comments: m.comments_count ?? 0,
      caption: (m.caption ?? '').replace(/\s+/g, ' ').slice(0, 60),
      link: m.permalink,
    }))
  } catch (error) {
    summary.push({ account: handle, error: error.message.includes('Invalid user id') ? 'not a professional account, or wrong username' : error.message })
  }
}

console.log('Accounts')
console.table(summary)
console.log('Top posts by interaction relative to followers')
console.table(posts.sort((a, b) => b['interaction %'] - a['interaction %']).slice(0, 15).map(({ link, ...p }) => p))
const byType = {}
for (const p of posts) (byType[p.type] ??= []).push(p['interaction %'])
console.log('Average interaction % by format')
console.table(Object.fromEntries(Object.entries(byType).map(([t, r]) => [t, { posts: r.length, 'avg %': +(r.reduce((a, b) => a + b, 0) / r.length).toFixed(2) }])))
if (process.argv.includes('--links')) posts.slice(0, 15).forEach((p) => console.log(p.link))
