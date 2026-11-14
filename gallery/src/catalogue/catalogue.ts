import { plain, summaryOf } from './markdown'
import type { CategoryInfo, ExampleInfo, FamilyInfo } from './types'

/** The categories, in the order of the sidebar: the frame first, then what a page is made of, then its content. */
export const ORDER = [
  'shell',
  'layout',
  'top-bar',
  'actions',
  'forms',
  'choices',
  'dates',
  'feedback',
  'states',
  'overlays',
  'navigation',
  'tables',
  'figures',
  'charts',
  'code',
  'ai',
] as const

const loaded = import.meta.glob<CategoryInfo>('../components/*/category.ts', { eager: true, import: 'default' })

const rank = (slug: string) => {
  const index = (ORDER as readonly string[]).indexOf(slug)
  return index === -1 ? ORDER.length : index
}

/** Every category, in order. */
export const CATEGORIES: CategoryInfo[] = Object.values(loaded).sort((a, b) => rank(a.slug) - rank(b.slug))

/** The guidelines of each component, by its name (`design-system/components/<name>/README.md`). */
const READMES: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>('../../../design-system/components/*/README.md', { eager: true, query: '?raw', import: 'default' }),
  ).map(([path, text]) => [path.split('/').at(-2) ?? path, text]),
)

export const COMPONENTS_PATH = '/components'

export const categoryPath = (category: CategoryInfo) => `${COMPONENTS_PATH}/${category.slug}`
export const familyPath = (category: CategoryInfo, family: FamilyInfo) => `${categoryPath(category)}/${family.slug}`
/** An example's key among its category's examples, and its file: `<family>/<example>`. */
export const exampleKey = (family: FamilyInfo, example: ExampleInfo) => `${family.slug}/${example.id}`

/** A family where it stands. */
export interface Placed {
  category: CategoryInfo
  family: FamilyInfo
  path: string
}

/** Every family, in the order of their categories. */
export const FAMILIES: Placed[] = CATEGORIES.flatMap((category) =>
  category.families.map((family) => ({ category, family, path: familyPath(category, family) })),
)

export function readmeOf(family: FamilyInfo): string | undefined {
  return READMES[family.name]
}

/** A family's summary, in Markdown (its guidelines' first paragraph). */
export function summaryOfFamily(family: FamilyInfo): string {
  const readme = readmeOf(family)
  return readme ? summaryOf(readme) : ''
}

/** The same, as plain words. */
export function plainSummary(family: FamilyInfo): string {
  return plain(summaryOfFamily(family))
}

/** The line an application imports a family with. */
export function importLine(family: FamilyInfo): string {
  return `import { ${family.names.join(', ')} } from '${family.entry ?? 'ioiti-ui'}'`
}
