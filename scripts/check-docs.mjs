// What the docs say that the code knows, held to it (npm run lint): no version and no count goes stale unseen.
//
// - The tag README.md and the template's README install is package.json's version (`npm run release` sets them).
// - The counts README.md and AGENTS.md give: the components (gallery/src/props.json, parts counted), EasyUI's
//   (src/components/ui), the looks (two themes × the accents × the materials of src/lib/theme.ts), the gallery's
//   groups (its category.ts files).
// - The Tailwind CSS README.md installs is the template's, to the version.
// - The gallery's pages write no count of looks by hand: they compute it from ACCENTS and MATERIALS.
// - The design system's cards (design-system/): every component's guidelines (components/<Name>/README.md) have a card
//   in cards.json and its preview (previews/<Name>.tsx), or the reason it has none in no-card.json (a provider, an
//   entry the bundle does not hold); every card has its guidelines and its preview, every preview its card.
// - CHANGELOG.md: its versions newest first, dated, each once; from 0.24.0 their notes in sections, in order, none
//   empty, Upgrading where something changes; the links at its foot as scripts/changelog.mjs writes them
//   (`node scripts/check-docs.mjs --fix` writes them).
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

import { changelogProblems, formatChangelog, parseChangelog, sectionsOf, UNRELEASED } from './changelog.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (file) => readFileSync(join(root, file), 'utf8')
const readJson = (file) => JSON.parse(read(file))
const problems = []

// The versions.
const version = readJson('package.json').version
const template = readJson('templates/app/package.json')
for (const file of ['README.md', 'templates/app/README.md']) {
  const tags = [...read(file).matchAll(/IOITI\/ioiti-ui(?:\/templates\/app)?#(v[0-9A-Za-z.-]*[0-9A-Za-z])/g)].map((match) => match[1])
  if (!tags.length) problems.push(`${file}: installs no tag of ioiti-ui (github:IOITI/ioiti-ui#v${version})`)
  for (const tag of new Set(tags)) {
    if (tag !== `v${version}`) problems.push(`${file}: installs ${tag}, where package.json is ${version}`)
  }
}
if (template.dependencies['ioiti-ui'] !== `github:IOITI/ioiti-ui#v${version}`) {
  problems.push(`templates/app/package.json: depends on ${template.dependencies['ioiti-ui']}, where package.json is ${version}`)
}

// The counts.
const listed = (source, name) => {
  const match = read(source).match(new RegExp(`export const ${name} = \\[([^\\]]*)\\]`))
  if (!match) throw new Error(`${source}: no ${name}`)
  return match[1].match(/'[^']+'/g)?.length ?? 0
}
const looks = 2 * listed('src/lib/theme.ts', 'ACCENTS') * listed('src/lib/theme.ts', 'MATERIALS')
const components = Object.keys(readJson('gallery/src/props.json')).length
const easyUi = readdirSync(join(root, 'src/components/ui')).filter((name) => name.endsWith('.tsx')).length
const groups = readdirSync(join(root, 'gallery/src/components'), { withFileTypes: true }).filter(
  (entry) => entry.isDirectory() && readdirSync(join(root, 'gallery/src/components', entry.name)).includes('category.ts'),
).length
const CLAIMS = [
  ['README.md', /\*\*(\d+) components\*\*/, components, 'components (gallery/src/props.json)'],
  ['README.md', /(\d+) of EasyUI's/, easyUi, "of EasyUI's components (src/components/ui)"],
  ['README.md', /every look \((\d+)\)/, looks, 'looks (two themes × the accents × the materials)'],
  ['README.md', /in (\d+) groups/, groups, "of the gallery's groups (its category.ts files)"],
  ['AGENTS.md', /a material: (\d+)\)/, looks, 'looks (two themes × the accents × the materials)'],
]
for (const [file, pattern, actual, what] of CLAIMS) {
  const match = read(file).match(pattern)
  if (!match) problems.push(`${file}: no longer says the number ${what} as ${pattern} finds it: say it so, or change scripts/check-docs.mjs`)
  else if (Number(match[1]) !== actual) problems.push(`${file}: says ${match[1]} ${what}, where there are ${actual}`)
}

// The Tailwind CSS an application installs.
const install = read('README.md').match(/tailwindcss@(\S+) @tailwindcss\/vite@(\S+)/)
if (!install) problems.push('README.md: no longer installs tailwindcss@… @tailwindcss/vite@…')
else {
  const [, tailwind, plugin] = install
  if (tailwind !== template.devDependencies.tailwindcss) problems.push(`README.md: installs tailwindcss@${tailwind}, the template ${template.devDependencies.tailwindcss}`)
  if (plugin !== template.devDependencies['@tailwindcss/vite']) problems.push(`README.md: installs @tailwindcss/vite@${plugin}, the template ${template.devDependencies['@tailwindcss/vite']}`)
}

// No count of looks written by hand in the gallery's pages.
for (const name of readdirSync(join(root, 'gallery/src/pages'))) {
  const file = `gallery/src/pages/${name}`
  read(file)
    .split('\n')
    .forEach((line, index) => {
      if (/\b\d+ looks\b/.test(line)) problems.push(`${file}:${index + 1}: a count of looks written by hand: compute it from ACCENTS and MATERIALS`)
    })
}

// The design system's cards: a card for every component's guidelines, or the reason it has none.
const DS = 'design-system'
const cards = readJson(`${DS}/cards.json`).map((card) => card.name)
const noCard = readJson(`${DS}/no-card.json`)
const guidelines = readdirSync(join(root, DS, 'components'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
const previews = readdirSync(join(root, DS, 'previews'))
  .filter((name) => name.endsWith('.tsx'))
  .map((name) => name.slice(0, -'.tsx'.length))
for (const name of guidelines) {
  if (!cards.includes(name) && !(name in noCard)) {
    problems.push(`${DS}/components/${name}: no card in ${DS}/cards.json, nor the reason it has none in ${DS}/no-card.json`)
  }
}
cards.forEach((name, index) => {
  if (cards.indexOf(name) !== index) problems.push(`${DS}/cards.json: ${name} is there twice`)
  if (!existsSync(join(root, DS, 'components', name, 'README.md'))) problems.push(`${DS}/cards.json: ${name} has no guidelines (${DS}/components/${name}/README.md)`)
  if (!previews.includes(name)) problems.push(`${DS}/cards.json: ${name} has no preview (${DS}/previews/${name}.tsx)`)
  if (name in noCard) problems.push(`${DS}/no-card.json: ${name} has a card in ${DS}/cards.json`)
})
for (const name of previews) {
  if (!cards.includes(name)) problems.push(`${DS}/previews/${name}.tsx: the preview of no card in ${DS}/cards.json`)
}
for (const [name, reason] of Object.entries(noCard)) {
  if (!guidelines.includes(name)) problems.push(`${DS}/no-card.json: ${name} has no guidelines (${DS}/components/${name}/README.md)`)
  if (typeof reason !== 'string' || !reason.trim()) problems.push(`${DS}/no-card.json: ${name} says no reason`)
}

// The CHANGELOG.
const changelogText = read('CHANGELOG.md')
const changelog = parseChangelog(changelogText)
problems.push(...changelogProblems(changelog).map((problem) => `CHANGELOG.md: ${problem}`))
const written = formatChangelog(changelog)
if (written !== changelogText) {
  if (process.argv.includes('--fix')) {
    writeFileSync(join(root, 'CHANGELOG.md'), written)
    console.log('check-docs: the links at the foot of CHANGELOG.md written again')
  } else {
    problems.push('CHANGELOG.md: its foot does not link every version as scripts/changelog.mjs writes it (node scripts/check-docs.mjs --fix)')
  }
}

// Every deprecation (src/lib/deprecations.ts) is named, in backticks, in the Deprecated section of the version it came in,
// or of [Unreleased] until that version is released.
const { outputText } = ts.transpileModule(read('src/lib/deprecations.ts'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
})
const { DEPRECATIONS } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const deprecatedIn = (name) => {
  const version = changelog.versions.find((each) => each.name === name) ?? changelog.versions.find((each) => each.name === UNRELEASED)
  return version ? (sectionsOf(version).sections.find((section) => section.name === 'Deprecated')?.lines.join('\n') ?? '') : ''
}
for (const [id, entry] of Object.entries(DEPRECATIONS)) {
  if (!deprecatedIn(entry.since).includes(`\`${entry.old}\``)) {
    problems.push(`CHANGELOG.md: \`${entry.old}\` (${id}, src/lib/deprecations.ts) is named in no Deprecated section of ${entry.since}`)
  }
}

if (problems.length) {
  console.error(problems.join('\n'))
  console.error(`\ncheck-docs: ${problems.length} problem${problems.length === 1 ? '' : 's'}`)
  process.exit(1)
}
console.log(
  `check-docs: the READMEs install v${version}; ${components} components, ${easyUi} of EasyUI's, ${looks} looks, ${groups} groups, as the code has them; the design system's ${cards.length} cards, and why ${Object.keys(noCard).length} components have none; the CHANGELOG in order, its links written`,
)
