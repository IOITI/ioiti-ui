// What neither TypeScript nor the linter checks in the package's code:
//
// - every relative import of src/ ends in `.js`: Node's ESM loader, which an application's tests
//   may run the package with, does not guess extensions (scripts/fix-imports.mjs adds them);
// - nothing in src/ imports react-router but its adapter (src/react-router/) and the tests: the
//   core works without a router, or with another one;
// - nothing in src/ imports CodeMirror but the code editors' entry (src/code/): an application that
//   never edits code never bundles it, nor installs its packages;
// - nothing of the gallery imports the package's source: it imports `ioiti-ui`, as an application;
// - no name of the application ioiti-ui was made from (WATA, its broker) in the code an
//   application ships or starts from (src/, the gallery, the template): the docs say where it
//   comes from, the code does not.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const CODE = /\.(ts|tsx|js|mjs|css|html|json)$/
const SKIPPED = new Set(['node_modules', 'dist', '.vite'])

function filesUnder(folder) {
  const found = []
  let names
  try {
    names = readdirSync(join(root, folder))
  } catch {
    return found
  }
  for (const name of names) {
    if (SKIPPED.has(name)) continue
    const path = join(folder, name)
    if (statSync(join(root, path)).isDirectory()) found.push(...filesUnder(path))
    else if (CODE.test(name)) found.push(path)
  }
  return found
}

const problems = []
const IMPORT = /(?:\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.{1,2}\/[^'"]*)\1/g
const ROUTER = /(?:\bfrom\s*|\bimport\s*\(?\s*)['"]react-router(?:\/[^'"]*)?['"]/
const CODEMIRROR = /(?:\bfrom\s*|\bimport\s*\(?\s*)['"]@(?:codemirror|lezer)\/[^'"]*['"]/
const ORIGIN = /\b(wata|saxo)\b/i

for (const file of filesUnder('src')) {
  if (!/\.(ts|tsx)$/.test(file)) continue
  const text = readFileSync(join(root, file), 'utf8')
  for (const [, , specifier] of text.matchAll(IMPORT)) {
    if (!/\.(js|css|json)$/.test(specifier.replace(/\?.*$/, ''))) problems.push(`${file}: "${specifier}" has no .js ending (node scripts/fix-imports.mjs ${file})`)
  }
  const isTest = /\.test\.(ts|tsx)$/.test(file) || file.startsWith(join('src', 'test'))
  if (ROUTER.test(text) && !file.startsWith(join('src', 'react-router')) && !isTest) {
    problems.push(`${file}: imports react-router, which only src/react-router/ may`)
  }
  if (CODEMIRROR.test(text) && !file.startsWith(join('src', 'code'))) {
    problems.push(`${file}: imports CodeMirror, which only src/code/ may`)
  }
}

// One focus ring, the design's (design.css): no component draws one of its own beside it. What a control means is a
// Hint, never a title (a title shows on none of a phone, a keyboard or a disabled control): ThemeToggle's is the
// original's, kept on purpose.
const OWN_RING = /focus-visible:ring|focus-visible:outline-none/
const TITLE_ON_CONTROL = /<(?:button|a|motion\.button)\b[^>]*?\stitle=/s
for (const file of filesUnder('src')) {
  if (!/\.tsx$/.test(file) || /\.test\.tsx$/.test(file)) continue
  const text = readFileSync(join(root, file), 'utf8')
  text.split('\n').forEach((line, index) => {
    if (OWN_RING.test(line)) problems.push(`${file}:${index + 1}: draws a focus ring of its own (the design's is the one)`)
  })
  if (file.endsWith(join('components', 'ThemeToggle.tsx'))) continue
  for (const match of text.matchAll(new RegExp(TITLE_ON_CONTROL, 'gs'))) {
    const line = text.slice(0, match.index).split('\n').length
    problems.push(`${file}:${line}: a title on a control: say it in a Hint`)
  }
}

// Text has a size by its role (design-system/guide/README.md, Type): Tailwind's text-xs (12px), text-sm (14px) and
// above, or one written by hand of 11px (a badge's count, a key, a chart's tick), 13px (code) or a display figure of
// 18px and more. Nothing under 11px, nothing in between: the scale drifted to 9, 10, 12.5 and 13.5px without it.
const TEXT_SIZE = /\btext-\[(\d+(?:\.\d+)?)px\]|\bfontSize:\s*['"](\d+(?:\.\d+)?)px['"]/g
const CLASS_OF = { 12: 'text-xs', 14: 'text-sm', 16: 'text-base' }
for (const file of [...filesUnder('src'), ...filesUnder(join('gallery', 'src')), ...filesUnder('templates')]) {
  if (!/\.(ts|tsx)$/.test(file) || /\.test\.(ts|tsx)$/.test(file)) continue
  readFileSync(join(root, file), 'utf8')
    .split('\n')
    .forEach((line, index) => {
      for (const match of line.matchAll(TEXT_SIZE)) {
        const px = Number(match[1] ?? match[2])
        if (px === 11 || px === 13 || px >= 18) continue
        if (CLASS_OF[px]) {
          if (match[1]) problems.push(`${file}:${index + 1}: text-[${px}px] is ${CLASS_OF[px]}`)
          continue
        }
        problems.push(`${file}:${index + 1}: text of ${px}px, off the scale (11px, text-xs, 13px for code, text-sm and up)`)
      }
    })
}

// One recipe per role (src/lib/recipes.ts, design-system/guide/README.md): a component names the design's tokens and
// recipes, never a colour, a shadow, a curve or a radius of its own. Each rule names what it refuses and what to write.
const RECIPE_RULES = [
  [/var\(--font-(sans|mono|body|heading)/, "reads tokens.css's font names, which no face registers: font-sans / font-mono"],
  [/\[#[0-9a-fA-F]{3,8}\]|#[0-9a-fA-F]{6}\b|\brgba?\(/, 'a colour written by hand: a token by role (recipes.ts)'],
  [
    /(?<![\w-])(?:[a-z-]+:)*(?:text|bg|border|fill|stroke|ring|divide|from|to|via|outline|decoration|placeholder|shadow|caret)-(?:neutral|zinc|gray|slate|stone|red|rose|emerald|green|amber|yellow|orange|sky|blue|indigo|violet|purple|pink|fuchsia|teal|cyan|lime)-\d/,
    "a palette's colour: a token by role (recipes.ts)",
  ],
  [/(?<![\w-])(?:[a-z-]+:)*(?:bg|text|border|fill)-(?:white|black)(?![\w-])/, 'white or black: a token by role (recipes.ts)'],
  [/(?<![\w-])shadow-(?:xs|sm|md|lg|xl|2xl)(?![\w-])|(?<!(?:accent|glass):(?:hover:)?)shadow-\[(?!inset)/, 'a shadow of its own: shadow-elevated (it floats) or shadow-subtle; a look adds its glow (accent:, glass:)'],
  [/(?<![\w-])rounded(?=[\s"'`])|rounded(?:-[a-z]{1,2})?-\[(?!(?:[0-4](?:\.\d+)?px|inherit|calc\(var\(--radius)[^\]]*\])/, 'a radius off the scale: rounded-sm/md/lg/xl/2xl/full by size'],
  [/(?<![\w-])transition-all(?![\w-])/, 'transition-all: the properties that change'],
  [/(?<![\w-])ease-(?:in|out|in-out)(?![\w-])|ease:\s*['"](?:easeIn|easeOut|easeInOut)['"]/, 'a curve of its own: ease-soft / ease-fast / ease-exit, or motionTransitions'],
  [/bg-surface\/50.*dark:bg-surface\/25|rounded-2xl.*border-border\/70|border-border\/70.*rounded-2xl/, "a section's frame written by hand: SECTION or SECTION_FRAME (recipes.ts)"],
  [/backdrop-blur|backdrop-filter|backdropFilter/, 'a blur of its own: the design blurs glass-tile and glass-float (and the scrim, SCRIM)'],
  [/\buseReducedMotion\b(?!Config)/, "framer's useReducedMotion follows the system only: useReducedMotionConfig"],
  [/(?<![\w-])(?:aria-)?disabled:opacity-(?!50(?![\d]))/, 'disabled is 50% (DISABLED in recipes.ts)'],
]
// Where a rule does not apply: the recipes themselves, the looks' swatches (copies of accents.css and glass.css,
// tested), the motion tokens; and the 404's illustration, EasyUI's drawing kept as it was on purpose (its colours,
// its glows, its frosted glass, its springs and curve), the page around it on the rules.
const RECIPE_EXEMPT = {
  [join('src', 'lib', 'recipes.ts')]: /./,
  [join('src', 'components', 'look-swatches.ts')]: /./,
  [join('src', 'components', 'ui', 'not-found.tsx')]: /colour written by hand|palette's colour|white or black|shadow of its own|curve of its own|spring written by hand|blur of its own/,
}
const SPRING_BY_HAND = /\b(?:stiffness|damping|bounce)\s*:/
for (const file of filesUnder('src')) {
  if (!/\.(ts|tsx)$/.test(file) || /\.test\.(ts|tsx)$/.test(file) || file.startsWith(join('src', 'test'))) continue
  const exempt = RECIPE_EXEMPT[file]
  readFileSync(join(root, file), 'utf8')
    .split('\n')
    .forEach((line, index) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return
      for (const [rule, says] of RECIPE_RULES) {
        if (rule.test(line) && !(exempt && exempt.test(says))) problems.push(`${file}:${index + 1}: ${says}`)
      }
      if (SPRING_BY_HAND.test(line) && !file.endsWith(join('lib', 'motion-tokens.ts')) && !(exempt && exempt.test('spring written by hand'))) {
        problems.push(`${file}:${index + 1}: a spring written by hand: motionTransitions (src/lib/motion-tokens.ts)`)
      }
    })
}

// What an application gives a component is drawn as text, which React escapes: no component writes HTML (SECURITY.md).
// Two write a fixed style sheet of their own as raw HTML, nothing of what they are given: ActivityHeatmap's cells,
// the 404's drawing.
const RAW_HTML = /dangerouslySetInnerHTML|\.(?:inner|outer)HTML\s*=|insertAdjacentHTML|document\.write\(/
const RAW_HTML_EXEMPT = new Set([join('src', 'components', 'ui', 'activity-heatmap.tsx'), join('src', 'components', 'ui', 'not-found.tsx')])
for (const file of filesUnder('src')) {
  if (!/\.(ts|tsx)$/.test(file) || /\.test\.(ts|tsx)$/.test(file) || file.startsWith(join('src', 'test')) || RAW_HTML_EXEMPT.has(file)) continue
  readFileSync(join(root, file), 'utf8')
    .split('\n')
    .forEach((line, index) => {
      if (!/^\s*(\/\/|\*|\/\*)/.test(line) && RAW_HTML.test(line)) problems.push(`${file}:${index + 1}: HTML written raw: draw what is given as text (SECURITY.md)`)
    })
}

// The gallery is an application made with the package: it imports `ioiti-ui`, never the package's source.
for (const file of filesUnder(join('gallery', 'src'))) {
  const text = readFileSync(join(root, file), 'utf8')
  for (const [, , specifier] of text.matchAll(IMPORT)) {
    const target = relative(root, join(root, dirname(file), specifier))
    if (target.startsWith(`src${sep}`) || target === 'src') problems.push(`${file}: imports the package's source ("${specifier}"): import 'ioiti-ui'`)
  }
}

// The gallery's examples are what an application writes, and the code their page shows: they import the
// package's entries, React, lucide-react and the gallery's sample data; the router only for the shell's own.
// An import statement (from the start of a line), a side effect's or a dynamic import, never words in a string.
const SPECIFIER = /^\s*(?:import|export)\b[^'";]*?\bfrom\s*(['"])([^'"]+)\1|^\s*import\s*(['"])([^'"]+)\3|\bimport\(\s*(['"])([^'"]+)\5\s*\)/gm
const EXAMPLES = join('gallery', 'src', 'components')
for (const file of filesUnder(EXAMPLES)) {
  if (!file.endsWith('.tsx')) continue
  const router = file.startsWith(join(EXAMPLES, 'shell'))
  for (const match of readFileSync(join(root, file), 'utf8').matchAll(SPECIFIER)) {
    const specifier = match[2] ?? match[4] ?? match[6]
    const allowed =
      /^(ioiti-ui|ioiti-ui\/react-router|ioiti-ui\/code|react|react-dom|lucide-react)$/.test(specifier) ||
      /^(\.\.\/)+samples\/[\w-]+$/.test(specifier) ||
      (router && specifier === 'react-router')
    if (!allowed) problems.push(`${file}: an example imports "${specifier}": the package's entries, react, lucide-react or the samples only`)
  }
}

// The guidelines are shipped with the gallery too.
const GUIDELINES = join('design-system', 'components')
const guidelines = readdirSync(join(root, GUIDELINES)).map((name) => join(GUIDELINES, name, 'README.md'))

for (const file of [...filesUnder('src'), ...filesUnder('gallery'), ...filesUnder('templates'), ...guidelines]) {
  const lines = readFileSync(join(root, file), 'utf8').split('\n')
  lines.forEach((line, index) => {
    if (ORIGIN.test(line)) problems.push(`${relative(root, join(root, file))}:${index + 1}: names ${line.match(ORIGIN)[0]}`)
  })
}

if (problems.length) {
  console.error(problems.join('\n'))
  console.error(`\ncheck-source: ${problems.length} problem${problems.length === 1 ? '' : 's'}`)
  process.exit(1)
}
console.log('check-source: imports end in .js, react-router only in its adapter, CodeMirror only in src/code, one focus ring, hints not titles, text sizes on the scale, one recipe per role (colours, shadows, radii, curves, disabled), no HTML written raw, examples import what an application would, no name of the original application')
