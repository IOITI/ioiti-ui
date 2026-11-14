# TextLink

A link made of words, through the application's router: underlined in text, underlined under the pointer in a list, quiet as a panel's way further.

**You provide** `to` (the path), the words as `children`; `variant` (`inline` by default · `hover` · `quiet`); `reloadDocument` for an address the server answers and the router does not know (a sign-out, a file).

```tsx
<p className="text-sm">Read <TextLink to="/foundations/usable-by-all">the rules</TextLink> before writing a page.</p>
<TextLink to="/components/tables" variant="quiet">View all</TextLink>
```

- `inline` in running text: underlined, in the accent's `brand-text` where one is chosen. `hover` where every name in a list or a table is a link. `quiet` for a panel's "View all": `text-xs`, `muted-foreground`, `foreground` under the pointer.
- It is drawn by the application's link (`LinkProvider`), a plain `<a>` without one: opened in another tab with ⌘ or Ctrl. A link drawn as a button is a `ButtonLink`.
