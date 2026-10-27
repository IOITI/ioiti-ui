import { NotFoundPage } from 'ioiti-ui'
import { RouterAppShell, RouterRoot } from 'ioiti-ui/react-router'
import { createBrowserRouter } from 'react-router'
import type { RouteObject } from 'react-router'

import packageJson from '../../package.json'
import { GallerySearch, ThemeFooterButton } from './chrome'
import { MENU, PAGES } from './routes'

const route = (page: (typeof PAGES)[number]): RouteObject =>
  page.path === '/' ? { index: true, element: page.element } : { path: page.path, element: page.element }

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
        children: [...PAGES.filter((page) => !page.bare).map(route), { path: '*', element: <NotFoundPage /> }],
      },
    ],
  },
]

/** Under the site's path when published (`vite build --base`: `/ioiti-ui/` on GitHub Pages), `/` in development. */
export const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })
