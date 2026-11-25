/**
 * The Markdown of the gallery's documents, as few things as they use: the guidelines
 * (`design-system/components/<Name>/README.md`), the conventions (docs/conventions.md) and the CHANGELOG. Headings at
 * their level, paragraphs, lists (one inside another), blocks of code, tables; in a line, `code`, **strong** and
 * *emphasised* words, and links: `[words](address)`, or `[words]` where a line of the document gives the address
 * (`[0.30.0]: https://…`, at the CHANGELOG's foot).
 */

/** A column's alignment, as a table's second line writes it (`:--`, `:-:`, `--:`); `null` where it says none. */
export type Align = 'left' | 'center' | 'right' | null

/** An item of a list, and the list indented under it. */
export interface ListItem {
  text: string
  items?: ListItem[]
}

export type Block =
  | { type: 'title'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: ListItem[] }
  | { type: 'code'; language: string; code: string }
  | { type: 'table'; head: string[]; align: Align[]; rows: string[][] }

/** A part of a line; `text` is its words alone (`plain`), what holds others has them as `parts`. */
export type Inline =
  | { type: 'text' | 'code'; text: string }
  | { type: 'strong' | 'emphasis'; text: string; parts: Inline[] }
  | { type: 'link'; text: string; href: string; parts: Inline[] }

/** The words of a line's parts. */
const plainOf = (parts: Inline[]) => parts.map((part) => part.text).join('')

const FENCE = /^```/
const HEADING = /^(#{1,6}) (.*)$/
const ITEM = /^(\s*)[-*] (.*)$/
const DEFINITION = /^ {0,3}\[([^\]]+)\]:\s*<?([^\s>]+)>?(?:\s+.*)?$/
const DELIMITER = /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/
const REFERENCE = /\[([^\]]+)\](?:\[([^\]]*)\])?(?!\()/g

/** A link's label as Markdown matches it: case and spaces aside. */
const labelOf = (text: string) => text.trim().replace(/\s+/g, ' ').toLowerCase()

/**
 * The links a document defines on lines of their own (`[0.30.0]: https://…`), by their label, and its lines without
 * them: they draw nothing. One starts no line of a paragraph, and is none in a block of code.
 */
function definitions(lines: string[]): { lines: string[]; links: Map<string, string> } {
  const links = new Map<string, string>()
  const kept: string[] = []
  let fenced = false
  let running = false
  for (const line of lines) {
    if (FENCE.test(line)) fenced = !fenced
    const definition = fenced || running ? null : DEFINITION.exec(line)
    if (definition) {
      // The first of a label is its address.
      if (!links.has(labelOf(definition[1]))) links.set(labelOf(definition[1]), definition[2])
      continue
    }
    kept.push(line)
    running = !fenced && line.trim() !== '' && !HEADING.test(line)
  }
  return { lines: kept, links }
}

/** A line's `[words]` and `[words][label]` made links where the document defines their label; its code kept as it is. */
function resolve(text: string, links: Map<string, string>): string {
  if (!links.size || !text.includes('[')) return text
  return text
    .split(/(`[^`]*`)/)
    .map((part, index) =>
      index % 2
        ? part
        : part.replace(REFERENCE, (whole, words: string, label?: string) => {
            const href = links.get(labelOf(label || words))
            return href ? `[${words}](${href})` : whole
          }),
    )
    .join('')
}

/** A table's line in its cells: the pipes at its ends dropped, `\|` a pipe in a cell. */
function cellsOf(line: string): string[] {
  let row = line.trim()
  if (row.startsWith('|')) row = row.slice(1)
  if (row.endsWith('|') && !row.endsWith('\\|')) row = row.slice(0, -1)
  return row.split(/(?<!\\)\|/).map((cell) => cell.trim().replace(/\\\|/g, '|'))
}

/** Whether a table starts at this line: a line of cells (`| a | b |`), then the line of its columns (`| - | -: |`). */
function startsTable(lines: string[], index: number): boolean {
  const next = lines[index + 1]
  return /^\s*\|/.test(lines[index]) && next !== undefined && DELIMITER.test(next) && cellsOf(next).length === cellsOf(lines[index]).length
}

function alignOf(cell: string): Align {
  const left = cell.startsWith(':')
  const right = cell.endsWith(':')
  return left && right ? 'center' : right ? 'right' : left ? 'left' : null
}

/** Its items, each with the list indented under it: by how far a `-` is indented. */
function listOf(lines: string[]): ListItem[] {
  const top: ListItem[] = []
  const levels: { indent: number; items: ListItem[] }[] = []
  let last: ListItem | undefined
  for (const line of lines) {
    const item = ITEM.exec(line)
    if (!item) {
      // A line indented under an item goes on with it.
      if (last) last.text += ` ${line.trim()}`
      continue
    }
    const indent = item[1].length
    while (levels.length > 1 && indent < levels[levels.length - 1].indent) levels.pop()
    if (!levels.length) levels.push({ indent, items: top })
    // Further in than its level's items: a list under the last of them.
    const parent = levels[levels.length - 1].items.at(-1)
    if (indent > levels[levels.length - 1].indent && parent) {
      parent.items ??= []
      levels.push({ indent, items: parent.items })
    }
    last = { text: item[2].trim() }
    levels[levels.length - 1].items.push(last)
  }
  return top
}

export function blocks(markdown: string): Block[] {
  const { lines, links } = definitions(markdown.replace(/\r\n/g, '\n').split('\n'))
  const words = (text: string) => resolve(text, links)
  const resolved = (items: ListItem[]): ListItem[] =>
    items.map((item) => (item.items ? { text: words(item.text), items: resolved(item.items) } : { text: words(item.text) }))
  const found: Block[] = []
  let index = 0
  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) {
      index += 1
    } else if (FENCE.test(line)) {
      const language = line.slice(3).trim() || 'text'
      const code: string[] = []
      index += 1
      while (index < lines.length && !FENCE.test(lines[index])) code.push(lines[index++])
      index += 1
      found.push({ type: 'code', language, code: code.join('\n') })
    } else if (HEADING.test(line)) {
      const [, hashes, text] = HEADING.exec(line)!
      found.push({ type: 'title', level: hashes.length, text: words(text.trim()) })
      index += 1
    } else if (startsTable(lines, index)) {
      const head = cellsOf(line)
      const align = cellsOf(lines[index + 1]).map(alignOf)
      const rows: string[][] = []
      index += 2
      while (index < lines.length && /^\s*\|/.test(lines[index])) {
        const cells = cellsOf(lines[index++])
        rows.push(head.map((_, column) => words(cells[column] ?? '')))
      }
      found.push({ type: 'table', head: head.map(words), align, rows })
    } else if (/^[-*] /.test(line)) {
      const items: string[] = []
      while (index < lines.length && (/^[-*] /.test(lines[index]) || /^\s+\S/.test(lines[index]))) items.push(lines[index++])
      found.push({ type: 'list', items: resolved(listOf(items)) })
    } else {
      const text: string[] = []
      while (index < lines.length && lines[index].trim() && !/^([-*] |```|#{1,6} )/.test(lines[index]) && !startsTable(lines, index)) {
        text.push(lines[index++].trim())
      }
      found.push({ type: 'paragraph', text: words(text.join(' ')) })
    }
  }
  return found
}

/** Where the code span that starts here ends (after its closing backtick), or -1. */
function codeEnd(text: string, at: number): number {
  if (text[at] !== '`') return -1
  const close = text.indexOf('`', at + 1)
  return close > at + 1 ? close + 1 : -1
}

/** The next `**` from here, past code spans; -1 if none. */
function strongClose(text: string, from: number): number {
  for (let at = from; at < text.length; at += 1) {
    const code = codeEnd(text, at)
    if (code !== -1) at = code - 1
    else if (text.startsWith('**', at)) return at
  }
  return -1
}

/** A `*` alone (no other beside it). */
const single = (text: string, at: number) => text[at] === '*' && text[at - 1] !== '*' && text[at + 1] !== '*'

/** The `*` that closes an emphasis opened before `from`, past code spans: one after a letter, not a space; -1 if none. */
function emphasisClose(text: string, from: number): number {
  for (let at = from; at < text.length; at += 1) {
    const code = codeEnd(text, at)
    if (code !== -1) at = code - 1
    else if (single(text, at) && !/\s/.test(text[at - 1])) return at
  }
  return -1
}

/** The `]` that closes the `[` here, past code spans and pairs of brackets; -1 if none. */
function bracketClose(text: string, at: number): number {
  let depth = 0
  for (let index = at; index < text.length; index += 1) {
    const code = codeEnd(text, index)
    if (code !== -1) index = code - 1
    else if (text[index] === '[') depth += 1
    else if (text[index] === ']' && --depth === 0) return index
  }
  return -1
}

const DESTINATION = /^\(\s*<?([^\s<>()]+)>?(?:\s+"[^"]*")?\s*\)/

/** The part of a line that starts here, and where it ends: code, strong or emphasised words, a link. */
function partAt(text: string, at: number): { part: Inline; end: number } | undefined {
  const char = text[at]
  if (char === '`') {
    const end = codeEnd(text, at)
    return end === -1 ? undefined : { part: { type: 'code', text: text.slice(at + 1, end - 1) }, end }
  }
  if (text.startsWith('**', at)) {
    const close = strongClose(text, at + 2)
    if (close <= at + 2) return undefined
    const parts = inline(text.slice(at + 2, close))
    return { part: { type: 'strong', text: plainOf(parts), parts }, end: close + 2 }
  }
  if (single(text, at) && text[at + 1] && !/\s/.test(text[at + 1])) {
    const close = emphasisClose(text, at + 2)
    if (close === -1) return undefined
    const parts = inline(text.slice(at + 1, close))
    return { part: { type: 'emphasis', text: plainOf(parts), parts }, end: close + 1 }
  }
  if (char === '[') {
    const close = bracketClose(text, at)
    const destination = close > at + 1 ? DESTINATION.exec(text.slice(close + 1)) : null
    if (!destination) return undefined
    const parts = inline(text.slice(at + 1, close))
    return { part: { type: 'link', text: plainOf(parts), href: destination[1], parts }, end: close + 1 + destination[0].length }
  }
  return undefined
}

export function inline(text: string): Inline[] {
  const parts: Inline[] = []
  let words = ''
  let at = 0
  while (at < text.length) {
    const found = partAt(text, at)
    if (!found) {
      words += text[at]
      at += 1
      continue
    }
    if (words) parts.push({ type: 'text', text: words })
    words = ''
    parts.push(found.part)
    at = found.end
  }
  if (words) parts.push({ type: 'text', text: words })
  return parts
}

/** A line of Markdown as plain words (⌘K's descriptions). */
export function plain(text: string): string {
  return plainOf(inline(text))
}

/** Whether a link leaves the gallery: an address of another site (`https:`, `mailto:`), not a part of a page or a page. */
export function leaves(href: string): boolean {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)
}

/** Its summary: the first paragraph under its title. */
export function summaryOf(markdown: string): string {
  return blocks(markdown).find((block) => block.type === 'paragraph')?.text ?? ''
}

/**
 * What the gallery shows of the guidelines: all but the title, the summary (the page's description) and "You provide"
 * (its props tables). Its headings from `##` on stay, each saying whose the lines under it are (`## FanChart`).
 */
export function guidelinesOf(markdown: string): Block[] {
  const all = blocks(markdown).filter((block) => !(block.type === 'title' && block.level === 1))
  const summary = all.findIndex((block) => block.type === 'paragraph')
  return all.filter((block, index) => index !== summary && !(block.type === 'paragraph' && /^\*\*You provide\*\*/.test(block.text)))
}
