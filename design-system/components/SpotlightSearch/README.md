# SpotlightSearch

A palette that goes somewhere: every word typed must be in an entry, and Enter follows it; its entries under their categories, the searches made before while nothing is typed. Asked to, it stays open to choose several.

**You provide** `open`, `onOpenChange`, `label`, `items` (`[{ id, title, category, description?, icon?, shortcut?, href?, action?, keywords? }]`); `placeholder`, `grouped`, `recentSearches`; `onSelect`, `onClose`; `closeOnSelect={false}` with `picked` (ids ticked) and `footer` to choose several; `enableGlobalShortcut` (⌘K on an Apple computer, Ctrl K elsewhere, listed by `?` as its `label`); `limit` (`50`), `onQueryChange` (told of `''` as it opens), `onNavigate`, `linkComponent`.

```tsx
<SpotlightSearch open={open} onOpenChange={setOpen} label="Go to" placeholder="An order, a customer…" grouped
  recentSearches={['acme', 'refund']}
  items={[{ id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Acme · 1,840.00 €', href: '/orders/2026-0042', icon: <Receipt /> }]} />
```

- The focus goes into its field and stays in the palette: Tab goes round its own controls, a press on an entry leaves it in the field. The arrows move, the list scrolling in itself; Enter follows; Escape, or ⌘K again, closes it, and the focus goes back to what opened it. An entry with an `href` is a link: ⌘ or Ctrl and a click opens it elsewhere.
- Its keys are its own: a dialog under it hears none (one Escape closes the palette alone), nor do the application's shortcuts. A key that composes a character (an IME's Enter) is the composition's.
- `enableGlobalShortcut` is for a palette that only leads somewhere; one that acts opens from a button. Without it, give your button the keys you register (`useShortcut('mod+k', …)`), never both.
- A word is found in an entry's title, category, description and `keywords`. Its keys are drawn as `Kbd`. A screen reader hears its headings as groups, and how many entries are found once typing pauses.
- The palette is `surface-raised` with `border`, `shadow-elevated` and `radius-2xl`; the entry chosen is `surface-hover` (the accent's soft `brand` under an accent). Under glass it is `glass-float` over `glass-scrim`.
