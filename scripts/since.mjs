// The version each name the package exports first shipped in: read from every tag's built types (the release commits
// carry dist/), written to gallery/src/since.json, which a family's page reads ("Since 0.12.0"). A name no tag has yet
// is the next version's: `--next <version>` names it (release.mjs runs this so before building the release); without
// it, such a name is left out (the gallery says it is new).
//
//   node scripts/since.mjs [--next 0.32.0]
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'

import { compareVersions } from './changelog.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ts = createRequire(import.meta.url)('typescript')
const OUT = join(root, 'gallery/src/since.json')
/** The entries whose names a page shows: the package, the router's adapter, the code editors. */
const ENTRIES = ['dist/index.d.ts', 'dist/react-router/index.d.ts', 'dist/code/index.d.ts']

const at = process.argv.indexOf('--next')
const next = at > 0 ? process.argv[at + 1] : undefined
if (at > 0 && !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(next ?? '')) {
  console.error('since: --next takes a version (0.32.0)')
  process.exit(1)
}

const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
const shown = (tag, file) => {
  try {
    return git('show', `${tag}:${file}`)
  } catch {
    return undefined
  }
}

/** The names a built declaration file exports, following `export *` into the files it names. */
function exportsOf(tag, file, seen = new Set()) {
  if (seen.has(file)) return []
  seen.add(file)
  const text = shown(tag, file)
  if (text === undefined) return []
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, false)
  const names = []
  const exported = (node) => ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export
  for (const statement of source.statements) {
    if (ts.isExportDeclaration(statement)) {
      if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) names.push(element.name.text)
      } else if (!statement.exportClause && statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
        const target = posix.join(posix.dirname(file), statement.moduleSpecifier.text).replace(/\.js$/, '.d.ts')
        names.push(...exportsOf(tag, target, seen))
      }
    } else if (ts.isVariableStatement(statement) && exported(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.push(declaration.name.text)
      }
    } else if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name &&
      exported(statement)
    ) {
      names.push(statement.name.text)
    }
  }
  return names
}

const tags = git('tag', '--list', 'v*')
  .split('\n')
  .filter(Boolean)
  .map((tag) => tag.slice(1))
  .filter((version) => !version.includes('-'))
  .sort(compareVersions)

const since = {}
for (const version of tags) {
  for (const entry of ENTRIES) {
    for (const name of exportsOf(`v${version}`, entry)) since[name] ??= version
  }
}

// What the source exports that no tag has: the next version's, when it is named.
if (next) {
  for (const entry of ['src/index.ts', 'src/react-router/index.ts', 'src/code/index.ts']) {
    const program = ts.createProgram([join(root, entry)], { allowJs: false, noEmit: true, jsx: ts.JsxEmit.ReactJSX })
    const checker = program.getTypeChecker()
    const module = checker.getSymbolAtLocation(program.getSourceFile(join(root, entry)))
    for (const symbol of module ? checker.getExportsOfModule(module) : []) since[symbol.name] ??= next
  }
}

const sorted = Object.fromEntries(Object.entries(since).sort(([a], [b]) => a.localeCompare(b, 'en')))
const text = `${JSON.stringify(sorted, null, 2)}\n`
let before = ''
try {
  before = readFileSync(OUT, 'utf8')
} catch {
  // Not written yet.
}
if (text !== before) writeFileSync(OUT, text)
console.log(`since: ${Object.keys(sorted).length} names, from ${tags.length} tags${next ? ` and ${next}` : ''}: gallery/src/since.json`)
