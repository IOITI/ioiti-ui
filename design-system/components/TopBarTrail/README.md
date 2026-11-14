# TopBarTrail

Where the page is, in the top bar of every page: Home, the section, the entry of the menu, and for a page deeper than the menu the pages between and its name. `AppShell` draws it; `PageTrailProvider` holds what it is made from.

**You provide** for `PageTrailProvider`: `menu`, `pathname`, the frame as `children`; a page gives its name with its `PageHeader` (`title`, `parents`, `name`), or `usePageName(title, parents)`. For `TopBarTrail`: `home` (`{ label, href }`; `Home` at `/` by default).

```tsx
<PageTrailProvider menu={MENU} pathname={location.pathname}>
  <header className="flex h-14 items-center border-b border-border px-4"><TopBarTrail /></header>
  <PageHeader title="Order 2026-0042" parents={[{ label: 'November', href: '/orders?month=11' }]} />
</PageTrailProvider>
```

- Whole on a wide screen while it fits the room the top bar leaves it (the page's own name may be cut short, not the steps before it); otherwise its last two steps; on a phone, the step before the page alone, a link back.
- A section has no page: its step is no link. A section without a heading, or a menu with `trailSections: false`, has no step at all.
- An entry under another (`parent`) goes through it. Until a deeper page has said its name, its step is `…`.
