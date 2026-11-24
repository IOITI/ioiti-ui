# RouterErrorPage

What a route shows when it fails (`ioiti-ui/react-router`, a route's `errorElement`): its loader threw, its page threw as it drew, or its code failed to load. A 404 is the page not found, a 401 or a 403 a page the person may not see, anything else an `ErrorState` whose Try again runs the route again.

**You provide** nothing but its place, a route's `errorElement`; `report={false}` where the application reports the router's errors itself (`RouterProvider`'s `onError`): `IoitiProvider`'s `onError` is told of each once otherwise.

```tsx
const router = createBrowserRouter([{
  element: <RouterRoot />,
  errorElement: <RouterErrorPage />, // the last resort, outside the shell
  children: [
    { path: '/sign-in', element: <SignInPage /> },
    { element: <RouterAppShell menu={MENU} />,
      children: [{ errorElement: <RouterErrorPage />, // every page, in the shell
        children: [{ index: true, element: <HomePage /> }, { path: 'orders/:id', loader: loadOrder, element: <OrderPage /> },
          { path: '*', element: <NotFoundPage /> }] }] },
  ],
}])
```

- On a route without a path under `RouterAppShell`'s, holding every page: a page that fails shows what went wrong in the shell, which stays, its menu still leading elsewhere. On the root as well, the last resort for what fails outside the shell (the sign-in page): a page of its own there.
- A loader says what is wrong by the response it throws: `throw data(null, { status: 404 })` for a record that does not exist (the page not found, which suggests the entry its address is under); 401 or 403 for a page the person may not see, without Try again, which would change nothing.
- Try again runs the route again, its loaders and its page (`useRevalidator`); a part of the application that failed to load (a new version published since the page was opened) is reloaded instead.
- The router's catches what a page throws as it draws before AppShell's boundary does, which catches it where no route has an `errorElement`. Either tells `IoitiProvider`'s `onError`, once.
- It needs a data router (`createBrowserRouter`), as `RouterLeaveGuard` does. Without React Router, AppShell's boundary and `ErrorState` say the same.
