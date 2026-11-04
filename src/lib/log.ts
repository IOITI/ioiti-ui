// What LogViewer reads in a log: its lines, how serious each is, where a search finds them, and how the
// lines are laid out in blocks (only the blocks in sight are drawn).

export type LogLevel = 'error' | 'warning' | 'info'

const ERROR = /\b(?:ERROR|ERR|FATAL|CRITICAL|PANIC|EXCEPTION)\b|Traceback \(most recent call last\)|^\s*(?:error|fatal)(?=[[:\s])/
const WARNING = /\b(?:WARN|WARNING)\b|^\s*warn(?:ing)?(?=[[:\s])/
const INFO = /\b(?:INFO|NOTICE)\b/

/** How serious a line says it is, from the words logs use (ERROR, WARN, INFO, a traceback), or nothing. */
export function logLevel(line: string): LogLevel | null {
  if (ERROR.test(line)) return 'error'
  if (WARNING.test(line)) return 'warning'
  if (INFO.test(line)) return 'info'
  return null
}

/** A text's lines; a last line break ends the last line rather than starting an empty one. */
export function splitLog(text: string): string[] {
  if (!text) return []
  const lines = text.split(/\r?\n/)
  if (lines[lines.length - 1] === '') lines.pop()
  return lines
}

/** The lines a search finds, by their index: the text sought anywhere in them, whatever its case. */
export function findInLog(lines: readonly string[], query: string): number[] {
  const sought = query.trim().toLowerCase()
  if (!sought) return []
  const found: number[] = []
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes(sought)) found.push(index)
  })
  return found
}

/** A line cut where the search finds it: the parts, each said to match or not. */
export function matchParts(line: string, query: string): { text: string; match: boolean }[] {
  const sought = query.trim().toLowerCase()
  if (!sought) return [{ text: line, match: false }]
  const parts: { text: string; match: boolean }[] = []
  const lower = line.toLowerCase()
  let at = 0
  for (let found = lower.indexOf(sought); found !== -1; found = lower.indexOf(sought, at)) {
    if (found > at) parts.push({ text: line.slice(at, found), match: false })
    parts.push({ text: line.slice(found, found + sought.length), match: true })
    at = found + sought.length
  }
  if (at < line.length) parts.push({ text: line.slice(at), match: false })
  return parts
}

/** Lines per block: a block in sight is drawn whole, the others are space of their height. */
export const LOG_BLOCK = 100

/**
 * The blocks to draw, and the space before and after them: the blocks seen between `top` and `top + view`
 * (plus one on each side), each `height(block)` high.
 */
export function blocksInSight(
  blocks: number,
  height: (block: number) => number,
  top: number,
  view: number,
): { first: number; last: number; before: number; after: number } {
  if (blocks === 0) return { first: 0, last: -1, before: 0, after: 0 }
  let offset = 0
  let first = -1
  let last = blocks - 1
  let before = 0
  for (let block = 0; block < blocks; block++) {
    const size = height(block)
    if (first === -1 && offset + size > top) {
      first = Math.max(0, block - 1)
      before = first === block ? offset : offset - height(block - 1)
    }
    if (first !== -1 && offset > top + view) {
      last = Math.min(blocks - 1, block)
      break
    }
    offset += size
  }
  if (first === -1) {
    // Scrolled past the end (the log was cut): the last blocks.
    first = Math.max(0, blocks - 2)
    before = 0
    for (let block = 0; block < first; block++) before += height(block)
  }
  let after = 0
  for (let block = last + 1; block < blocks; block++) after += height(block)
  return { first, last, before, after }
}
