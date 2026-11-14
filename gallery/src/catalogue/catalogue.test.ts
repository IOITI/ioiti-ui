import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import * as core from 'ioiti-ui'
import * as code from 'ioiti-ui/code'
import * as adapter from 'ioiti-ui/react-router'
import { describe, expect, it } from 'vitest'

import { CATEGORIES, exampleKey, FAMILIES, ORDER, readmeOf } from './catalogue'
import { blocks, summaryOf } from './markdown'
import { COMPONENT_PROPS } from './props'
import type { Entry, Examples } from './types'

const ENTRIES: Record<Entry, Record<string, unknown>> = { 'ioiti-ui': core, 'ioiti-ui/react-router': adapter, 'ioiti-ui/code': code }

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
      expect(blocks(readme)[0], family.name).toEqual({ type: 'title', text: family.name })
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
