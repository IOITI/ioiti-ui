// Renders each card of design-system/out as the artifact's page does (tokens.css from tokens.json, the fonts,
// bundle.css, React, the bundle, data-theme on <html>), in both themes, and reports errors and empty cards.
// Screenshots go to design-system/out/check/. Needs Playwright and its Chromium (not a dependency of the package).
//
//   node design-system/check.mjs [Card…] [--theme=light|dark] [--accent=violet|indigo|blue|bloom] [--material=glass]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DS = dirname(fileURLToPath(import.meta.url))
const P = join(DS, 'out/project')
const H = join(DS, 'out/check')
let chromium
try {
  ;({ chromium } = createRequire(join(DS, '../package.json'))('playwright'))
} catch {
  console.error('Playwright is not installed here: npx playwright install chromium, with playwright installed, or check the page itself.')
  process.exit(1)
}
mkdirSync(H, { recursive: true })
const args = process.argv.slice(2)
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')))
const only = args.filter((a) => !a.startsWith('--'))
const cards = [...JSON.parse(readFileSync(join(DS, 'cards.json'), 'utf8')), { name: 'Cover', height: 288, static: true }]

// tokens.css as the page writes it from tokens.json.
const tokens = JSON.parse(readFileSync(join(P, 'tokens.json'), 'utf8'))
const themes = tokens.color.themes.map((t) => t.id)
const value = (x) => (typeof x === 'string' && /^\{.*\}$/.test(x) ? `var(--${x.slice(1, -1)})` : x)
let css = ''
for (const theme of themes) {
  const lines = []
  for (const t of [...tokens.color.tokens, ...tokens.shadow.tokens]) {
    const v = typeof t.value === 'string' ? (theme === themes[0] ? t.value : null) : (t.value[theme] ?? null)
    if (v != null) lines.push(`  --${t.name}: ${value(v)};`)
  }
  css += `${theme === themes[0] ? `:root, [data-theme="${theme}"]` : `[data-theme="${theme}"]`} {\n${lines.join('\n')}\n}\n`
}
const rest = ['spacing', 'radius', 'tracking'].flatMap((f) => tokens[f].tokens.map((t) => `  --${t.name}: ${t.value};`))
for (const [key, stack] of Object.entries(tokens.type.families)) rest.push(`  --font-${key}: ${stack};`)
css += `:root {\n${rest.join('\n')}\n}\n`
for (const f of tokens.type.fonts) css += `@font-face { font-family: "${f.family}"; src: url("${join(P, f.file)}") format("woff2"); font-weight: ${f.weight}; font-style: ${f.style}; }\n`
writeFileSync(join(H, 'tokens.css'), css)

const browser = await chromium.launch()
let failed = 0
for (const card of cards) {
  if (only.length && !only.includes(card.name)) continue
  const source = readFileSync(join(P, 'components', card.name, 'preview.html'), 'utf8')
  const body = source.slice(source.indexOf('<body>') + 6, source.lastIndexOf('</body>'))
  for (const theme of flags.theme ? [flags.theme] : themes) {
    const attrs = [`data-theme="${theme}"`, flags.accent && `data-accent="${flags.accent}"`, flags.material && `data-material="${flags.material}"`].filter(Boolean)
    const file = join(H, `${card.name}.${theme}.html`)
    writeFileSync(
      file,
      `<!doctype html><html ${attrs.join(' ')}><head><meta charset="utf-8"><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="../project/components/bundle.css">` +
        `<script src="../project/components/lib/react.js"></script><script src="../project/components/lib/react-dom.js"></script><script src="../project/components/bundle.js"></script></head><body>${body}</body></html>`,
    )
    const page = await browser.newPage({ viewport: { width: 960, height: card.height } })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && !/_blob|ERR_FILE_NOT_FOUND/.test(m.text()) && errors.push(m.text()))
    await page.goto('file://' + file)
    await page.waitForTimeout(800)
    const { nodes, height } = await page.evaluate(() => {
      const root = document.getElementById('root')
      return { nodes: root?.querySelectorAll('*').length ?? 0, height: Math.round(root?.getBoundingClientRect().height ?? 0) }
    })
    await page.screenshot({ path: join(H, `${card.name}.${theme}.png`), fullPage: true })
    const state = errors.length ? 'ERR' : !card.static && nodes < 3 ? 'EMPTY' : 'ok'
    if (state !== 'ok') failed++
    console.log(`${state.padEnd(5)} ${card.name.padEnd(20)} ${theme.padEnd(5)} ${card.static ? '' : `height ${height} (card ${card.height})`} ${errors.slice(0, 2).join(' | ').slice(0, 240)}`)
    await page.close()
  }
}
await browser.close()
process.exit(failed ? 1 : 0)
