import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import * as core from 'ioiti-ui'
import * as code from 'ioiti-ui/code'
import * as adapter from 'ioiti-ui/react-router'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

import { KEYBOARD_FAMILIES, NATIVE_FAMILIES } from './accessibility'
import { CATEGORIES, exampleKey, FAMILIES, ORDER, readmeOf } from './catalogue'
import { FORMER_ADDRESSES, movedTo } from './legacy'
import { blocks, summaryOf, type Block } from './markdown-blocks'
import { COMPONENT_PROPS } from './props'
import type { Entry, Examples } from './types'

const ENTRIES: Record<Entry, Record<string, unknown>> = { 'ioiti-ui': core, 'ioiti-ui/react-router': adapter, 'ioiti-ui/code': code }

/**
 * What 1.0 removed (src/codemod/table.ts, which the codemod rewrites), read as the package's scripts read it: data, not
 * an import of the package's source, which the gallery never makes.
 */
async function readRemoved(): Promise<{ kind: string; old: string; new: string }[]> {
  const source = readFileSync(join(import.meta.dirname, '..', '..', '..', 'src', 'codemod', 'table.ts'), 'utf8')
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } })
  const read = (await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)) as {
    REMOVED: Record<string, { kind: string; old: string; new: string }>
  }
  return Object.values(read.REMOVED)
}

/** A name the package exported until 1.0, and the one an application writes in its place: `old` → `new`. */
const REMOVED = new Map(
  (await readRemoved()).filter((entry) => entry.kind === 'export').map((entry): [string, string] => [entry.old, entry.new]),
)

/** A component's name as an address writes it: `settle-modal` for SettleModal. */
const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/** A component: a name in PascalCase (not a CONSTANT), and something React can draw. */
function components(module: Record<string, unknown>): string[] {
  return Object.entries(module)
    .filter(([name]) => /^[A-Z]/.test(name) && !/^[A-Z0-9_]+$/.test(name))
    .filter(([, value]) => typeof value === 'function' || (typeof value === 'object' && value !== null && '$$typeof' in value))
    .map(([name]) => name)
}

const EXAMPLES = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: Examples }>('../components/*/examples.ts', { eager: true })).map(([path, module]) => [
    path.split('/').at(-2),
    module.default,
  ]),
)

const COMPONENTS = join(import.meta.dirname, '..', 'components')

describe('the catalogue', () => {
  it('has every category, in its order', () => {
    expect(CATEGORIES.map((category) => category.slug)).toEqual([...ORDER])
  })

  it('puts every component of the package in one family, and every name of a family is the package’s', () => {
    const owners = new Map<string, string[]>()
    for (const { family } of FAMILIES) {
      for (const name of family.names) owners.set(name, [...(owners.get(name) ?? []), family.name])
      const entry = ENTRIES[family.entry ?? 'ioiti-ui']
      expect(family.names.filter((name) => !(name in entry)), `${family.name}: names its entry does not export`).toEqual([])
    }
    const everyComponent = [...components(core), ...components(adapter), ...components(code)]
    expect(everyComponent.filter((name) => !owners.has(name)), 'components in no family').toEqual([])
    expect([...owners].filter(([, families]) => families.length > 1), 'components in two families').toEqual([])
  })

  it('names a family’s former names, each removed in 1.0 for one of its own, and leads its former address to its page', () => {
    for (const { category, family, path } of FAMILIES) {
      for (const old of family.formerly ?? []) {
        expect(family.names, `${family.name}: ${old}, removed for none of its own (src/codemod/table.ts)`).toContain(REMOVED.get(old))
        expect(old in ENTRIES[family.entry ?? 'ioiti-ui'], `${family.name}: ${old}, exported still`).toBe(false)
      }
      if (!family.formerly) continue
      const [first] = family.examples
      expect(movedTo(`/components/${category.slug}/${kebab(family.formerly[0])}`, `#${first.id}`), family.name).toBe(`${path}#${first.id}`)
    }
    for (const { to } of FORMER_ADDRESSES) expect(FAMILIES.some((placed) => placed.path === to), to).toBe(true)
  })

  it('gives each category 3 to 10 families, and unique addresses', () => {
    for (const category of CATEGORIES) {
      expect(category.families.length, category.slug).toBeGreaterThanOrEqual(3)
      expect(category.families.length, category.slug).toBeLessThanOrEqual(10)
      const slugs = category.families.map((family) => family.slug)
      expect(new Set(slugs).size, category.slug).toBe(slugs.length)
    }
  })

  it('gives each family its guidelines, with a summary', () => {
    const missing = FAMILIES.filter(({ family }) => !readmeOf(family)).map(({ family }) => family.name)
    expect(missing, `families without design-system/components/<Name>/README.md`).toEqual([])
    for (const { family } of FAMILIES) {
      const readme = readmeOf(family)!
      expect(blocks(readme)[0], family.name).toEqual({ type: 'title', level: 1, text: family.name })
      expect(summaryOf(readme), family.name).not.toBe('')
    }
  })

  it('gives each family two examples at least, or says why one is enough', () => {
    for (const { family } of FAMILIES) {
      if (family.single) expect(family.examples, family.name).toHaveLength(1)
      else expect(family.examples.length, family.name).toBeGreaterThanOrEqual(2)
      const ids = family.examples.map((example) => example.id)
      expect(new Set(ids).size, family.name).toBe(ids.length)
      expect(ids.filter((id) => ['guidelines', 'props'].includes(id)), family.name).toEqual([])
    }
  })

  it('has a file for each example, and an example for each file', () => {
    for (const category of CATEGORIES) {
      const examples = EXAMPLES[category.slug] ?? {}
      const listed = category.families.flatMap((family) => family.examples.map((example) => exampleKey(family, example)))
      expect(Object.keys(examples).sort(), category.slug).toEqual([...listed].sort())
      // No folder of examples that is no family's.
      const folders = readdirSync(join(COMPONENTS, category.slug), { withFileTypes: true }).filter((entry) => entry.isDirectory())
      expect(folders.map((folder) => folder.name).sort(), category.slug).toEqual(category.families.map((family) => family.slug).sort())
      expect(existsSync(join(COMPONENTS, category.slug, 'category.ts'))).toBe(true)
    }
  })

  it('imports each component of a family in one of its examples, as an application would', () => {
    for (const { category, family } of FAMILIES) {
      const imported = new Set<string>()
      for (const example of family.examples) {
        const source = EXAMPLES[category.slug]?.[exampleKey(family, example)]?.source ?? ''
        for (const [, names, from] of source.matchAll(/import\s*\{([^}]*)\}\s*from\s*'([^']+)'/g)) {
          if (from === (family.entry ?? 'ioiti-ui')) for (const name of names.split(',')) imported.add(name.trim().replace(/^type\s+/, ''))
        }
      }
      expect(family.names.filter((name) => !imported.has(name)), `${family.name}: parts no example imports`).toEqual([])
    }
  })

  it('has the props of each component (npm run props)', () => {
    const names = FAMILIES.flatMap(({ family }) => family.names)
    expect(names.filter((name) => !COMPONENT_PROPS[name])).toEqual([])
  })
})

/** A section of guidelines: its blocks under `## <heading>`, to the next heading of its level or above. */
function sectionOf(readme: string, heading: string): Block[] | undefined {
  const all = blocks(readme)
  const start = all.findIndex((block) => block.type === 'title' && block.level === 2 && block.text === heading)
  if (start === -1) return undefined
  const after = all.slice(start + 1)
  const end = after.findIndex((block) => block.type === 'title' && block.level <= 2)
  return end === -1 ? after : after.slice(0, end)
}

type TableBlock = Extract<Block, { type: 'table' }>

describe('the guidelines and the choices', () => {
  it('say how each interactive family is used without a mouse: what a screen reader hears, then its keys', () => {
    const listed: string[] = [...KEYBOARD_FAMILIES, ...NATIVE_FAMILIES]
    const names = new Set(FAMILIES.map(({ family }) => family.name))
    expect(listed.filter((name) => !names.has(name)), 'listed, and no family').toEqual([])
    expect(listed.filter((name, index) => listed.indexOf(name) !== index), 'listed twice').toEqual([])
    for (const { family } of FAMILIES) {
      const section = sectionOf(readmeOf(family)!, 'Accessibility')
      if (!listed.includes(family.name)) {
        // A family given the section is listed in accessibility.ts, which holds it to it.
        expect(section, `${family.name}: an Accessibility section that accessibility.ts does not list`).toBeUndefined()
        continue
      }
      expect(section, `${family.name}: no ## Accessibility`).toBeDefined()
      expect(section!.some((block) => block.type === 'paragraph'), `${family.name}: what a screen reader hears`).toBe(true)
      const tables = section!.filter((block): block is TableBlock => block.type === 'table')
      if (NATIVE_FAMILIES.includes(family.name)) {
        expect(tables, `${family.name}: the browser's own controls, said in a sentence`).toEqual([])
        continue
      }
      expect(tables, `${family.name}: a table of its keys`).toHaveLength(1)
      const [table] = tables
      expect(table.head, family.name).toEqual(['Key', 'What it does'])
      expect(table.rows.length, family.name).toBeGreaterThan(0)
      for (const row of table.rows) expect(row.every((cell) => cell.trim() !== ''), `${family.name}: ${row.join(' | ')}`).toBe(true)
    }
  })

  it('say which of a category’s families to use: its own, each once, each link to a family’s page', () => {
    const paths = new Set(FAMILIES.map(({ path }) => path))
    for (const category of CATEGORIES) {
      if (!category.choose) continue
      const { heading, rows } = category.choose
      expect(heading.trim(), category.slug).not.toBe('')
      expect(rows.length, category.slug).toBeGreaterThanOrEqual(2)
      const slugs = rows.map((row) => row.family)
      expect(slugs.filter((slug, index) => slugs.indexOf(slug) !== index), `${category.slug}: named twice`).toEqual([])
      for (const row of rows) {
        const family = category.families.find((each) => each.slug === row.family)
        expect(family, `${category.slug}: ${row.family}, none of its families`).toBeDefined()
        expect(row.when.trim(), `${category.slug}: ${row.family}`).not.toBe('')
        for (const [, href] of row.when.matchAll(/\]\(([^)\s]+)\)/g)) expect(paths.has(href), `${category.slug}: ${href}`).toBe(true)
      }
    }
  })
})
