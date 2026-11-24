# Contributing

How a change to ioiti-ui is made, checked and proposed. The conventions of the code are in `AGENTS.md`, which holds
for people as it does for agents; this file is the way through them.

## Before you start

- **Node.js 24** (`nvm use`: `.nvmrc`), then `npm ci`.
- **The gallery** is where a change is seen: `npm run gallery` (http://localhost:5180), on the source, in both
  themes and every look.
- **An idea or a question first as an issue**, before a change of the design or of an API: its form says what helps.

## What runs

```bash
npm run lint             # oxlint, check-source (the rules of AGENTS.md), check-docs (what the docs count), the props
npm run typecheck
npm test                 # Vitest and Testing Library, in jsdom
npm run build            # dist/
npm run build:gallery    # the gallery on dist/
npm run check:package    # the package packed, installed into the template, built, read and weighed
npm run e2e              # the gallery built, in Chromium: every page, axe with CSS, the keyboard, motion
```

All of it passes before a pull request is reviewed; CI runs it again, on Node 24 and on Node 22.12, the browser suite in
Firefox and WebKit too, and compares the gallery's screenshots on Linux (a picture that moved is a diff to look at;
a new one, a baseline to commit from CI's `visual-baselines`).

## A change

- **One subject per pull request**, on a branch of `main`. Commits are conventional (`feat(Sidebar): …`, `fix: …`,
  `docs: …`), their subject saying what changes for whoever uses the package.
- **Its line in the CHANGELOG**, under `## [Unreleased]`, in its section (Added, Changed, Deprecated, Removed, Fixed,
  Security), starting with the API it is about. **Upgrading** says what an application does when something changes,
  is deprecated or removed. `npm run lint` holds the sections and their order.
- **Nothing changes at once.** A prop, a value or a component renamed or reshaped keeps its old name working, marked
  `@deprecated`, and a line of Deprecated says what replaces it; the old name goes at 1.0.
- **Both themes, every look.** A colour has its two values (a token by role, the recipes of `src/lib/recipes.ts`);
  text holds 4.5:1 everywhere (`gallery/src/tokens.test.ts`); a filled, primary control adds the accent's classes;
  motion is the tokens'. `AGENTS.md` gives the reasons.
- **The design's values do not change by accident**: `check:package` holds the built CSS to
  `test/golden/reference-blocks.json`. A change on purpose is a new reference (`scripts/golden-from.mjs`) and a line
  of the CHANGELOG.

## A new component

1. **Its file**, in `src/components/` (or `src/shell/` for the frame of the pages), exporting components only, its
   helpers in a `.ts` beside it; relative imports end in `.js`.
2. **Its export**, named in `src/index.ts`; then `npx vitest run -u` (the list of exports is a snapshot) and its line
   under Added.
3. **Its family in the gallery**, `gallery/src/components/<group>/<family>/`, named in the group's `category.ts`: two
   examples at least, which import `ioiti-ui` as an application does.
4. **Its guidelines**, `design-system/components/<Name>/README.md`: what the gallery shows beside its examples.
5. **Its props**, `npm run props` (lint fails while `gallery/src/props.json` differs from the types).
6. **Its words**, in the catalogue: a namespace in `src/locales/en/` and its French in `src/locales/fr/`, said with
   `useMessages()`; its numbers and moments with `useFormat()`. None written in its code (`npm run lint`).
7. **Its tests** beside it, by role and by keyboard, and in French; and a look at it in both themes, with an accent and
   with glass, and in French (the gallery's language picker).

A component taken from EasyUI goes in `src/components/ui/`, each change marked `// ioiti-ui:` and listed in
`docs/easyui-changes.md`.

## Releases

A release is the maintainers' (`docs/releasing.md`): `npm run release -- <version>` names what is under
[Unreleased], builds, checks and tags; CI then installs the tag from GitHub and makes its Release.

## A flaw in the package's security

Reported privately, never in an issue: `SECURITY.md`.
