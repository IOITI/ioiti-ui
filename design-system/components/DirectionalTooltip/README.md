# DirectionalTooltip

The tooltip under `Hint`: it comes from the side asked, or the other one when there is no room, its arrow on its trigger.

**You provide** `content` and one element as `children`; `side` (`top` · `right` · `bottom` · `left`, `top` by default), `align` (`start` · `center` · `end`); `delayDuration` (ms, `150`), `offset` (px, `8`), `showArrow`; `wrapperClassName` (a full-width field keeps its width); `forceOpen` to show it in a design preview.

```tsx
<DirectionalTooltip content="On the right" side="right">
  <Button size="sm" variant="outline">right</Button>
</DirectionalTooltip>
```

- Pages use `Hint`, which is built on it. Never a `title` attribute.
- It shows on hover, on keyboard focus and on a tap; Escape, a tap elsewhere or a scroll hides it. Screen readers read it as the trigger's description, shown or not.
- It floats in the document's body, kept on the screen: `surface`, `border`, `text-primary`, `shadow-elevated`, `radius-md`; `glass-float` under glass.
