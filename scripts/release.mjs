// Makes a release that applications install from its tag: `github:IOITI/ioiti-ui#v<version>`.
//
//   npm run release -- <version> [--skip-checks] [--trailer "Key: value"]...
//   npm run release -- <version> --at <commit> [--trailer "Key: value"]...
//
// 1. Every version CHANGELOG.md names before this one is a tag on origin (git ls-remote): one tagged and never
//    pushed, or never tagged, is said with the command that mends it, and nothing is released before.
//    Before it, nothing is touched unless Node is the one of .nvmrc (the tests need it), and the branch is main
//    (clean, with all of origin's main).
// 2. On main: what is under `## [Unreleased]` in CHANGELOG.md becomes the version's,
//    dated today (unless the version's section is there already), its sections checked (scripts/changelog.mjs);
//    the version set in package.json, in the template's dependency on ioiti-ui and in the tag the READMEs install.
// 3. Builds, and runs every check (lint, typecheck, tests, the gallery's build, check:package) unless
//    --skip-checks; then commits step 2 (`chore: release v<version>`). A check that fails leaves step 2
//    uncommitted, to mend or to undo (`git checkout -- .`).
// 4. In a temporary worktree, on a commit of its own after that one: dist/ added (it is never committed on a
//    branch), and a package.json without scripts or development dependencies. npm installs a git dependency
//    that has no build script as it is: in seconds, nothing run, nothing built (with a `prepare`, it would install
//    every development tool and build twice).
// 5. Tags that commit `v<version>`. Nothing is pushed: `git push origin main v<version>` does it, and CI then
//    installs the tag and makes its GitHub Release (.github/workflows/verify-release.yml).
//
// --at <commit>: a version whose tag was never made, released from the commit that set its version (its
// `chore: release`). That commit's own lockfile is installed and built in a worktree, its release commit and tag
// made as in steps 4 and 5; the branch and CHANGELOG.md stay as they are, and nothing is checked but the build.
import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  changelogProblems,
  compareVersions,
  formatChangelog,
  hasNotes,
  isVersion,
  parseChangelog,
  promote,
  today,
  UNRELEASED,
  versionProblems,
} from './changelog.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const valueOf = (flag) => {
  const index = args.indexOf(flag)
  return index >= 0 ? args[index + 1] : undefined
}
const isValue = (index) => index > 0 && ['--trailer', '--at'].includes(args[index - 1])
const version = args.find((arg, index) => !arg.startsWith('--') && !isValue(index))
const skipChecks = args.includes('--skip-checks')
const at = valueOf('--at')
const trailers = args.flatMap((arg, index) => (arg === '--trailer' && args[index + 1] ? ['--trailer', args[index + 1]] : []))

function fail(message) {
  console.error(`release: ${message}`)
  process.exit(1)
}

function git(...gitArgs) {
  return execFileSync('git', gitArgs, { cwd: root, encoding: 'utf8' }).trim()
}

function npm(cwd, ...npmArgs) {
  console.log(`\n> npm ${npmArgs.join(' ')}${cwd === root ? '' : ` (in ${cwd})`}`)
  execFileSync('npm', npmArgs, { cwd, stdio: 'inherit' })
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

if (!version || !isVersion(version)) fail('give the version: npm run release -- 0.24.0')
if (args.includes('--at') && !at) fail('give the commit: npm run release -- 0.17.0 --at ef8a481')
const tag = `v${version}`
if (git('tag', '--list', tag)) fail(`${tag} exists already`)

// The checks need the Node of .nvmrc (the tests' jsdom asks for a recent one): said before anything is touched, not
// in a hundred errors once the files are stamped.
const wanted = Number(readFileSync(join(root, '.nvmrc'), 'utf8').trim())
if (Number(process.versions.node.split('.')[0]) < wanted) {
  fail(`Node ${process.versions.node} runs this, and the checks need Node ${wanted} (.nvmrc): nvm use, then again`)
}

// The release commit, apart from any branch, and its tag: dist/ (built here, or copied from root) and a
// package.json that npm installs as it is.
function release(commit, { build }) {
  const work = mkdtempSync(join(tmpdir(), 'ioiti-ui-release-'))
  const tree = join(work, 'tree')
  try {
    git('worktree', 'add', '--detach', tree, commit)
    if (build) {
      npm(tree, 'ci', '--no-audit', '--no-fund')
      npm(tree, 'run', 'build')
    } else {
      cpSync(join(root, 'dist'), join(tree, 'dist'), { recursive: true })
    }
    const released = readJson(join(tree, 'package.json'))
    delete released.scripts
    delete released.devDependencies
    writeJson(join(tree, 'package.json'), released)
    const inTree = (...gitArgs) => execFileSync('git', gitArgs, { cwd: tree, encoding: 'utf8' }).trim()
    inTree('add', '--force', 'dist', 'package.json')
    inTree(
      'commit',
      '-m',
      `release: ${tag}`,
      '-m',
      'The built package (dist/), for installing from this tag. package.json has no scripts here, so that npm installs it as it is.',
      ...trailers,
    )
    inTree('tag', '-a', tag, '-m', `ioiti-ui ${tag}`)
    console.log(`\nTagged ${tag} (${inTree('rev-parse', '--short', 'HEAD')}).`)
  } finally {
    try {
      git('worktree', 'remove', '--force', tree)
    } catch {
      // Already gone.
    }
    rmSync(work, { recursive: true, force: true })
  }
}

if (at) {
  // A version whose tag was never made, from the commit that set it.
  let commit
  try {
    commit = git('rev-parse', '--verify', `${at}^{commit}`)
  } catch {
    fail(`${at} is no commit of this repository`)
  }
  const then = JSON.parse(git('show', `${commit}:package.json`))
  if (then.version !== version) fail(`${at} sets the version ${then.version}, not ${version}`)
  if (!git('show', `${commit}:CHANGELOG.md`).includes(`## [${version}]`)) fail(`${at}'s CHANGELOG.md has no section for ${version}`)
  release(commit, { build: true })
  console.log(`Push it with: git push origin ${tag}`)
  process.exit(0)
}

if (git('status', '--porcelain')) fail('the working tree has changes: commit or remove them first')

// From main, as origin has it at least: a release made on a branch merged later (squashed, rebased) would leave its tag
// on no commit of main.
const branch = git('rev-parse', '--abbrev-ref', 'HEAD')
if (branch !== 'main') fail(`a release is made on main, and this is ${branch}: merge it into main first (docs/releasing.md)`)
let behind = null
try {
  git('fetch', '--quiet', 'origin', 'main')
  behind = Number(git('rev-list', '--count', 'HEAD..origin/main'))
} catch {
  console.warn("release: origin's main could not be read (offline?): main is not checked to have all of it")
}
if (behind) fail(`main is ${behind} commit${behind === 1 ? '' : 's'} behind origin's: git pull --ff-only first`)

// 1. Every version before this one installable from origin.
const changelogPath = join(root, 'CHANGELOG.md')
let changelog = parseChangelog(readFileSync(changelogPath, 'utf8'))
const named = changelog.versions.map((entry) => entry.name).filter((name) => name !== UNRELEASED && name !== version && isVersion(name))
let originTags = null
try {
  originTags = new Set(
    git('ls-remote', '--tags', 'origin')
      .split('\n')
      .map((line) => line.split('\t')[1]?.replace(/^refs\/tags\//, '').replace(/\^\{\}$/, ''))
      .filter(Boolean),
  )
} catch {
  console.warn("release: origin's tags could not be read (offline?): the earlier versions are not checked to be tags there")
}
if (originTags) {
  const missing = named.filter((name) => !originTags.has(`v${name}`))
  if (missing.length) {
    const mend = missing.map((name) => {
      if (git('tag', '--list', `v${name}`)) return `v${name}, tagged here and never pushed: git push origin v${name}`
      const setBy = git('log', '--format=%h', '-n', '1', `--grep=^chore: release v${name}$`)
      return `v${name}, never tagged: npm run release -- ${name} --at ${setBy || '<the commit that set its version>'}`
    })
    fail(`CHANGELOG.md names versions that are no tag on origin, which no application can install:\n  ${mend.join('\n  ')}`)
  }
}
const newest = named.find(Boolean)
if (newest && compareVersions(version, newest) <= 0) fail(`${version} is not after ${newest}, the newest version of CHANGELOG.md`)

// 2. The version's notes, its number, and the tag the READMEs install.
const section = changelog.versions.find((entry) => entry.name === version)
if (!section) {
  const unreleased = changelog.versions.find((entry) => entry.name === UNRELEASED)
  if (!unreleased || !hasNotes(unreleased)) fail(`CHANGELOG.md has nothing under "## [${UNRELEASED}]": write what this release changes first`)
  changelog = promote(changelog, version, today())
}
const problems = [...versionProblems(changelog.versions.find((entry) => entry.name === version)), ...changelogProblems(changelog)]
if (problems.length) fail(`CHANGELOG.md:\n  ${[...new Set(problems)].join('\n  ')}`)
writeFileSync(changelogPath, formatChangelog(changelog))

const manifestPath = join(root, 'package.json')
const manifest = readJson(manifestPath)
manifest.version = version
writeJson(manifestPath, manifest)
const templatePath = join(root, 'templates/app/package.json')
const template = readJson(templatePath)
template.dependencies['ioiti-ui'] = `github:IOITI/ioiti-ui#${tag}`
writeJson(templatePath, template)
const STAMPED = ['README.md', 'templates/app/README.md']
for (const file of STAMPED) {
  const path = join(root, file)
  writeFileSync(path, readFileSync(path, 'utf8').replace(/(IOITI\/ioiti-ui(?:\/templates\/app)?#)v[0-9A-Za-z.-]*[0-9A-Za-z]/g, `$1${tag}`))
}

// The version each exported name first shipped in, this one's new names included (the gallery's "Since").
execFileSync(process.execPath, [join(root, 'scripts/since.mjs'), '--next', version], { cwd: root, stdio: 'inherit' })

// 3. Built, checked, committed.
const touched = ['CHANGELOG.md', 'package.json', 'templates/app/package.json', 'gallery/src/since.json', ...STAMPED]
try {
  npm(root, 'run', 'build')
  if (!skipChecks) {
    for (const script of ['lint', 'typecheck', 'test', 'build:gallery', 'check:package']) npm(root, 'run', script)
  }
} catch {
  fail(`a check failed: ${touched.join(', ')} are left as the release set them, uncommitted (git checkout -- . undoes it)`)
}
git('add', ...touched)
if (git('diff', '--cached', '--name-only')) {
  git('commit', '-m', `chore: release ${tag}`, ...trailers)
  console.log(`Committed the version ${version} on ${git('rev-parse', '--abbrev-ref', 'HEAD')}.`)
}

// 4 and 5. The release commit and its tag.
release('HEAD', { build: false })
console.log(`Push it with: git push origin ${git('rev-parse', '--abbrev-ref', 'HEAD')} ${tag}`)
