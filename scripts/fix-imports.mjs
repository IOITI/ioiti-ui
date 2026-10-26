// Gives every relative import of the files named an explicit `.js` ending, as the package's code
// must have (Node's ESM loader, which a consumer's tests may use, does not guess extensions):
// `../../lib/utils` becomes `../../lib/utils.js`, `./charts` becomes `./charts/index.js`.
//
//   node scripts/fix-imports.mjs src/components/ui/new-component.tsx [...]
//
// For a component copied in from EasyUI. Prints what it changed.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const SPECIFIER = /(\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.{1,2}\/[^'"]*)\2/g
const KEPT = /\.(js|mjs|cjs|css|json|svg|png)$/

function withEnding(file, specifier) {
  if (KEPT.test(specifier.replace(/\?.*$/, ''))) return specifier
  const target = resolve(dirname(file), specifier)
  for (const extension of ['.ts', '.tsx']) {
    if (existsSync(target + extension)) return `${specifier}.js`
  }
  for (const extension of ['.ts', '.tsx']) {
    if (existsSync(resolve(target, `index${extension}`))) return `${specifier.replace(/\/$/, '')}/index.js`
  }
  throw new Error(`${file}: nothing found for "${specifier}"`)
}

for (const file of process.argv.slice(2)) {
  const before = readFileSync(file, 'utf8')
  const after = before.replace(SPECIFIER, (whole, lead, quote, specifier) => {
    const fixed = withEnding(file, specifier)
    return fixed === specifier ? whole : `${lead}${quote}${fixed}${quote}`
  })
  if (after !== before) {
    writeFileSync(file, after)
    console.log(`${file}: relative imports given their .js ending`)
  }
}
