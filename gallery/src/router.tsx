import { NotFoundPage } from 'ioiti-ui'
import { RouterAppShell, RouterRoot } from 'ioiti-ui/react-router'
import { createBrowserRouter } from 'react-router'
import type { RouteObject } from 'react-router'

import packageJson from '../../package.json'
import { CategoryPage } from './catalogue/CategoryPage'
import { FamilyPage } from './catalogue/FamilyPage'
import { GONE } from './catalogue/legacy'
import { LegacyRedirect } from './catalogue/LegacyRedirect'
import type { Examples } from './catalogue/types'
import { GallerySearch, ThemeFooterButton } from './chrome'
import { MENU, PAGES, type GalleryPage } from './routes'

/** Each category's examples: a chunk of their own, loaded with the first of its pages. */
const EXAMPLES = import.meta.glob<{ default: Examples }>('./components/*/examples.ts')

function loadExamples(slug: string): Promise<Examples> {
  const load = EXAMPLES[`./components/${slug}/examples.ts`]
  return load ? load().then((module) => module.default) : Promise.resolve({})
}

function route(page: GalleryPage): RouteObject {
  const where = page.path === '/' ? { index: true as const } : { path: page.path }
  const { category, family } = page
  if (category) {
    return {
      ...where,
      lazy: async () => {
        const examples = await loadExamples(category.slug)
        return {
          element: family ? (
            <FamilyPage category={category} family={family} examples={examples} />
          ) : (
            <CategoryPage category={category} examples={examples} />
          ),
        }
      },
    }
  }
  return { ...where, element: page.element }
}

/** The former pages whose address is no page now: to where their parts went. */
const LEGACY_ROUTES: RouteObject[] = Object.keys(GONE).map((path) => ({ path, element: <LegacyRedirect /> }))

/** The gallery is an application made with ioiti-ui: its own frame is the shell it shows. */
export const routes: RouteObject[] = [
  {
    element: <RouterRoot />,
    children: [
      ...PAGES.filter((page) => page.bare).map(route),
      {
        element: (
          <RouterAppShell
            menu={MENU}
            appDetail={`v${packageJson.version}`}
            sidebarFooter={<ThemeFooterButton />}
            topBarEnd={<GallerySearch />}
          />
        ),
        children: [...PAGES.filter((page) => !page.bare).map(route), ...LEGACY_ROUTES, { path: '*', element: <NotFoundPage /> }],
      },
    ],
  },
]

/** Under the site's path when published (`vite build --base`: `/ioiti-ui/` on GitHub Pages), `/` in development. */
export const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })
