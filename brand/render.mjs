// Renders Bleu GitHub brand assets: social previews (1280x640 @2x) + repo banner.
// Brand system: jose-brain/bleu-brain/document-system (tokens.css, application-rules.md)
import { chromium } from '/Users/joseribeiro/new-bleu-website/node_modules/@playwright/test/index.mjs'
import { readFileSync, writeFileSync } from 'node:fs'

const ASSETS = '/Users/joseribeiro/jose-brain/bleu-brain/document-system/assets'
const OUT = new URL('./out/', import.meta.url).pathname
const wordmark = readFileSync(`${ASSETS}/bleu-wordmark-light.svg`, 'utf8')
const fin = readFileSync(`${ASSETS}/bleu-fin.svg`, 'utf8')

// grain per application rules: "all gradients carry grain"
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>`
)}")`

const css = `
@font-face { font-family: Erode; src: url('file://${ASSETS}/fonts/Erode-Light.otf'); font-weight: 300; }
@font-face { font-family: Erode; src: url('file://${ASSETS}/fonts/Erode-Regular.otf'); font-weight: 400; }
@font-face { font-family: 'Geist Mono'; src: url('file://${ASSETS}/fonts/GeistMono-VariableFont_wght.ttf'); }
* { margin: 0; box-sizing: border-box; }
body { width: 1280px; height: 640px; background: #0A0D18; overflow: hidden; position: relative;
  font-family: Erode, serif; color: #F2F4F1; }
.ground { position: absolute; inset: 0;
  background: radial-gradient(1100px 700px at 88% 112%, rgba(32,197,217,.34), transparent 62%),
              radial-gradient(900px 600px at -8% -20%, rgba(29,135,175,.22), transparent 60%),
              linear-gradient(160deg, #0F1321 0%, #0A0D18 55%, #050C1A 100%); }
.grain { position: absolute; inset: 0; background-image: ${GRAIN}; mix-blend-mode: overlay; }
.card { position: absolute; inset: 0; padding: 72px 80px; display: flex; flex-direction: column; }
.eyebrow { font-family: 'Geist Mono', monospace; font-size: 22px; letter-spacing: .14em;
  color: #20C5D9; text-transform: uppercase; }
.eyebrow .dim { color: #6C7DA4; }
h1 { font-weight: 300; font-size: 74px; line-height: 1.08; letter-spacing: -0.01em;
  margin-top: 40px; max-width: 940px; text-wrap: balance; }
h1 em { font-style: normal; color: #20C5D9; }
.foot { margin-top: auto; display: flex; align-items: flex-end; justify-content: space-between; }
.foot svg.mark { width: 214px; height: auto; display: block; }
.foot .url { font-family: 'Geist Mono', monospace; font-size: 21px; color: #6C7DA4; letter-spacing: .06em; }
.fin { position: absolute; right: -46px; top: 96px; color: #20C5D9; opacity: .16; }
.fin svg { width: 560px; height: auto; transform: rotate(-8deg); }
.rule { position: absolute; left: 80px; right: 80px; top: 148px; height: 1px; background: rgba(242,244,241,.14); }
/* banner variant */
body.banner { width: 1200px; height: 220px; }
body.banner .card { padding: 0 64px; flex-direction: row; align-items: center; gap: 48px; }
body.banner svg.mark { width: 168px; height: auto; display: block; flex: none; }
body.banner .copy { font-weight: 300; font-size: 30px; line-height: 1.3; color: #F2F4F1; }
body.banner .copy .mono { font-family: 'Geist Mono', monospace; font-size: 19px; color: #20C5D9;
  letter-spacing: .1em; display: block; margin-top: 10px; text-transform: uppercase; }
body.banner .fin { top: -18px; right: -30px; opacity: .14; }
body.banner .fin svg { width: 300px; }
`

const page$ = async (browser, html, w, h, file) => {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.screenshot({ path: `${OUT}${file}` })
  await page.close()
  console.log(file)
}

const social = (repo, headline) => `<style>${css}</style>
<div class="ground"></div><div class="grain"></div>
<div class="fin">${fin}</div>
<div class="card">
  <div class="eyebrow"><span class="dim">github.com/bleu /</span> ${repo}</div>
  <div class="rule"></div>
  <h1>${headline}</h1>
  <div class="foot">
    <svg class="mark" viewBox="0 0 744 141">${wordmark.replace(/<\/?svg[^>]*>/g, '')}</svg>
    <div class="url">bleu.builders</div>
  </div>
</div>`

const banner = `<style>${css}</style>
<body class="banner">
<div class="ground"></div><div class="grain"></div>
<div class="fin">${fin}</div>
<div class="card">
  <svg class="mark" viewBox="0 0 744 141">${wordmark.replace(/<\/?svg[^>]*>/g, '')}</svg>
  <div class="copy">Built and maintained by Bleu — we build products, modernize systems and put&nbsp;AI&nbsp;to&nbsp;work.
    <span class="mono">bleu.builders → bring us the problem</span></div>
</div></body>`

const CARDS = [
  ['scaffold-composable-cow', 'The scaffolding people <em>actually build on.</em> 125+ forks.'],
  ['cow-py', 'CoW Protocol’s Python SDK. Built from scratch, <em>upstreamed.</em>'],
  ['stellar-brl-corridor', 'A BRL/PIX corridor on Stellar. <em>Audited</em> Soroban primitives.'],
  ['cow-programmatic-orders-api', 'Programmatic orders on CoW Protocol, <em>live in production.</em>'],
  ['claude-boilerplate', 'Our starting point for putting <em>AI to work.</em>'],
  ['bleu', 'We build products, modernize systems and <em>put AI to work.</em>'],
]

const browser = await chromium.launch()
for (const [repo, head] of CARDS)
  await page$(browser, social(repo, head), 1280, 640, `social-${repo}.png`)
await page$(browser, banner, 1200, 220, 'banner-built-by-bleu.png')
await browser.close()
