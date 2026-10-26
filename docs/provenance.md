# Where ioiti-ui comes from

ioiti-ui is the design of the admin interface of WATA (IOITI's trading assistant), as it was at WATA v0.50.1
(IOITI/WATA `e656282`, `admin_ui/`, 2026-10-26), made into a package any application can install.

| ioiti-ui | From WATA's `admin_ui/src/` |
|---|---|
| `src/styles/tokens.css` | `styles/tokens.css` (EasyUI's tokens), byte for byte |
| `src/styles/theme.css` | `styles/theme.css`: the values unchanged, the comments made general |
| `src/styles/design.css` | `styles/index.css` from its `@custom-variant` to its end, unchanged but two comments, and the package's `@source` |
| `src/styles/styles.css` | the first line of `styles/index.css` (`@import "tailwindcss"`) and `design.css` |
| `src/theme.js` | `public/theme.js`, its key taken from its tag (`data-storage-key`) |
| `src/components/ui/*` | `components/ui/*` (EasyUI's components with WATA's changes, `docs/easyui-changes.md`) |
| `src/components/*` | `components/{Hint,KpiTile,Panel,CheckList,ExportButton,DateRangeFilter,ButtonLink,PeekLink,ThemeProvider,ThemeToggle,ToastProvider,status}` and their contexts |
| `src/shell/*` | `components/{AppShell,PageTrail,page-trail-context,navigation,NotFoundState}`, `features/NotFoundPage.tsx`, the frame of `features/auth/LoginPage.tsx` |
| `src/lib/*` | `lib/{utils,links,motion-tokens,theme,format,csv,dateRange,checks,chart-primitives,dashboard-chart-utils}` |
| `Field`, `IconButton`, `Table`…, `EmptyText`, `ErrorText`, `KpiGrid`, `TextLink` | class recipes WATA's pages wrote by hand, with the same classes |

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

## When WATA moves onto the package

Not done yet (a later WATA release). What it takes:

1. `npm install github:IOITI/ioiti-ui#v<version>` in `admin_ui`; CI and `package.sh` then fetch it from
   GitHub (a public repository needs no token).
2. `src/styles/index.css` becomes `@import "ioiti-ui/styles.css";`; `tokens.css` and `theme.css` go.
3. Imports of `@/components/ui/*` and of the generic components and helpers above become `'ioiti-ui'`;
   WATA's copies and their tests go (the package holds them).
4. The renames above. `ConfirmLiveAction` can stay in WATA as a few lines around `ConfirmAction` with its
   warning; `PnlValue` as `SignedValue`.
5. `App.tsx` puts `IoitiProvider appName="WATA Admin" themeStorageKey="wata.theme"` around the router (the
   choices kept in browsers stay), and `RouterRoot` at its root route, in place of `ThemeProvider`,
   `MotionConfig` and `ToastProvider` (`toastWrapperClassName="bottom-20"`, above the configuration page's
   bar).
6. `AppShell.tsx` keeps WATA's own content and gives it to `RouterAppShell`: the menu (`navigation.ts`, with
   its icons), `topBarChips` (Saxo's authorisation, the restart), `topBarEnd` (the live pill, the live dot,
   the palette, the bell, the theme button, the services' badge), `sidebarFooter` (sign out), `appDetail`
   (the version), `isWide` (the editor, the charts). `tests/test_config_catalog.py` reads
   `MENU_SECTIONS` in `navigation.ts`: keep that line.
7. `public/theme.js` stays (it is served as it is, CSP and all), its key `wata.theme`, or becomes the
   package's through the Vite plugin (`ioiti({ themeStorageKey: 'wata.theme' })`), which also sets
   `assetsInlineLimit: 0`, as WATA does.
8. Check as `docs/fidelity.md` says: the same tokens and the same shell in both themes.
