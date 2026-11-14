/**
 * The Markdown of the guidelines (`design-system/components/<Name>/README.md`), as few things as they use: a title,
 * paragraphs, a list, a block of code; in a line, `code` and **strong** words.
 */

export type Block =
  | { type: 'title'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; language: string; code: string }

export type Inline = { type: 'text' | 'code' | 'strong'; text: string }

export function blocks(markdown: string): Block[] {
  const found: Block[] = []
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  let index = 0
  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) {
      index += 1
    } else if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text'
      const code: string[] = []
      index += 1
      while (index < lines.length && !lines[index].startsWith('```')) code.push(lines[index++])
      index += 1
      found.push({ type: 'code', language, code: code.join('\n') })
    } else if (/^#{1,6} /.test(line)) {
      found.push({ type: 'title', text: line.replace(/^#+ /, '').trim() })
      index += 1
    } else if (/^[-*] /.test(line)) {
      const items: string[] = []
      while (index < lines.length && (/^[-*] /.test(lines[index]) || (/^\s+\S/.test(lines[index]) && items.length))) {
        if (/^[-*] /.test(lines[index])) items.push(lines[index].slice(2).trim())
        else items[items.length - 1] += ` ${lines[index].trim()}`
        index += 1
      }
      found.push({ type: 'list', items })
    } else {
      const text: string[] = []
      while (index < lines.length && lines[index].trim() && !/^([-*] |```|#{1,6} )/.test(lines[index])) text.push(lines[index++].trim())
      found.push({ type: 'paragraph', text: text.join(' ') })
    }
  }
  return found
}

export function inline(text: string): Inline[] {
  const parts: Inline[] = []
  const pattern = /`([^`]+)`|\*\*([^*]+)\*\*/g
  let last = 0
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) parts.push({ type: 'text', text: text.slice(last, match.index) })
    parts.push(match[1] !== undefined ? { type: 'code', text: match[1] } : { type: 'strong', text: match[2] })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ type: 'text', text: text.slice(last) })
  return parts
}

/** A line of Markdown as plain words (⌘K's descriptions). */
export function plain(text: string): string {
  return inline(text)
    .map((part) => part.text)
    .join('')
}

/** Its summary: the first paragraph under its title. */
export function summaryOf(markdown: string): string {
  return blocks(markdown).find((block) => block.type === 'paragraph')?.text ?? ''
}

/** What the gallery shows of the guidelines: all but the title, the summary (the page's description) and "You provide" (its props tables). */
export function guidelinesOf(markdown: string): Block[] {
  const all = blocks(markdown).filter((block) => block.type !== 'title')
  const summary = all.findIndex((block) => block.type === 'paragraph')
  return all.filter((block, index) => index !== summary && !(block.type === 'paragraph' && /^\*\*You provide\*\*/.test(block.text)))
}
