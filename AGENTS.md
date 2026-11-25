# ioiti-ui — AGENTS.md

## Project

IOITI's design system, taken from WATA's admin interface (`docs/provenance.md`): tokens, React 19
components, an application shell, for Tailwind CSS 4. Installed by applications from a git tag
(`github:IOITI/ioiti-ui#vX.Y.Z`), never published to npm (`"private": true`).

| Path | Content |
|---|---|
| `src/styles/` | `styles.css` (Tailwind + the design), `design.css` (the design alone), `tokens.css` (EasyUI's, unchanged), `theme.css` (what the design adds), `accents.css` and `glass.css` (the accents and the glass material, ioiti-ui's own), `motion.css` (the motion's curves, a page's and a look's changes, motion reduced: ioiti-ui's own), `type.css` (what is typed exactly, without ligatures or tracking: ioiti-ui's own), `finish.css` (what is selected, the scrollbars in every browser: ioiti-ui's own), `grain-*.png` (the gradient accents' grains, the glass backdrop's) |
| `src/theme.js` | the pre-paint theme script, a file of its own (no inline script under a strict CSP) |
| `src/components/ui/` | EasyUI's components, changed (`docs/easyui-changes.md`) |
| `src/components/` | the blocks of pages, the providers and their contexts, the recipe components |
| `src/shell/` | the application shell, the trail, the 404, the sign-in frame |
| `src/lib/` | helpers (`cn`, formats, theme, CSV, dates, date maths, keys, the clock), a locale's week, clock and numbers (`locale.ts`), the catalogue's kit (`messages.ts`), the two tones (`tones.ts`), what is deprecated (`deprecations.ts`, `deprecated.ts`), the placing of a layer (`anchor.ts`), a frame that scrolls (`scroll-region.ts`), the charts' scales and colours, EasyUI's chart helpers |
| `src/locales/` | the words the package says: English's catalogue (`en.ts`, a file per namespace in `en/`), the one every language is typed after, and French's (`fr.ts`, `fr/`); the entries `ioiti-ui/locales/en` and `ioiti-ui/locales/fr` |
| `src/react-router/` | the adapter for React Router, the only code that imports it |
| `src/vite/` | the Vite plugin (Node: no DOM types there) |
| `src/codemod/` | the codemod, `npx ioiti-ui-codemod` (Node, its own build: `tsconfig.codemod.json`): an application's code given today's names, from `src/lib/deprecations.ts`, read with the application's TypeScript |
| `gallery/` | an application made with the package: a page per component, in both themes (`gallery/src/components/<category>/`: its `category.ts`, then a folder per component of one file per example, whose code the page shows; `gallery/src/catalogue/` draws them, with each component's guidelines and props, its source at the tag, the version it shipped in (`gallery/src/since.json`), what it was named before; its Changelog page draws CHANGELOG.md) |
| `templates/app/` | the starter template an application is copied from |
| `scripts/` | build, release (`release.mjs`; the CHANGELOG read and written, `changelog.mjs`; a Release's notes, `release-notes.mjs`), the package, source and docs checks (`check-docs.mjs`: what the docs count and install), a word written in a component (`check-strings.mjs`), the import codemod, the golden reference, the grains, the props, each component's props type and their JSDoc (`props.mjs`; what has none yet, `docs-baseline.json`), the interface's report (`api-report.mjs`), the version each name shipped in (`since.mjs`, run by the release) |
| `design-system/` | the claude.ai Design System artifact's files (`design-system/README.md`); `components/<Name>/README.md` are also the gallery's guidelines; a card for each component that draws something (`cards.json`, `previews/<Name>.tsx`), the others in `no-card.json`, each with why: `check-docs` holds both |
| `test/golden/` | blocks of the original design's built CSS, which an application's build must hold |
| `test/size-budget.json` | what an application bundles, gzipped, which `check:package` holds it to |
| `test/api/` | the interface of each entry as the type checker reads it (`<entry>.api.txt`: `npm run api`), which `npm run lint` holds |
| `test/a11y.ts` | axe in the tests (`expectAccessible`), shared by the package's tests and the gallery's |
| `e2e/` | the gallery in real browsers (Playwright): its pages, axe with the stylesheets, the keyboard, motion, its screenshots (`e2e/__screenshots__`, made by CI) |

## Commands

Node 24: `source ~/.nvm/nvm.sh && nvm use 24` first (the default Node of this Mac is older).

```bash
npm run lint && npm run typecheck && npm test && npm run build && npm run build:gallery && npm run check:package
npm run gallery                    # http://localhost:5180, on src/
npm run props                      # gallery/src/props.json, after a change of a component's props (lint checks it)
npm run api                        # test/api/<entry>.api.txt, after a change of the interface on purpose (lint checks it)
node scripts/props.mjs --docs-baseline   # scripts/docs-baseline.json, once a component or a prop it lists is documented
npm run release -- 0.2.0           # docs/releasing.md; pushing is the user's
npm run check:package -- --update-budget   # test/size-budget.json, after a change that weighs more on purpose
npm run e2e                        # the gallery built, in Chromium: pages, axe with CSS, the keyboard, motion
E2E_SOURCE=1 E2E_PORT=4181 npm run e2e -- a11y.spec   # on the source (vite's dev server), a port of its own
```

## Rules

- **The design's values do not change by accident.** `tokens.css` stays EasyUI's copy, `theme.css` and
  `design.css` WATA's values; `check:package` holds a build to `test/golden/reference-blocks.json` and the
  gallery's test the contrast table. A change on purpose is a new reference (`scripts/golden-from.mjs`) and a
  line of CHANGELOG.md. `design.css`'s import order is load-bearing (`--border` and `--accent` are set twice).
- **A change has its line in the CHANGELOG**, under `## [Unreleased]`, in its section (Added, Changed, Deprecated,
  Removed, Fixed, Security), the API's name first, in the house voice; Upgrading says what an application does when
  something changes, is deprecated or removed (`scripts/changelog.mjs`). A number or a version a doc gives is computed
  where it is shown (the gallery's pages) or held by `scripts/check-docs.mjs` (README.md, AGENTS.md, the template's
  README): it never goes stale.
- **Two values for every colour** (`light dark:dark`, or a token with both); text at 4.5:1 on every surface of
  every look (a theme, an accent, a material: 36). The one known exception is pinned in
  `gallery/src/tokens.test.ts`, which composites glass over its backdrop, and a grain at its strongest speck,
  before measuring.
- **Accents and glass only add.** A look's tokens are in its own file, in blocks of one selector:
  `:root[data-accent="…"]:not(.dark)` and `:root[data-accent="…"].dark`, what both share under
  `:root[data-accent="…"]` (the same for `data-material`), never a rule in a layer (the reference holds the base
  layer whole), never an edit to a block of the design. A component keeps its classes and adds `accent:` ones
  after them (the `brand` tokens), or `glass-bar`, `glass-card`, `glass-tile`, `glass-float` (and `glass-edge`). A filled, primary control adds
  `accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground`, the accent's gradient where it has one
  (bloom, lagoon, aurora, dusk, golden): an image as `bg-(image:…)`, since tailwind-merge takes any other `bg-brand-…` for a colour and drops
  `bg-brand`. A grain is a PNG beside `accents.css`, made by `scripts/grains.mjs` (an SVG filter's noise
  vanishes or turns to moiré at some screens and zooms), never a `data:` URI; `GRAINS` in
  `gallery/src/tokens.ts` reads it (the backdrop's, an overlay: `OVERLAY_GRAIN`). Two blur: `glass-tile` (KpiTile)
  and `glass-float`, nothing else. Not `glass-bar` (the top bar, the sidebar, a pushing sheet): it stands on the
  still backdrop, which a blur barely changes, and the browser blurs it again at every frame of a change of page
  beside it (one at a third of its frames). For the same reason nothing is blended with what is under it
  (`mix-blend-mode`): the backdrop's grain is blended as it is painted (`background-blend-mode`, over a copy of
  the backdrop: `--glass-backdrop`). A blur goes never on an element with a fixed child of its own (a
  blur becomes its containing block, and the root of the blur of what floats in it: a layer goes to
  `document.body`, as the sidebar's tip, the bell's panel and LookPicker's choices), never on white text on ink, never under an
  element with a `view-transition-name` at rest (a name makes it the root of its children's backdrop: their
  blur sees nothing of the page). What floats has no sheen: its text holds 4.5:1 over black or white behind it
  (`gallery/src/tokens.test.ts`). The tones (gain, loss, warning)
  keep their colours.
- **Motion is a token, and calm.** framer-motion takes `motionTransitions` (`src/lib/motion-tokens.ts`), the
  stylesheets the same curves (`ease-soft`, `ease-fast`, `ease-exit`: `motion.css`, a test holding them equal):
  no spring or curve written by hand in ioiti-ui's own code. An entrance settles in about 300 ms without
  overshoot (a gesture's return excepted), an exit is quicker (`easeExit`), a distance a few pixels. Reduced
  (the system, or IoitiProvider's `reducedMotion`, `data-reduced-motion` on `<html>`), movement goes and fades
  stay: framer's by MotionConfig, the stylesheets' by `motion-safe:` and `motion-reduce:` (written again to
  follow both) and the loops' `--animate-*`. A layer fixed over the page (a dialog, a sheet, the drawer, the
  toasts) carries `over-page` on its container, which does not move: a change of page, drawn above the whole
  document, would cover it. It names the layer while a view transition plays only, never at rest, which would
  take the blur of its glass away. `motion.css` only
  adds, as the accents and glass.
- **A layer placed beside its trigger** (a popover, a menu, a list) is placed by `src/lib/anchor.ts`
  (`useAnchoredLayer`): in `document.body`, following its trigger, its Escape and Tab its own inside a dialog.
  No new placement written by hand.
- **What scrolls and holds no control** (a table's frame, code, a sheet's body, a page of text) is a stop of the
  keyboard while it scrolls, a region named by what it holds: `useScrollRegion` (`src/lib/scroll-region.ts`), never a
  tab index measured by hand. What fits is no stop, nor a frame that holds a control, which Tab reaches.
- **One recipe per role** (`src/lib/recipes.ts`): a section or a card (`SECTION`), what floats, a tooltip, a dialog, a toast, a menu's row, the scrim,
  the close buttons, a disabled or pressed control, the tones. A component names the design's tokens by role
  (`design-system/guide/README.md`, Colour) and these recipes, never a colour (hex, `rgba()`, a palette's step, white or
  black), a shadow (but `shadow-elevated`, `shadow-subtle`, a look's `accent:`/`glass:` glow), a radius off the scale, a
  curve or a spring of its own, nor `var(--font-*)` (tokens.css names faces no `@font-face` registers). `check-source`
  holds it; `look-swatches.ts` and the 404's illustration (`ui/not-found.tsx`, EasyUI's drawing kept as it was,
  its frosted glass's blur included) are the exceptions.
- **A chart's series take the design's colours** (`src/lib/chart-colours.ts`): one series `--chart-series`,
  things compared `--chart-compare-1…4` in order, never recycled (a fifth is grey).
- **What MotionConfig does not reduce** (a value animated by hand: `pathLength`, `d`, a size, `useSpring`) is
  reduced through `useReducedMotionConfig()`, which follows IoitiProvider as well as the system; framer's
  `useReducedMotion` follows the system only.
- **One focus ring**, the global rule of `design.css`; no component draws its own. A field that takes text has
  none, a browser marking it at a click too: its caret and its own border show its focus, as the form's `Input`
  (`fieldBorder()` in `src/lib/field-border.ts`: `focus:border-muted-foreground accent:focus:border-brand`), or its frame's.
- **What leads somewhere is a link**, drawn by `useLinkComponent()` (the application's, from `LinkProvider`),
  or by the component's own `linkComponent` prop when given; a plain click is left to the router, a click with
  a modifier to the browser (`isPlainClick`). Never import a router outside `src/react-router/`. A part of the
  page shown (`#part`) is a plain `<a>`, never a route: the browser scrolls what holds it and keeps the query
  (`RouterLink` draws it so).
- **A `Hint`, never a `title`**, for what a control means (the theme button's `title` is the original's).
- **A name follows the conventions** (`docs/conventions.md`, a page of the gallery's foundations): `value`,
  `defaultValue`, `onChange` for a value, `open`, `defaultOpen`, `onOpenChange` for what opens, held by
  `useControllableState` (`src/lib/controllable.ts`), never by hand; `loading` for content not there yet, `pending` for
  an action under way; `aria-*` as ARIA writes them; `href` for a link; `showCloseButton`; `density="compact"`; a
  state's tone a `StatusTone`, a figure's a `SignTone` (`src/lib/tones.ts`). A component is named by its role
  (`Dialog`, `Sheet`), never by how it moves. A control takes what a native one does (`id` and `ref` on what takes the
  focus, `name` sent by a form, a hidden input where it has none of its own, `aria-label|labelledby|describedby|invalid`,
  `className` and `data-*` on its outermost element), and reads the Field or FormItem around it (`useFieldControl`,
  `src/components/field-context.ts`), its own props first.
- **A deprecation** goes through `src/lib/deprecations.ts` (the old name, what replaces it, since when), `@deprecated`
  on the old prop (the props tables mark it; `props.mjs --check` refuses a retired name not so marked), `deprecated(id)`
  when it is given (once, in development: a production build keeps none of it, `check:package`), and a line of the
  CHANGELOG's Deprecated section (`check-docs`). A component renamed keeps its former name as
  `renamed(Component, 'Former')` (`src/lib/renamed.ts`: the component itself in production), its id never its file's
  name (a bundle names its modules after their files). The codemod (`src/codemod`, `npx ioiti-ui-codemod`) rewrites an
  application from the same list: a deprecation it cannot rewrite alone (`hideCloseButton` turned the other way round)
  is taught to it (`SPECIAL`, `src/codemod/rules.ts`), with a test. It lives through one minor version at least, and is
  removed only in a major, its entry moved to the codemod's table of what was removed (`src/codemod/table.ts`: 1.0's),
  named in that version's Removed section (`check-docs`).
- **What is public changes as semantic versioning says** (`docs/stability.md`): each entry's exports and types (the
  snapshot, `test/api/`), the stylesheets and the tokens' names, the classes and attributes the docs name, the
  catalogue's keys. A patch fixes, a minor adds and deprecates, a major removes. The DOM a component draws is not public:
  a test finds a component by its role and name.
- **A word the package says comes from its catalogue** (`src/locales/en/<namespace>.ts`, French in `src/locales/fr/`):
  a component says it with `useMessages()`, never written in its code (`check-strings` fails on one; `// i18n-exempt:
  <why>` for what is no word to translate: a brand, a code, a symbol). A word added in English is added in French in the
  same change (`src/locales/locales.test.ts`), and the gallery's examples drawn in French hold none of English's
  (`gallery/src/french.test.tsx`). A word that takes values is a function of one value
  and the locale's kit (its plurals, numbers, lists), never a sentence built around a word. A component's own prop wins.
- **Formats follow the locale**: a component writes a number, an amount, a percentage or a moment with `useFormat()`
  (or Intl with `useLocale().locale`), never by hand ("12%", `toFixed`) nor in a fixed locale (but where a text is
  computed, not shown: said there), and starts its weeks on `useLocale().weekStartsOn`, any day (`WeekDay`). The
  functions exported alone (`formatMoney`…) write English (en-GB), for what is outside React. A moment keeps its data's
  time zone: the locale changes how it is written, never which it is.
- **A page that fails shows what went wrong in its place, the shell kept**: AppShell's boundary (`ErrorBoundary`, an
  `ErrorState` of a page), `RouterErrorPage` on the router's routes; an error is told to the application once
  (`reportOnce`, `src/components/error-context.ts`: IoitiProvider's `onError`), its kind read by `src/lib/errors.ts`.
  The details of an error show in development only.
- **One dialog at a time**, in `document.body`, keeping the focus. A layer that holds the page (a dialog, a sheet with
  a backdrop, the sidebar's drawer: `aria-modal`; the palette, a tour) keeps it with `useFocusScope`
  (`src/lib/focus-scope.ts`): moved in, kept in by Tab, given back, the latest opened keeping it; a layer beside the
  page (a sheet without a backdrop) is a scope that holds none (`contain: false`: Tab free, its Escape heard from within);
  no trap written by hand.
- **What is said to a screen reader once something happened** goes through a live region there before its words:
  `announce` (`src/lib/announce.ts`, polite or assertive, in the dialog that keeps the focus), or a frame of its own
  that stays (the toasts', `ToastProvider`'s two regions). Never a region drawn with its words.
- **What a component says to its developer** (a dialog without a name, a prop deprecated) is `devWarn(id)`
  (`src/lib/dev.ts`), its words in `src/lib/dev-messages.ts`: once, in development only; a production build keeps none
  of them (`check:package`). Never `console.warn` of its own.
- **Nothing from another origin**, no inline script, no font as a `data:` URI.
- **Copied files** are marked (`// ioiti-ui:` on each change) and their changes listed in
  `docs/easyui-changes.md`; they are linted for the rules of hooks and the accessibility rules only
  (`.oxlintrc.copies.json`).
- **Relative imports end in `.js`** (`node scripts/fix-imports.mjs <file>`): a consumer's tests may load the
  package in Node's ESM loader. `check-source` holds it.
- **No name of the original application** (WATA, its broker) in `src/`, `gallery/` or `templates/`: the docs
  say where it comes from, the code does not. `check-source` holds it.
- **Every export is a decision**: `src/index.ts` names each one; `src/index.test.ts` snapshots the list
  (`npx vitest run -u` on purpose, and a line of CHANGELOG.md), `test/api/` the types of every entry (`npm run api` on
  purpose, the same line). A component's props type is exported by its entry beside it, as `<Name>Props` (a part that
  takes an element's attributes, a named type of them: `TableRowProps = ComponentProps<'tr'>`), with a line of JSDoc;
  a former name needs none (`props.mjs --check`). Every component belongs to one family of the
  gallery (`gallery/src/components/<category>/category.ts`, its `names`), which has its guidelines
  (`design-system/components/<Name>/README.md`), two examples at least that import it, as an application would
  (`scripts/check-source.mjs` holds their imports), and its props (`npm run props`):
  `gallery/src/catalogue/catalogue.test.ts` fails otherwise. A name 1.0 removed (`src/codemod/table.ts`) has no
  family: its new name's says it (`formerly`, its page's former address led there by `gallery/src/catalogue/legacy.ts`).
- **A guideline says what a person does with the keyboard**: an interactive family's README has `## Accessibility`, what
  a screen reader hears and a table of its keys (`| Key | What it does |`), written from what the code does; a family
  of native buttons and links says so in a sentence. `gallery/src/catalogue/accessibility.ts` lists both kinds, which
  the catalogue's test holds. Where a category's families answer one need in different ways, its `category.ts` says
  which one to choose (`choose`, drawn on its page).
- **A component and each of its props have a line of JSDoc.** Those without one in 0.31.0 are listed in
  `scripts/docs-baseline.json`, which only shrinks: `props.mjs --check` fails on a new one without JSDoc, and on one
  listed that has it now or is gone (`node scripts/props.mjs --docs-baseline` takes it off and takes nothing in). A
  prop's JSDoc is its description, or its `@deprecated` tag.
- **A component exports components only** (fast refresh): constants and helpers go in a `.ts` beside it
  (`link-context.ts`, `field-context.ts`).
- **The link drawn from context** is flagged by oxlint's `react/static-components`: disable it on that line
  with the reason (`ButtonLink.tsx` shows how), never for the file.

## Testing quirks

- Vitest runs in jsdom, with `src/test/setup.ts`; framer-motion is not mocked: wait for exits (`waitFor`).
- **A component in another language** is rendered in `<IoitiProvider locale="fr-FR" messages={fr}>` (`fr` from
  `src/locales/fr.ts`); Intl is Node's, as complete as a browser's. French writes no-break spaces (U+00A0 before `€` and
  `%`, U+202F between thousands): a test writes them (`'1\u202f234,50\u00a0€'`), or reads the text with them made spaces.
- **axe holds what a test draws** (`expectAccessible` of `test/a11y.ts`, WCAG 2.2 A and AA): every page of the gallery
  (its test, split in four files that run side by side) and every layer its examples open
  (`gallery/src/open-states.test.tsx`). Off in jsdom, which reads no CSS and lays nothing out: contrast (held by
  `gallery/src/tokens.test.ts`), a link told by its colour, a target's size, a scrolling region's reach. A component's
  test holds its open states to it too. Shared helpers live in the root `test/`, which the gallery may import.
  Under fake timers, framer-motion draws on the window's real frames, taken when it loads, and reads the faked
  clock: an animation starts on one of its frames and moves as the clock is advanced (`ToastProvider.test.tsx`).
- **What jsdom cannot hold, a real browser does** (`e2e/`, Playwright, on the gallery built): every page loads and
  says nothing wrong (`e2e/fixtures.ts` fails a test on a console error, an uncaught error, a failed request, a request
  to another origin; the pages whose examples fail on purpose let React's words for them through), axe with the
  stylesheets in light and dark (contrast, a region that scrolls, a label in a name), the pages and axe once more with
  the components in French (`inFrench`), the keyboard's journeys (focus through portals, a real drag), motion and
  reduced motion. Firefox and WebKit run what is tagged `@smoke` (CI).
  Behaviour that needs layout, CSS or a real focus belongs there, not in a jsdom test.
- **A control that shows words is named by them** (WCAG 2.5.3): axe's label in name reads every word on screen, an
  `aria-hidden` one too (a key's `Kbd`, a count), against a name written over them (`aria-label`, `aria-labelledby`),
  what is in brackets left out. Where a screen reader needs more than it shows, the words are the control's own, the
  rest `sr-only` beside them ("Collapse" and "sidebar", `ui/sidebar.tsx`), what is for the eye alone `aria-hidden`.
- **The screenshots are made on Linux only** (`e2e/visual.spec.ts`, Playwright's image): CI's `visual` job writes a
  picture that has no baseline and uploads it (`visual-baselines`, to look at and commit into `e2e/__screenshots__`),
  and fails on a picture that moved (`visual-diffs`). A Mac draws other pixels: `E2E_SNAPSHOTS=<a folder>` keeps a set
  of its own there, to see a change draw the same twice. An example that moves on its own or reads the time is not
  pictured (`LIVE`); the clock stands still and Math.random is seeded for the others; the gallery's version, which a
  release changes, is made invisible (its words: a mask's box was as wide as them). An example's picture leaves out the
  page's contents bar (`e2e/example-shot.css`).
- jsdom has no view transitions: pages and looks change at once there. `src/test/viewTransition.ts` stands in
  for `document.startViewTransition` (a change of look), not for React's `ViewTransition`, whose pictures jsdom
  cannot animate.
- **A stylesheet imported in a test is empty** (`css: false`), `?raw` included: read it from disk
  (`gallery/src/tokens.test.ts`), or compile it with Tailwind's `compile` (`src/styles/styles.test.ts`, which holds
  the variants' order and every block of the design). A gallery page reading one gets an empty string.
- jsdom has no `matchMedia`, `ResizeObserver` or `IntersectionObserver`: the components guard their use;
  `src/test/systemTheme.ts` stands in for the system's theme.
- The gallery's tests render every page through its router: a page that throws fails them, and so does a link
  that leaves `/ioiti-ui/`, the path CI publishes `main`'s gallery at on GitHub Pages (`vite build --base`). A
  category's examples are a chunk loaded with its pages (the route's `lazy`): a test waits for the page's heading.
  A former address of the gallery leads where its content went (`gallery/src/catalogue/legacy.ts`).
- `check:package` installs the packed package into a copy of the template (network for npm), runs the template's lint
  and tests, and opens its build in Playwright's Chromium under `vite preview`, with the Content-Security-Policy
  (`npx playwright install chromium` once); `--keep` keeps it to look at. The template is linted by its own
  `.oxlintrc.json`, also when the root's oxlint walks into it.

## Releasing

`dist/` is only in release commits, apart from `main`, whose `package.json` has no scripts: npm then
installs a tag without building it. `npm run release` makes them; never commit `dist/` on a branch. It names and
dates what is under `[Unreleased]`, sets the version where the READMEs install it, writes the version each exported
name shipped in (`gallery/src/since.json`, from every tag's `dist/` and the new names), and releases nothing while a
version the CHANGELOG names before is no tag on origin (`--at <commit>` makes one never made). CI installs each tag
pushed into the template, which passes its checks, and makes its GitHub Release from its section
(`.github/workflows/verify-release.yml`).
