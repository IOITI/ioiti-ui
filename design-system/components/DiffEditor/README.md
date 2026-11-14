# DiffEditor

Two versions of a text and what changed between them, from `ioiti-ui/code`: side by side or in one column, unchanged stretches folded, the second version editable.

**You provide** `original` (never changed here), `modified`, `onChange`, `label` (what is compared, in its header and for a screen reader); `language` (as `CodeEditor`'s); `layout` (`split` · `unified`); `originalLabel` and `modifiedLabel` (`Original` and `Modified` by default); `collapseUnchanged` (on, three lines kept around each change, or `{ margin, minSize }`, or `false`); `readOnly`, `wrap`, `maxHeight`; `diagnostics` and `onSave` for the changed version; `actions` at the end of its header.

```tsx
import { DiffEditor } from 'ioiti-ui/code'

<DiffEditor label="Rule file" language="toml" original={saved} modified={toml} onChange={setToml}
  originalLabel="Saved" modifiedLabel="Yours" onSave={save} diagnostics={problems} />
```

- What was removed is in the loss's tone, what was added in the gain's, each change also underlined: never the colour alone. The header counts the changes; its arrows go from one to the next.
- `split` aligns the unchanged lines of both; `unified` puts what was removed above what replaced it, for a narrow column or a review.
- Drawn as `CodeEditor` is: `surface`, a `border`, `radius-xl`. A diff to read only, with no editor loaded, is a `CodeBlock` in `diff`.
