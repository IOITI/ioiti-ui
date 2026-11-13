# CopyChip

A value to read and copy, in a chip with its copy button: a reference, an identifier, an address. A long one is cut in its middle (its ends tell it apart) or at its end; the whole of it is in a hint and for a screen reader.

**You provide** `value` (what is shown and copied), `label` (what it is: "the request ID" makes "Copy the request ID"); `truncate` (`middle` · `end` · `false`) with `keep` (`{ start, end }`, 8 and 6 by default) for the middle; a width in `className` for `end`.

```tsx
<CopyChip value={request.id} label="the request ID" truncate="middle" />
```

- Set in `mono`, `text-xs`, on `surface` with a `border`, `radius-md`. The button says it copied for two seconds.
- For a copy button beside a value set in the text, use `CopyButton`.
