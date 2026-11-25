#!/usr/bin/env node
// ioiti-ui-codemod: an application's code given the package's names of today (CHANGELOG.md, Deprecated and Removed).
//
//   npx ioiti-ui-codemod [paths…] [--dry-run] [--check]
//
// Rewrites the files under the paths given (src/ by default), in place: an import renamed and its uses, a prop
// renamed, a value renamed. It reads them with the application's own TypeScript and changes only what it must, the
// formatting kept. What it cannot rewrite for sure (a spread, a value computed, a name with no name in its place) it
// says, with the file and the line. --dry-run says what it would do and writes nothing; --check fails (exit 1) where
// anything is left to rewrite, for CI.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { extname, join, relative, resolve } from 'node:path'
import type * as TS from 'typescript'

import { rulesOf } from './rules.js'
import { rewrite } from './transform.js'

const CODE = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs'])
const SKIPPED = new Set(['node_modules', 'dist', 'build', 'coverage', '.git', '.vite', '.next', '.turbo'])

const say = (text = '') => process.stdout.write(`${text}\n`)
function fail(text: string): never {
  process.stderr.write(`ioiti-ui-codemod: ${text}\n`)
  process.exit(2)
}

const flags = new Set(process.argv.slice(2).filter((argument) => argument.startsWith('--')))
for (const flag of flags) {
  if (!['--dry-run', '--check', '--help'].includes(flag)) fail(`${flag}? It takes --dry-run, --check and paths`)
}
if (flags.has('--help')) {
  say('npx ioiti-ui-codemod [paths…] [--dry-run] [--check]: the package\'s deprecated names rewritten (src/ by default)')
  process.exit(0)
}
const dryRun = flags.has('--dry-run') || flags.has('--check')
const given = process.argv.slice(2).filter((argument) => !argument.startsWith('--'))
const paths = (given.length ? given : ['src']).map((path) => resolve(path))

// The application's TypeScript, the one its code is written for.
let ts: typeof TS
try {
  ts = createRequire(join(process.cwd(), 'package.json'))('typescript') as typeof TS
} catch {
  fail('it reads your code with your project\'s TypeScript, which is not installed here: npm install --save-dev typescript, then again')
}

function filesUnder(path: string): string[] {
  let stats
  try {
    stats = statSync(path)
  } catch {
    return fail(`${relative(process.cwd(), path) || path}: no such file or folder`)
  }
  if (stats.isFile()) return CODE.has(extname(path)) && !path.endsWith('.d.ts') ? [path] : []
  return readdirSync(path)
    .filter((name) => !SKIPPED.has(name))
    .sort()
    .flatMap((name) => filesUnder(join(path, name)))
}

const rules = rulesOf()
let rewritten = 0
let left = 0
for (const path of [...new Set(paths.flatMap(filesUnder))]) {
  const source = readFileSync(path, 'utf8')
  const { output, changes, notes } = rewrite(ts, path, source, rules)
  if (!changes.length && !notes.length) continue
  const name = relative(process.cwd(), path)
  say(name)
  for (const change of changes) say(`  ${name}:${change.line}  ${change.text}`)
  for (const note of notes) say(`  ${name}:${note.line}  to look at: ${note.text}`)
  if (output !== source) {
    rewritten += 1
    if (!dryRun) writeFileSync(path, output)
  }
  left += notes.length
}

const files = (count: number) => `${count} file${count === 1 ? '' : 's'}`
say()
say(
  rewritten
    ? `${dryRun ? 'Would rewrite' : 'Rewrote'} ${files(rewritten)}; ${left ? `${left} place${left === 1 ? '' : 's'} to look at by hand, above` : 'nothing left to look at'}.`
    : `Nothing to rewrite${left ? `; ${left} place${left === 1 ? '' : 's'} to look at by hand, above` : ''}.`,
)
if (flags.has('--check') && (rewritten || left)) process.exit(1)
