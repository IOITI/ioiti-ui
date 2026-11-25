# StatusIsland

A pill that keeps its place in the top bar and grows into an island over the page: what is live, everywhere.

**You provide** `label` (the pill's and the island's name), `compact` (what the pill shows), the island's content as `children`; `defaultState` or `state` with `onStateChange` (`collapsed` · `expanded`).

```tsx
<StatusIsland label="Today" compact={<span className="text-xs">3 orders · <SignedValue value={12.4} kind="percent" /></span>}>
  <div className="p-4 text-sm">3 orders, 4,210.00 €: 12.4 % more than last Monday.</div>
</StatusIsland>
```

- The pill is a button: pressed, the island grows from it over the page; a press outside closes it.
- The bar keeps its height: the pill stays in place and the island opens from its left edge, 22rem wide; on a phone, across the screen under the bar. Under glass both are `glass-float`.
- Formerly `DynamicIsland`: that name still draws it until 1.0, and says so once in development.

## Accessibility

The pill is a button named by `label` and what it shows, which says whether the island is open; the island is a region named by `label`. Opened, the focus goes to its Close ("Close today"); closed, back to the pill.

| Key | What it does |
|---|---|
| Enter, Space | On the pill: opens the island |
| Tab | Through the island's controls, then on through the page |
| Escape | Closes the island, the focus back on the pill |
