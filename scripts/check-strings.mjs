// The words the package says come from its catalogue (src/locales/), never written in a component: a word written in the
// code is English whatever the application's language. This finds them in what an application draws (src/components,
// src/shell, src/react-router; not the tests): JSX text and the words in a JSX element's expressions (`{found ? … :
// 'No match'}`), the words of an attribute a person reads or hears (aria-label, placeholder, title, alt, a Hint's
// content, `label`, `emptyText`…), and the words such a prop takes by default (`title = 'Recovery ledger'`, `rowLabels`). A word that is not one to translate says why where it is written: `// i18n-exempt: <why>`
// (or `{/* i18n-exempt: <why> */}` in JSX), on its line or the line above.
//
// The words still written in the code are listed in scripts/strings-baseline.json, which only shrinks: a word written
// anew fails, and so does one the list names that the code no longer has (`--update` takes it off).
//
//   node scripts/check-strings.mjs            the check (npm run lint)
//   node scripts/check-strings.mjs --update   the list again, once words have gone to the catalogue: never one added
//                                             (but the first list, where there is none)
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASELINE = join(root, 'scripts/strings-baseline.json')
const FOLDERS = ['src/components', 'src/shell', 'src/react-router']

/** The attributes whose words a person reads or hears. */
const SAID = new Set(['aria-label', 'aria-valuetext', 'aria-roledescription', 'aria-description', 'placeholder', 'alt', 'content', 'hint', 'summary'])
/** The props that take words, by the end of their name (`title`, `emptyText`, `rowLabels`): given, or by default. */
const WORDS_PROP = /(?:label|text|title|placeholder|description|message|caption|legend)s?$/i
const takesWords = (name) => SAID.has(name) || WORDS_PROP.test(name)
const EXEMPT = /i18n-exempt:\s*\S/

function filesUnder(folder) {
  const found = []
  for (const name of readdirSync(join(root, folder))) {
    const path = join(folder, name)
    if (statSync(join(root, path)).isDirectory()) found.push(...filesUnder(path))
    else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) found.push(path)
  }
  return found
}

const hasLetter = (text) => /\p{L}/u.test(text)
const tidy = (text) => text.replace(/\s+/g, ' ').trim()

/** The words a literal says: a string, a template's text with `{…}` for what it puts in. */
function literalText(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isTemplateExpression(node)) return [node.head.text, ...node.templateSpans.map((span) => `{…}${span.literal.text}`)].join('')
  return null
}

/**
 * Every literal with words an expression says: both ends of a condition (not its test), both sides of `??` and `||`, the
 * right of `&&`, an array's items, an object's props that take words. Not a comparison's, a key's, a call's arguments,
 * nor in JSX or a function, which the walk of the file reaches on its own.
 */
function literalsIn(node, found = []) {
  const text = literalText(node)
  if (text !== null) {
    if (hasLetter(text)) found.push({ node, text: tidy(text) })
    return found
  }
  const each = (...nodes) => {
    for (const one of nodes) literalsIn(one, found)
    return found
  }
  if (ts.isConditionalExpression(node)) return each(node.whenTrue, node.whenFalse)
  if (ts.isBinaryExpression(node)) {
    const operator = node.operatorToken.kind
    if (operator === ts.SyntaxKind.AmpersandAmpersandToken) return each(node.right)
    if ([ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken, ts.SyntaxKind.PlusToken].includes(operator)) return each(node.left, node.right)
    return found
  }
  if (ts.isObjectLiteralExpression(node)) {
    const said = node.properties.filter((prop) => ts.isPropertyAssignment(prop) && takesWords(prop.name.getText()))
    return each(...said.map((prop) => prop.initializer))
  }
  if (ts.isArrayLiteralExpression(node)) return each(...node.elements)
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression?.(node)) return each(node.expression)
  return found
}

/** The words written in the code of a file: each `{ line, text }`. */
export function wordsIn(file, source = readFileSync(join(root, file), 'utf8')) {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  const lines = source.split('\n')
  const found = []
  const exempt = (node) => {
    const line = tree.getLineAndCharacterOfPosition(node.getStart(tree)).line
    return EXEMPT.test(lines[line] ?? '') || EXEMPT.test(lines[line - 1] ?? '')
  }
  const say = (node, text) => {
    if (!exempt(node)) found.push({ line: tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1, text })
  }
  const visit = (node) => {
    if (ts.isJsxText(node)) {
      const text = tidy(node.text)
      if (hasLetter(text)) say(node, text)
    } else if (ts.isJsxExpression(node) && node.expression && (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent))) {
      for (const each of literalsIn(node.expression)) say(each.node, each.text)
    } else if (ts.isJsxAttribute(node) && takesWords(node.name.getText(tree)) && node.initializer) {
      const value = ts.isJsxExpression(node.initializer) ? node.initializer.expression : node.initializer
      if (value) for (const each of literalsIn(value)) say(each.node, each.text)
    } else if (ts.isBindingElement(node) && node.initializer) {
      const name = (node.propertyName ?? node.name).getText(tree)
      if (WORDS_PROP.test(name)) for (const each of literalsIn(node.initializer)) say(each.node, each.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(tree)
  return found
}

/** Every file's words, as the baseline lists them: by file, sorted, a word as many times as it is written. */
function current() {
  const words = {}
  for (const folder of FOLDERS) {
    for (const file of filesUnder(folder)) {
      const each = wordsIn(file).map((word) => word.text)
      if (each.length) words[file.split(sep).join('/')] = each.sort()
    }
  }
  return words
}

function count(list = []) {
  const counted = new Map()
  for (const text of list) counted.set(text, (counted.get(text) ?? 0) + 1)
  return counted
}

const isMain = process.argv[1] && relative(process.argv[1], fileURLToPath(import.meta.url)) === ''
if (isMain) {
  const now = current()
  const total = Object.values(now).reduce((sum, list) => sum + list.length, 0)
  let baseline = {}
  try {
    baseline = JSON.parse(readFileSync(BASELINE, 'utf8')).words ?? {}
  } catch {
    baseline = {}
  }

  const added = []
  const gone = []
  for (const file of new Set([...Object.keys(now), ...Object.keys(baseline)])) {
    const was = count(baseline[file])
    const is = count(now[file])
    for (const [text, times] of is) if (times > (was.get(text) ?? 0)) added.push(`${file}: "${text}"`)
    for (const [text, times] of was) if (times > (is.get(text) ?? 0)) gone.push(`${file}: "${text}"`)
  }

  if (process.argv.includes('--update')) {
    if (added.length && existsSync(BASELINE)) {
      console.error(`check-strings: ${added.length} word(s) written in the code that the list does not name; never added to it:`)
      for (const each of added) console.error(`  ${each}: from the catalogue (useMessages), or // i18n-exempt: <why>`)
      process.exit(1)
    }
    const about =
      'The words still written in the code (scripts/check-strings.mjs), until they come from the catalogue: a list that only shrinks.'
    writeFileSync(BASELINE, `${JSON.stringify({ about, words: now }, null, 2)}\n`)
    console.log(`check-strings: the list written again, ${total} words in ${Object.keys(now).length} files (${gone.length} gone)`)
  } else {
    for (const each of added) console.error(`${each}: a word written in the code, English whatever the language: from the catalogue (useMessages), or // i18n-exempt: <why>`)
    for (const each of gone) console.error(`${each}: no longer written; take it off the list (node scripts/check-strings.mjs --update)`)
    if (added.length || gone.length) process.exit(1)
    console.log(`check-strings: ${total} words still written in the code, as the list has them; none added`)
  }
}
