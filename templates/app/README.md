# My App

An application made with [ioiti-ui](https://github.com/IOITI/ioiti-ui): React 19, React Router,
Tailwind CSS 4 and Vite. It starts with a sign-in page, the shell (sidebar, top bar, the trail of
where a page is), a dashboard and a list, on example data.

## Start

Node.js 24 (`nvm use`).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/: typechecked, then built
npm run preview    # serves dist/
```

## Make it yours

- **The name**: `appName` in `src/main.tsx` (the sidebar, every tab's title), the `<title>` of
  `index.html`, the `name` of `package.json`, `title` in `src/pages/LoginPage.tsx`.
- **The theme's key**: `themeStorageKey` in `vite.config.ts`. One key per application, or two
  applications on one site share the theme chosen.
- **The menu**: `src/menu.tsx`. Each entry is a page; a page deeper than the menu (`/items/42`)
  stands under the entry its address starts with, and names itself with `PageHeader`.
- **The pages**: `src/pages/`, routed in `src/router.tsx`. The data of `src/data.ts` are examples.
- **The sign-in**: `src/pages/LoginPage.tsx` checks nothing yet.

## ioiti-ui

`package.json` names the version used: `github:IOITI/ioiti-ui#v0.1.0`. Another version is another
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
