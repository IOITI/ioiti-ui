import { Loader, LookPicker, NotFoundPage, SidebarFooterButton, ThemeToggle } from 'ioiti-ui'
import { RouterAppShell, RouterErrorPage, RouterRoot } from 'ioiti-ui/react-router'
import { LogOut } from 'lucide-react'
import { createBrowserRouter, useNavigate, useNavigation } from 'react-router'

import { version } from '../package.json'
import { MENU } from './menu'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'

function SignOut() {
  const navigate = useNavigate()
  return <SidebarFooterButton icon={<LogOut />} label="Sign out" onClick={() => void navigate('/login')} />
}

/** The shell, which shows a thin bar under the top bar while the next page loads (its code, its data). */
function Shell() {
  const navigation = useNavigation()
  return (
    <RouterAppShell
      menu={MENU}
      appDetail={`v${version}`}
      sidebarFooter={<SignOut />}
      pending={navigation.state === 'loading'}
      // The top bar ends with the accent and material (each person's own), then the theme.
      topBarEnd={
        <>
          <LookPicker />
          <ThemeToggle />
        </>
      }
    />
  )
}

export const router = createBrowserRouter([
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
])
