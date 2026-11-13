// Builds the IOITI Design System (a claude.ai Design System artifact) from this repository, into
// design-system/out/project/: the files the artifact holds. design-system/README.md says how to publish them.
//
//   node design-system/build.mjs
//
// The values come from the stylesheets of src/styles, read anew at every build: a token changed in a release
// changes here. The words around them (each token's note, the guide, the components' guidelines and previews)
// are design-system/'s own files. A token the stylesheets add or remove stops the build until config.json
// says what it is for.
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const DS = dirname(fileURLToPath(import.meta.url))
const ROOT = join(DS, '..')
const OUT = join(DS, 'out')
const P = join(OUT, 'project')
const STYLES = join(ROOT, 'src/styles')
const require = createRequire(join(ROOT, 'package.json'))
const { build: rolldown } = await import(require.resolve('rolldown'))
const { compile } = await import(require.resolve('@tailwindcss/node'))
const { Scanner } = await import(require.resolve('@tailwindcss/oxide'))

const config = JSON.parse(readFileSync(join(DS, 'config.json'), 'utf8'))
const cards = JSON.parse(readFileSync(join(DS, 'cards.json'), 'utf8'))
const read = (path) => readFileSync(path, 'utf8')
const write = (path, text) => {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text)
}

rmSync(OUT, { recursive: true, force: true })
mkdirSync(P, { recursive: true })

// ── Reading the stylesheets ───────────────────────────────────────────────────────────────────────────

/** A stylesheet's top-level statements (`@import …;`) and blocks (`selector { body }`), comments removed. */
function topLevel(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const out = []
  let depth = 0
  let start = 0
  let open = -1
  let quote = null
  for (let at = 0; at < css.length; at++) {
    const ch = css[at]
    if (quote) {
      if (ch === quote) quote = null
      continue
    }
    if (ch === '"' || ch === "'") quote = ch
    else if (ch === '{') {
      if (depth++ === 0) open = at
    } else if (ch === '}') {
      if (--depth === 0) {
        out.push({ selector: css.slice(start, open).trim(), body: css.slice(open + 1, at) })
        start = at + 1
      }
    } else if (ch === ';' && depth === 0) {
      out.push({ statement: css.slice(start, at + 1).trim() })
      start = at + 1
    }
  }
  return out
}

/** A block's custom properties, in order; none when it holds nested rules. */
function declarations(body) {
  if (body.includes('{')) return []
  return body
    .split(';')
    .map((each) => each.trim())
    .filter((each) => each.startsWith('--'))
    .map((each) => {
      const colon = each.indexOf(':')
      return [each.slice(0, colon).trim(), each.slice(colon + 1).trim().replace(/\s+/g, ' ')]
    })
}

const emit = (block) => ('statement' in block ? block.statement : `${block.selector} {${block.body}}`)
const emitVars = (selector, vars) => (vars.length ? `${selector} {\n${vars.map(([n, v]) => `  ${n}: ${v};`).join('\n')}\n}` : '')

const COLOR = /^(#[0-9a-f]{3,8}|(rgba?|hsla?|oklch|oklab|lab|lch)\([^()]*\))$/i

/** A colour as the token format reads it: hex in lower case, rgb() with commas, an alpha as a number. */
function colour(value) {
  if (!value || !COLOR.test(value)) return null
  if (value.startsWith('#')) return value.toLowerCase()
  const rgb = /^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/i.exec(value)
  if (rgb) {
    const alpha = rgb[4] === undefined ? null : rgb[4].endsWith('%') ? String(parseFloat(rgb[4]) / 100) : rgb[4]
    return alpha === null ? `rgb(${rgb[1]}, ${rgb[2]}, ${rgb[3]})` : `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})`
  }
  return value.replace(/\/\s*([\d.]+)%/, (_, n) => `/ ${parseFloat(n) / 100}`)
}

/** A shadow's colours, written as colour() writes them. */
const shadowColours = (value) => value?.replace(/rgba?\([^()]*\)/g, (each) => colour(each) ?? each)

// The design's own values: tokens.css, theme.css and design.css's palettes, each theme as the cascade
// resolves it (`:root` in both themes, `.dark` in dark, `:root:not(.dark)` in light; the last one wins).
const BASE_FILES = ['tokens.css', 'theme.css', 'design.css']
const PALETTE = { ':root': ['light', 'dark'], '.dark': ['dark'], ':root:not(.dark)': ['light'] }
const base = { light: new Map(), dark: new Map() }
for (const file of BASE_FILES) {
  for (const block of topLevel(read(join(STYLES, file)))) {
    for (const theme of PALETTE[block.selector] ?? []) for (const [name, value] of declarations(block.body)) base[theme].set(name, value)
  }
}
const themeInline = new Map(declarations(topLevel(read(join(STYLES, 'design.css'))).find((b) => b.selector === '@theme inline').body))

const values = new Map() // token name → { family, light, dark }
const unknown = []
for (const name of new Set([...base.light.keys(), ...base.dark.keys()])) {
  const light = base.light.get(name)
  const dark = base.dark.get(name)
  const token = name.slice(2)
  if (name.startsWith('--font-') || (name.startsWith('--radius-') && name !== '--radius-full')) continue // families and radii: below
  if (name === '--radius' || name === '--radius-full') values.set(token, { family: 'radius', light })
  else if (name.startsWith('--tracking-')) values.set(token, { family: 'tracking', light })
  else if (name.includes('shadow')) values.set(token, { family: 'shadow', light: shadowColours(light), dark: shadowColours(dark) })
  else if (colour(light) || colour(dark)) values.set(token, { family: 'color', light: colour(light), dark: colour(dark) })
  else unknown.push(`${name}: ${light ?? dark}`)
}

// The radii the classes compute from --radius (design.css's @theme inline), in pixels.
const radiusPx = parseFloat(base.light.get('--radius')) * (base.light.get('--radius').endsWith('rem') ? 16 : 1)
for (const [name, value] of themeInline) {
  const scale = /^--radius-(\w+)$/.exec(name)
  if (!scale) continue
  const factor = value === 'var(--radius)' ? 1 : Number(/calc\(var\(--radius\) \* ([\d.]+)\)/.exec(value)?.[1])
  if (!factor) unknown.push(`${name}: ${value}`)
  else values.set(`radius-${scale[1]}`, { family: 'radius', light: `${Math.round(radiusPx * factor * 100) / 100}px` })
}

// The accents (accents.css): a preset's values become tokens of their own (`violet-brand`…), which the
// bundle's stylesheet maps onto the brand tokens under [data-accent].
const ACCENT = /^:root\[data-accent="([\w-]+)"\](:not\(\.dark\)|\.dark)?$/
const accents = new Map() // preset → { light: Map, dark: Map }
const accentHead = []
for (const block of topLevel(read(join(STYLES, 'accents.css')))) {
  const match = ACCENT.exec(block.selector ?? '')
  if (!match) {
    accentHead.push(block)
    continue
  }
  const preset = accents.get(match[1]) ?? { light: new Map(), dark: new Map() }
  accents.set(match[1], preset)
  for (const [name, value] of declarations(block.body)) {
    if (match[2] !== '.dark') preset.light.set(name, value)
    if (match[2] !== ':not(.dark)') preset.dark.set(name, value)
  }
}
const accentCss = [...accentHead.map(emit)]
for (const [preset, { light, dark }] of accents) {
  const shared = []
  const perTheme = { light: [], dark: [] }
  for (const name of new Set([...light.keys(), ...dark.keys()])) {
    const l = light.get(name)
    const d = dark.get(name)
    const kept = /^--(brand(-[\w-]+)?|chart-series|chart-funnel-\d+)$/.test(name) && !['--brand-grain', '--brand-fill', '--brand-gradient'].includes(name)
    if (kept) {
      const token = `${preset}-${name.slice(2)}`
      const alias = (v) => (v === 'var(--brand)' ? `{${preset}-brand}` : colour(v))
      values.set(token, { family: 'color', light: alias(l), dark: alias(d) })
      shared.push([name, `var(--${token})`])
    } else if (name === '--brand-gradient') {
      // A gradient: its stops become tokens, its angle and positions stay here.
      const parts = (v) => /^linear-gradient\((.*)\)$/.exec(v)[1].split(/,\s*/)
      const [angle, ...stops] = parts(l)
      const darkStops = parts(d).slice(1)
      const mapped = stops.map((stop, i) => {
        const [c, position] = stop.split(/\s+/)
        values.set(`${preset}-gradient-${i + 1}`, { family: 'color', light: colour(c), dark: colour(darkStops[i].split(/\s+/)[0]) })
        return `var(--${preset}-gradient-${i + 1})${position ? ' ' + position : ''}`
      })
      shared.push([name, `linear-gradient(${angle}, ${mapped.join(', ')})`])
    } else if (l === d) shared.push([name, l])
    else {
      // A grain: the artifact's upload of the file the stylesheet names.
      const asBlob = (v) =>
        v?.replace(/url\("\.\/([\w.-]+)"\)/g, (_, file) => `url("/_blob/${config.assetGroups.Textures.files[file].blob}")`)
      if (l !== undefined) perTheme.light.push([name, asBlob(l)])
      if (d !== undefined) perTheme.dark.push([name, asBlob(d)])
    }
  }
  accentCss.push(emitVars(`:root[data-accent="${preset}"]`, shared))
  accentCss.push(emitVars(`:root[data-accent="${preset}"]:not(.dark)`, perTheme.light))
  accentCss.push(emitVars(`:root[data-accent="${preset}"].dark`, perTheme.dark))
}

// The glass material (glass.css): its colours are tokens under their own names; what it sets again of the
// design's tokens becomes glass-<name>, mapped back here. What holds a var() or a composite stays.
const GLASS = /^:root\[data-material="glass"\](:not\(\.dark\)|\.dark)?$/
const glassBlocks = topLevel(read(join(STYLES, 'glass.css')))
const glass = { light: new Map(), dark: new Map() }
for (const block of glassBlocks) {
  const match = GLASS.exec(block.selector ?? '')
  if (!match) continue
  for (const [name, value] of declarations(block.body)) {
    if (match[1] !== '.dark') glass.light.set(name, value)
    if (match[1] !== ':not(.dark)') glass.dark.set(name, value)
  }
}
const glassVars = { '': [], ':not(.dark)': [], '.dark': [] }
for (const name of new Set([...glass.light.keys(), ...glass.dark.keys()])) {
  const l = glass.light.get(name)
  const d = glass.dark.get(name)
  const own = name.startsWith('--glass-')
  const token = own ? name.slice(2) : `glass-${name.slice(2)}`
  const isShadow = name.includes('shadow') && !own
  const isColour = colour(l) || colour(d)
  if (isShadow || (isColour && !(l ?? d).includes('var('))) {
    const onlyLight = d === undefined || (d === base.dark.get(name) && !own)
    values.set(token, isShadow ? { family: 'shadow', light: shadowColours(l), dark: shadowColours(d) } : { family: 'color', light: colour(l), dark: onlyLight ? undefined : colour(d) })
    if (!own) glassVars[onlyLight ? ':not(.dark)' : ''].push([name, `var(--${token})`])
  } else if (l === d) glassVars[''].push([name, l])
  else {
    if (l !== undefined) glassVars[':not(.dark)'].push([name, l])
    if (d !== undefined) glassVars['.dark'].push([name, d])
  }
}
const glassCss = glassBlocks.map((block) => {
  const match = GLASS.exec(block.selector ?? '')
  return match ? emitVars(block.selector, glassVars[match[1] ?? '']) : emit(block)
})

// ── tokens.json ───────────────────────────────────────────────────────────────────────────────────────

const notes = config.notes
const missingNotes = [...values.keys()].filter((name) => !(name in notes))
const gone = Object.keys(notes).filter((name) => !values.has(name))
if (unknown.length || missingNotes.length || gone.length) {
  if (unknown.length) console.error('Values of a kind the build does not place:\n  ' + unknown.join('\n  '))
  if (missingNotes.length) console.error('New tokens, with no note in config.json "notes" (say where each is used):\n  ' + missingNotes.join('\n  '))
  if (gone.length) console.error('Tokens the stylesheets no longer define (remove their notes from config.json once that is meant):\n  ' + gone.join('\n  '))
  process.exit(1)
}
const entry = (name) => {
  const { light, dark } = values.get(name)
  const value = dark === undefined || dark === null || dark === light ? light : { light, dark }
  return { name, value, usage: notes[name] }
}
const family = (f) => Object.keys(notes).filter((name) => values.get(name).family === f).map(entry)
const fontStack = (name) => themeInline.get(name).replace(/'/g, '"')
const sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim()
const version = JSON.parse(read(join(ROOT, 'package.json'))).version
const tokens = {
  name: config.title,
  version: 1,
  color: { themes: [{ id: 'light', name: 'Light' }, { id: 'dark', name: 'Dark' }], tokens: family('color') },
  type: {
    fonts: config.fonts.map(({ family: f, file, weight, style }) => ({ family: f, file, weight, style })),
    families: { sans: fontStack('--font-sans'), mono: fontStack('--font-mono') },
    groups: config.typeGroups,
  },
  spacing: { tokens: config.spacing },
  radius: { note: config.familyNotes.radius, tokens: family('radius') },
  shadow: { note: config.familyNotes.shadow, tokens: family('shadow') },
  tracking: { note: config.familyNotes.tracking, tokens: family('tracking') },
  meta: {
    source: 'github',
    repo: 'IOITI/ioiti-ui',
    ref: `v${version}@${sha}`,
    paths: { tokens: [...BASE_FILES, 'accents.css', 'glass.css'].map((f) => `src/styles/${f}`), docs: ['design-system/'] },
    synced: new Date().toISOString().slice(0, 10),
  },
}
write(join(P, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n')

// ── components/bundle.css ─────────────────────────────────────────────────────────────────────────────

// The design's stylesheets with the values of tokens.json taken out (tokens.css, which the artifact
// writes from tokens.json, declares them), compiled by Tailwind over the components and the previews.
const COPY = join(OUT, 'styles')
const tokenVar = (name) => values.has(name.slice(2)) || name.startsWith('--font-') || name.startsWith('--radius')
const withoutValues = (file) =>
  topLevel(read(join(STYLES, file)))
    .map((block) => {
      if (!(block.selector in PALETTE)) return emit(block)
      return emitVars(block.selector, declarations(block.body).filter(([name]) => !tokenVar(name)))
    })
    .filter(Boolean)
    .join('\n\n')
write(join(COPY, 'tokens.css'), withoutValues('tokens.css'))
write(join(COPY, 'theme.css'), withoutValues('theme.css'))
write(join(COPY, 'accents.css'), accentCss.filter(Boolean).join('\n\n'))
write(join(COPY, 'glass.css'), glassCss.filter(Boolean).join('\n\n'))
write(join(COPY, 'motion.css'), read(join(STYLES, 'motion.css')))
write(join(COPY, 'styles.css'), read(join(STYLES, 'styles.css')))
const previewsOut = relative(COPY, join(P, 'components'))
write(
  join(COPY, 'design.css'),
  withoutValues('design.css')
    .replace(/@import "@fontsource[^"]*";\n?/g, '')
    .replace('@source "../";', `@source "${relative(COPY, join(ROOT, 'src'))}";\n@source "${previewsOut}/**/*.html";`)
    .replace('@source not "../vite";', `@source not "${relative(COPY, join(ROOT, 'src/vite'))}";\n@source not "${relative(COPY, join(ROOT, 'src/code'))}";`)
    .replace('@source not "../**/*.d.ts";', `@source not "${relative(COPY, join(ROOT, 'src'))}/**/*.d.ts";`),
)

// ── Scripts: React, the library, the previews ─────────────────────────────────────────────────────────

// A package the page loads as a script (React, React DOM, the library itself) is read from its global.
const GLOBALS = { 'ioiti-ui': config.namespace, react: 'React', 'react-dom': 'ReactDOM', 'react-dom/client': 'ReactDOM' }
const safe = (code) => code.replaceAll('</script', '<\\/script').replaceAll('<!--', '<\\!--')
const VIRTUAL = '\0entry'
async function bundle({ entry, contents, globals = [], name, minify = true, jsx = 'automatic' }) {
  const result = await rolldown({
    input: entry ?? VIRTUAL,
    cwd: ROOT,
    write: false,
    platform: 'browser',
    resolve: { extensionAlias: { '.js': ['.ts', '.tsx', '.js'] } },
    transform: {
      define: { 'process.env.NODE_ENV': '"production"' },
      jsx: jsx === 'classic' ? { runtime: 'classic', pragma: 'React.createElement', pragmaFrag: 'React.Fragment' } : { runtime: 'automatic' },
    },
    plugins: [
      {
        name: 'entry-and-globals',
        resolveId: (id) => (id === VIRTUAL ? id : globals.includes(id) ? `\0global:${id}` : null),
        load: (id) => (id === VIRTUAL ? contents : id.startsWith('\0global:') ? `module.exports = window.${GLOBALS[id.slice(8)]}` : null),
      },
    ],
    logLevel: 'warn',
    // "use client" in lucide-react and framer-motion: a server component's word, nothing to keep in a script.
    onwarn: (warning, warn) => warning.code === 'MODULE_LEVEL_DIRECTIVE' || warn(warning),
    output: { format: 'iife', name, minify },
  })
  return safe(result.output[0].code)
}

const reactVersion = JSON.parse(read(require.resolve('react/package.json'))).version
write(join(P, 'components/lib/react.js'), `/* React ${reactVersion} (MIT), production, as window.React */\n` + (await bundle({ contents: "window.React = require('react')" })))
write(
  join(P, 'components/lib/react-dom.js'),
  `/* React DOM ${reactVersion} (MIT), production, react-dom and react-dom/client as window.ReactDOM */\n` +
    (await bundle({ contents: "window.ReactDOM = Object.assign({}, require('react-dom'), require('react-dom/client'))", globals: ['react'] })),
)
const library = await bundle({
  contents: `// The previews' frame says its theme with data-theme on <html>; the dark: classes and dark blocks read .dark.
const root = document.documentElement
const sync = () => root.classList.toggle('dark', root.getAttribute('data-theme') === 'dark')
sync()
new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] })
export * from ${JSON.stringify(join(ROOT, 'src/index.ts'))}`,
  globals: ['react', 'react-dom', 'react-dom/client'],
  name: config.namespace,
})
const header = { format: 4, namespace: config.namespace, components: cards.map(({ name }) => ({ name })) }
write(join(P, 'components/bundle.js'), `/* @ds-bundle: ${JSON.stringify(header)} */\n${library}`)

for (const card of cards) {
  const script = await bundle({
    entry: join(DS, 'previews', `${card.name}.tsx`),
    globals: ['ioiti-ui', 'react', 'react-dom/client'],
    minify: false,
    jsx: 'classic',
  })
  const marker = [`group="${card.group}"`, `height=${card.height}`].join(' ')
  write(
    join(P, 'components', card.name, 'preview.html'),
    `<!-- @dsCard ${marker} -->\n<!doctype html>\n<html>\n<head><meta charset="utf-8"><title>${card.name} — preview</title></head>\n<body>\n<div id="root"></div>\n<script>\n${script.trim()}\n</script>\n</body>\n</html>\n`,
  )
  copyFileSync(join(DS, 'components', card.name, 'README.md'), join(P, 'components', card.name, 'README.md'))
}
write(join(P, 'components/Cover/preview.html'), read(join(DS, 'cover.html')))

// The stylesheet, now that the previews' classes are on disk.
const entryCss = read(join(COPY, 'styles.css'))
const compiler = await compile(entryCss, { base: COPY, onDependency: () => {} })
const scanner = new Scanner({ sources: compiler.sources })
let css = compiler.build(scanner.scan())
const SANS = /font-family: 'Geist Variable', [^;]*;/g
const MONO = /font-family: 'JetBrains Mono Variable', [^;]*;/g
css = css.replace(/@font-face\s*\{[^}]*\}\s*/g, '').replace(SANS, 'font-family: var(--font-sans);').replace(MONO, 'font-family: var(--font-mono);')
if (/<\/style/i.test(css)) throw new Error('bundle.css holds </style')
write(
  join(P, 'components/bundle.css'),
  `/* ioiti-ui ${version}'s stylesheet for the ${config.title}: Tailwind CSS compiled over the components, with the
   values of tokens.json taken out (tokens.css declares them). The accents and the glass material map their
   tokens here: data-accent="${[...accents.keys()].join('|')}" and data-material="glass" on <html> turn them on. */\n` + css,
)

// ── Types, fonts, the guide, the assets ───────────────────────────────────────────────────────────────

const DTS = join(OUT, 'dts')
execFileSync(join(ROOT, 'node_modules/.bin/tsc'), ['-p', 'tsconfig.lib.json', '--declaration', '--emitDeclarationOnly', '--outDir', DTS], { cwd: ROOT, stdio: 'inherit' })
const modules = [...new Set([...read(join(DTS, 'index.d.ts')).matchAll(/from '\.\/(.+?)\.js'/g)].map((m) => m[1]))]
let types = `// ${config.namespace} (window.${config.namespace}): the declarations of ioiti-ui ${version}'s public modules, one after another.
// Documentation: React, framer-motion and lucide-react types are referenced by name, not imported.
// The public names are src/index.ts's exports; a module's other exports are its own helpers.\n`
for (const module of modules) {
  const text = read(join(DTS, `${module}.d.ts`))
    .split('\n')
    .filter((line) => !/^import\s/.test(line) && !/^export (type )?\{[^}]*\} from /.test(line) && !/^export \{\};?$/.test(line))
    .join('\n')
    .trim()
  if (text) types += `\n// ── ${module}.tsx\n${text}\n`
}
write(join(P, 'components/index.d.ts'), types)

for (const font of config.fonts) {
  mkdirSync(join(P, 'fonts'), { recursive: true })
  copyFileSync(require.resolve(font.from), join(P, font.file))
}
const copyTree = (from, to) => {
  for (const name of readdirSync(from)) {
    const path = join(from, name)
    if (statSync(path).isDirectory()) copyTree(path, join(to, name))
    else {
      mkdirSync(to, { recursive: true })
      copyFileSync(path, join(to, name))
    }
  }
}
copyTree(join(DS, 'guide'), P)
// The assets are uploads of the artifact (config.json assetGroups); here for comparing, not sent as files.
for (const [path, source] of Object.entries(config.assetSources)) {
  mkdirSync(dirname(join(OUT, 'assets', path)), { recursive: true })
  copyFileSync(join(ROOT, source), join(OUT, 'assets', path))
}

// ── The index, and the list of files to publish ───────────────────────────────────────────────────────

const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z')
const index = {
  v: 3,
  layout: 'files',
  createdOnFiles: config.createdOnFiles,
  title: config.title,
  namespace: config.namespace,
  libraries: [
    { name: 'react', version: reactVersion, global: 'React', file: 'components/lib/react.js' },
    { name: 'react-dom', version: reactVersion, global: 'ReactDOM', file: 'components/lib/react-dom.js' },
  ],
  sections: {},
  groups: config.groups,
  assetGroups: config.assetGroups,
  blobs: {},
  docs: { sections: [] },
  lastChange: { by: 'Claude', at: now, via: `GitHub · IOITI/ioiti-ui@${sha}`, note: `Built from ioiti-ui ${version}: ${values.size} tokens, ${cards.length} components.` },
}
write(join(P, 'design-system.json'), JSON.stringify(index, null, 2) + '\n')

const files = {}
const list = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) list(path)
    else {
      const served = relative(OUT, path)
      if (served === 'project/design-system.json') continue
      // A .d.ts is not a served type by its name: it goes as text.
      files[served] = served.endsWith('.d.ts') ? { from: served, contentType: 'text/plain' } : served
    }
  }
}
list(P)
write(join(OUT, 'files.json'), JSON.stringify(files, null, 1) + '\n')
if (!existsSync(join(OUT, 'files.json'))) throw new Error('no files.json')
console.log(`${config.title}: ${values.size} tokens, ${cards.length} components, ${Object.keys(files).length + 1} files in ${relative(ROOT, P)}`)
