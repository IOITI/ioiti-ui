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
console.log('check-source: imports end in .js, react-router only in its adapter, CodeMirror only in src/code, examples import what an application would, no name of the original application')
