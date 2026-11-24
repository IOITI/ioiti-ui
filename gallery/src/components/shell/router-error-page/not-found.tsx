import { NotFoundPage, PageHeader, TextLink } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'
import { RouterAppShell, RouterErrorPage, RouterRoot } from 'ioiti-ui/react-router'
import { LayoutDashboard, Receipt, Users } from 'lucide-react'
import { useState } from 'react'
import { createMemoryRouter, data, RouterProvider, useLoaderData } from 'react-router'
import type { RouteObject } from 'react-router'

const MENU: Menu = {
  sections: [{ id: 'Work', title: false }, 'Settings'],
  entries: [
    { id: 'home', path: '/', label: 'Dashboard', section: 'Work', icon: <LayoutDashboard /> },
    { id: 'orders', path: '/orders', label: 'Orders', section: 'Work', icon: <Receipt /> },
    { id: 'team', path: '/settings/team', label: 'Team', section: 'Settings', icon: <Users /> },
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

// The account signed in: a viewer, and the team is an administrator's to see.
const ACCOUNT = { role: 'viewer' }

function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="Placed this week, newest first." />
      <ul className="flex flex-col gap-1.5 text-sm">
        {ORDERS.map((order) => (
          <li key={order.id}>
            <TextLink to={`/orders/${order.id}`}>Order {order.id}</TextLink>{' '}
            <span className="text-muted-foreground">
              {order.customer}, {order.amount}
            </span>
          </li>
        ))}
        <li>
          <TextLink to="/orders/2026-0017">Order 2026-0017</TextLink> <span className="text-muted-foreground">removed since: its link is an old one</span>
        </li>
      </ul>
    </>
  )
}

function OrderPage() {
  const order = useLoaderData<Order>()
  return <PageHeader title={`Order ${order.id}`} description={`${order.customer}, ${order.amount}.`} />
}

const ROUTES: RouteObject[] = [
  {
    element: <RouterRoot />,
    errorElement: <RouterErrorPage />,
    children: [
      {
        element: (
          <RouterAppShell menu={MENU} appName="My App" appDetail="v1.2.0" topBarEnd={null} shortcutsDialog={false} tabTitle={false} className="h-full" />
        ),
        children: [
          {
            errorElement: <RouterErrorPage />,
            children: [
              { index: true, element: <PageHeader title="Dashboard" description="The figures of the day." /> },
              { path: 'orders', element: <OrdersPage /> },
              {
                path: 'orders/:id',
                // A record the server does not have: a 404, which the router's error page says as the page not found.
                loader: ({ params }) => {
                  const order = ORDERS.find((each) => each.id === params.id)
                  if (!order) throw data(null, { status: 404 })
                  return order
                },
                element: <OrderPage />,
              },
              {
                path: 'settings/team',
                // A page the account may not see: a 403, which the router's error page says as such, without Try again.
                loader: () => {
                  if (ACCOUNT.role !== 'admin') throw data(null, { status: 403 })
                  return null
                },
                element: <PageHeader title="Team" description="Who signs in, and what each may do." />,
              },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
]

export default function RouterErrorPageNotFound() {
  // In memory, under this gallery's address (basename), as the example above.
  const [router] = useState(() => createMemoryRouter(ROUTES, { basename: '/ioiti-ui/', initialEntries: ['/ioiti-ui/orders'] }))
  return (
    <div className="h-[28rem] overflow-hidden rounded-xl border border-border">
      <RouterProvider router={router} />
    </div>
  )
}
