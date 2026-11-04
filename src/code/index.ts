// ioiti-ui's code editors (CodeMirror 6): an entry of its own, so that an application that never edits code
// never bundles CodeMirror. Its packages are optional peers of ioiti-ui, installed by the application that
// imports this entry (README.md, "Code editors").
export { CodeEditor } from './CodeEditor.js'
export type { CodeEditorProps } from './CodeEditor.js'
export { DiffEditor } from './DiffEditor.js'
export type { DiffEditorProps } from './DiffEditor.js'
export type { CodeDiagnostic } from './diagnostics.js'
export type { CodeEditorLanguage } from './languages.js'
