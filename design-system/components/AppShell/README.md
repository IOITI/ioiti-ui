# AppShell

The frame of every page: the sidebar with the application's menu, the top bar with the trail of where the page is, and the page in a column of `page-max-width`.

**You provide** `menu` (`{ sections, entries: [{ id, path, label, section, icon, badge?, badgeTone? }] }`), the `pathname` shown, the page as `children`; optionally `appName` (IoitiProvider's by default), `appDetail` (a version), `brandMark`, `sidebarFooter` (a `SidebarFooterButton` to sign out), `topBarChips` (a `StateChip` each, or a `StateSummary` of them all), `topBarEnd` (the theme button by default; a `UserMenu`), `collapsedStorageKey` (where the browser keeps the reader's choice of the rail), `isWide(pathname)` for pages that need the whole width; `hash` (the part of the page the address shows, scrolled to; `RouterAppShell` gives it), `search` (the address's query, for entries that say values of it; `RouterAppShell` gives it), `className` (`h-full` in a box), `tabTitle` (whether its pages name the tab: not by default inside another shell). An entry under another takes `parent`. Its links are the application's (`LinkProvider`, or `RouterAppShell` with React Router).

```tsx
<AppShell menu={MENU} pathname={location.pathname} appDetail="v1.2.0"
  sidebarFooter={<SidebarFooterButton icon={<LogOut />} label="Sign out" onClick={signOut} />}
  topBarEnd={<><LookPicker /><ThemeToggle /></>}>
  <PageHeader title="Orders" description="Every order, newest first." />
  …
</AppShell>
```

- The sidebar is beside the page from 768px, a drawer below; ⌘B (Ctrl+B) folds it, and with `collapsedStorageKey` every page opens it as the reader left it. Under glass the sidebar and the top bar are `glass-bar`, unblurred over the still backdrop; what floats from them is drawn in `document.body`.
- An entry ends with a count (`badge: 38`), quiet, or a state in a word in its tone (`badge: 'Degraded', badgeTone: 'warning'`, or `danger`), with a dot.
- The shell puts `page-gap` between the page's blocks: a page returns them side by side, no margins of its own.
- A change of page fades the page alone; the sidebar and the top bar stay still and in use.
- A page deeper than the menu (`/orders/42`) stands under the entry its address starts with; its `PageHeader` names it in the trail.
- A page's tab kept in the query is an entry of its own when its `path` says the values (`/ops?tab=history`): the longest path wins, then the entry that says more of the query.
- An entry under another may be at its parent's address: it is the parent's first page ("Rules › Library"), and the trail says the parent without a link. A parent with a page of its own is a link in the trail.
- A section placed at the foot (`place: 'footer'`) is drawn above Collapse; the trail does not say its heading.
- A page that throws as it draws shows an `ErrorState` in its place, the sidebar and the top bar kept; another page clears it. `errorFallback` gives another, `false` none (the router's error page, or the application's boundary, catch it then).
- `pending` while the next page is on its way (`useNavigation().state === 'loading'`): a thin bar under the top bar after a moment, and the page said busy.
