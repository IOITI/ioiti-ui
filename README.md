# ioiti-ui

IOITI's design system: the design tokens, the React components and the application shell of WATA's admin
interface, as a package any application can install. React 19, Tailwind CSS 4, framer-motion, lucide-react.

- **Two themes**, light and dark, each a full set of tokens; the page follows the system until a theme is
  chosen, and is painted in its theme from the first frame.
- **117 components** (counting their parts): 44 of EasyUI's, reworked for the keyboard, screen readers,
  phones and a light theme; the blocks pages are made of (panels, tiles, tables, fields); and the shell
  (sidebar, top bar, the trail of where a page is).
- **Checked**: every text colour is 4.5:1 on every surface of its theme, one focus ring everywhere, links that
  open in another tab, nothing loaded from another origin (a strict Content-Security-Policy holds).

The gallery shows all of it, in both themes: `npm run gallery` (http://localhost:5180).

## Start a new application

```bash
npx degit IOITI/ioiti-ui/templates/app#v0.1.0 my-app
cd my-app && npm install && npm run dev
```

The template has a sign-in page, the shell with its menu, a dashboard and a list, on React Router.
`templates/app/README.md` says what to change first.

## Add it to an application

```bash
npm install github:IOITI/ioiti-ui#v0.1.0 react react-dom framer-motion react-router
npm install -D tailwindcss@4.3.3 @tailwindcss/vite@4.3.3 vite @vitejs/plugin-react
```

**One line of CSS** brings Tailwind CSS and the design (tokens, fonts, base rules, focus ring). It replaces
`@import "tailwindcss"`: never import both.

```css
/* src/index.css */
@import "ioiti-ui/styles.css";
```

An application that imports Tailwind with options of its own imports `ioiti-ui/design.css` after it instead.

**The Vite plugin** writes the pre-paint theme script beside the pages and its tag first in `<head>`, under the
application's own key; keeps the fonts out of `data:` URIs; makes one React and one framer-motion of a
`file:` link.

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { ioiti } from 'ioiti-ui/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), ioiti({ themeStorageKey: 'my-app.theme' })],
})
```

**Around the pages**: `IoitiProvider` (the theme, the animations as the system asks, the application's name
in every tab's title), and with React Router, `RouterRoot` (the router's links for every component, the
toasts) and `RouterAppShell` (the shell).

```tsx
// src/main.tsx
createRoot(document.getElementById('root')!).render(
  <IoitiProvider appName="My App">
    <RouterProvider router={router} />
  </IoitiProvider>,
)

// src/router.tsx
import { NotFoundPage } from 'ioiti-ui'
import { RouterAppShell, RouterRoot } from 'ioiti-ui/react-router'

export const router = createBrowserRouter([
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
])
```

```tsx
// src/menu.tsx: the sidebar lists it, the top bar's trail says where a page stands in it
export const MENU: Menu = {
  sections: ['Work', 'Settings'],
  entries: [
    { id: 'home', path: '/', label: 'Dashboard', section: 'Work', icon: <LayoutDashboard /> },
    { id: 'orders', path: '/orders', label: 'Orders', section: 'Work', icon: <Receipt /> },
    { id: 'settings', path: '/settings', label: 'Settings', section: 'Settings', icon: <Settings /> },
  ],
}

// a page
export function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="Every order, newest first." actions={<ButtonLink to="/orders/new">New order</ButtonLink>} />
      <KpiGrid>…</KpiGrid>
      <Panel title="Open" dense>
        <Table aria-label="Open orders">…</Table>
      </Panel>
    </>
  )
}
```

Without React Router, give `AppShell` the address (`pathname`) and `LinkProvider` your router's link
(`component`, a link that takes `href`) and navigation (`navigate`).

## The rules of the design

- **Two values for every colour.** A class that names a colour has its dark value beside it
  (`text-neutral-600 dark:text-neutral-400`), or goes through a token that has both (`text-muted-foreground`).
- **Text is 4.5:1** on every surface of its theme, checked by the tests (the gallery's Colours page has the
  table). One pair of the original palette is under: dark `--text-subtle` on a hovered surface (4.44:1).
- **One focus ring**, the stylesheet's, on everything that takes the keyboard's focus.
- **What leads somewhere is a link** (`ButtonLink`, `TextLink`, `href` on menu entries, tabs and actions);
  only actions are buttons.
- **A `Hint`, not a `title`**, for what a control means or why it is disabled: shown on hover, on keyboard
  focus and on a tap, and read by screen readers.
- **One dialog at a time**, drawn in the document's body, keeping the focus.
- **Colour is never alone**: a status has its word (`StatusBadge`), a change its sign (`SignedValue`).

The gallery's Foundations pages say more, with the reasons.

## Content-Security-Policy

The package loads nothing from another origin and needs no inline script. A strict policy suits an
application made with it:

```text
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'
```

`style-src` needs `'unsafe-inline'`: the animations set inline styles.

## Working on it

Node.js 24 (`nvm use`).

```bash
npm ci
npm run gallery          # the gallery on the source, http://localhost:5180
npm run lint             # oxlint, and scripts/check-source.mjs
npm run typecheck
npm test                 # Vitest and Testing Library, jsdom
npm run build            # dist/
npm run build:gallery    # the gallery on dist/
npm run check:package    # the package as a release packs it, installed into the template, built and read
npm run dev              # dist/ kept built, for an application on a file: link
```

`AGENTS.md` holds the conventions of the code; `docs/easyui-changes.md` what was changed in EasyUI's
components and how to add one; `docs/releasing.md` how a version is made; `docs/fidelity.md` how the design
is held to the original; `docs/provenance.md` where everything comes from.

## Licences

MIT (`LICENSE`). The components of EasyUI keep their MIT licence, and the fonts their SIL Open Font License:
`THIRD-PARTY-NOTICES.md`.
