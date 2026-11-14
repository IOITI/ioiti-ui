# Sidebar

The application's menu, beside the page from 768px up and a drawer below: its sections, entries with an icon and a badge, entries that open on their children, the page shown marked. `AppShell` draws it from its menu; alone, it takes its sections.

**You provide** `sections` (`[{ id, title?, foldable?, items: [{ id, label, icon, href?, badge?, badgeTone?, children? }] }]`; `sidebarSections(menu)` makes them from a `Menu`), `activeId`; `onActiveChange` (an entry without an `href` is a button), `linkComponent`, `header` and `footer`; `collapsed` or `defaultCollapsed`, with `onCollapsedChange`; `mobileOpen` with `onMobileOpenChange`, opened by `SidebarTrigger` (a button of the top bar, shown below 768px only).

```tsx
<Sidebar sections={sidebarSections(MENU)} activeId={current.id}
  header={<AppBrand name="My App" detail="v1.2.0" />}
  footer={<SidebarFooterButton icon={<LogOut />} label="Sign out" onClick={signOut} />}
  mobileOpen={open} onMobileOpenChange={setOpen} />
<SidebarTrigger onClick={() => setOpen(true)} />
```

- ⌘B (Ctrl B) folds it to a rail of icons, each named in a tip, as its Collapse button does. In `header` and `footer`, `useSidebar()` says whether it is folded.
- The page shown is marked in the accent where there is one. A badge counts, quiet, or says a state in `warning` or `negative` with a dot.
- A folded section (`foldable`) stays folded for each reader, in their browser, until the page shown is in it.
- Beside the page it is `glass-bar` under glass; the drawer is `glass-float`, closed by a choice, Escape, its scrim or a swipe.
