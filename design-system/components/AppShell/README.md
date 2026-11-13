# AppShell

The frame of every page: the sidebar with the application's menu, the top bar with the trail of where the page is, and the page in a column of `page-max-width`.

**You provide** `menu` (`{ sections, entries: [{ id, path, label, section, icon }] }`), the `pathname` shown, the page as `children`; optionally `appName` (IoitiProvider's by default), `appDetail` (a version), `brandMark`, `sidebarFooter` (a `SidebarFooterButton` to sign out), `topBarChips`, `topBarEnd` (the theme button by default), `isWide(pathname)` for pages that need the whole width. Its links are the application's (`LinkProvider`, or `RouterAppShell` with React Router).

```tsx
<AppShell menu={MENU} pathname={location.pathname} appDetail="v1.2.0"
  sidebarFooter={<SidebarFooterButton icon={<LogOut />} label="Sign out" onClick={signOut} />}
  topBarEnd={<><LookPicker /><ThemeToggle /></>}>
  <PageHeader title="Orders" description="Every order, newest first." />
  …
</AppShell>
```

- The sidebar is beside the page from 768px, a drawer below; ⌘B (Ctrl+B) folds it. Under glass it is `glass-bar`.
- The shell puts `page-gap` between the page's blocks: a page returns them side by side, no margins of its own.
- A change of page fades the page alone; the sidebar and the top bar stay still and in use.
- A page deeper than the menu (`/orders/42`) stands under the entry its address starts with; its `PageHeader` names it in the trail.
