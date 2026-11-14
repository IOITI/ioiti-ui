# RouterRoot

The root route of an application on React Router (`ioiti-ui/react-router`): every link of ioiti-ui goes through the router, and the toasts are shown. `RouterAppShell` is the layout route of the pages in the shell; `RouterLink` is the link both give the components.

**You provide** for `RouterRoot`: nothing (its child routes are its outlet), or `children`; `toastWrapperClassName` to move the toasts (above a bar fixed at the bottom of a page: `bottom-20`). For `RouterAppShell`: `AppShell`'s props but the address (`menu`, `appDetail`, `sidebarFooter`, `topBarChips`, `topBarEnd`, `isWide`, `pageOf`…), its pages its child routes or `children`. `RouterLink` takes `href` and the props of an `<a>`.

```tsx
const router = createBrowserRouter([{
  element: <RouterRoot />,
  children: [
    { path: '/sign-in', element: <SignInPage /> },
    { element: <RouterAppShell menu={MENU} appDetail="v1.2.0" />,
      children: [{ index: true, element: <HomePage /> }, { path: 'orders', element: <OrdersPage /> }, { path: '*', element: <NotFoundPage /> }] },
  ],
}])
```

- The only part of ioiti-ui that imports React Router: the core works without a router, or with another one given to `LinkProvider`.
- A data router (`createBrowserRouter`), under `IoitiProvider`: `RouterLeaveGuard` needs one. The sign-in page and the pages outside the shell stand beside `RouterAppShell`, under `RouterRoot`.
- A plain click is the router's; with ⌘ or Ctrl, the browser opens another tab. A link to a part of the page shown (`#rules`) is a plain `<a>`: the browser scrolls what holds it and keeps the query, which the router's link would drop.
