# Fidelity to the interface it was taken from

ioiti-ui is the design of WATA's admin interface (WATA v0.50.1, `admin_ui/` at IOITI/WATA `e656282`).
"The same design" is checked three ways.

## 1. The built CSS, block by block (automated)

`npm run check:package` builds the starter template on the package as a release packs it, and checks that
its CSS holds, character for character, the 25 blocks of `test/golden/reference-blocks.json`: the
tokens of both themes (`:root`, `.dark`, `:root:not(.dark)`), Tailwind's base layer with the design's
base rules, the scrollbar, the focus ring, and the 11 `@font-face` rules of Geist and JetBrains Mono.
Those blocks do not depend on which classes the pages use, so any application's build has them.

The reference was taken from WATA's own build:

```bash
cd ../wata/admin_ui && npm ci && npm run build      # writes ../src/admin/static
node scripts/golden-from.mjs ../wata/src/admin/static/assets/index-*.css "The admin interface of WATA v…"
```

A block that differs fails the check, which says where the two texts part. A change of the design made
on purpose (a token, a new version of Tailwind CSS or of a font) means taking the reference again, and
saying so in CHANGELOG.md.

## 2. The computed values, in a browser (by hand)

`docs/fidelity/dump.js`, run in a page, returns every custom property the page's stylesheets set,
computed in the light theme and in the dark one, and the computed styles of the shell's parts (the
sidebar, the top bar, the menu's entries and sections, the trail, the page's column, title and
description, a panel and its title, the body), in both themes.

Run it on WATA's dashboard (its fake server: `npm run dev:api` in WATA's `admin_ui`) and on the gallery's
dashboard pattern **built** (`npm run build:gallery`, then `npx vite preview --config gallery/vite.config.ts`):
a development server writes the stylesheet unminified, and a custom property keeps the text it was
written with (`#FFFFFF` there, `#fff` in a build). Give both pages the same viewport (1440 × 900).

Compared on 2026-10-26:

| What | Result |
|---|---|
| Custom properties both pages have (193) | identical, light and dark |
| The 12 parts of the shell | identical, light and dark |
| The page's column | identical but its height (the pages hold different content) |
| Custom properties one page has alone | Tailwind's, emitted for the classes a page uses: `--text-3xl` (the gallery), `--tracking-wide` (WATA) |

## 3. Side by side

WATA's dashboard and the gallery's dashboard pattern (`/patterns/dashboard`), which is made of the same
blocks the same way, were looked at side by side in both themes, at 1440 px and at 375 px.

## 4. An application moved onto the package

WATA's admin interface, on 2026-10-27 (0.2.1), was compared with its build of before, on its fake server:

- **its built CSS, rule by rule**, parsed with PostCSS: every rule of the build before is in the new one, in
  the same order; the new one adds the accents' and the glass's rules (inert without `data-accent` or
  `data-material` on `<html>`), the utilities of the package's components the interface does not show, and six
  palette colours of the glass's backdrop. The few rules gone were utilities Tailwind had read in comments and
  in a test (`collapse`, `sepia`) and in EasyUI's 404 demo, which the package removed;
- **the computed styles of every element of 26 pages**, light and dark, at 1440 × 900 and at 375 × 812: the
  multiset of their colours, borders, radii, shadows, fonts, spacing, display and position (no geometry, no
  text), the build before against the new one, and the build before against itself for the noise of the fake's
  live data. The same, but for that noise.

How such a comparison goes wrong: switching the theme by the `dark` class catches an element in its
`transition-colors`, whose colour is then the one before (in `oklab`), so transitions are switched off while
the styles are read; toasts and what floats come and go with live data, so what is inside a `position: fixed`
element is left out; and a browser that gives the page no animation frame (a hidden pane) leaves framer-motion's
entrances at their start (`opacity: 0`), which the build before may not have been caught in.

## The accents and the glass material

They are ioiti-ui's own, not the original's: only neutral and flat, the default, are held to it. They are made
so that the default cannot move:

- their tokens are in files of their own (`src/styles/accents.css`, `glass.css`), in blocks more specific than
  the design's and set only while `data-accent` or `data-material` is on `<html>`; nothing in a layer. The
  check above passes on the same reference, which was not taken again;
- a component keeps its classes, and the accent's and the glass's are added after them, gated on those
  attributes (`accent:`, `glass-*`);
- `src/styles/styles.test.ts` compiles the stylesheets with and without the two files: every block of the
  design is in both, in the same order, the base layer whole, and what the two files add is only their own
  blocks.

In a browser, on 2026-10-26: the computed colours, borders, shadows and blurs of every element of the
gallery's 19 pages (the set of their distinct values, per page, in the light theme and in the dark one) were
recorded before the change and compared after each step of it: identical, but for the picker added to the
gallery's top bar.

## The motion

ioiti-ui's own too, and on by default (`src/styles/motion.css`, `src/lib/motion.ts`): the reference was not
taken again, as it holds nothing of it. Its curves are Tailwind's theme layer (`--ease-soft`, `--ease-fast`,
`--ease-exit`, and `ease-fast`'s curve for every `transition-*` class, their 150 ms kept), which the reference
leaves out; its rules are blocks of their own after the glass's (`::view-transition-…`,
`:root[data-reduced-motion=…]`, `:root[data-look-change] …`), nothing in a layer. `src/styles/styles.test.ts`
holds that it only adds, as the accents and the glass do. Compare styles at rest: a change of page or of look
is a picture over the page while it plays, and a change of look holds the components' own transitions still.

## What the package changed, and why

Nothing of the design's values. The differences an application can see are listed in
`docs/easyui-changes.md` under "ioiti-ui's own changes": defaults that were WATA's usage (the series
blue of the one-series charts), a selection basket that no longer runs off a phone's screen in `inline`
mode, and the like.
