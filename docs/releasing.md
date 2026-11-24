# Releasing

A version is a git tag (`v0.24.0`), which an application installs as `github:IOITI/ioiti-ui#v0.24.0`, and a GitHub
Release, which says what its section of the CHANGELOG says.

## Why a release commit

npm installs a git dependency by running its `prepare` (or `build`) script, and for that installs every
development tool first (TypeScript, Vite, Vitest, jsdom…), builds twice, and refuses with
`--ignore-scripts`. So `dist/` is never built on install: each release is a commit of its own, after the
branch's, that adds `dist/` and a `package.json` without scripts. npm then takes the tag as it is, in
seconds, and nothing runs. `main` never carries `dist/`.

## As changes land

Each change writes its line in `CHANGELOG.md` under `## [Unreleased]`, in its section: **Added**, **Changed**,
**Deprecated**, **Removed**, **Fixed**, **Security**; and under **Upgrading**, what an application does when
something changes, is deprecated or removed. The API's name comes first, then what it does now. `npm run lint`
holds the sections, their order and the links at the CHANGELOG's foot (`scripts/check-docs.mjs`).

## Steps

1. On `main`, with nothing uncommitted and all of origin's `main`, under Node 24 (`nvm use`):

   ```bash
   npm run release -- 0.24.0
   ```

   Elsewhere (another branch, a `main` behind origin's, a Node before 22.12, whose tests cannot start), it says so
   and touches nothing.

   - **Every version the CHANGELOG names before it is a tag on origin** (`git ls-remote`), or nothing is released:
     the command that mends one is said (`git push origin v…` for a tag made and never pushed, `--at` below for
     one never made).
   - **What is under `[Unreleased]` becomes the version's**, dated today, an empty `[Unreleased]` above it; its
     sections are checked.
   - **The version is set** in `package.json`, in the template's dependency on ioiti-ui, and in the tag the README and
     the template's README install.
   - **Built and checked**: lint, types, tests, the gallery's build, `check:package`. A check that fails leaves the
     changes above uncommitted, to mend (`git checkout -- .` undoes them); once all pass, they are committed
     (`chore: release v0.24.0`).
   - **The release commit and the tag** `v0.24.0`: `dist/` and a `package.json` without scripts, on a commit of
     its own after the branch's.

   `--skip-checks` skips the checks; `--trailer "Key: value"` adds a trailer to both commits.
2. Push the branch and the tag:

   ```bash
   git push origin main v0.24.0
   ```

   CI's `verify-release` installs the tag from GitHub into the template and builds it, then makes the tag's GitHub
   Release, its notes the version's section, the line that installs it and the commits since the version before.
   `node scripts/release-notes.mjs v0.24.0` shows them beforehand.

A tag made by mistake and not pushed yet: `git tag -d v0.24.0`.

## A version never tagged

A version the CHANGELOG names whose tag was never made cannot be installed, and `npm run release` refuses the next
one until it is (0.17.0, 0.18.0 and 0.18.1 were such). It is released from the commit that set its version, its
`chore: release`:

```bash
npm run release -- 0.17.0 --at ef8a481
git push origin v0.17.0
```

That commit's own lockfile is installed and built in a worktree, its release commit and tag made; the branch and the
CHANGELOG stay as they are. CI installs the tag as it is installed in an application. The Release is made by the
workflow the tag carries, which has the job from 0.24.0: an older version's is made by hand,
`node scripts/release-notes.mjs v0.17.0 > notes.md && gh release create v0.17.0 --verify-tag --notes-file notes.md`.

## What an application bundles

`check:package` weighs what an application bundles, gzipped: one component alone, each entry whole, and the
template (its JavaScript, its CSS), against `test/size-budget.json`, 5 % to spare. One component bundling more than
a tenth of the package fails it: tree-shaking broke. A change that weighs more on purpose records it,
`npm run check:package -- --update-budget`, and says so in the CHANGELOG.

## In an application

Change the tag in its `package.json` (`"ioiti-ui": "github:IOITI/ioiti-ui#v0.24.0"`), `npm install`, read the
CHANGELOG between the two versions: its Upgrading sections say what to do.

A tag is fixed: the lock file records its commit. A branch (`#main`) has no `dist/` and cannot be installed.
