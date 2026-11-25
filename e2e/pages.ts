// The gallery's pages, read where the gallery reads them: its groups and their families (each category.ts, plain
// data), and its pages of foundations and patterns (routes.tsx, by their paths).
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

export interface Family {
  slug: string
  name: string
  path: string
  /** The id of its first example (`[data-example]`), what its screenshot shows. */
  firstExample: string
}

export interface GalleryPage {
  path: string
  label: string
  family?: Family
}

interface CategoryInfo {
  slug: string
  label: string
  families: { slug: string; name: string; examples: { id: string }[] }[]
}

const COMPONENTS = join(root, 'gallery/src/components')
const groups: CategoryInfo[] = []
for (const name of readdirSync(COMPONENTS).sort()) {
  const file = join(COMPONENTS, name, 'category.ts')
  try {
    readFileSync(file)
  } catch {
    continue
  }
  groups.push(((await import(pathToFileURL(file).href)) as { default: CategoryInfo }).default)
}

const routes = readFileSync(join(root, 'gallery/src/routes.tsx'), 'utf8')
const fixed = [...routes.matchAll(/\{ id: '(\/(?:foundations|patterns)\/[^']+)', path: '[^']+', label: '([^']+)'/g)].map(([, path, label]) => ({
  path,
  label,
}))

export const FAMILIES: Family[] = groups.flatMap((group) =>
  group.families.map((family) => ({
    slug: family.slug,
    name: family.name,
    path: `/components/${group.slug}/${family.slug}`,
    firstExample: family.examples[0]?.id ?? '',
  })),
)

export const PAGES: GalleryPage[] = [
  { path: '/', label: 'Getting started' },
  { path: '/components', label: 'All components' },
  ...fixed,
  ...groups.flatMap((group) => [
    { path: `/components/${group.slug}`, label: group.label },
    ...FAMILIES.filter((family) => family.path.startsWith(`/components/${group.slug}/`)).map((family) => ({ path: family.path, label: family.name, family })),
  ]),
]

if (PAGES.length < 150 || fixed.length < 12) {
  throw new Error(`e2e/pages.ts found ${PAGES.length} pages (${fixed.length} of foundations and patterns): the gallery has more; read routes.tsx again`)
}

/** The pages Firefox and WebKit load too (@smoke): one of each kind, and the ones that move the most. */
export const SMOKE = new Set([
  '/',
  '/components',
  '/foundations/colours',
  '/foundations/motion',
  '/patterns/dashboard',
  '/patterns/sign-in',
  '/components/overlays/dialog',
  '/components/shell/app-shell',
  '/components/tables/data-table',
  '/components/choices/select-menu',
])
