# Releasing

A version is a git tag (`v0.2.0`), which an application installs as `github:IOITI/ioiti-ui#v0.2.0`.

## Why a release commit

npm installs a git dependency by running its `prepare` (or `build`) script, and for that installs every
development tool first (TypeScript, Vite, Vitest, jsdom…), builds twice, and refuses with
`--ignore-scripts`. So `dist/` is never built on install: each release is a commit of its own, after the
branch's, that adds `dist/` and a `package.json` without scripts. npm then takes the tag as it is, in
seconds, and nothing runs. `main` never carries `dist/`.

## Steps

1. Write what changed in `CHANGELOG.md`, under `## [<version>] - <day>`: what an application sees, and
   what it must change (a renamed export, a token's value).
2. On `main`, with nothing uncommitted:

   ```bash
   npm run release -- 0.2.0
   ```

   It sets the version in `package.json` and in the template's dependency (committed on `main`), builds,
   runs every check (lint, types, tests, the gallery's build, `check:package`), then makes the release
   commit and the tag `v0.2.0`. `--skip-checks` skips the checks; `--trailer "Key: value"` adds a trailer to
   both commits.
3. Push the branch and the tag:

   ```bash
   git push origin main v0.2.0
   ```

   CI's `verify-release` installs the tag from GitHub into the template and builds it.

A tag made by mistake and not pushed yet: `git tag -d v0.2.0`.

## In an application

Change the tag in its `package.json` (`"ioiti-ui": "github:IOITI/ioiti-ui#v0.2.0"`), `npm install`, read the
CHANGELOG between the two versions.

A tag is fixed: the lock file records its commit. A branch (`#main`) has no `dist/` and cannot be installed.
