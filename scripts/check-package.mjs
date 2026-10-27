// What an application gets when it installs ioiti-ui, checked end to end: the package packed as a
// release ships it, installed into a copy of the starter template (templates/app), the template
// built, and the result read. Run after `npm run build`.
//
//   npm run check:package [-- --keep]     (--keep leaves the temporary folder, and says where)
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { topLevelBlocks } from './golden-from.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const keep = process.argv.includes('--keep')
const failures = []

function check(ok, what) {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`)
  if (!ok) failures.push(what)
}

function run(command, args, cwd) {
  try {
    return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (error) {
    console.error(`${command} ${args.join(' ')} failed in ${cwd}:\n${error.stdout ?? ''}${error.stderr ?? ''}`)
    throw error
  }
}

function textUnder(folder) {
  return readdirSync(folder)
    .map((name) => join(folder, name))
    .map((path) => (statSync(path).isDirectory() ? textUnder(path) : readFileSync(path, 'utf8')))
    .join('\n')
}

// Classes written in the package's own files alone: the template never writes them, so finding
// them in its CSS proves that Tailwind read the package in node_modules (design.css's @source).
const PACKAGE_ONLY = [
  { name: 'w-[17rem]', css: '.w-\\[17rem\\]', file: 'src/components/ui/sidebar.tsx' },
  { name: 'text-[12.5px]', css: '.text-\\[12\\.5px\\]', file: 'src/components/ui/not-found.tsx' },
]

// The design itself, as the built CSS writes it: the light page and secondary text, the dark
// palette, the contrast fixes, a chart ramp, the global focus ring; the accents, a gradient one too,
// the glass material, and the motion.
const DESIGN = [
  ':root:not(.dark){--background:#fafafa;--muted-foreground:#676772}',
  '.dark{--bg:#111113;',
  '--text-muted:#63636b',
  '--chart-funnel-1:#1e40af',
  ':focus-visible:not([tabindex="-1"]){outline:2px solid var(--focus-ring);outline-offset:2px}',
  ':root[data-accent=violet]:not(.dark){--brand:#7c3aed;',
  ':root[data-accent=bloom]:not(.dark){--brand:#c2398b;',
  '.glass-float:is(:root[data-material=glass] *){background-color:var(--glass-float);',
  ':root[data-reduced-motion=always]{--animate-spin:none;',
  '::view-transition-new(.ioiti-page){',
  '.over-page:is(:root:active-view-transition:not([data-look-change]) *){view-transition-name:match-element;',
]

// The images the stylesheets name: the grains of the bloom accent.
const GRAINS = ['grain-white', 'grain-black']

const FILES = [
  'package.json',
  'README.md',
  'LICENSE',
  'THIRD-PARTY-NOTICES.md',
  'CHANGELOG.md',
  'dist/index.js',
  'dist/index.d.ts',
  'dist/styles/styles.css',
  'dist/styles/design.css',
  'dist/styles/tokens.css',
  'dist/styles/theme.css',
  'dist/styles/accents.css',
  'dist/styles/glass.css',
  'dist/styles/motion.css',
  ...GRAINS.map((grain) => `dist/styles/${grain}.png`),
  'dist/theme.js',
  'dist/vite/index.js',
  'dist/vite/index.d.ts',
  'dist/react-router/index.js',
  'dist/react-router/index.d.ts',
]

if (!existsSync(join(root, 'dist/index.js'))) {
  console.error('check:package: nothing built yet (npm run build)')
  process.exit(1)
}

const work = mkdtempSync(join(tmpdir(), 'ioiti-ui-check-'))
try {
  // What a release ships.
  const [pack] = JSON.parse(run('npm', ['pack', '--json', '--pack-destination', work], root))
  const shipped = pack.files.map((file) => file.path)
  for (const file of FILES) check(shipped.includes(file), `the package ships ${file}`)
  const stray = shipped.filter((file) => /^(src|gallery|templates|scripts|test|docs)\//.test(file) || /\.map$|\.test\./.test(file))
  check(stray.length === 0, `no source, test, gallery, template or source map is shipped${stray.length ? `: ${stray.join(', ')}` : ''}`)
  console.log(`     ${pack.filename}: ${shipped.length} files, ${Math.round(pack.size / 1024)} kB packed`)

  // Installed into the starter template, which is built.
  const app = join(work, 'app')
  cpSync(join(root, 'templates/app'), app, {
    recursive: true,
    filter: (source) => !/[/\\](node_modules|dist)([/\\]|$)/.test(source),
  })
  const manifestPath = join(app, 'package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  manifest.dependencies['ioiti-ui'] = `file:${join(work, pack.filename)}`
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  run('npm', ['install', '--no-audit', '--no-fund'], app)
  run('npm', ['run', 'build'], app)
  check(true, 'the template installs the packed package and builds')

  const dist = join(app, 'dist')
  const assets = readdirSync(join(dist, 'assets'))
  const read = (suffix) => assets.filter((name) => name.endsWith(suffix)).map((name) => readFileSync(join(dist, 'assets', name), 'utf8')).join('\n')
  const css = read('.css')
  const js = read('.js')

  for (const snippet of DESIGN) check(css.includes(snippet), `the CSS has ${snippet}`)

  const templateSource = textUnder(join(root, 'templates/app/src'))
  for (const { name, css: written, file } of PACKAGE_ONLY) {
    check(readFileSync(join(root, file), 'utf8').includes(name), `${file} writes ${name}`)
    check(!templateSource.includes(name), `the template itself does not write ${name}`)
    check(css.includes(written), `the CSS has ${name}, written in the package alone: Tailwind read it in node_modules`)
  }

  const fonts = assets.filter((name) => name.endsWith('.woff2'))
  check(fonts.length === 11, `the 11 font files are written as files (${fonts.length})`)
  for (const grain of GRAINS) {
    const file = assets.find((name) => name.startsWith(`${grain}-`) && name.endsWith('.png'))
    const named = Boolean(file) && new RegExp(`url\\(["']?/assets/${file}["']?\\)`).test(css)
    check(named, `${grain}.png is written as a file, and the CSS names it there${file ? ` (${file})` : ''}`)
  }
  check(!/url\(\s*["']?data:/.test(css) && !`${css}${js}`.includes('data:font'), 'nothing is inlined as a data: URI (font-src and img-src stay at self)')

  const html = readFileSync(join(dist, 'index.html'), 'utf8')
  const key = readFileSync(join(root, 'templates/app/vite.config.ts'), 'utf8').match(/themeStorageKey:\s*'([^']+)'/)?.[1]
  const themeTag = html.indexOf(`<script src="/ioiti-theme.js" data-storage-key="${key}"></script>`)
  const moduleTag = html.indexOf('<script type="module"')
  check(Boolean(key) && themeTag >= 0 && themeTag < moduleTag, `the theme script comes first in <head>, with the template's key (${key})`)
  check(
    readFileSync(join(dist, 'ioiti-theme.js'), 'utf8') === readFileSync(join(root, 'src/theme.js'), 'utf8'),
    'the theme script written beside the pages is the package\'s',
  )
  check([...html.matchAll(/<script\b[^>]*>/g)].every(([tag]) => /\bsrc=/.test(tag)), 'no inline script (script-src stays at self)')

  // The design as the interface it was taken from built it, block by block: the tokens of both
  // themes, the base layer, the focus ring, the fonts (test/golden, from scripts/golden-from.mjs).
  const golden = JSON.parse(readFileSync(join(root, 'test/golden/reference-blocks.json'), 'utf8'))
  const built = topLevelBlocks(css).map((block) => block.text)
  const differing = golden.blocks.filter((block) => !built.includes(block))
  for (const block of differing.slice(0, 3)) {
    const selector = block.slice(0, block.indexOf('{'))
    const near = built.find((text) => text.startsWith(`${selector}{`)) ?? ''
    let at = 0
    while (at < block.length && block[at] === near[at]) at += 1
    console.log(`     ${selector}: the reference has "${block.slice(at, at + 60)}", the build "${near.slice(at, at + 60)}"`)
  }
  check(differing.length === 0, `the CSS has the ${golden.blocks.length} blocks of the reference design, as they are (${golden.source})`)

  run('node', ['--input-type=module', '-e', "await import('ioiti-ui'); await import('ioiti-ui/react-router'); await import('ioiti-ui/vite')"], app)
  check(true, 'Node imports ioiti-ui, ioiti-ui/react-router and ioiti-ui/vite')
} catch (error) {
  failures.push(String(error.message ?? error).split('\n')[0])
} finally {
  if (keep) console.log(`\nKept: ${work}`)
  else rmSync(work, { recursive: true, force: true })
}

if (failures.length) {
  console.error(`\ncheck:package: ${failures.length} failed`)
  process.exit(1)
}
console.log('\ncheck:package: an application gets the whole design')
