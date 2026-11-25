# SpotlightSearch

A palette that goes somewhere: every word typed must be in an entry, whatever its case and accents, the best entries first, and Enter follows the one chosen; its entries under their categories, those chosen last and the searches made before while nothing is typed. Asked to, it stays open to choose several.

**You provide** `open`, `onOpenChange`, `label`, `items` (`[{ id, title, category, description?, icon?, shortcut?, href?, action?, keywords?, items?, placeholder? }]`); `placeholder`, `grouped`, `recentSearches`, `remember` (a name for the entries chosen); `onSelect`, `onClose`; `closeOnSelect={false}` with `picked` (ids ticked) and `footer` to choose several; `enableGlobalShortcut` (⌘K on an Apple computer, Ctrl K elsewhere, listed by `?` as its `label`); `limit` (`50`, the best); `onQueryChange(query, scope)` (told of `''` as it opens, `scope` the entry whose list is shown) with `filter={false}` for entries a server found, `loading`, `error` (`true` or your words) and `onRetry`; `onNavigate`, `linkComponent`.

```tsx
<SpotlightSearch open={open} onOpenChange={setOpen} label="Go to" placeholder="An order, a customer…" grouped
  recentSearches={['acme', 'refund']}
  items={[{ id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Acme · 1,840.00 €', href: '/orders/2026-0042', icon: <Receipt /> }]} />
```

- The focus goes into its field and stays in the palette; a press on an entry leaves it in the field. The list scrolls in itself, the entry chosen kept in sight. An entry with an `href` is a link: ⌘ or Ctrl and a click opens it elsewhere and leaves the palette open.
- Its keys are its own: a dialog under it hears none (one Escape closes the palette alone), nor do the application's shortcuts. A key that composes a character (an IME's Enter) is the composition's.
- `enableGlobalShortcut` is for a palette that only leads somewhere; one that acts opens from a button. Without it, give your button the keys you register (`useShortcut('mod+k', …)`), never both.
- A word is found in an entry's title, `keywords`, category and description, whatever its case and accents: "resume" finds "Résumé", "strasse" "Straße". An entry whose title holds the words comes first (the whole title, then its start, then a word in it: IconButton), then one found by a keyword, its category, its description; those worth the same keep your order, as all do while nothing is typed. Grouped, the category of the best entry comes first. What matches is underlined (`<mark>`, in the text's own colour). `filter={false}` lists your entries as given, still marked.
- An entry with `items` holds a list of its own ("Orders ›"): chosen, the palette lists them, its title before the field (with its `placeholder`), searched alone. Backspace in the empty field, Escape or its title goes back, what was typed above typed again. It leads nowhere itself, and is neither remembered nor told to `onSelect`. Fill it as it is searched: `onQueryChange` names it.
- `remember` keeps the five entries chosen last in this browser, under the application's key (`<themeStorageKey()>.spotlight.<name>`), and offers them first while nothing is typed (Recent): one that leads somewhere as it was kept, one that acts while it is among your entries. Shift+Delete forgets the one chosen. Only an entry's id, title, category and `href` are kept, never its description; they outlive a sign-out: where a browser is shared, put who is signed in in the name, and remove the key as they sign out.
- Found as it is typed: `onQueryChange` asks your server. Set `loading` in it, at once, before the request waits: the palette says it is searching in place of the list, never "No results" before it knows, and keeps the entries shown until new ones come. Drop the answer to an older query yourself (it may come last). `error` says the search failed, in place of the list or above the last entries found, with a Try again for `onRetry`. The entry chosen stays chosen as the entries change.
- An entry's `shortcut` is keys (`'g o'`, `mod`), drawn by `Kbd` as this computer writes them; the palette does not listen for them. A screen reader hears its headings as groups, and how many entries are found once typing pauses.
- The palette is `surface-raised` with `border`, `shadow-elevated` and `radius-2xl`; the entry chosen is `surface-hover` (the accent's soft `brand` under an accent). Under glass it is `glass-float` over `glass-scrim`.

## Accessibility

A modal dialog named by its `label`; its field is a combobox ("Search", or "Search Orders" in an entry's list) that says the entry the arrows are on. The entries are options under their categories: one ticked said checked (`picked`), one that holds a list saying it opens one, one chosen before offering Shift+Delete. How many entries are found is said once typing pauses.

| Key | What it does |
|---|---|
| ⌘K (Ctrl+K) | Opens it from any page, with `enableGlobalShortcut`; in it, closes it |
| ↓, ↑ | The next entry, or the one before; past the last, the first again |
| Enter | Chooses the entry: follows it, does it, opens its list, or types a search made before again |
| ⌘↵ (Ctrl+Enter) | Opens an entry that leads somewhere in another tab, the palette staying open |
| Backspace | In the empty field: back from an entry's list |
| Shift+Delete | In the empty field: forgets the entry chosen before that the arrows are on (`remember`) |
| Tab, Shift+Tab | Round its field and its own buttons |
| Escape | Back from an entry's list; else closes it, the focus back on what opened it |
