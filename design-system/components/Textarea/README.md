# Textarea

A field that takes several lines of text: a note, a message, a driver's instructions.

**You provide** what a `<textarea>` takes (`rows`, `value` / `defaultValue`, `onChange`, `placeholder`, `disabled`, `readOnly`, `maxLength`); `error` for its border in the negative colour.

```tsx
<Field label="Note">
  <Textarea rows={3} placeholder="What the warehouse should know" />
</Field>
```

- 90px high at least, or as tall as its `rows`; the reader may stretch it downwards.
- Its text, its border and its focus are the `Input`'s, under its label in a `Field`, which says what is wrong.
- A limit of length is said under it (what is left, or by how much it is over) rather than cutting what is typed.
