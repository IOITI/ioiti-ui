// Makes a release that applications install from its tag: `github:IOITI/ioiti-ui#v<version>`.
//
//   npm run release -- <version> [--skip-checks] [--trailer "Key: value"]...
//
// 1. On the branch checked out (clean), sets the version in package.json and the template's
//    dependency on ioiti-ui to the new tag; CHANGELOG.md must already have the version's section.
//    Commits that if anything changed.
// 2. Builds, and runs every check (lint, typecheck, tests, the gallery's build, check:package)
//    unless --skip-checks.
// 3. In a temporary worktree, on a commit of its own after that one: dist/ added (it is never
//    committed on a branch), and a package.json without scripts or development dependencies.
//    npm installs a git dependency that has no build script as it is: in seconds, nothing run,
//    nothing built (with a `prepare`, it would install every development tool and build twice).
// 4. Tags that commit `v<version>`. Nothing is pushed: `git push origin main v<version>` does it.
import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const version = args.find((arg) => !arg.startsWith('--') && !isTrailerValue(arg))
const skipChecks = args.includes('--skip-checks')
const trailers = args.flatMap((arg, index) => (arg === '--trailer' && args[index + 1] ? ['--trailer', args[index + 1]] : []))

function isTrailerValue(arg) {
  const index = args.indexOf(arg)
  return index > 0 && args[index - 1] === '--trailer'
}

function fail(message) {
  console.error(`release: ${message}`)
  process.exit(1)
}

function git(...gitArgs) {
  return execFileSync('git', gitArgs, { cwd: root, encoding: 'utf8' }).trim()
}

function npm(script) {
  console.log(`\n> npm run ${script}`)
  execFileSync('npm', ['run', script], { cwd: root, stdio: 'inherit' })
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

if (!version || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) fail('give the version: npm run release -- 0.2.0')
const tag = `v${version}`
if (git('status', '--porcelain')) fail('the working tree has changes: commit or remove them first')
if (git('tag', '--list', tag)) fail(`${tag} exists already`)
if (!readFileSync(join(root, 'CHANGELOG.md'), 'utf8').includes(`## [${version}]`)) {
  fail(`CHANGELOG.md has no section "## [${version}]": write what this release changes first`)
}

// 1. The version, on the branch.
const manifestPath = join(root, 'package.json')
const manifest = readJson(manifestPath)
const templatePath = join(root, 'templates/app/package.json')
const template = readJson(templatePath)
const dependency = `github:IOITI/ioiti-ui#${tag}`
if (manifest.version !== version || template.dependencies['ioiti-ui'] !== dependency) {
  manifest.version = version
  template.dependencies['ioiti-ui'] = dependency
  writeJson(manifestPath, manifest)
  writeJson(templatePath, template)
  git('add', 'package.json', 'templates/app/package.json')
  git('commit', '-m', `chore: release ${tag}`, ...trailers)
  console.log(`Committed the version ${version} on ${git('rev-parse', '--abbrev-ref', 'HEAD')}.`)
}

// 2. Built and checked.
npm('build')
if (!skipChecks) {
  for (const script of ['lint', 'typecheck', 'test', 'build:gallery', 'check:package']) npm(script)
}

// 3. The release commit, apart from the branch.
const work = mkdtempSync(join(tmpdir(), 'ioiti-ui-release-'))
const tree = join(work, 'tree')
try {
  git('worktree', 'add', '--detach', tree, 'HEAD')
  cpSync(join(root, 'dist'), join(tree, 'dist'), { recursive: true })
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
  // 4. The tag.
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
console.log(`Push it with: git push origin ${git('rev-parse', '--abbrev-ref', 'HEAD')} ${tag}`)
