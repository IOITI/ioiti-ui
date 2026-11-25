import { Loader, NotFoundPage } from 'ioiti-ui'
import { RouterErrorPage, RouterRoot } from 'ioiti-ui/react-router'
import type { RouteObject } from 'react-router'

import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { Shell } from './Shell'

/** The application's routes: src/main.tsx gives them to the browser's router, the tests to one kept in memory. */
export const routes: RouteObject[] = [
  {
    // Every link of ioiti-ui goes through the router, and the toasts are shown.
    element: <RouterRoot />,
    // The last resort, for what fails outside the shell (the sign-in page): a page of its own.
    errorElement: <RouterErrorPage />,
    children: [
      { path: '/login', element: <LoginPage /> },
      {
        element: <Shell />,
        children: [
          {
            // Every page, under one route of the router's errors: a page that fails to load or to draw (its loader
            // threw, its code failed to arrive) shows what went wrong in the shell, which stays.
            errorElement: <RouterErrorPage />,
            // While the first page's code arrives: nothing for a moment, then a spinner.
            hydrateFallbackElement: <Loader delay={300} className="mx-auto mt-24" />,
            children: [
              { index: true, element: <HomePage /> },
              // A page loaded when it is first opened: its code a file of its own, out of the first page's.
              { path: 'items', lazy: () => import('./pages/ItemsPage').then((module) => ({ Component: module.ItemsPage })) },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
]
