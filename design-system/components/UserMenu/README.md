# UserMenu

Who is signed in, at the end of the top bar: their avatar and their name, a role under it, a button that opens the menu of their account, signing out last.

**You provide** `name`, `detail` (a role: "Analyst"), `avatarSrc` (their picture, from the application's own origin; their initials without one); `items` as `DropdownMenu` takes them (links `{ type: 'link', label, href, icon }`, actions); `appearance` for the theme, then a sub-menu of the accent and the material; `onSignOut` (an action) or `signOutHref` (an address the server answers, its page loaded from the server); `signOutLabel` (`Sign out`), `label` (`Account`).

```tsx
<AppShell … topBarEnd={
  <UserMenu name={me.name} detail={me.role} avatarSrc="/api/v1/me/avatar"
    items={[{ type: 'link', label: 'Profile', href: '/profile', icon: <UserRound /> }]}
    appearance signOutHref="/api/v1/auth/logout" />
} />
```

- The name (`foreground`) and the role (`muted-foreground`) show beside the avatar from 640px; below, the avatar alone, the name still the button's for a screen reader.
- The menu is `DropdownMenu`'s: the arrows move, a letter jumps, Escape closes, Tab leaves. Signing out is always last, after a separator.
- With `appearance` it takes the place of `ThemeToggle` and `LookPicker` in the top bar: each person's choice, kept in this browser. It reads the theme's context (`IoitiProvider`); a settings menu of its own takes the same items from `useAppearanceItems()`.
