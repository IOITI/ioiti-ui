# ioiti-ui — AGENTS.md

## Project

IOITI's design system, taken from WATA's admin interface (`docs/provenance.md`): tokens, React 19
components, an application shell, for Tailwind CSS 4. Installed by applications from a git tag
(`github:IOITI/ioiti-ui#vX.Y.Z`), never published to npm (`"private": true`).

| Path | Content |
|---|---|
| `src/styles/` | `styles.css` (Tailwind + the design), `design.css` (the design alone), `tokens.css` (EasyUI's, unchanged), `theme.css` (what the design adds), `accents.css` and `glass.css` (the accents and the glass material, ioiti-ui's own) |
| `src/theme.js` | the pre-paint theme script, a file of its own (no inline script under a strict CSP) |
| `src/components/ui/` | EasyUI's components, changed (`docs/easyui-changes.md`) |
| `src/components/` | the blocks of pages, the providers and their contexts, the recipe components |
| `src/shell/` | the application shell, the trail, the 404, the sign-in frame |
| `src/lib/` | helpers (`cn`, formats, theme, CSV, dates), EasyUI's chart helpers |
| `src/react-router/` | the adapter for React Router, the only code that imports it |
| `src/vite/` | the Vite plugin (Node: no DOM types there) |
| `gallery/` | an application made with the package: every component, in both themes |
| `templates/app/` | the starter template an application is copied from |
| `scripts/` | build, release, the package and source checks, the import codemod, the golden reference |
| `test/golden/` | blocks of the original design's built CSS, which an application's build must hold |

## Commands

Node 24: `source ~/.nvm/nvm.sh && nvm use 24` first (the default Node of this Mac is older).

```bash
npm run lint && npm run typecheck && npm test && npm run build && npm run build:gallery && npm run check:package
npm run gallery                    # http://localhost:5180, on src/
npm run release -- 0.2.0           # docs/releasing.md; pushing is the user's
```

## Rules

- **The design's values do not change by accident.** `tokens.css` stays EasyUI's copy, `theme.css` and
  `design.css` WATA's values; `check:package` holds a build to `test/golden/reference-blocks.json` and the
  gallery's test the contrast table. A change on purpose is a new reference (`scripts/golden-from.mjs`) and a
  line of CHANGELOG.md. `design.css`'s import order is load-bearing (`--border` and `--accent` are set twice).
- **Two values for every colour** (`light dark:dark`, or a token with both); text at 4.5:1 on every surface of
  every look (a theme, an accent, a material: 16). The one known exception is pinned in
  `gallery/src/tokens.test.ts`, which composites glass over its backdrop before measuring.
- **Accents and glass only add.** A look's tokens are in its own file, in blocks of one selector:
  `:root[data-accent="…"]:not(.dark)` and `:root[data-accent="…"].dark` (the same for `data-material`), never a
  rule in a layer (the reference holds the base layer whole), never an edit to a block of the design. A
  component keeps its classes and adds `accent:` ones after them (the `brand` tokens), or `glass-bar`,
  `glass-card`, `glass-float`. `glass-float` is the only blur: never on an element with a fixed child of its own
  (a blur becomes its containing block), never on white text on ink. The tones (gain, loss, warning) keep their
  colours.
- **One focus ring**, the global rule of `design.css`; no component draws its own.
- **What leads somewhere is a link**, drawn by `useLinkComponent()` (the application's, from `LinkProvider`),
  or by the component's own `linkComponent` prop when given; a plain click is left to the router, a click with
  a modifier to the browser (`isPlainClick`). Never import a router outside `src/react-router/`.
- **A `Hint`, never a `title`**, for what a control means (the theme button's `title` is the original's).
- **One dialog at a time**, in `document.body`, keeping the focus.
- **Nothing from another origin**, no inline script, no font as a `data:` URI.
- **Copied files** are marked (`// ioiti-ui:` on each change) and their changes listed in
  `docs/easyui-changes.md`; they are linted for the rules of hooks only (`.oxlintrc.copies.json`).
- **Relative imports end in `.js`** (`node scripts/fix-imports.mjs <file>`): a consumer's tests may load the
  package in Node's ESM loader. `check-source` holds it.
- **No name of the original application** (WATA, its broker) in `src/`, `gallery/` or `templates/`: the docs
  say where it comes from, the code does not. `check-source` holds it.
- **Every export is a decision**: `src/index.ts` names each one; `src/index.test.ts` snapshots the list
  (`npx vitest run -u` on purpose, and a line of CHANGELOG.md). Every component has a demo in the gallery
  (`gallery/src/gallery.test.tsx` fails otherwise): a `Demo` names it in `names`.
- **A component exports components only** (fast refresh): constants and helpers go in a `.ts` beside it
  (`lib/health.ts`, `link-context.ts`).
- **The link drawn from context** is flagged by oxlint's `react/static-components`: disable it on that line
  with the reason (`ButtonLink.tsx` shows how), never for the file.

## Testing quirks

- Vitest runs in jsdom, with `src/test/setup.ts`; framer-motion is not mocked: wait for exits (`waitFor`).
- **A stylesheet imported in a test is empty** (`css: false`), `?raw` included: read it from disk
  (`gallery/src/tokens.test.ts`), or compile it with Tailwind's `compile` (`src/styles/styles.test.ts`, which holds
  the variants' order and every block of the design). A gallery page reading one gets an empty string.
- jsdom has no `matchMedia`, `ResizeObserver` or `IntersectionObserver`: the components guard their use;
  `src/test/systemTheme.ts` stands in for the system's theme.
- The gallery's tests render every page through its router: a page that throws fails them.
- `check:package` installs the packed package into a copy of the template (network for npm), `--keep` keeps
  it to look at.

## Releasing

`dist/` is only in release commits, apart from `main`, whose `package.json` has no scripts: npm then
installs a tag without building it. `npm run release` makes them; never commit `dist/` on a branch.
