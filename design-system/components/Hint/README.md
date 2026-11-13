# Hint

What a control means, or why it is disabled: shown on hover, on keyboard focus and on a tap, and read by screen readers as the control's description.

**You provide** `content` (the words) and the control as `children`; `wrap` around a disabled control, or one that is not a button, so the hint still has something to hang on.

```tsx
<Hint content="Choose two to four runs to compare them" wrap>
  <Button size="sm" disabled>Compare</Button>
</Hint>
```

- Never a `title` attribute: it shows on no phone, no keyboard and no disabled control.
- One short sentence; what the control does is its own label, the hint says what more there is to know.
