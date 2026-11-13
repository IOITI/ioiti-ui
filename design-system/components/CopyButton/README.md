# CopyButton

Copies a value and says it did: a check for two seconds, its hint saying what came of it, and the words for a screen reader; the focus stays on it.

**You provide** `value` (the text copied), `label` ("Copy the tracking number"); `size`; `showLabel` to show the words beside the icon.

```tsx
<CopyButton value={order.trackingNumber} label="Copy the tracking number" />
```

- Put it right after what it copies. For a value that is itself the button, use `CopyChip`.
