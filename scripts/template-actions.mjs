// The starter template's CI (templates/app/.github/workflows/ci.yml) pins each action to the commit the repository's
// own CI does (.github/workflows/ci.yml), with the version beside it. Dependabot moves the repository's pins: it reads
// the workflows of the root alone, not one under templates/. This writes the template's again from them.
//
//   node scripts/template-actions.mjs           the template's pins written as the repository's
//   node scripts/template-actions.mjs --check   fails on a pin left behind, saying which (npm run lint)
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OURS = '.github/workflows/ci.yml'
const ITS = 'templates/app/.github/workflows/ci.yml'
/** `uses: owner/action@ref # v1.2.3`: the action, its ref, the version written beside it. */
const USES = /^(\s*-?\s*uses:\s*)([^@\s]+)@(\S+)(\s*#.*)?$/gm

const ours = new Map()
for (const [, , action, ref, version] of readFileSync(join(root, OURS), 'utf8').matchAll(USES)) {
  ours.set(action, { ref, version: version ?? '' })
}

const text = readFileSync(join(root, ITS), 'utf8')
const problems = []
const written = text.replace(USES, (line, start, action, ref, version = '') => {
  const pin = ours.get(action)
  if (!pin) {
    problems.push(`${ITS}: ${action}, which the repository's CI does not use: no pin to follow`)
    return line
  }
  if (!/^[0-9a-f]{40}$/.test(pin.ref)) problems.push(`${OURS}: ${action}@${pin.ref}, pinned to no commit`)
  if (pin.ref === ref && pin.version.trim() === version.trim()) return line
  return `${start}${action}@${pin.ref}${pin.version}`
})

if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
const actions = [...text.matchAll(USES)].map(([, , action]) => action)
if (process.argv.includes('--check')) {
  if (written !== text) {
    console.error(`template-actions: ${ITS} pins its actions elsewhere than ${OURS} (Dependabot moved the repository's): node scripts/template-actions.mjs`)
    process.exit(1)
  }
  console.log(`template-actions: the template's CI pins ${[...new Set(actions)].join(', ')} to the repository's commits`)
} else if (written !== text) {
  writeFileSync(join(root, ITS), written)
  console.log(`template-actions: ${ITS} written with the repository's pins`)
} else {
  console.log('template-actions: the template\'s pins are the repository\'s already')
}
