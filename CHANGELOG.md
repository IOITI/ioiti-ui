# Changelog

What changes from one version of ioiti-ui to the next. A version is a git tag (`v0.1.0`), which an
application installs as `github:IOITI/ioiti-ui#v0.1.0` (`docs/releasing.md`).

## [0.3.0] - Unreleased

A fifth accent, `bloom`: the colours of a printed flyer, a soft gradient with a grain.

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

An application changes nothing. `ioiti({ accent: 'bloom' })` makes bloom its own; `ACCENTS` and the type
`Accent` have one more value, which a `switch` naming every accent must handle.

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
