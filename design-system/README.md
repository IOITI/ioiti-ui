# The IOITI Design System

ioiti-ui as a claude.ai Design System artifact: the tokens, the type, the guide and a card for each component,
live (the library itself runs in every preview). This folder makes its files; the artifact holds them.

The artifact: https://claude.ai/artifact/Y5cqfM5Rnfa3KN4UAWHDft (private to its owner until shared).

## After a release

```bash
node design-system/build.mjs      # writes design-system/out/project/ (not committed)
node design-system/check.mjs      # optional: renders every card in both themes (needs Playwright)
```

Then ask Claude Code to publish it: *"Publish design-system/out to the IOITI Design System artifact"*. It reads
the artifact's index first, then sends `out/files.json`'s files with `root: design-system/out`, the index
(`out/project/design-system.json`) last, as the Design System type's instructions say. Someone may have edited
the system on its page since: Claude Code compares, and keeps their edits or asks.

The build stops when the stylesheets define a token `config.json` has no note for (a new colour), or no longer
define one it has (a token removed): say what the new one is for in `notes`, or remove the note, and build
again. Nothing else needs changing for a release that only changes values.

## What is made, and what is written

| Made by the build, from the code | Written here |
|---|---|
| `tokens.json`: every colour, shadow, radius and tracking value, read from `src/styles/` (tokens, theme, design, accents, glass), each theme as the cascade resolves it | `config.json`: each token's note (`notes`, in the order the page shows them), the spacing and the type styles, the fonts, the asset records, the artifact's marker |
| `components/bundle.js`: `src/index.ts` as one script, `window.IoitiUI` | `cards.json`: the cards, in order, with their group and height |
| `components/bundle.css`: the design's stylesheets compiled by Tailwind over the components and previews, the values of `tokens.json` taken out (the page declares them) | `previews/<Card>.tsx`: each card's preview, recreating the gallery's demo |
| `components/lib/`: React and React DOM, from `node_modules` | `components/<Card>/README.md`: each card's guidelines |
| `components/index.d.ts`: the public modules' declarations | `guide/`: the guide (`README.md`) and the asset groups' notes |
| `components/<Card>/preview.html`, the fonts, the index | `cover.html`: the cover |

## A new component

Add it to `cards.json` (its export's name, a group, a height), write `previews/<Name>.tsx` from its gallery demo
and `components/<Name>/README.md` (the first sentence is the card's summary; every prop checked against its
types), build, check, publish. A preview imports only from `ioiti-ui`, `lucide-react`, `react` and
`react-dom/client`; it opens nothing that takes the focus on load, and its links go to `#…` (the frame has no
router).

## The gallery's guidelines

`components/<Name>/README.md` is also what the gallery shows of a component (`gallery/src/catalogue/`): its summary
under the page's title, its rules under Guidelines (not its "You provide": the gallery's props tables are read from
the types). Every family of the gallery has one, so some have no card (`CodeEditor`, `DiffEditor`, `Calendar`…): the
build reads `cards.json` only, and leaves them out.

## Assets

The mark (`gallery/public/favicon.svg`) and Bloom's grains (`src/styles/grain-*.png`) are uploads of the artifact:
`config.json` holds their records. A changed file is uploaded again (Claude Code: an asset upload to the
artifact) and its new id written in `config.json`; the grains' ids are also the ones `bundle.css` loads.
