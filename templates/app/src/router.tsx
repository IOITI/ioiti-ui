import { LookPicker, NotFoundPage, SidebarFooterButton, ThemeToggle } from 'ioiti-ui'
import { RouterAppShell, RouterRoot } from 'ioiti-ui/react-router'
import { LogOut } from 'lucide-react'
import { createBrowserRouter, useNavigate } from 'react-router'

import { MENU } from './menu'
import { HomePage } from './pages/HomePage'
import { ItemsPage } from './pages/ItemsPage'
import { LoginPage } from './pages/LoginPage'

function SignOut() {
  const navigate = useNavigate()
  return <SidebarFooterButton icon={<LogOut />} label="Sign out" onClick={() => void navigate('/login')} />
}

export const router = createBrowserRouter([
  {
    // Every link of ioiti-ui goes through the router, and the toasts are shown.
    element: <RouterRoot />,
    children: [
      { path: '/login', element: <LoginPage /> },
      {
        // The top bar ends with the accent and material (each person's own), then the theme.
        element: (
          <RouterAppShell
            menu={MENU}
            appDetail="v0.1.0"
            sidebarFooter={<SignOut />}
            topBarEnd={
              <>
                <LookPicker />
                <ThemeToggle />
              </>
            }
          />
        ),
        children: [
          { index: true, element: <HomePage /> },
          { path: 'items', element: <ItemsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
