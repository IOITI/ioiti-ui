import { EditorState } from '@codemirror/state'
import type { Extension } from '@codemirror/state'

import type { BoundMessages } from '../components/locale-context.js'

/** The code editors' words, bound to a locale: a provider's `useMessages().code`. */
export type CodeWords = BoundMessages['code']

/** The words of the catalogue's `code` that are strings (CodeMirror's phrases are). */
type PhraseWord = { [K in keyof CodeWords]: CodeWords[K] extends string ? K : never }[keyof CodeWords]

// CodeMirror's English phrases, which it looks its words up by, and the catalogue's word for each: its view, its
// commands, its search panel, its folds, its lint and its merge view (@codemirror/view, commands, search, language,
// lint, merge).
// i18n-exempt: CodeMirror's own English, the ids of its phrases; their words are the catalogue's.
const PHRASES = {
  'Control character': 'controlCharacter',
  'Selection deleted': 'selectionDeleted',
  Find: 'find',
  Replace: 'replace',
  next: 'findNext',
  previous: 'findPrevious',
  all: 'selectMatches',
  'match case': 'matchCase',
  regexp: 'regexp',
  'by word': 'byWord',
  replace: 'replaceMatch',
  'replace all': 'replaceAll',
  close: 'close',
  'current match': 'currentMatch',
  'on line': 'onLine',
  'replaced $ matches': 'replacedMatches',
  'replaced match on line $': 'replacedMatchOnLine',
  'Go to line': 'goToLine',
  go: 'go',
  'Folded lines': 'foldedLines',
  'Unfolded lines': 'unfoldedLines',
  to: 'foldedTo',
  'folded code': 'foldedCode',
  unfold: 'unfold',
  'Fold line': 'foldLine',
  'Unfold line': 'unfoldLine',
  Diagnostics: 'diagnostics',
  'No diagnostics': 'noDiagnostics',
  '$ unchanged lines': 'unchangedLines',
  Accept: 'accept',
  Reject: 'reject',
  'Revert this chunk': 'revertChunk',
} as const satisfies Record<string, PhraseWord>

/** CodeMirror's phrases in the words given: what its own panels, marks and announcements say. */
export function codeMirrorPhrases(words: CodeWords): Record<string, string> {
  return Object.fromEntries(Object.entries(PHRASES).map(([phrase, word]) => [phrase, words[word]]))
}

/** An editor's phrases (`EditorState.phrases`) in the words given, the provider's language's. */
export function phrasesExtension(words: CodeWords): Extension {
  return EditorState.phrases.of(codeMirrorPhrases(words))
}
