# SpotlightSearch

A palette that goes somewhere: every word typed must be in an entry, whatever its case and accents, the best entries first, and Enter follows the one chosen; its entries under their categories, the searches made before while nothing is typed. Asked to, it stays open to choose several.

**You provide** `open`, `onOpenChange`, `label`, `items` (`[{ id, title, category, description?, icon?, shortcut?, href?, action?, keywords? }]`); `placeholder`, `grouped`, `recentSearches`; `onSelect`, `onClose`; `closeOnSelect={false}` with `picked` (ids ticked) and `footer` to choose several; `enableGlobalShortcut` (⌘K on an Apple computer, Ctrl K elsewhere, listed by `?` as its `label`); `limit` (`50`, the best); `onQueryChange` (told of `''` as it opens) with `filter={false}` for entries a server found; `onNavigate`, `linkComponent`.

```tsx
<SpotlightSearch open={open} onOpenChange={setOpen} label="Go to" placeholder="An order, a customer…" grouped
  recentSearches={['acme', 'refund']}
  items={[{ id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Acme · 1,840.00 €', href: '/orders/2026-0042', icon: <Receipt /> }]} />
```

- The focus goes into its field and stays in the palette: Tab goes round its own controls, a press on an entry leaves it in the field. The arrows move, the list scrolling in itself; Enter follows; Escape, or ⌘K again, closes it, and the focus goes back to what opened it. An entry with an `href` is a link: ⌘ or Ctrl and a click opens it elsewhere.
- Its keys are its own: a dialog under it hears none (one Escape closes the palette alone), nor do the application's shortcuts. A key that composes a character (an IME's Enter) is the composition's.
- `enableGlobalShortcut` is for a palette that only leads somewhere; one that acts opens from a button. Without it, give your button the keys you register (`useShortcut('mod+k', …)`), never both.
- A word is found in an entry's title, `keywords`, category and description, whatever its case and accents: "resume" finds "Résumé", "strasse" "Straße". An entry whose title holds the words comes first (the whole title, then its start, then a word in it: IconButton), then one found by a keyword, its category, its description; those worth the same keep your order, as all do while nothing is typed. Grouped, the category of the best entry comes first. What matches is underlined (`<mark>`, in the text's own colour). `filter={false}` lists your entries as given, still marked.
- An entry's `shortcut` is keys (`'g o'`, `mod`), drawn by `Kbd` as this computer writes them; the palette does not listen for them. A screen reader hears its headings as groups, and how many entries are found once typing pauses.
- The palette is `surface-raised` with `border`, `shadow-elevated` and `radius-2xl`; the entry chosen is `surface-hover` (the accent's soft `brand` under an accent). Under glass it is `glass-float` over `glass-scrim`.
