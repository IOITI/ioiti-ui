# DynamicIsland

A pill that keeps its place in the top bar and grows into an island over the page: what is live, everywhere.

**You provide** `label` (the pill's and the island's name), `compact` (what the pill shows), the island's content as `children`; `defaultState` or `state` with `onStateChange` (`collapsed` · `expanded`).

```tsx
<DynamicIsland label="Today" compact={<span className="text-xs">3 orders · <SignedValue value={12.4} kind="percent" /></span>}>
  <div className="p-4 text-sm">3 orders, 4,210.00 €: 12.4 % more than last Monday.</div>
</DynamicIsland>
```

- The pill is a button: pressed, the island grows from it over the page and the focus moves to its Close; Escape or a press outside closes it, the focus back on the pill.
- The bar keeps its height: the pill stays in place and the island opens from its left edge, 22rem wide; on a phone, across the screen under the bar. Under glass both are `glass-float`.
