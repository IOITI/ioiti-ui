# Tooltip

The tooltip under `Hint`: it comes from the side asked, or the other one when there is no room, its arrow on its trigger.

**You provide** `content` and one element as `children`; `side` (`top` · `right` · `bottom` · `left`, `top` by default), `align` (`start` · `center` · `end`); `delayDuration` (ms, `150`), `offset` (px, `8`), `showArrow`; `wrapperClassName` (a full-width field keeps its width); `forceOpen` to show it in a design preview.

```tsx
<Tooltip content="On the right" side="right">
  <Button size="sm" variant="outline">right</Button>
</Tooltip>
```

- Pages use `Hint`, which is built on it. Never a `title` attribute.
- It shows on hover, on keyboard focus and on a tap; Escape, a tap elsewhere or a scroll hides it. The pointer can go onto it: it waits 120 ms once the pointer has left its trigger, and stays while the pointer is over it.
- It floats in the document's body, kept on the screen: `surface`, `border`, `text-primary`, `shadow-elevated`, `radius-md`; `glass-float` under glass.
- Formerly `DirectionalTooltip`: that name still draws it until 1.0, and says so once in development.

## Accessibility

Its words describe its trigger, read with it whether the tooltip shows or not; the tooltip itself is hidden from screen readers, never said twice. It is no stop of the keyboard: its trigger is.

| Key | What it does |
|---|---|
| Tab | Onto its trigger: shows it, after `delayDuration`. Away: hides it |
| Escape | Hides it, the focus staying on its trigger |
