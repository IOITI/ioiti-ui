# CodeEditor

Code to edit (a configuration, a rule, a document), from `ioiti-ui/code`: in the `code-*` colours, ⌘S saving, ⌘F searching, a server's parse errors marked where they are.

**You provide** `value`, `onChange`, `label` (what the code is, for a screen reader); `language` (`toml` · `yaml` · `json` · `markdown` · `python` · `text`); `diagnostics` (`[{ line, column?, message, severity? }]`, `severity` `error` · `warning`); `onSave`; `readOnly`, `wrap`, `lineNumbers` (on by default), `placeholder`, `minHeight`, `maxHeight`, `autoFocus`.

```tsx
import { CodeEditor } from 'ioiti-ui/code'

<CodeEditor label="Rule file" language="toml" value={toml} onChange={setToml} onSave={save} diagnostics={problems} maxHeight={320} />
```

- An entry of its own, on CodeMirror 6: an application that never edits code never bundles it. Load it lazily to keep it out of the first page; each language is a chunk of its own, loaded when first shown.
- Its frame is `surface` with a `border`, `radius-xl`; with the focus, its border darkens (the accent's `brand` with one), as a field's: no ring. Tab moves the focus on, as in any field.
- A problem is underlined where it is, marked in the gutter, its message on hover. Code to read only is a `CodeBlock`; two versions compared, a `DiffEditor`.

## Accessibility

Its text is a stop of the keyboard named by its `label`, said read-only with `readOnly`; what CodeMirror says (its search, a problem's message) is in the provider's language. Tab never stays in it.

| Key | What it does |
|---|---|
| Tab, Shift+Tab | The next control, or the one before: never an indent |
| ⌘] (Ctrl+]), ⌘[ (Ctrl+[) | Indents the line, or takes its indent back |
| ⌘S (Ctrl+S) | Saves (`onSave`) |
| ⌘F (Ctrl+F) | Opens its search, where Enter goes to the next match and Shift+Enter to the one before |
| Escape | Closes its search |
| ⌘Z (Ctrl+Z) | Undoes |
| ⌘⇧Z (Ctrl+Y) | Redoes |
