import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { tags } from '@lezer/highlight'

/*
 * The editors in the design's colours: every colour a token of theme.css (the code colours CodeBlock
 * uses, held at 4.5:1 on --surface and --surface-hover in every look), so that a theme, an accent or a
 * material changes them as it changes the rest of the page. CodeMirror's own defaults draw a few
 * marks with SVG `data:` images (the lint squiggles and markers): set here without them, img-src
 * staying at self.
 */

const mix = (token: string, percent: number) => `color-mix(in oklab, var(${token}) ${percent}%, transparent)`
/** A mark under changed text: a line two pixels high, as the merge view draws it. */
const underline = (token: string) => `linear-gradient(${mix(token, 55)}, ${mix(token, 55)}) bottom / 100% 2px no-repeat`

const theme = EditorView.theme({
  '&': {
    color: 'var(--text-primary)',
    backgroundColor: 'var(--surface)',
    fontSize: '12.5px',
  },
  // The frame shows the focus (its border), as a field that takes text: no outline of the editor's own.
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': { fontFamily: 'var(--font-mono, ui-monospace, monospace)', lineHeight: '1.625' },
  '.cm-content': { caretColor: 'var(--text-primary)', padding: '10px 0' },
  '.cm-line': { padding: '0 12px' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--text-primary)' },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
    { backgroundColor: 'var(--code-selection)' },
  '.cm-activeLine': { backgroundColor: 'var(--surface-hover)' },
  '.cm-gutters': {
    backgroundColor: 'var(--surface)',
    color: 'var(--text-muted)',
    borderRight: '1px solid var(--border)',
  },
  '.cm-activeLineGutter': { backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)' },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 8px 0 12px', minWidth: '2.5em' },
  '.cm-placeholder': { color: 'var(--text-muted)' },
  '.cm-matchingBracket, &.cm-focused .cm-matchingBracket': {
    backgroundColor: 'var(--surface-hover)',
    outline: '1px solid var(--border)',
  },
  '.cm-selectionMatch': { backgroundColor: mix('--info', 14) },
  '.cm-searchMatch': { backgroundColor: mix('--warning', 22), outline: `1px solid ${mix('--warning', 60)}` },
  '.cm-searchMatch.cm-searchMatch-selected': { backgroundColor: mix('--warning', 40) },
  '.cm-panels': { backgroundColor: 'var(--surface)', color: 'var(--text-primary)' },
  '.cm-panels.cm-panels-top': { borderBottom: '1px solid var(--border)' },
  '.cm-panels.cm-panels-bottom': { borderTop: '1px solid var(--border)' },
  '.cm-panel input, .cm-panel button': { font: 'inherit', fontSize: '12px' },
  '.cm-textfield': {
    backgroundColor: 'var(--surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
  },
  '.cm-button': {
    backgroundImage: 'none',
    backgroundColor: 'var(--surface-hover)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
  },
  '.cm-tooltip': {
    backgroundColor: 'var(--surface-raised)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
  },
  '.cm-tooltip.cm-tooltip-lint': { padding: '2px 0' },
  '.cm-diagnostic': { padding: '4px 10px', borderLeftWidth: '3px' },
  '.cm-diagnostic-error': { borderLeftColor: 'var(--negative)' },
  '.cm-diagnostic-warning': { borderLeftColor: 'var(--warning)' },
  '.cm-diagnostic-info': { borderLeftColor: 'var(--info)' },
  '.cm-lintRange': { backgroundImage: 'none', textDecorationLine: 'underline', textDecorationStyle: 'wavy', textDecorationSkipInk: 'none', textUnderlineOffset: '3px' },
  '.cm-lintRange-error': { textDecorationColor: 'var(--negative)' },
  '.cm-lintRange-warning': { textDecorationColor: 'var(--warning)' },
  '.cm-lintRange-info': { textDecorationColor: 'var(--info)' },
  '.cm-lint-marker': { content: 'none', width: '0.6em', height: '0.6em', margin: '0.45em 0 0 0.2em', borderRadius: '9999px' },
  '.cm-lint-marker-error': { content: 'none', backgroundColor: 'var(--negative)' },
  '.cm-lint-marker-warning': { content: 'none', backgroundColor: 'var(--warning)' },
  '.cm-lint-marker-info': { content: 'none', backgroundColor: 'var(--info)' },
  '.cm-foldPlaceholder': { backgroundColor: 'var(--surface-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' },

  // The merge view (DiffEditor): what was removed in the loss's tone, what was added in the gain's.
  // The selectors repeat a class where CodeMirror's own (`&light`, `&dark`) weigh two.
  '&.cm-merge-a .cm-changedLine, .cm-deletedChunk': { backgroundColor: mix('--negative', 9) },
  '&.cm-merge-b .cm-changedLine, .cm-inlineChangedLine': { backgroundColor: mix('--positive', 9) },
  '&.cm-merge-a.cm-merge-a .cm-changedText, &.cm-editor.cm-editor .cm-deletedChunk .cm-deletedText': { background: underline('--negative') },
  '&.cm-merge-b.cm-merge-b .cm-changedText': { background: underline('--positive') },
  '&.cm-merge-b .cm-deletedText': { background: mix('--negative', 20) },
  '&.cm-editor.cm-editor .cm-collapsedLines': {
    color: 'var(--text-secondary)',
    background: 'var(--surface-hover)',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
    fontSize: '12px',
  },
  '&.cm-merge-a.cm-merge-a .cm-changedLineGutter, &.cm-editor.cm-editor .cm-deletedLineGutter': { background: 'var(--negative)' },
  '&.cm-merge-b.cm-merge-b .cm-changedLineGutter': { background: 'var(--positive)' },
  '&.cm-editor.cm-editor .cm-inlineChangedLineGutter': { background: 'var(--info)' },
})

const highlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.moduleKeyword, tags.operatorKeyword, tags.definitionKeyword], color: 'var(--code-keyword)' },
  { tag: [tags.string, tags.special(tags.string), tags.regexp, tags.character, tags.monospace], color: 'var(--code-string)' },
  { tag: [tags.number, tags.bool, tags.null, tags.atom, tags.unit], color: 'var(--code-number)' },
  { tag: [tags.comment, tags.lineComment, tags.blockComment, tags.docComment, tags.meta], color: 'var(--code-comment)' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName), tags.link, tags.url], color: 'var(--code-function)' },
  { tag: [tags.link, tags.url], textDecoration: 'underline' },
  { tag: [tags.propertyName, tags.attributeName, tags.definition(tags.propertyName)], color: 'var(--code-namespace)' },
  { tag: [tags.typeName, tags.className, tags.tagName, tags.namespace], color: 'var(--code-type)' },
  { tag: [tags.labelName, tags.special(tags.variableName), tags.self], color: 'var(--code-builtin)' },
  { tag: [tags.operator, tags.punctuation, tags.separator, tags.bracket, tags.squareBracket, tags.brace], color: 'var(--code-operator)' },
  { tag: tags.heading, color: 'var(--code-keyword)', fontWeight: '600' },
  { tag: tags.strong, fontWeight: '600' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: tags.quote, color: 'var(--text-secondary)' },
  { tag: tags.inserted, color: 'var(--positive)' },
  { tag: tags.deleted, color: 'var(--negative)' },
  { tag: tags.invalid, color: 'var(--negative)' },
])

/** The design's look of an editor: its colours, its type, its marks. */
export const editorTheme: Extension = [theme, syntaxHighlighting(highlight)]

/** An editor's height: at least `min`, at most `max` (it scrolls past). */
export function editorHeight(min?: number | string, max?: number | string): Extension {
  const size = (value: number | string | undefined) => (typeof value === 'number' ? `${value}px` : value)
  return EditorView.theme({
    '&': { maxHeight: size(max) ?? 'none' },
    '.cm-scroller': { overflow: 'auto' },
    '.cm-content, .cm-gutter': { minHeight: size(min) ?? '0' },
  })
}
