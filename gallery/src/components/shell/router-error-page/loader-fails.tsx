import { NotFoundPage, PageHeader, TextLink } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'
import { RouterAppShell, RouterErrorPage, RouterRoot } from 'ioiti-ui/react-router'
import { LayoutDashboard, Receipt } from 'lucide-react'
import { useState } from 'react'
import { createMemoryRouter, RouterProvider, useLoaderData, useNavigation } from 'react-router'
import type { RouteObject } from 'react-router'

const MENU: Menu = {
  sections: [{ id: 'Work', title: false }],
  entries: [
    { id: 'home', path: '/', label: 'Dashboard', section: 'Work', icon: <LayoutDashboard /> },
    { id: 'orders', path: '/orders', label: 'Orders', section: 'Work', icon: <Receipt /> },
  ],
}

interface Order {
  id: string
  customer: string
  amount: string
}

const ORDERS: Order[] = [
  { id: '2026-0042', customer: 'Acme', amount: '1,840.00 €' },
  { id: '2026-0041', customer: 'Globex', amount: '312.50 €' },
]

function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="The figures of the day." />
      <p className="text-sm text-muted-foreground">
        The server of the orders fails the first time it is asked: <TextLink to="/orders">open the orders</TextLink>.
      </p>
    </>
  )
}

function OrdersPage() {
  const orders = useLoaderData<Order[]>()
  return (
    <>
      <PageHeader title="Orders" description="Placed this week, newest first." />
      <ul className="flex flex-col gap-1.5 text-sm">
        {orders.map((order) => (
          <li key={order.id}>
            Order {order.id} <span className="text-muted-foreground">{order.customer}, {order.amount}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

/** The shell, its thin bar showing while the next page loads (the orders, the first time and on Try again). */
function Shell() {
  const navigation = useNavigation()
  return (
    <RouterAppShell
      menu={MENU}
      appName="My App"
      appDetail="v1.2.0"
      pending={navigation.state === 'loading'}
      topBarEnd={null}
      shortcutsDialog={false}
      tabTitle={false}
      className="h-full"
    />
  )
}

/** The application's routes, as the starter template has them: every page under one route of the router's errors. */
function routes(): RouteObject[] {
  // The server of the orders, here: it takes a moment to answer, fails the first time it is asked, then answers.
  let asked = 0
  return [
    {
      element: <RouterRoot />,
      // The last resort, for what fails outside the shell: a page of its own.
      errorElement: <RouterErrorPage />,
      children: [
        {
          element: <Shell />,
          children: [
            {
              // A page that fails to load or to draw shows what went wrong here, in the shell, which stays.
              errorElement: <RouterErrorPage />,
              children: [
                { index: true, element: <DashboardPage /> },
                {
                  path: 'orders',
                  loader: async () => {
                    await new Promise((resolve) => window.setTimeout(resolve, 400))
                    asked += 1
                    if (asked === 1) throw new Error('The server answered 500 Internal Server Error.')
                    return ORDERS
                  },
                  element: <OrdersPage />,
                },
                { path: '*', element: <NotFoundPage /> },
              ],
            },
          ],
        },
      ],
    },
  ]
}

export default function RouterErrorPageLoaderFails() {
  // In memory, as a test makes one: its address is its own, not the browser's (an application's router is
  // createBrowserRouter's). Under this gallery's address (basename): its links, opened in another tab, stay in it.
  // It opens on the dashboard, the orders a link away, as a person meets a page that fails; the shell's thin bar shows
  // while the orders load, the first time and on Try again.
  const [router] = useState(() => createMemoryRouter(routes(), { basename: '/ioiti-ui/', initialEntries: ['/ioiti-ui/'] }))
  return (
    <div className="h-[28rem] overflow-hidden rounded-xl border border-border">
      <RouterProvider router={router} />
    </div>
  )
}
