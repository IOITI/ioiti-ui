# Sidebar

The application's menu, beside the page from 768px up and a drawer below: its sections, entries with an icon and a badge, entries that open on their children, the page shown marked. `AppShell` draws it from its menu; alone, it takes its sections.

**You provide** `sections` (`[{ id, title?, foldable?, place?, items: [{ id, label, icon, href?, badge?, badgeTone?, children? }] }]`; `sidebarSections(menu)` makes them from a `Menu`), `activeId`; `onActiveChange` (an entry without an `href` is a button), `linkComponent`, `header` and `footer`; `collapsed` or `defaultCollapsed`, with `onCollapsedChange`, or `collapsedStorageKey` to keep the reader's choice in the browser; `mobileOpen` with `onMobileOpenChange`, opened by `SidebarTrigger` (a button of the top bar, shown below 768px only).

```tsx
<Sidebar sections={sidebarSections(MENU)} activeId={current.id}
  header={<AppBrand name="My App" detail="v1.2.0" />}
  footer={<SidebarFooterButton icon={<LogOut />} label="Sign out" onClick={signOut} />}
  mobileOpen={open} onMobileOpenChange={setOpen} />
<SidebarTrigger onClick={() => setOpen(true)} />
```

- ⌘B (Ctrl B) folds it to a rail of icons, each named in a tip, as its Collapse button does. In the rail a badge is a dot on its icon, in its tone, its words in the entry's name and tip. In `header` and `footer`, `useSidebar()` says whether it is folded.
- The page shown is marked in the accent where there is one. A badge counts, quiet, or says a state in `warning` or `danger` (formerly `negative`) with a dot.
- A folded section (`foldable`) stays folded for each reader, in their browser, until the page shown is in it. Folded, it shows a dot when an entry under it has a badge, in the gravest tone among them.
- An entry with children and an `href` is a page and a link, its chevron apart opening it; the one that is, or holds, the page shown opens at every page. Closed, it shows a dot when a child has a badge, in the gravest tone among them.
- Folded to the rail, an entry with children shows its pages in a menu beside it (its own page first, unless a child is at its address), the page shown marked; it keeps the pill while it holds the page shown.
- A section placed at the foot (`place: 'footer'`) is drawn above Collapse, without a heading: a page the reader goes to now and then, the documentation.
- Beside the page it is `glass-bar` under glass; the drawer is `glass-float`, closed by a choice, Escape, its close button, its scrim or a swipe.
- The drawer is a dialog: opened, the focus goes to the page shown in it, Tab stays in it, and closed it goes back to the button that opened it, which says whether it is open (`aria-expanded`, `aria-controls` its `drawerId`: `AppShell` gives both).
