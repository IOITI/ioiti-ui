// What an application gets when it installs ioiti-ui, checked end to end: the package packed as a
// release ships it, installed into a copy of the starter template (templates/app), the template's
// own lint and tests run, the template built, the result read, served by `vite preview` under its
// Content-Security-Policy and opened in Chromium, and what an application bundles weighed. Run after
// `npm run build`; Chromium is Playwright's (npx playwright install chromium).
//
//   npm run check:package [-- --keep] [-- --update-budget]
//
// --keep leaves the temporary folder, and says where; --update-budget writes what was weighed as the new
// budget (test/size-budget.json), after a change that weighs more on purpose.
import { execFileSync, spawn } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'

import { chromium } from '@playwright/test'
import { build } from 'vite'

import { topLevelBlocks } from './golden-from.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const keep = process.argv.includes('--keep')
const updateBudget = process.argv.includes('--update-budget')
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

/** A script of the template's own, as an application runs it: whether it passed, and what it said (colours taken out). */
function attempt(command, args, cwd) {
  const plain = (text) => String(text ?? '').replace(/\x1b\[[0-9;]*m/g, '')
  try {
    return { ok: true, output: plain(execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })) }
  } catch (error) {
    return { ok: false, output: plain(`${error.stdout ?? ''}${error.stderr ?? ''}`) }
  }
}

/** What a script said, under its line of the check. */
function indented(output) {
  return output
    .trim()
    .split('\n')
    .map((line) => `       ${line}`)
    .join('\n')
}

/** Whether this Node meets a range of `engines` as the tools write it (`^22.22.2 || ^24.15.0 || >=26.0.0`). */
function nodeMeets(range) {
  const [major, minor, patch] = process.versions.node.split('.').map(Number)
  return range.split('||').some((wanted) => {
    const [, operator, ...version] = wanted.trim().match(/^(\^|>=)(\d+)\.(\d+)\.(\d+)$/) ?? []
    // A range written otherwise is taken as met: the tests then say for themselves whether they run.
    if (!operator) return true
    const [a, b, c] = version.map(Number)
    const order = major - a || minor - b || patch - c
    return order >= 0 && (operator === '>=' || major === a)
  })
}

/** The policy a README recommends: the block of text under its Content-Security-Policy heading. */
function policyIn(file) {
  const section = readFileSync(join(root, file), 'utf8').split(/^## Content-Security-Policy$/m)[1] ?? ''
  return section.match(/^```text\n(.+)\n```$/m)?.[1]
}

/** The actions a workflow uses, and the commit (or tag) each is pinned to. */
function actionsIn(file) {
  return new Map([...readFileSync(join(root, file), 'utf8').matchAll(/^\s*-?\s*uses:\s*([^@\s]+)@(\S+)/gm)].map(([, action, ref]) => [action, ref]))
}

/** A port nothing listens on, for the server to take (`--strictPort`: one taken meanwhile is said, not replaced). */
function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

/**
 * The template's build served as `npm run preview` serves it (`vite preview`, its vite.config.ts read, its headers
 * sent), on a free port: its origin, and `stop`, which the caller runs whatever happens (and this process's exit does,
 * as a last resort).
 */
async function preview(app) {
  const port = await freePort()
  const vite = join(app, 'node_modules/vite/bin/vite.js')
  const server = spawn(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: app,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let said = ''
  server.stdout.on('data', (chunk) => (said += chunk))
  server.stderr.on('data', (chunk) => (said += chunk))
  const exited = new Promise((resolve) => server.once('exit', resolve))
  const kill = () => server.kill()
  process.once('exit', kill)
  const stop = async () => {
    process.off('exit', kill)
    if (server.exitCode !== null || server.signalCode !== null) return
    server.kill()
    const late = setTimeout(() => server.kill('SIGKILL'), 5000)
    await exited
    clearTimeout(late)
  }
  const origin = `http://127.0.0.1:${port}`
  for (const started = Date.now(); ; ) {
    if (server.exitCode !== null || server.signalCode !== null) {
      await stop()
      throw new Error(`vite preview stopped: ${said.trim()}`)
    }
    try {
      const response = await fetch(origin)
      await response.body?.cancel()
      if (response.ok) return { origin, stop }
    } catch {
      // Not listening yet.
    }
    if (Date.now() - started > 30_000) {
      await stop()
      throw new Error(`vite preview did not answer within 30 s: ${said.trim()}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
}

/**
 * Each address opened in Chromium as a person opens it (a page loaded whole, its policy held: no bypass), and what was
 * met there: the policy each page came with, the heading of the page drawn, what the policy refused
 * (`securitypolicyviolation`, heard from the first script on), what the console said wrong or was thrown, the requests
 * that failed, those to another origin.
 */
async function browse(origin, paths) {
  let browser
  try {
    browser = await chromium.launch()
  } catch (error) {
    throw new Error(`Chromium did not start (npx playwright install chromium): ${String(error.message ?? error).split('\n')[0]}`)
  }
  const drawn = []
  const policies = []
  const met = { refused: [], said: [], failed: [], foreign: [] }
  let at = ''
  const note = (list, what) => list.push([at, what])
  try {
    const context = await browser.newContext()
    await context.addInitScript(() => {
      window.refusedByPolicy = []
      document.addEventListener('securitypolicyviolation', (event) =>
        window.refusedByPolicy.push(`${event.effectiveDirective} refused ${event.blockedURI || 'inline'}`),
      )
    })
    const page = await context.newPage()
    page.on('console', (message) => {
      if (message.type() === 'error') note(met.said, message.text())
    })
    page.on('pageerror', (error) => note(met.said, error.message))
    page.on('requestfailed', (request) => note(met.failed, `${request.url()}: ${request.failure()?.errorText}`))
    page.on('response', (response) => {
      if (response.status() >= 400) note(met.failed, `${response.url()}: ${response.status()}`)
    })
    page.on('request', (request) => {
      const url = new URL(request.url())
      if (/^(?:https?|wss?):$/.test(url.protocol) && url.origin !== origin) note(met.foreign, request.url())
    })
    for (const path of paths) {
      at = path
      const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' })
      policies.push(response?.headers()['content-security-policy'] ?? 'none')
      const heading = page.getByRole('main').getByRole('heading', { level: 1 })
      try {
        await heading.waitFor({ timeout: 10_000 })
        drawn.push(await heading.textContent())
      } catch {
        drawn.push(`no heading at ${path}`)
      }
      for (const refused of await page.evaluate(() => window.refusedByPolicy)) note(met.refused, refused)
    }
  } finally {
    await browser.close()
  }
  // Each fault said once, with the addresses it was met at.
  const once = (list) => {
    const where = new Map()
    for (const [path, what] of list) where.set(what, [...new Set([...(where.get(what) ?? []), path])])
    return [...where].map(([what, paths]) => `${what} (${paths.join(', ')})`)
  }
  return { drawn, policies, refused: once(met.refused), said: once(met.said), failed: once(met.failed), foreign: once(met.foreign) }
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
  { name: 'backdrop-blur-[2px]', css: '.backdrop-blur-\\[2px\\]', file: 'src/lib/recipes.ts' },
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
  ':root[data-accent=lagoon]:not(.dark){--brand:#0369a1;',
  ':root[data-accent=aurora]:not(.dark){--brand:#a21caf;',
  ':root[data-accent=dusk]:not(.dark){--brand:#5b4b8a;',
  ':root[data-accent=golden]:not(.dark){--brand:#b0436e;',
  '.glass-float:is(:root[data-material=glass] *){background-color:var(--glass-float);',
  ':root[data-reduced-motion=always]{--animate-spin:none;',
  '::view-transition-new(.ioiti-page){',
  '.over-page:is(:root:active-view-transition:not([data-look-change]) *){view-transition-name:match-element;',
]

// The images the stylesheets name: the grains of the gradient accents, and the glass backdrop's.
const GRAINS = ['grain-white', 'grain-black', 'grain-overlay']

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
  'dist/styles/type.css',
  'dist/styles/finish.css',
  ...GRAINS.map((grain) => `dist/styles/${grain}.png`),
  'dist/styles/not-found-folder.svg',
  'dist/theme.js',
  'dist/vite/index.js',
  'dist/codemod/cli.js',
  'dist/codemod/transform.js',
  'dist/codemod/rules.js',
  'dist/lib/deprecations.js',
  'dist/vite/index.d.ts',
  'dist/react-router/index.js',
  'dist/react-router/index.d.ts',
  'dist/code/index.js',
  'dist/code/index.d.ts',
  'dist/locales/en.js',
  'dist/locales/en.d.ts',
  'dist/locales/fr.js',
  'dist/locales/fr.d.ts',
]

// What is weighed: one component alone (tree-shaking holds: it bundles what it uses, not the package), then each
// entry whole. The peers (React, framer-motion, the router, CodeMirror) are the application's own: left out here,
// counted in the template, which has them all.
const WEIGHED = {
  'Button, alone': "export { Button } from 'ioiti-ui'",
  'ioiti-ui, whole': "export * from 'ioiti-ui'",
  'ioiti-ui/react-router, whole': "export * from 'ioiti-ui/react-router'",
  'ioiti-ui/code, whole (its languages included)': "export * from 'ioiti-ui/code'",
  'ioiti-ui/locales/fr, whole': "export * from 'ioiti-ui/locales/fr'",
}
const PEERS = /^(?:react|react-dom|framer-motion|react-router)(?:\/|$)|^@(?:codemirror|lezer)\//
const BUDGET = join(root, 'test/size-budget.json')

/**
 * What a module of the application bundles from the installed package, as its production build does (minified,
 * `process.env.NODE_ENV` written as 'production'): the code, and its weight gzipped (bytes, its chunks summed).
 */
async function bundled(app, work, source, nodeEnv = 'production') {
  const entry = join(app, `weighed-${Object.values(WEIGHED).indexOf(source)}.js`)
  writeFileSync(entry, `${source}\n`)
  const results = await build({
    root: app,
    configFile: false,
    logLevel: 'silent',
    publicDir: false,
    define: { 'process.env.NODE_ENV': JSON.stringify(nodeEnv) },
    build: {
      write: false,
      minify: true,
      outDir: join(work, 'weighed'),
      emptyOutDir: false,
      lib: { entry, formats: ['es'], fileName: 'weighed' },
      rolldownOptions: { external: (id) => PEERS.test(id) },
    },
  })
  const chunks = [results]
    .flat()
    .flatMap((result) => result.output)
    .filter((file) => file.type === 'chunk')
  return { code: chunks.map((chunk) => chunk.code).join('\n'), size: chunks.reduce((sum, chunk) => sum + gzipSync(chunk.code).length, 0) }
}

/** Each weight against its budget (and its tolerance), the one component against the whole; or the budget written. */
function weigh(measured) {
  const kB = (bytes) => `${(bytes / 1024).toFixed(1)} kB`
  const budget = existsSync(BUDGET) ? JSON.parse(readFileSync(BUDGET, 'utf8')) : { tolerance: 0.05, gzipped: {} }
  const tolerance = `+${Math.round(budget.tolerance * 100)} %`
  for (const [name, size] of Object.entries(measured)) {
    const allowed = budget.gzipped[name]
    if (updateBudget) console.log(`     ${name}: ${kB(size)} gzipped`)
    else if (allowed === undefined) check(false, `${name}: ${kB(size)} gzipped, and no budget for it (npm run check:package -- --update-budget)`)
    else {
      check(size <= allowed * (1 + budget.tolerance), `${name}: ${kB(size)} gzipped, within its budget of ${kB(allowed)} (${tolerance})`)
      if (size < allowed * (1 - budget.tolerance)) console.log(`     ${name} weighs less than its budget: --update-budget records it`)
    }
  }
  const [one, whole] = [measured['Button, alone'], measured['ioiti-ui, whole']]
  check(one * 10 <= whole, `one component bundles a tenth of the package at most (${kB(one)} of ${kB(whole)}): the rest is shaken off`)
  if (updateBudget) {
    const about = 'What an application bundles, gzipped, in bytes (scripts/check-package.mjs). A change that weighs more on purpose writes it again: npm run check:package -- --update-budget.'
    writeFileSync(BUDGET, `${JSON.stringify({ about, tolerance: budget.tolerance, gzipped: measured }, null, 2)}\n`)
    console.log(`     the budget written: ${BUDGET}`)
  }
}

if (!existsSync(join(root, 'dist/index.js'))) {
  console.error('check:package: nothing built yet (npm run build)')
  process.exit(1)
}

// The codemod (npx ioiti-ui-codemod), as an application runs it: a page written with names the package deprecated, and
// the same page as the codemod writes it with today's (CHANGELOG.md, Deprecated). The template's build type-checks it.
const CODEMOD_BEFORE = `import { Button, Panel, ProgressBar, SettleModal, useToast } from 'ioiti-ui'
import type { SettleModalProps, Tone } from 'ioiti-ui'

export function Archive({ open, onClose }: Pick<SettleModalProps, 'open' | 'onClose'>) {
  const toast = useToast()
  const tone: Tone = 'positive'
  return (
    <SettleModal open={open} onClose={onClose} title="Archive the project" hideCloseButton>
      <Panel title="Storage" dense>
        <ProgressBar label="Used" value={92} tone="negative" />
      </Panel>
      <Button variant="destructive" isLoading onClick={() => toast({ title: tone, variant: 'error' })}>
        Archive
      </Button>
    </SettleModal>
  )
}
`
const CODEMOD_AFTER = `import { Button, Panel, ProgressBar, Dialog, useToast } from 'ioiti-ui'
import type { DialogProps, SignTone } from 'ioiti-ui'

export function Archive({ open, onClose }: Pick<DialogProps, 'open' | 'onClose'>) {
  const toast = useToast()
  const tone: SignTone = 'positive'
  return (
    <Dialog open={open} onClose={onClose} title="Archive the project" showCloseButton={false}>
      <Panel title="Storage" density="compact">
        <ProgressBar label="Used" value={92} tone="danger" />
      </Panel>
      <Button variant="danger" pending onClick={() => toast({ title: tone, tone: 'danger' })}>
        Archive
      </Button>
    </Dialog>
  )
}
`

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
  const engines = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).engines?.node
  check(
    manifest.engines?.node === engines,
    `the template asks for the Node ioiti-ui does (engines: ${manifest.engines?.node}${manifest.engines?.node === engines ? '' : `, where ioiti-ui's is ${engines}`})`,
  )
  manifest.dependencies['ioiti-ui'] = `file:${join(work, pack.filename)}`
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  run('npm', ['install', '--no-audit', '--no-fund'], app)

  // The template's own checks, as the application runs them (npm run check, its CI): its lint, then its tests, on the
  // package installed. The tests' jsdom asks for a more recent Node than the oldest an application builds with: on an
  // older one they are said not to run, not failed.
  const linted = attempt('npm', ['run', 'lint'], app)
  check(linted.ok, "the template's lint finds nothing (npm run lint: oxlint, its .oxlintrc.json)")
  if (!linted.ok) console.log(indented(linted.output))
  const tooOld = ['vitest', 'jsdom']
    .map((name) => ({ name, range: JSON.parse(readFileSync(join(app, 'node_modules', name, 'package.json'), 'utf8')).engines?.node }))
    .find(({ range }) => range && !nodeMeets(range))
  if (tooOld) console.log(`     the template's tests are not run on Node ${process.versions.node}, older than its ${tooOld.name} asks (${tooOld.range})`)
  else {
    const tested = attempt('npm', ['test'], app)
    const passed = tested.output.match(/Tests\s+(\d+) passed/)?.[1]
    check(tested.ok, `the template's tests pass (npm test${passed ? `, ${passed} of them` : ''}: its pages through its router, in jsdom)`)
    if (!tested.ok) console.log(indented(tested.output))
  }
  // Its CI pins each action to the commit the repository's own CI does: dependabot moves those, this says when the
  // template's are left behind.
  const ours = actionsIn('.github/workflows/ci.yml')
  const its = actionsIn('templates/app/.github/workflows/ci.yml')
  const astray = [...its].filter(([action, ref]) => !/^[0-9a-f]{40}$/.test(ref) || ours.get(action) !== ref)
  check(
    its.size > 0 && astray.length === 0,
    `the template's CI pins its actions to the commits the repository's does (${[...its.keys()].join(', ')})${astray.map(([action, ref]) => `; ${action}@${ref}, the repository's ${ours.get(action) ?? 'none'}`).join('')}`,
  )

  // The codemod rewrites a page of deprecated names, and touches nothing else of the template, which writes today's.
  const page = join(app, 'src', 'codemod-archive.tsx')
  writeFileSync(page, CODEMOD_BEFORE)
  const said = run('npx', ['--no-install', 'ioiti-ui-codemod'], app)
  check(readFileSync(page, 'utf8') === CODEMOD_AFTER, 'the codemod (npx ioiti-ui-codemod) writes a page of deprecated names with today\'s')
  check(/^Rewrote 1 file; nothing left to look at\.$/m.test(said), `the codemod rewrites that page alone, and leaves nothing to look at${/Rewrote 1 file; nothing/.test(said) ? '' : `:\n${said}`}`)
  run('npm', ['run', 'build'], app)
  check(true, 'the template installs the packed package and builds (the page the codemod wrote type-checks)')

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
  for (const [image, type] of [...GRAINS.map((grain) => [grain, 'png']), ['not-found-folder', 'svg']]) {
    const file = assets.find((name) => name.startsWith(`${image}-`) && name.endsWith(`.${type}`))
    const named = Boolean(file) && new RegExp(`url\\(["']?/assets/${file}["']?\\)`).test(css)
    check(named, `${image}.${type} is written as a file, and the CSS names it there${file ? ` (${file})` : ''}`)
  }
  check(!/url\(\s*["']?data:/.test(css) && !`${css}${js}`.includes('data:font'), 'nothing is inlined as a data: URI (font-src and img-src stay at self)')
  check(!js.includes('cm-editor') && !js.includes('@codemirror'), 'CodeMirror stays out of an application that does not import ioiti-ui/code')

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

  // The policy, proven: the build served as `npm run preview` serves it, under the policy its vite.config.ts sends (the
  // READMEs'), and opened in Chromium as a person opens it. Each page is drawn in its place, the policy refuses nothing,
  // nothing is said wrong, no request fails or goes elsewhere.
  try {
    const policy = policyIn('README.md')
    const { en } = await import(pathToFileURL(join(app, 'node_modules/ioiti-ui/dist/locales/en.js')).href)
    const pages = { '/': 'Dashboard', '/items': 'Items', '/no-such-page': en.notFound.pageTitle }
    const server = await preview(app)
    try {
      const met = await browse(server.origin, Object.keys(pages))
      const others = [...new Set(met.policies.filter((sent) => sent !== policy))]
      check(
        Boolean(policy) && policyIn('templates/app/README.md') === policy && others.length === 0,
        `vite preview sends each page with the Content-Security-Policy README.md and the template's recommend${others.length ? `, not ${others.join(' | ')}` : ''}`,
      )
      check(
        met.drawn.join('|') === Object.values(pages).join('|'),
        `Chromium opens /, /items and an address of no page, each drawn in its place (${met.drawn.join(', ')})`,
      )
      const listed = (faults) => (faults.length ? `: ${faults.join('; ')}` : '')
      check(met.refused.length === 0, `the policy refuses nothing there (no securitypolicyviolation)${listed(met.refused)}`)
      check(met.said.length === 0, `nothing is said wrong on the console, nothing thrown${listed(met.said)}`)
      check(met.failed.length === 0, `no request fails${listed(met.failed)}`)
      check(met.foreign.length === 0, `no request goes to another origin${listed(met.foreign)}`)
    } finally {
      await server.stop()
    }
  } catch (error) {
    check(false, `the template's build, served by vite preview and opened in Chromium: ${String(error.message ?? error).split('\n')[0]}`)
  }

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

  run(
    'node',
    [
      '--input-type=module',
      '-e',
      "await import('ioiti-ui'); await import('ioiti-ui/react-router'); await import('ioiti-ui/vite'); await import('ioiti-ui/locales/en'); await import('ioiti-ui/locales/fr')",
    ],
    app,
  )
  check(true, 'Node imports ioiti-ui, ioiti-ui/react-router, ioiti-ui/vite and the languages (ioiti-ui/locales/en, /fr)')

  // What an application bundles, gzipped, held to its budget: one component alone, each entry whole, the template.
  const measured = {}
  const codes = {}
  for (const [name, source] of Object.entries(WEIGHED)) ({ size: measured[name], code: codes[name] } = await bundled(app, work, source))

  // What a component says to its developer (src/lib/dev.ts) is said in development only: a production build keeps
  // none of its words.
  const { DEV_MESSAGES } = await import(pathToFileURL(join(app, 'node_modules/ioiti-ui/dist/lib/dev-messages.js')).href)
  const kept = Object.values(DEV_MESSAGES).filter((message) => codes['ioiti-ui, whole'].includes(message.slice(0, 40)))
  check(kept.length === 0, `a production build keeps none of what a component says to its developer${kept.length ? `: ${kept.join(' | ')}` : ''}`)
  const { code: developed } = await bundled(app, work, "export { Dialog } from 'ioiti-ui'", 'development')
  check(
    Object.values(DEV_MESSAGES).some((message) => developed.includes(message.slice(0, 40))),
    'a development build keeps them (Dialog says a dialog without a name): the check above reads the right words',
  )
  // What the package deprecated (src/lib/deprecations.ts) is said in development only: a production build keeps none of
  // the list (its ids), which a development build of a component that warns keeps.
  const { DEPRECATIONS } = await import(pathToFileURL(join(app, 'node_modules/ioiti-ui/dist/lib/deprecations.js')).href)
  const ids = Object.keys(DEPRECATIONS)
  const keptIds = ids.filter((id) => id.includes('-') && codes['ioiti-ui, whole'].includes(id))
  check(keptIds.length === 0, `a production build keeps none of the deprecations' list${keptIds.length ? `: ${keptIds.join(', ')}` : ''}`)
  const { code: warned } = await bundled(app, work, "export { Button } from 'ioiti-ui'", 'development')
  check(warned.includes('button-is-loading'), 'a development build keeps it (Button says isLoading is deprecated): the check above reads the right words')

  // A language is bundled by an application that imports it, never by one that speaks English: the template's JavaScript
  // has none of French's words, which the French entry bundled alone has.
  const { code: french } = await bundled(app, work, "export { fr } from 'ioiti-ui/locales/fr'")
  check(french.includes('il y a') && !js.includes('il y a'), 'French stays out of an application that does not import ioiti-ui/locales/fr')
  const gzippedAssets = (suffix) => assets.filter((name) => name.endsWith(suffix)).reduce((sum, name) => sum + gzipSync(readFileSync(join(dist, 'assets', name))).length, 0)
  measured['the template: its JavaScript'] = gzippedAssets('.js')
  measured['the template: its CSS'] = gzippedAssets('.css')
  weigh(measured)
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
