/**
 * Renders Instagram images (feed 4:5 or stories 9:16) with the brand fonts, from a post spec.
 *
 * Run: node scripts/instagram/render.mjs <post.json>
 *
 * post.json:
 * {
 *   "out": "~/Downloads/visitpunta-instagram/01-presentacion",
 *   "format": "feed" | "story",
 *   "slides": [
 *     { "file": "fotos/casapueblo/X.jpg", "position": "35% 50%",
 *       "style": "cover" | "caption" | "card" | "sign" | "clean" | "story" | "highlight",
 *       "eyebrow": "Maldonado · Uruguay", "title": "Punta del Este", "text": "Guía curada.",
 *       "lines": ["Línea 1", "Línea 2"], "tint": "dark" | "paper" }
 *   ]
 * }
 * - cover: eyebrow + big title + italic line, bottom left (carousel covers, first post).
 * - label: one italic line at the bottom + small brand mark at the top.
 * - clean: the photo alone (most feed posts).
 * - story: 9:16, title + text in the middle third, leaving the top/bottom 250 px free for Instagram's UI
 *   and room for the link sticker under the text.
 * - highlight: highlight cover, no photo: navy background and one word centered (Instagram crops it to a circle).
 * - caption: the photo with one short line at the bottom, small, on a soft gradient. No boxes over photos.
 * - card: no photo. Navy background, a white title and at most one short pink line. Text lives here, not on photos.
 * - sign: the last slide of a carousel. Navy background, the pe avatar and the site address.
 * Photos are embedded as data URIs (the headless browser blocks file:// from a set page).
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import { chromium } from 'playwright-core'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const BROWSER = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell')
const SIZES = { feed: { width: 1080, height: 1350 }, story: { width: 1080, height: 1920 } }

const specPath = process.argv[2]
if (!specPath) throw new Error('Usage: node scripts/instagram/render.mjs <post.json>')
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const out = spec.out.replace(/^~/, os.homedir())
const size = SIZES[spec.format ?? 'feed']
fs.mkdirSync(out, { recursive: true })

const escapeHtml = (text = '') => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function dataUri(file) {
  const buffer = await sharp(path.resolve(ROOT, file)).rotate().resize({ width: 2200, height: 2200, fit: 'inside' }).jpeg({ quality: 90 }).toBuffer()
  return `data:image/jpeg;base64,${buffer.toString('base64')}`
}

const fonts =
  '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600&display=block" rel="stylesheet">'

// Brand tokens: navy #3D4B66 (brand), pink #FA9683 (accent), white
const css = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${size.width}px;height:${size.height}px;position:relative;overflow:hidden;background:#3d4b66;color:#ffffff}
  .photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .shade{position:absolute;inset:auto 0 0 0;height:55%;background:linear-gradient(to top,rgba(20,18,15,.72),rgba(20,18,15,0))}
  .veil{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(20,18,15,.15),rgba(20,18,15,.55) 45%,rgba(20,18,15,.55) 65%,rgba(20,18,15,.15))}
  .bottom{position:absolute;left:72px;right:72px;bottom:92px}
  .eyebrow{font-family:'Inter',sans-serif;font-weight:500;font-size:26px;letter-spacing:.22em;text-transform:uppercase;opacity:.9;margin-bottom:22px}
  .title{font-family:'Playfair Display',serif;font-size:112px;line-height:1.02;letter-spacing:-.01em}
  .italic{font-family:'Playfair Display',serif;font-style:italic;font-size:40px;line-height:1.3;margin-top:26px;opacity:.95}
  .label{font-family:'Playfair Display',serif;font-style:italic;font-size:58px;line-height:1.1}
  .mark{position:absolute;top:64px;left:72px;font-family:'Inter',sans-serif;font-weight:500;font-size:24px;letter-spacing:.04em;opacity:.85;text-shadow:0 1px 8px rgba(0,0,0,.35)}
  .story{position:absolute;left:84px;right:84px;top:640px}
  .story .title{font-size:96px}
  .story .italic{font-size:44px}
  .story .mark{position:static;display:block;margin-top:56px;font-size:26px}
  .highlight{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#3d4b66}
  .caption{position:absolute;left:72px;right:72px;bottom:80px;font-family:'Playfair Display',serif;font-style:italic;font-size:44px;line-height:1.25;text-shadow:0 1px 14px rgba(0,0,0,.25)}
  .soft{position:absolute;inset:auto 0 0 0;height:32%;background:linear-gradient(to top,rgba(20,18,15,.55),rgba(20,18,15,0))}
  .card{position:absolute;inset:0;background:#3d4b66;color:#ffffff;display:flex;flex-direction:column;justify-content:center;padding:0 110px}
  .card .title{font-size:92px;line-height:1.05}
  .card .italic{color:#fa9683;opacity:1;font-size:42px;margin-top:34px}
  .sign{position:absolute;inset:0;background:#3d4b66;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px}
  .sign img{width:220px;height:220px}
  .sign span{font-family:'Inter',sans-serif;font-weight:500;font-size:34px;letter-spacing:.06em;color:#ffffff}
  .highlight span{font-family:'Playfair Display',serif;font-size:132px;color:#ffffff;letter-spacing:-.01em}
`

function body(slide) {
  const eyebrow = slide.eyebrow ? `<div class="eyebrow">${escapeHtml(slide.eyebrow)}</div>` : ''
  const title = slide.title ? `<div class="title">${escapeHtml(slide.title)}</div>` : ''
  const italic = slide.text ? `<div class="italic">${escapeHtml(slide.text)}</div>` : ''
  switch (slide.style) {
    case 'cover':
      return `<div class="shade"></div><div class="bottom">${eyebrow}${title}${italic}</div>`
    case 'label':
      return `<div class="shade"></div><div class="bottom"><div class="label">${escapeHtml(slide.text)}</div></div><div class="mark">visitpunta</div>`
    case 'story':
      return `<div class="veil"></div><div class="story">${eyebrow}${title}${italic}<span class="mark">visitpunta.com</span></div>`
    case 'caption':
      return `<div class="soft"></div><div class="caption">${escapeHtml(slide.text)}</div>`
    case 'card':
      return `<div class="card">${title}${italic}</div>`
    case 'sign': {
      const avatar = fs.readFileSync(path.join(ROOT, 'public/brand/avatar.svg')).toString('base64')
      return `<div class="sign"><img src="data:image/svg+xml;base64,${avatar}"><span>visitpunta.com</span></div>`
    }
    case 'highlight':
      return `<div class="highlight"><span>${escapeHtml(slide.title)}</span></div>`
    default:
      return ''
  }
}

const browser = await chromium.launch({ executablePath: BROWSER })
const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1 })
for (const [index, slide] of spec.slides.entries()) {
  const html = `<!doctype html><html><head><meta charset="utf-8">${fonts}<style>${css} .photo{object-position:${slide.position ?? '50% 50%'}}</style></head>
    <body class="format-${spec.format ?? 'feed'}">${slide.file ? `<img class="photo" src="${await dataUri(slide.file)}">` : ''}${body(slide)}</body></html>`
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const name = `${String(index + 1).padStart(2, '0')}.jpg`
  await page.screenshot({ path: path.join(out, name), type: 'jpeg', quality: 92 })
  console.log(`✓ ${name}`)
}
await browser.close()
console.log(`→ ${out}`)
