# Stability

What ioiti-ui promises from 1.0: what an application may build on, what may change in which version, and how a change
reaches it.

## What is public

- **Each entry's exports, and their types**: `ioiti-ui`, `ioiti-ui/react-router`, `ioiti-ui/code`, `ioiti-ui/vite`,
  `ioiti-ui/locales/en` and `ioiti-ui/locales/fr`. Every name an entry exports, a component's props (their names, their
  types, what they do), a function's signature, a hook's result. `test/api/` holds them as the type checker reads them,
  and `src/index.test.ts` the names: a change of either is a change of the interface, said in the CHANGELOG.
- **The stylesheets an application imports**: `styles.css`, `design.css`, `tokens.css`, `theme.css`, `accents.css`,
  `glass.css`, `motion.css`, `type.css` and `finish.css`, and `theme.js`, the script that sets the theme before the page
  is painted.
- **The tokens' names**: every custom property `tokens.css` and `theme.css` declare (`--background`, `--positive`,
  `--chart-series`…), and the Tailwind classes they make (`bg-surface`, `text-muted-foreground`…). Their values are the
  design's, and may be tuned in a minor version (a colour that reads better), never removed but in a major.
- **The classes and attributes the docs name**: `glass-bar`, `glass-card`, `glass-tile`, `glass-float`, `glass-edge`;
  the `accent:` and `glass:` variants; `ease-soft`, `ease-fast`, `ease-exit`; and on `<html>`, `data-accent`,
  `data-material` and `data-reduced-motion`, with the class `dark`.
- **The words of the catalogue**: its namespaces and keys (`useMessages().table.search`), which an application overrides
  through `IoitiProvider`'s `messages`. A key may be added in a minor version (an override that lacks it says English
  there); renamed or removed only in a major.
- **`npx ioiti-ui-codemod`**: its command and its options.

## What is not

- **The DOM a component draws**: its elements, their order, their classes, an `id` it makes. A test of an application
  finds a component as a person does, by its role and its name, never by its markup.
- **What the package's own files hold beyond their exports**: `src/lib`, `src/components/ui` (EasyUI's copies), a module
  the entries do not export, a class written inside a component.
- **The look, pixel for pixel**: a spacing, a curve, a shadow may be tuned in a minor version, the design kept.
- **A word's English**: what a component says may be said better in a minor version (its key kept).

## Versions

From 1.0, semantic versioning:

- **A patch** (1.0.1) fixes what does not work as the docs say, and changes nothing an application relies on.
- **A minor** (1.1.0) adds: a component, a prop, a value, a word. It may deprecate: the old name keeps working, says so
  once in development (`console.warn`, never in production), and the CHANGELOG's Deprecated section says what replaces
  it; the codemod rewrites it.
- **A major** (2.0.0) removes what was deprecated, and changes what cannot be kept. Its CHANGELOG's Upgrading section
  says what an application does, the codemod first. A name lives deprecated through one minor version at least before a
  major removes it.

A version is a git tag (`github:IOITI/ioiti-ui#v1.0.0`); its notes are in `CHANGELOG.md` and on its GitHub Release. A
release candidate (`v1.0.0-rc.1`) is marked a pre-release there.

## What it runs with

- **React 19.3** and later 19, **framer-motion 13.5** and later 13, **Tailwind CSS 4.3** and later 4, **Vite 7 or 8**
  (for its plugin), **React Router 8** (for `ioiti-ui/react-router`), **CodeMirror 6** (for `ioiti-ui/code`): the peers
  of `package.json`. A new major of a peer is supported in a minor version of ioiti-ui once tested; one is dropped only
  in a major.
- **Node 22.12** and later, to build an application (`engines`).
- **Browsers**: Safari 16.4, Chrome and Edge 111, Firefox 128, and later, as Tailwind CSS 4 requires. A browser without
  view transitions changes a page at once instead of in a cross-fade.
