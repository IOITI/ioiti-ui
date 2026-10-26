import { Button, ButtonLink, PageHeader, Panel, ThemeToggle, useToast } from 'ioiti-ui'
import { ArrowRight } from 'lucide-react'

import { Code, Demo } from '../parts'

function ToastButton() {
  const toast = useToast()
  return (
    <Button variant="outline" size="sm" onClick={() => toast({ title: 'Saved', description: 'Toasts come one at a time, at the bottom.', variant: 'success' })}>
      Show a toast
    </Button>
  )
}

export function GettingStarted() {
  return (
    <>
      <PageHeader
        title="ioiti-ui"
        description="IOITI's design system: the tokens, the components and the frame of its applications, for React 19 and Tailwind CSS 4."
        actions={
          <ButtonLink to="/patterns/dashboard" variant="outline" size="sm" rightIcon={<ArrowRight className="size-3.5" />}>
            A page made with it
          </ButtonLink>
        }
      />

      <Panel title="Start a new application" description="The starter template has the shell, a sign-in page, a dashboard and a list, ready to change.">
        <Code>{`npx degit IOITI/ioiti-ui/templates/app#v0.1.0 my-app
cd my-app && npm install && npm run dev`}</Code>
      </Panel>

      <Panel title="Or add it to an application" description="Installed from a tag of its repository: a release carries the package built, nothing is built on install.">
        <div className="space-y-3">
          <Code>{`npm install github:IOITI/ioiti-ui#v0.1.0 react react-dom framer-motion react-router
npm install -D tailwindcss@4.3.3 @tailwindcss/vite@4.3.3`}</Code>
          <p className="text-sm text-muted-foreground">
            One line of CSS brings Tailwind and the design: the tokens of both themes, the fonts, the focus ring. It
            replaces <code>@import "tailwindcss"</code>, never sits beside it.
          </p>
          <Code>{`/* src/index.css */
@import "ioiti-ui/styles.css";`}</Code>
          <p className="text-sm text-muted-foreground">
            The Vite plugin sets the theme before the first paint (no flash of the other one), under the
            application's own key, and keeps the fonts out of <code>data:</code> URIs for a strict
            Content-Security-Policy.
          </p>
          <Code>{`// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { ioiti } from 'ioiti-ui/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), ioiti({ themeStorageKey: 'my-app.theme' })],
})`}</Code>
        </div>
      </Panel>

      <Demo
        id="providers"
        title="Around the pages"
        description="IoitiProvider holds the theme, the animations (reduced when the system asks) and the application's name, which ends every tab's title. LinkProvider gives every component the application's link; ToastProvider shows the toasts. With React Router, RouterRoot does both."
        names={['IoitiProvider', 'ThemeProvider', 'ThemeToggle', 'LinkProvider', 'ToastProvider']}
        className="flex-col items-start"
      >
        <Code>{`createRoot(document.getElementById('root')!).render(
  <IoitiProvider appName="My App">
    <RouterProvider router={router} />
  </IoitiProvider>,
)`}</Code>
        <div className="flex flex-wrap items-center gap-3">
          <ToastButton />
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <ThemeToggle /> follows the system, then light, then dark: it says which, and what a press does.
          </span>
        </div>
      </Demo>

      <Demo
        id="react-router"
        title="With React Router"
        description="The core imports no router. This entry gives the router's links to every component (a link opens in another tab with ⌘ or Ctrl, as any link), and the shell its address and outlet."
        names={['RouterRoot', 'RouterAppShell', 'RouterLink']}
        from="ioiti-ui/react-router"
        className="flex-col items-start"
      >
        <Code>{`const router = createBrowserRouter([
  {
    element: <RouterRoot />,
    children: [
      { path: '/login', element: <LoginPage /> },
      {
        element: <RouterAppShell menu={MENU} appDetail="v1.0.0" />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])`}</Code>
      </Demo>
    </>
  )
}
