import { Button, ButtonLink, CodeBlock, useToast } from 'ioiti-ui'
import { RouterRoot } from 'ioiti-ui/react-router'
import { ArrowRight } from 'lucide-react'

const ROUTES = `// router.tsx
const router = createBrowserRouter([
  {
    element: <RouterRoot />,
    children: [
      { path: '/sign-in', element: <SignInPage /> },
      {
        element: <RouterAppShell menu={MENU} appDetail="v1.2.0" topBarEnd={<UserMenu … />} />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'orders/:id', element: <OrderPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])

// main.tsx
createRoot(document.getElementById('root')!).render(
  <IoitiProvider appName="My App">
    <RouterProvider router={router} />
  </IoitiProvider>,
)`

/** What a page under it gets: the router's links, and the toasts. */
function Page() {
  const toast = useToast()
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonLink to="/components/shell/app-shell" variant="outline" size="sm" rightIcon={<ArrowRight />}>
        AppShell, through the router
      </ButtonLink>
      <Button variant="outline" size="sm" onClick={() => toast({ title: 'Order saved', variant: 'success' })}>
        Show a toast
      </Button>
    </div>
  )
}

export default function RouterRootRoutes() {
  return (
    <div className="flex flex-col gap-4">
      <CodeBlock language="tsx" code={ROUTES} />
      {/* Given children, it draws them in place of the router's outlet: here, a page under the gallery's own root. */}
      <RouterRoot>
        <Page />
      </RouterRoot>
    </div>
  )
}
