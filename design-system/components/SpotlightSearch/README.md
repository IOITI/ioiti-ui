# SpotlightSearch

A palette that goes somewhere: every word typed must be in an entry, and Enter follows it; its entries under their categories, the searches made before while nothing is typed. Asked to, it stays open to choose several.

**You provide** `open`, `onOpenChange`, `label`, `items` (`[{ id, title, category, description?, icon?, shortcut?, href?, action?, keywords? }]`); `placeholder`, `grouped`, `recentSearches`; `onSelect`; `closeOnSelect={false}` with `picked` (ids ticked) and `footer` to choose several; `enableGlobalShortcut` (⌘K on an Apple computer, Ctrl K elsewhere); `limit` (`50`), `onQueryChange`, `onNavigate`.

```tsx
<SpotlightSearch open={open} onOpenChange={setOpen} label="Go to" placeholder="An order, a customer…" grouped
  recentSearches={['acme', 'refund']}
  items={[{ id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Acme · 1,840.00 €', href: '/orders/2026-0042', icon: <Receipt /> }]} />
```

- The focus goes into its field; the arrows move, Enter follows, Escape closes, and the focus goes back. An entry with an `href` is a link: ⌘ or Ctrl and a click opens it elsewhere.
- A word is found in an entry's title, category, description and `keywords`. Its keys are drawn as `Kbd`.
- The palette is `surface-raised` with `border`, `shadow-elevated` and `radius-2xl`; the entry chosen is `surface-hover` (the accent's soft `brand` under an accent). Under glass it is `glass-float` over `glass-scrim`.
