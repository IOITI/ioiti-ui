// The words the package says come from its catalogue (src/locales/), never written in a component: a word written in the
// code is English whatever the application's language. This finds them in what an application draws (src/components,
// src/shell, src/react-router, src/code; not the tests): JSX text and the words in a JSX element's expressions
// (`{found ? … : 'No match'}`), the words of an attribute a person reads or hears (aria-label, placeholder, title, alt, a
// Hint's content, `label`, `emptyText`…), and the words such a prop takes by default (`title = 'Recovery ledger'`,
// `rowLabels`). And a template literal, wherever it is, that says words around what it puts in (`More ${label} options`,
// `${count} items`): a sentence built around a value, whose words the catalogue holds as a function of it; not a class,
// nor what is said to the developer (thrown, logged).
// A word that is not one to translate (a brand, a code, a symbol) says why where it is written:
// `// i18n-exempt: <why>` (or `{/* i18n-exempt: <why> */}` in JSX), on its line or the line above.
//
//   node scripts/check-strings.mjs            the check (npm run lint): none written
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const FOLDERS = ['src/components', 'src/shell', 'src/react-router', 'src/code']

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

/** Where a template puts in a value, in its text: no character a template's own text holds. */
const PUT = '\uE000'
/** A piece of a template's text that is a word: letters (an apostrophe within), a mark of punctuation after them. */
const WORD = /^\p{L}+(?:['’]\p{L}+)*[.,:;!?…]?$/u
/** What a template puts in, alone between spaces: a mark of punctuation or a quote around it at most (`“${name}”,`). */
const ALONE = new RegExp(`^[("“‘«]?${PUT}[.,:;!?…)"”’»]?$`, 'u')

/**
 * Whether a template literal says words around what it puts in (`More ${label} options`, `${count} items`): each piece
 * of its text between spaces a word of letters or what it puts in, alone; one word of two letters at least. Not a class
 * (`text-${tone}`, `${base} animate-pulse`), an id (`${id}-label`), a unit (`${size}px`), a path or a selector: their
 * pieces are glued to what is put in, or hold what no word holds (a hyphen, a digit, a bracket, a sign).
 */
function templateSaysWords(node) {
  const text = [node.head.text, ...node.templateSpans.map((span) => `${PUT}${span.literal.text}`)].join('')
  const pieces = text.split(/\s+/).filter(Boolean)
  return pieces.every((piece) => WORD.test(piece) || ALONE.test(piece)) && pieces.some((piece) => WORD.test(piece) && /\p{L}{2}/u.test(piece))
}

/** The calls that make a class of their arguments, and what is said to the developer (a thrown error, the console). */
const CLASS_CALLS = new Set(['cn', 'clsx', 'cx', 'twMerge', 'cva'])
const DEVELOPER_CALLS = new Set(['devWarn', 'deprecated'])

/**
 * Whether a template is a class or a style (a `className` or `style` attribute, a `cn(…)`), or words said to the developer
 * (thrown, logged): no words a person using the application reads.
 */
function notForAPerson(node) {
  for (let at = node.parent; at && !ts.isSourceFile(at); at = at.parent) {
    if (ts.isJsxAttribute(at)) return ['className', 'class', 'style'].includes(at.name.getText())
    if (ts.isThrowStatement(at)) return true
    if (ts.isNewExpression(at) && /Error$/.test(at.expression.getText())) return true
    if (ts.isCallExpression(at)) {
      const callee = at.expression.getText()
      if (CLASS_CALLS.has(callee) || DEVELOPER_CALLS.has(callee) || callee.startsWith('console.')) return true
    }
    if (ts.isTaggedTemplateExpression(at)) return true
  }
  return false
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
  // Each literal once: a template in an attribute that takes words is found by both.
  const said = new Set()
  const say = (node, text) => {
    if (said.has(node) || exempt(node)) return
    said.add(node)
    found.push({ line: tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1, text })
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
    if (ts.isTemplateExpression(node) && templateSaysWords(node) && !notForAPerson(node)) say(node, tidy(literalText(node)))
    ts.forEachChild(node, visit)
  }
  visit(tree)
  return found
}



const isMain = process.argv[1] && relative(process.argv[1], fileURLToPath(import.meta.url)) === ''
if (isMain) {
  let files = 0
  const written = []
  for (const folder of FOLDERS) {
    for (const file of filesUnder(folder)) {
      files += 1
      for (const word of wordsIn(file)) written.push(`${file.split(sep).join('/')}:${word.line}: "${word.text}"`)
    }
  }
  for (const each of written) {
    console.error(`${each}: a word written in the code, English whatever the language: from the catalogue (useMessages), or // i18n-exempt: <why>`)
  }
  if (written.length) process.exit(1)
  console.log(`check-strings: no word written in the ${files} files of what an application draws; every one from the catalogue`)
}
