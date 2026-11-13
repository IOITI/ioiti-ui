# CodeBlock

Code to read and copy (a payload, a configuration, a command, a diff), coloured in the `code-*` tokens; `Code` for a reference inside a sentence.

**You provide** `code`, `language` (`json` · `ts` · `js` · `css` · `shell` · `toml` · `yaml` · `python` · `diff`…); `label` (a file name, what it is); `lineNumbers`, `highlightLines`, `wrap`; `copyable` (on by default).

```tsx
<CodeBlock label="Order IT-1042, as the server sent it" language="json" lineNumbers code={json} />
```

- Set in `code-block`, on `surface-raised`. Code to edit is `CodeEditor` (`ioiti-ui/code`, not in this bundle); a process's output is a `LogViewer`.
