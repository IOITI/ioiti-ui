# InlineEdit

A value edited where it is shown, a name or a title: it reads as text, a click or Enter turns it into a field, Enter saves and Escape gives up.

**You provide** `value`, `onSave` (may return a Promise: nothing or `true` for done, `false` to stay in the field, words for what went wrong), `label` (what the value is, for a screen reader; a `Field` or a `FormItem` around it says it without); `variant` (`text` by default · `title`), `as` (`h1` · `h2` · `h3` · `h4` · `p` · `span`), `validate` (words for what is wrong, before saving), `placeholder`, `readOnly`. In a form: `name`, the value saved (not one being typed). `id`, `ref` (its button, then its field), `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, as a native control takes them.

```tsx
<InlineEdit label="Name of the project" variant="title" value={name}
  validate={(value) => (value.trim() ? undefined : 'A project needs a name.')}
  onSave={rename} />
```

- A save that takes its time shows a spinner; one refused shows why under the field, in `negative`, and keeps the field.
- `title` is `text-lg` semibold (an `h2` unless `as` says otherwise), `text` is `text-sm`. A pencil shows under the pointer and with the focus.
- For a form of several fields saved together, use fields and a `SaveBar`, not a row of inline edits.

## Accessibility

Read, it is a button named by its value and what a press does ("Acme, edit the name of the project"); edited, a field named by its label, with Save and Cancel after it. What is refused is said at once, and read with the field after.

| Key | What it does |
|---|---|
| Enter, Space | On the value: turns it into a field, its text selected |
| Enter | In the field: saves; once saved, the focus back on the value |
| Escape | In the field: gives up, the focus back on the value |
| Tab | From the field to Save, then Cancel |
