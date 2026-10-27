# Where ioiti-ui comes from

ioiti-ui is the design of the admin interface of WATA (IOITI's trading assistant), as it was at WATA v0.50.1
(IOITI/WATA `e656282`, `admin_ui/`, 2026-10-26), made into a package any application can install.

| ioiti-ui | From WATA's `admin_ui/src/` |
|---|---|
| `src/styles/tokens.css` | `styles/tokens.css` (EasyUI's tokens), byte for byte |
| `src/styles/theme.css` | `styles/theme.css`: the values unchanged, the comments made general |
| `src/styles/design.css` | `styles/index.css` from its `@custom-variant` to its end, unchanged but two comments, the package's `@source`, and ioiti-ui's imports of `accents.css` and `glass.css` and its `accent` and `glass` variants |
| `src/styles/accents.css`, `src/styles/glass.css` | nothing: ioiti-ui's own, the accents and the glass material (`docs/fidelity.md`) |
| `src/styles/motion.css`, `src/lib/motion.ts` | nothing: ioiti-ui's own, the motion for the stylesheets and the page, a page's and a look's changes (`docs/fidelity.md`) |
| `src/styles/styles.css` | the first line of `styles/index.css` (`@import "tailwindcss"`) and `design.css` |
| `src/theme.js` | `public/theme.js`, its key taken from its tag (`data-storage-key`); the accent and the material are ioiti-ui's own |
| `src/components/ui/*` | `components/ui/*` (EasyUI's components with WATA's changes, `docs/easyui-changes.md`) |
| `src/components/*` | `components/{Hint,KpiTile,Panel,CheckList,ExportButton,DateRangeFilter,ButtonLink,PeekLink,ThemeProvider,ThemeToggle,ToastProvider,status}` and their contexts |
| `src/shell/*` | `components/{AppShell,PageTrail,page-trail-context,navigation,NotFoundState}`, `features/NotFoundPage.tsx`, the frame of `features/auth/LoginPage.tsx` |
| `src/lib/*` | `lib/{utils,links,motion-tokens,theme,format,csv,dateRange,checks,chart-primitives,dashboard-chart-utils}` |
| `Field`, `IconButton`, `Table`…, `EmptyText`, `ErrorText`, `KpiGrid`, `TextLink` | class recipes WATA's pages wrote by hand, with the same classes |
| `LookPicker` | nothing: ioiti-ui's own |

The name of the application and of its broker appear nowhere in the package's code, its gallery or its template
(`scripts/check-source.mjs`): only in these documents, which say where it comes from.

## What was renamed

| WATA | ioiti-ui | Why |
|---|---|---|
| `ConfirmLiveAction` | `ConfirmAction` | Its default warning was about WATA's live trading account; `warning` is given by the caller now. |
| `PnlValue` | `SignedValue` | A signed figure, a gain or a loss of anything. |
| `ServiceStatusBadge` (`ServiceStatus`, `SERVICE_STATUS_LABEL`) | `StatusBadge` (`HealthStatus`, `HEALTH_STATUS_LABEL`) | The same states and words, for anything a health check reports. |
| `payment-status` (`PaymentStatus`…) | `request-status` (`RequestStatus`…) | What it shows since WATA's changes: a request followed to its outcome. |
| `THEME_STORAGE_KEY` (`wata.theme`) | `DEFAULT_THEME_STORAGE_KEY` (`ioiti.theme`), or the application's own key | One key per application. |
| `AppShell` (WATA's, with its menu, chips and pill) | `AppShell` / `RouterAppShell` (the menu and the top bar's ends given) | The frame without WATA's content. |
| `trailFor(pathname, page)`, `menuEntry(pathname)` | `trailFor(menu, pathname, page)`, `menuEntry(menu, pathname)` | The menu is the application's. |
| `useTabTitle` (`… · WATA Admin`) | `useTabTitle` (`… · ` the name given to `IoitiProvider`) | The application's name. |

## What stayed in WATA

What only means something for trading or for WATA's server: the command palette's entries
(`CommandPalette`, `commandItems`), the menu (`MENU`), the brands' marks (`BrandMark`), the Recharts charts
on WATA's types (`components/charts/*`), the price chart (Lightweight Charts), `ActionBadge`, `ClaudeBadge`,
`PeekRouterLink`, `labels`, `types`, `api`, `formatWallTime`, and every page.

## WATA on the package

WATA's admin interface moved onto the package on 2026-10-27, with 0.2.1 (0.2.0 sent a check's link to a part
of the page through the router: the one regression found, fixed here). What it took, and what another
application moving onto the package can expect:

1. `npm install github:IOITI/ioiti-ui#v<version>` in `admin_ui`. The lock records the commit as
   `git+ssh://git@github.com/IOITI/ioiti-ui.git#<sha>`, which npm fetches from GitHub as an HTTPS tarball, no SSH
   key needed (CI, `package.sh`).
2. `src/styles/index.css` became `@import "ioiti-ui/styles.css";`; `tokens.css` and `theme.css` went.
3. Imports of `@/components/ui/*` and of the generic components and helpers above became `'ioiti-ui'`, by a
   codemod over every import; WATA's copies and their tests went (the package holds them).
4. The renames above: `PnlValue` became `SignedValue`, `ServiceStatusBadge` `StatusBadge`, `PaymentStatus`
   `RequestStatus`; `ConfirmLiveAction` stayed in WATA as a few lines around `ConfirmAction` with its warning,
   and `NotFoundState` as a few lines giving the package's its way back ("Back to the dashboard") and the router's
   address.
5. `App.tsx` puts `IoitiProvider appName="WATA Admin"` around the router, and `RouterRoot` at its root route
   (`toastWrapperClassName="bottom-20"`), in place of `ThemeProvider`, `MotionConfig` and `ToastProvider`.
6. `AppShell.tsx` keeps WATA's own content and gives it to `RouterAppShell` (the menu with its icons, the chips,
   the top bar's end, signing out, the version, the wide pages).
7. `public/theme.js` went: the Vite plugin writes the package's (`ioiti({ themeStorageKey: 'wata.theme' })`),
   so the choices kept in browsers stay.
8. The tests: a page rendered alone whose test follows a link the package draws is mounted under `RouterRoot`,
   as the application mounts it (without a `LinkProvider` the link is a plain `<a>`, which jsdom does not
   follow); a test that reads the tab's title gives `IoitiProvider` the application's name; the contexts are not
   exported, so a theme is switched through `ThemeProvider` (the system's setting stubbed) and a toast is read on
   the screen.
9. Checked as `docs/fidelity.md` says, and more: the built CSS rule by rule against the build before (every
   rule kept, in the same order; the package adds its accents' and glass's) and the computed styles of every
   element of 26 pages, in both themes and at a phone's width too.
