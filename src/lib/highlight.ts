// A few small tokenisers for the code a page shows (a payload, a configuration, a command): enough to colour
// it in the design's code colours (--code-*), not to parse it. Each scans the text once, trying its rules in
// order at each position; what no rule takes is plain text.

export type CodeTokenKind =
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'function'
  | 'namespace'
  | 'type'
  | 'builtin'
  | 'operator'
  | 'plain'

export interface CodeToken {
  kind: CodeTokenKind
  text: string
}

export type CodeLanguage = 'json' | 'js' | 'jsx' | 'ts' | 'tsx' | 'css' | 'shell' | 'text'

type Rule = [CodeTokenKind | 'word', RegExp]

const JS_KEYWORDS = new Set(
  (
    'as async await break case catch class const continue debugger declare default delete do else enum export extends false finally ' +
    'for from function get if implements import in infer instanceof interface keyof let namespace new null of private protected public ' +
    'readonly return satisfies set static super switch this throw true try type typeof undefined var void while with yield'
  ).split(' '),
)

const JS_NAMESPACES = new Set(['Math', 'JSON', 'Object', 'Array', 'Number', 'String', 'Promise', 'Intl', 'Date', 'Reflect', 'console', 'window', 'document', 'process'])

const JS_RULES: Rule[] = [
  ['comment', /\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y],
  ['string', /`(?:\\[\s\S]|[^`\\])*`?|'(?:\\.|[^'\\\n])*'?|"(?:\\.|[^"\\\n])*"?/y],
  ['number', /\b(?:0[xX][\da-fA-F_]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?n?)\b/y],
  ['word', /[A-Za-z_$][\w$]*/y],
  ['operator', /=>|\.\.\.|[=!<>]=?=?|&&|\|\||\?\?|[-+*/%&|^~?:;,.(){}[\]<>]/y],
]

const JSON_RULES: Rule[] = [
  ['string', /"(?:\\.|[^"\\\n])*"?/y],
  ['number', /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/y],
  ['keyword', /\b(?:true|false|null)\b/y],
  ['operator', /[{}[\]:,]/y],
]

const CSS_RULES: Rule[] = [
  ['comment', /\/\*[\s\S]*?(?:\*\/|$)/y],
  ['string', /'(?:\\.|[^'\\\n])*'?|"(?:\\.|[^"\\\n])*"?/y],
  ['keyword', /@[\w-]+/y],
  ['type', /--[\w-]+/y],
  ['number', /#[\da-fA-F]{3,8}\b|-?\d*\.?\d+(?:%|[a-z]+)?/y],
  ['word', /[A-Za-z_-][\w-]*/y],
  ['operator', /[{}():;,>+~*=[\]]/y],
]

const SHELL_RULES: Rule[] = [
  ['comment', /#[^\n]*/y],
  ['string', /'[^'\n]*'?|"(?:\\.|[^"\\\n])*"?/y],
  ['namespace', /\$\{?[\w@#?*!-]+\}?/y],
  ['keyword', /(?<=\s|^)--?[\w-]+(?:=\S*)?/y],
  ['word', /[\w./@:+-]+/y],
  ['operator', /&&|\|\||[|;&<>()]/y],
]

function scan(code: string, rules: Rule[]): { kind: CodeTokenKind | 'word'; text: string }[] {
  const out: { kind: CodeTokenKind | 'word'; text: string }[] = []
  let at = 0
  let plain = ''
  while (at < code.length) {
    let taken = false
    for (const [kind, pattern] of rules) {
      pattern.lastIndex = at
      const match = pattern.exec(code)
      if (match && match[0].length > 0) {
        if (plain) {
          out.push({ kind: 'plain', text: plain })
          plain = ''
        }
        out.push({ kind, text: match[0] })
        at += match[0].length
        taken = true
        break
      }
    }
    if (!taken) plain += code[at++]
  }
  if (plain) out.push({ kind: 'plain', text: plain })
  return out
}

/** The next token that is not blank, after `index`. */
function next(tokens: { text: string }[], index: number): string | undefined {
  for (let at = index + 1; at < tokens.length; at++) if (tokens[at].text.trim()) return tokens[at].text
  return undefined
}

function previous(tokens: { text: string }[], index: number): string | undefined {
  for (let at = index - 1; at >= 0; at--) if (tokens[at].text.trim()) return tokens[at].text
  return undefined
}

function javascript(code: string): CodeToken[] {
  const tokens = scan(code, JS_RULES)
  return tokens.map((token, index) => {
    if (token.kind !== 'word') return token as CodeToken
    const word = token.text
    const before = previous(tokens, index)
    const after = next(tokens, index)
    if (JS_KEYWORDS.has(word) && before !== '.') return { kind: 'keyword', text: word }
    if (before === '<' || before === '</') return { kind: /^[A-Z]/.test(word) ? 'type' : 'keyword', text: word }
    if (after === '(') return { kind: before === '.' ? 'builtin' : 'function', text: word }
    if (JS_NAMESPACES.has(word) && after === '.') return { kind: 'namespace', text: word }
    if (/^[A-Z]/.test(word)) return { kind: 'type', text: word }
    return { kind: 'plain', text: word }
  })
}

function css(code: string): CodeToken[] {
  const tokens = scan(code, CSS_RULES)
  return tokens.map((token, index) => {
    if (token.kind !== 'word') return token as CodeToken
    const after = next(tokens, index)
    if (after === '(') return { kind: 'function', text: token.text }
    // A property: a word before its colon, inside a block.
    if (after === ':') return { kind: 'namespace', text: token.text }
    return { kind: 'plain', text: token.text }
  })
}

function shell(code: string): CodeToken[] {
  const tokens = scan(code, SHELL_RULES)
  let command = true
  return tokens.map((token) => {
    if (token.kind === 'operator' || /\n/.test(token.text)) {
      command = true
      return token.kind === 'word' ? { kind: 'plain', text: token.text } : (token as CodeToken)
    }
    if (token.kind !== 'word') return token as CodeToken
    if (command) {
      command = false
      return { kind: 'function', text: token.text }
    }
    return { kind: 'plain', text: token.text }
  })
}

/** The code's tokens, coloured as its language reads them; `text` is all plain. */
export function highlightCode(code: string, language: CodeLanguage): CodeToken[] {
  switch (language) {
    case 'json':
      return scan(code, JSON_RULES).map((token, index, tokens) =>
        // A key: a string before its colon.
        token.kind === 'string' && next(tokens, index) === ':' ? { kind: 'namespace', text: token.text } : (token as CodeToken),
      )
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return javascript(code)
    case 'css':
      return css(code)
    case 'shell':
      return shell(code)
    default:
      return [{ kind: 'plain', text: code }]
  }
}

/** The tokens cut at each line's end: a token across lines (a comment, a template) is in each of them. */
export function splitLines(tokens: CodeToken[]): CodeToken[][] {
  const lines: CodeToken[][] = [[]]
  for (const token of tokens) {
    const parts = token.text.split('\n')
    parts.forEach((part, index) => {
      if (index > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ kind: token.kind, text: part })
    })
  }
  return lines
}
