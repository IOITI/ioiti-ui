# Changelog

What changes from one version of ioiti-ui to the next. A version is a git tag (`v0.1.0`), which an
application installs as `github:IOITI/ioiti-ui#v0.1.0` (`docs/releasing.md`).

## [0.3.0] - Unreleased

A fifth accent, `bloom`: the colours of a printed flyer, a soft gradient with a grain. A check box whose mark
draws itself, and a sheet that can push the page aside. And motion, calm and the same everywhere: a page and a
look that change in one cross-fade, toasts that leave, and one motion for everything in front of the page. And
the data tables' filters as Elastic UI's filter group.

- **Bloom**: the flyer's orchid on what is chosen, current or primary, on links, the focus ring and one-series
  charts, as every accent's colour. A filled button and the application's mark take the flyer's gradient
  itself, lilac to pink to tangerine, under a fine grain, with the page's ink on it in both themes. With
  glass, the backdrop is the flyer: its pink, its tangerine and its mustard, grainy too. The grain's specks
  are the page's own colour (white in light, black in dark): they never bring the backdrop nearer the text on
  it. Text holds 4.5:1 on every surface of the 20 looks, on every point of the gradient, the grain's strongest
  speck included; the funnel ramps passed the dataviz validator.
- **Tokens** an accent with a gradient sets: `--brand-gradient`; `--brand-fill`, the gradient under its grain,
  for `accent:bg-(image:--brand-fill)`; `--brand-fill-foreground`, the text on it, for
  `accent:text-brand-fill-foreground` (the fill's own text where the accent has no gradient); `--brand-grain`;
  and the backdrop's other washes, `--brand-wash-2` and `--brand-wash-3`.
- **Two images**, `grain-white.png` and `grain-black.png`, beside `accents.css`, which names them: tiles of fine
  noise, a speck to a pixel of a retina screen, made by `scripts/grains.mjs`. An application's build writes
  them beside its own files, never inlined (`img-src 'self'` holds).
- **`Button`'s filled variants (and `ButtonLink`) and `AppBrand`'s mark** draw the gradient where the accent has
  one; with any other accent, nothing changes. `SplitButton`'s primary and the primary actions of
  `SelectionBasket` and `SmartComparison` keep the accent's fill.
- **The gallery**: bloom in the picker, the Themes, Colours and Chart colours pages; the contrast of the text on
  the gradient in every look.
- **`Checkbox` is EasyUI's draw-checkbox**: its mark draws itself and the box settles with a small pop, a soft
  box in the design's grey when checked (the accent's colour under an accent). The same props, and
  `indeterminate`, a bar, which screen readers hear as partly checked. The focus ring shows on it (the box it
  replaces hid it), and its label alone names it, its description read after. The boxes of `AdvancedDataTable`
  (rows, cards, header, column list) are the same box, no longer the browser's. A Check box demo in the gallery.
- **`Flysheet`**, EasyUI's sheet with what Elastic UI's flyout does: from any side, swiped away on a touch
  screen; a side sheet in three widths or any (`size`, `minWidth`, `maxWidth`), widened or narrowed by its edge
  or the arrow keys on it (`resizable`, `onResize`); pushing the page aside instead of covering it, from a
  window 1024 px wide (`type="push"`, `pushMinWidth`; `--flysheet-push-left` and `--flysheet-push-right` for
  what an application fixes to the window); without a backdrop, the page in use (`modal={false}`); its close
  button outside (`closePosition`); the padding of its parts (`padding`); a child sheet, a `Flysheet` in the
  content of another, beside its parent or over it on a narrow screen, closed with it; why it closed
  (`onOpenChange(false, { reason })`). Its parts: `FlysheetTrigger`, `FlysheetContent`, `FlysheetHeader`,
  `FlysheetTitle`, `FlysheetDescription`, `FlysheetBody`, `FlysheetFooter`, `FlysheetClose`. Shown on the
  gallery's Overlays page.
- **A change of page in one cross-fade** (`AppShell`, `RouterAppShell`): the page left fades out in 150 ms as
  the new one fades in and rises 6 px in 240 ms, the sidebar and the top bar staying as they are, and in use.
  React 19.3's `ViewTransition`, which React Router's changes of page start; with another router, a new
  `pathname` given to `AppShell` in a React transition. A change of the query alone, Back and Forward, and a
  browser without view transitions change the page at once; where motion is reduced, the new page fades in
  without rising. What is fixed over the page stays above it while it changes (a dialog, a sheet, the drawer,
  the toasts), its glass blurring the page behind it as ever. Another page opens at its top before the browser
  paints.
- **A change of look in one cross-fade**: a theme, an accent or a material chosen changes the whole page at once,
  where a mix of 150 ms colour fades and snaps did; the components' own transitions hold still meanwhile. A press
  is answered at once all the same: where the browser draws no frame soon, the change comes without its fade. The
  theme button's icon turns.
- **Within a page**: a toast leaves, its exit played, before the next one comes (`ToastProvider` took it away
  before its exit could play); what arrives where a skeleton was fades in (`QueryState`), what was there already
  is shown as it is; a meter slides to its ratio; the icon buttons and `ButtonLink` give when pressed, as
  `Button` does.
- **One motion for what floats**: popovers, menus, tooltips, peek cards, the palette and the toasts arrive with
  `springSnappy` and leave with `easeExit`, quicker than they came; sheets and the drawer slide with
  `springSheet`, the sidebar's width and pill too; scrims fade in with `easeFast` and out with `easeExit`.
  `SettleModal` grows from what opened it, without its overshoot. The components' own values are listed in
  `docs/easyui-changes.md`.
- **Tokens**: `motionTransitions.springSheet` and `.easeExit`. For the stylesheets, `ioiti-ui/motion.css`
  (imported by `design.css`): `ease-soft`, `ease-fast` and `ease-exit`, framer-motion's curves, and
  `animate-reveal`; every `transition-*` class takes `ease-fast`'s curve, its 150 ms kept. `motion-safe:` and
  `motion-reduce:` follow `IoitiProvider`'s `reducedMotion` as well as the system (`data-reduced-motion` on
  `<html>`), and the loops of spinners stop where motion is reduced. `over-page`, for a layer an application fixes over
  its pages, keeps it above a change of page. It only adds: the reference blocks of the design hold.
- **The gallery**: the Motion page shows the curves in CSS, a change of page and of look, what moves within a
  page and the motion of what floats.
- **The data tables' filters as one group of buttons** (`AdvancedDataTable`, `DataTableFilters`), as Elastic UI's
  filter group: a button for each column that filters, joined in one bar, saying how many options it has or how
  many are ticked. It opens its options in a list to tick, each with the rows it would leave under the search and
  the other filters, with a search of its own from eight options; a column of two options is an on/off pair,
  pressed one at a time. `ColumnDef`'s `filterDisplay` (`auto`, `list`, `toggle`) chooses; "Clear filters"
  clears them all. A list follows its button as the page scrolls; on a phone, a tap opens it without the
  keyboard, which comes when its search is tapped. `useDataTable()` gives `setFilter` and `countOptions`. Shown on the gallery's Data display
  page, the orders filtered by customer, status and channel.
- **`Kbd`**: the keys of a shortcut as this computer writes them: `mod+k` is ⌘K on an Apple computer, Ctrl K
  elsewhere; `g o` is G, then O. A screen reader hears them in words ("Command K").
- **`CopyButton`**: copies a value and says it did, a check for two seconds and its hint saying what came of it
  ("Copied", "Couldn't copy"), the words said to a screen reader; the focus stays on it.
- **`SegmentedControl`**: two to five choices in one bar, the chosen one filled as a primary button is (with the
  accent's fill), the fill sliding to the next. A radio group to the keyboard, its arrows moving and choosing;
  or the tabs of panels (`role="tablist"`).
- **`useNow`**: the time now, read again every interval; the components asking for the same interval share one
  timer, which stops when none is left.
- **The charts' small text** (StatCard, FunnelChart, ActivityHeatmap, LiveLineChart) is the design's muted text,
  4.5:1 on every surface of every look: it was 3.6:1 on the dark card. Their tooltips follow the pointer as what
  floats moves, and jump to it where motion is reduced; the focus on a chart is the global ring.

An application changes nothing. `ioiti({ accent: 'bloom' })` makes bloom its own; `ACCENTS` and the type
`Accent` have one more value, which a `switch` naming every accent must handle. `Checkbox` keeps its name and
its props: the new box comes with the update. So does the motion, on React 19.3 at least: an application on
React 19.2 updates `react` and `react-dom`. `IoitiProvider reducedMotion="always"` reduces it everywhere. A
table's filters change their look: a column of two options becomes an on/off pair (`filterDisplay: 'list'`
keeps it a list), and `initialFilters` works as before. No name was added to the package's interface.

## [0.2.1] - 2026-10-27

Found while moving WATA's admin interface onto the package, the one place where it did not do what the
interface it came from did.

- **A link to a part of the page shown is the browser's again** (`RouterLink` of `ioiti-ui/react-router`): an
  address that is only a fragment (`#trust`, a check of `CheckList` leading to what says more of it) is drawn as a
  plain `<a>`. Through React Router's `Link` it became `/page#trust`, dropped the address's query and scrolled
  nothing: the router does not scroll to a fragment, and the shell's page, not the window, is what scrolls. Any
  other address still goes through the router.

An application changes nothing.

## [0.2.0] - 2026-10-27

Two more choices beside light and dark, each person's own: an accent and a material. Neutral and flat are
the design as it was: an application that gives neither looks as it did.

- **The accent and the material**: `useTheme()` gives `accent`, `material`, `setAccent` and `setMaterial`;
  `ACCENTS` and `MATERIALS` list them (types `Accent`, `Material`). A choice is kept in the browser beside the
  theme's (`<key>.accent`, `<key>.material`), and the pre-paint script writes `data-accent` and
  `data-material` on `<html>`: nothing for neutral and flat.
- **`LookPicker`**: the button that chooses them, for beside the theme's (`topBarEnd`).
- **`ioiti({ accent, material })`**: the application's own, shown from the first paint until a person picks
  another.
- **The stylesheets**: `ioiti-ui/accents.css` (the `brand` tokens of violet, indigo and blue, and the focus
  ring and one-series charts in their colour) and `ioiti-ui/glass.css` (the backdrop, deeper shadows, and the
  `glass-bar`, `glass-card` and `glass-float` utilities), both imported by `design.css`, with the variants
  `accent:` and `glass:` for an application's own classes. Text holds 4.5:1 on every surface of the 16
  looks, glass laid over its backdrop's strongest colours; the design's own blocks are unchanged.
- **The accent on the components**: what is chosen, current or primary (a filled button, a box checked, a
  switch on, the day picked, the step done, the tab, option, row or page shown, a progress, a link) in the
  accent, through `accent:` classes after the components' own (`docs/easyui-changes.md`). The tones keep their
  colours.
- **Glass on the components**: the sidebar and the top bar (`glass-bar`), panels, tiles and cards
  (`glass-card`), and what floats over the page, the only glass blurred (`glass-float`): popovers, menus,
  dialogs over a lighter scrim, toasts, tooltips, the drawer. Fields, rows and buttons stay solid.
- **The gallery**: the picker in its top bar; a Themes page; the accents' and the glass's tokens on the Colours
  page, with the contrast of the look shown and of every look; each accent's chart colours; glass on the
  Surfaces page.
- **The template**: the picker beside the theme's button, and how to give the application's own look.

An application changes nothing to look as it did. To give it a look of its own, add `accent` and `material`
to `ioiti()` in `vite.config.ts`; to let each person choose, put `<LookPicker />` before `<ThemeToggle />` in
the shell's `topBarEnd`. A canvas chart keyed on the theme to redraw should be keyed on the accent too.

## [0.1.0] - 2026-10-26

The first version: the design and the components of WATA's admin interface (WATA v0.50.1), as a package any
application can install. Held to the original's built CSS block by block, and compared in a browser: the same
tokens and the same shell, in both themes (`docs/fidelity.md`).

- **The design**: `ioiti-ui/styles.css` (Tailwind CSS 4 and the design in one import) or `ioiti-ui/design.css`
  (the design alone); the tokens of both themes, Geist and JetBrains Mono, the global focus ring; the
  pre-paint theme script (`ioiti-ui/theme.js`), under the application's own key.
- **The components**: EasyUI's 44, as WATA's admin had them (`docs/easyui-changes.md`); the blocks of WATA's
  pages (`Panel`, `PageHeader`, `KpiTile`, `Meter`, `Hint`, `ButtonLink`, `PeekLink`, `CheckList`,
  `ExportButton`, `DateRangeFilter`, `ConfirmAction`, `StatusBadge`, `SignedValue`, `QueryState`); and the
  recipes its pages wrote by hand (`Field`, `IconButton`, `Table` and its parts, `TextLink`, `EmptyText`,
  `ErrorText`, `KpiGrid`).
- **The shell**: `AppShell` (sidebar, top bar, the trail of where a page is), `AppBrand`,
  `SidebarFooterButton`, `StateChip`, `NotFoundState`, `NotFoundPage`, `AuthLayout`; the menu as data
  (`Menu`), the page's name (`PageHeader`, `usePageName`, `useTabTitle`).
- **The providers**: `IoitiProvider` (theme, animations, the application's name), `LinkProvider` (the
  application's links for every component), `ThemeProvider`, `ToastProvider`.
- **`ioiti-ui/react-router`**: `RouterRoot`, `RouterAppShell`, `RouterLink`.
- **`ioiti-ui/vite`**: `ioiti()`, the pre-paint script in the pages, no font as a `data:` URI, one React.
- **The gallery** (`npm run gallery`) and **the starter template** (`templates/app`).
