// What neither TypeScript nor the linter checks in the package's code:
//
// - every relative import of src/ ends in `.js`: Node's ESM loader, which an application's tests
//   may run the package with, does not guess extensions (scripts/fix-imports.mjs adds them);
// - nothing in src/ imports react-router but its adapter (src/react-router/) and the tests: the
//   core works without a router, or with another one;
// - no name of the application ioiti-ui was made from (WATA, its broker) in the code an
//   application ships or starts from (src/, the gallery, the template): the docs say where it
//   comes from, the code does not.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
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
}

for (const file of [...filesUnder('src'), ...filesUnder('gallery'), ...filesUnder('templates')]) {
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
console.log('check-source: imports end in .js, react-router only in its adapter, no name of the original application')
