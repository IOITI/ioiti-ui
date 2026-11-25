# My App

An application made with [ioiti-ui](https://github.com/IOITI/ioiti-ui): React 19, React Router,
Tailwind CSS 4 and Vite. It starts with a sign-in page, the shell (sidebar, top bar, the trail of
where a page is), a dashboard and a list, on example data; and with its checks: lint, types, tests,
and the CI that runs them.

## Start

Node.js 24 (`nvm use`), CI's too. It builds on the oldest Node `engines` allows (`package.json`, ioiti-ui's
own); its tests need a more recent one (jsdom's).

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # lint, types, tests, then the build: what CI runs
npm run build      # dist/: typechecked, then built
npm run preview    # serves dist/, under the Content-Security-Policy below
```

## Make it yours

- **The name**: `appName` in `src/main.tsx` (the sidebar, every tab's title), the `<title>` of
  `index.html`, the `name` of `package.json`, `title` in `src/pages/LoginPage.tsx`. The sidebar shows the
  `version` of `package.json` under the name (`src/Shell.tsx`).
- **The theme's key**: `themeStorageKey` in `vite.config.ts`. One key per application, or two
  applications on one site share the theme chosen.
- **The look**: an accent (`neutral`, `violet`, `indigo`, `blue`, `bloom`, `lagoon`, `aurora`, `dusk`, `golden`) and a material (`flat`,
  `glass`), given beside the key, `ioiti({ themeStorageKey: 'my-app.theme', accent: 'violet', material:
  'glass' })`: the application's own, from the first paint. Each person can pick another with the palette
  button of the top bar (`LookPicker`, in `src/Shell.tsx`), kept in their browser; take it out for one
  look for all.
- **The menu**: `src/menu.tsx`. Each entry is a page; a page deeper than the menu (`/items/42`)
  stands under the entry its address starts with, and names itself with `PageHeader`.
- **The pages**: `src/pages/`, routed in `src/router.tsx`. The data of `src/data.ts` are examples.
- **The errors**: a page that fails to draw or to load shows what went wrong in the shell, which stays
  (`RouterErrorPage`, `src/router.tsx`), and is told to `src/errors.ts` (`IoitiProvider`'s `onError`): send it to
  your error tracker there.
- **The pages loaded later**: `items` is loaded the first time it is opened (`lazy` in `src/router.tsx`), its code a
  file of its own; a thin bar under the top bar shows while the next page loads.
- **The sign-in**: `src/pages/LoginPage.tsx` checks nothing yet. Its single sign-on button leads to a
  placeholder address (`/api/auth/sso/login`): give it your server's, which sends the browser on to the
  identity provider, or take `PROVIDERS` out for the password alone.

## Checks

`npm run check` runs them one after the other, as CI does.

- **Lint**: `npm run lint`, oxlint with `.oxlintrc.json`: what is outright wrong, React's rules of hooks, what a
  screen reader and a keyboard need (jsx-a11y), the tests' mistakes. A warning fails it as an error does.
- **Types**: `npm run typecheck`, TypeScript over `src/` and `vite.config.ts`.
- **Tests**: `npm test`, Vitest in jsdom (`test` in `vite.config.ts`). `src/router.test.tsx` opens the pages through
  the application's routes, on a router kept in memory: each draws its heading in the shell, and a page that throws
  shows what went wrong there, reported once. A new page adds its address.
- **CI**: `.github/workflows/ci.yml`, on every push to `main` and every pull request, on the Node of `.nvmrc`:
  installs what `package-lock.json` holds (`npm ci`: commit it), then runs `npm run check`. Its actions are pinned to
  a commit, the version beside it.
- **Updates**: `.github/dependabot.yml` proposes, once a week, the actions' next commits and the dependencies' next
  versions (ioiti-ui's next tag among them), grouped, each a pull request CI holds.

## Languages

English as Britain writes it, by default. In French, `IoitiProvider` takes the locale and the package's French
words, in `src/main.tsx`:

```tsx
import { fr } from 'ioiti-ui/locales/fr'

<IoitiProvider appName="My App" locale="fr-FR" messages={fr} onError={reportError}>
```

and `index.html` says so: `<html lang="fr">`. The package's words then speak French (the shell, the dates, the
errors), and the pages write their amounts, percentages and days the French way (`useFormat()`, in `src/pages/`).
The application's own words (the menu, the pages' titles) are its own to translate. An application that speaks
English never bundles French.

## ioiti-ui

`package.json` names the version used: `github:IOITI/ioiti-ui#v1.0.0-rc.2`. Another version is another
tag (its CHANGELOG says what changed). `src/index.css` imports Tailwind CSS and the design in one
line; it never imports `tailwindcss` itself as well.

The components, the colours and the rules of the design are in ioiti-ui's gallery (`npm run gallery`
in its repository).

## Content-Security-Policy

The built application loads nothing from another origin and runs no inline script (the theme is
set before the first paint by `ioiti-theme.js`, a file). A strict policy suits it:

```text
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'
```

`style-src` needs `'unsafe-inline'`: the animations set inline styles.

The server that serves `dist/` sends it with every page. `npm run preview` does (`preview.headers` in
`vite.config.ts`): what the policy refuses shows on the browser's console. `npm run dev` does not: React Refresh runs
an inline script.
