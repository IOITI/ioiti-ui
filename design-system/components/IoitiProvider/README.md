# IoitiProvider

What every page of an application needs, put once around its router: the theme (the system's, or the one chosen), the motion as the system asks, the registry of its keyboard shortcuts, and its name, which ends the title of every tab.

**You provide** `appName` ("Orders · My App" in a tab), `themeStorageKey` (where the choice is kept: one key per application; the Vite plugin's by default), `reducedMotion` (`user` · `always` · `never`), the router as `children`. Alone, `ThemeProvider` holds the theme (`storageKey`, `children`), and `LinkProvider` gives every component the application's link (`component`, given `href` and the props of an `<a>`; `navigate`, which follows an address from code).

```tsx
createRoot(document.getElementById('root')!).render(
  <IoitiProvider appName="My App" themeStorageKey="my-app.theme">
    <RouterProvider router={router} />
  </IoitiProvider>,
)
```

- Once, around everything, the sign-in page included: `ThemeToggle`, `LookPicker` and `UserMenu`'s appearance read it (`useTheme()`), `useShortcut` registers in it, `PageHeader` names the tab with it.
- With React Router, `RouterRoot` (`ioiti-ui/react-router`) adds the router's links and the toasts under it; without, put `LinkProvider` and `ToastProvider` there yourself.
- The Vite plugin's script writes the theme on `<html>` before the first paint (`ioiti({ themeStorageKey })`): give the provider the same key, or none.
- Reduced (the system's setting, or `always`), movement goes and fades stay: framer-motion's and the stylesheets' alike.
