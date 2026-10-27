# ioiti-ui

IOITI's design system: the design tokens, the React components and the application shell of WATA's admin
interface, as a package any application can install. React 19, Tailwind CSS 4, framer-motion, lucide-react.

- **Themes**: light and dark, each a full set of tokens; with them an accent (neutral, the design as it was,
  or violet, indigo, blue, bloom: a printed flyer's grainy gradient) and a material (flat, or glass). The page
  follows the system until a theme is chosen, shows the application's accent and material until a person
  picks others, and is painted in its look from the first frame.
- **Motion**: calm and the same everywhere, framer-motion's springs and the stylesheets' curves alike. A page
  changes in one cross-fade, the shell still; a look in one cross-fade of the whole page; what floats arrives and
  leaves the same way. Reduced where the system asks.
- **127 components** (counting their parts): 46 of EasyUI's, reworked for the keyboard, screen readers,
  phones and a light theme; the blocks pages are made of (panels, tiles, tables, fields); and the shell
  (sidebar, top bar, the trail of where a page is).
- **Checked**: every text colour is 4.5:1 on every surface of every look (20), one focus ring everywhere, links
  that open in another tab, nothing loaded from another origin (a strict Content-Security-Policy holds).

The gallery shows all of it, in every look: https://ioiti.github.io/ioiti-ui/ (`main`'s, published by CI once every
check passes), or `npm run gallery` (http://localhost:5180).

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

React and React DOM 19.3 at least: the shell changes pages with React's `ViewTransition`.

**One line of CSS** brings Tailwind CSS and the design (tokens, fonts, base rules, focus ring). It replaces
`@import "tailwindcss"`: never import both.

```css
/* src/index.css */
@import "ioiti-ui/styles.css";
```

An application that imports Tailwind with options of its own imports `ioiti-ui/design.css` after it instead.

**The Vite plugin** writes the pre-paint theme script beside the pages and its tag first in `<head>`, under the
application's own key, with its accent and material if it gives them (below); keeps the fonts out of `data:`
URIs; makes one React and one framer-motion of a `file:` link.

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

## Themes

Three choices, each with the others: light or dark, an accent, a material. Neutral and flat are the design as
it was, and the default.

- **An accent** colours what is chosen, current or primary (a filled button, a checked box, a switch on, the
  day picked, the page in the menu, a progress), links, the focus ring and one-series charts: `violet`,
  `indigo`, `blue` or `bloom`. The tones of gain, loss and warning keep their colours. Bloom is a printed
  flyer's grainy gradient: its orchid on all of these, the gradient itself (lilac, pink, tangerine) under a
  grain on a filled button and the application's mark, and with glass the flyer's pink, tangerine and mustard
  as the backdrop.
- **The glass material** turns the sidebar and the top bar, the panels and cards, and what floats over the page
  (popovers, menus, dialogs, toasts, tooltips) to glass, over a still backdrop of colour washes. Only what
  floats is blurred; fields, rows and buttons stay solid.

The application gives its own to the Vite plugin, shown from the first paint:

```ts
ioiti({ themeStorageKey: 'my-app.theme', accent: 'violet', material: 'glass' })
```

`LookPicker`, beside the theme's button, lets each person pick another, kept in their browser under the
application's key; without it, every person sees the application's.

```tsx
<RouterAppShell menu={MENU} topBarEnd={<><LookPicker /><ThemeToggle /></>} />
```

An application's own classes follow them the way the components do: `accent:` and `glass:` variants (on
`data-accent` and `data-material` of `<html>`), the accent's tokens (`bg-brand`, `text-brand-foreground`,
`bg-brand-soft`, `text-brand-text`; for a filled, primary control, `bg-(image:--brand-fill)` and
`text-brand-fill-foreground` after them, the accent's gradient where it has one) and the glass's utilities
(`glass-bar`, `glass-card`, `glass-float`). `useTheme()` says what is shown (`theme`, `accent`, `material`).

## Motion

On by default, and reduced where the system asks: movement goes, fades stay, the loops of spinners stop.

- **A change of page** (`AppShell`) fades the page left out as the new one fades in and rises 6 px, the sidebar and
  the top bar staying as they are, and in use: React 19.3's `ViewTransition`, which React Router's changes of page
  start (with another router, give `AppShell` the new `pathname` in a React transition). A change of the query
  alone, Back and Forward, and a browser without view transitions change the page at once.
- **A change of look** (a theme, an accent, a material) is one cross-fade of the whole page.
- **What floats** (dialogs, sheets, popovers, tooltips, toasts) arrives with `springSnappy` and leaves quicker with
  `easeExit`; a dialog grows from what opened it.

An application's own motion takes the same: `motionTransitions` for framer-motion, `ease-soft`, `ease-fast` and
`ease-exit` for its classes, `motion-safe:` for what moves. `IoitiProvider`'s `reducedMotion` reduces it
everywhere (`always`) or nowhere (`never`). A layer an application fixes over its pages takes `over-page` on
its container: a change of page would cover it otherwise while it plays. It names the layer only then, as a
view-transition name at rest would take the blur of its glass away.

## The rules of the design

- **Two values for every colour.** A class that names a colour has its dark value beside it
  (`text-neutral-600 dark:text-neutral-400`), or goes through a token that has both (`text-muted-foreground`).
- **Text is 4.5:1** on every surface of every look, glass over its backdrop's strongest colours and a grain at
  its strongest speck included, checked by the tests (the gallery's Colours page has the tables). One pair of
  the original palette is under: dark `--text-subtle` on a hovered surface (4.44:1).
- **The accent after the neutral classes, glass by role**: what is chosen or primary keeps its classes and adds
  `accent:` ones; a surface adds `glass-bar`, `glass-card` or `glass-float`. With neutral and flat, nothing
  changes.
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
