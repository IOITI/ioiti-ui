# Hint

What a control means, or why it is disabled: shown on hover, on keyboard focus and on a tap (the pointer can rest on it, Escape hides it), and read by screen readers as the control's description.

**You provide** `content` (the words) and the control as `children`; `wrap` around a disabled control, or one that is not a button, so the hint still has something to hang on.

```tsx
<Hint content="Choose two to four runs to compare them" wrap>
  <Button size="sm" disabled>Compare</Button>
</Hint>
```

- Never a `title` attribute: it shows on no phone, no keyboard and no disabled control.
- One short sentence; what the control does is its own label, the hint says what more there is to know.

## Accessibility

Its words are its control's description, read with the control whether the hint shows or not. With `wrap`, the wrapper is a stop of the keyboard, for a control that takes no focus (a disabled one): its hint is still reached.

| Key | What it does |
|---|---|
| Tab | Onto the control, or its wrapper: shows the hint. Away: hides it |
| Escape | Hides it, the focus staying where it is |
