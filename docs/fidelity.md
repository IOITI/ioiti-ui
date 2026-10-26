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

## What the package changed, and why

Nothing of the design's values. The differences an application can see are listed in
`docs/easyui-changes.md` under "ioiti-ui's own changes": defaults that were WATA's usage (the series
blue of the one-series charts), a selection basket that no longer runs off a phone's screen in `inline`
mode, and the like.
