import type { Diagnostic } from '@codemirror/lint'
import type { Text } from '@codemirror/state'

/**
 * A problem the server found in the code (a parse error): on a line, from 1, and at a column of it, from 1.
 * Without a column the whole line is marked; with one, from it to the line's end.
 */
export interface CodeDiagnostic {
  line: number
  column?: number
  message: string
  severity?: 'error' | 'warning'
}

/** The problems placed in the document: a line past its end is its last line. */
export function placeDiagnostics(doc: Text, diagnostics: readonly CodeDiagnostic[]): Diagnostic[] {
  return diagnostics.map(({ line, column, message, severity = 'error' }) => {
    const at = doc.line(Math.min(Math.max(1, Math.trunc(line) || 1), doc.lines))
    const from = column === undefined ? at.from : Math.min(at.from + Math.max(0, Math.trunc(column) - 1), at.to)
    // An empty range (a column at the line's end, an empty line) is still drawn: one character, or a point.
    const to = from < at.to ? at.to : Math.min(from + 1, doc.length)
    return { from, to: Math.max(from, to), message, severity }
  })
}
