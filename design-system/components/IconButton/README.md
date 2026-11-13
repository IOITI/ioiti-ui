# IconButton

An icon alone, named in words for screen readers, quiet until hovered: the top bar's buttons, a row's actions.

**You provide** `label` (the name a screen reader says, and the hint), `icon` (a lucide icon element), `onClick`; `hint` for a longer explanation than the label; `disabled`.

```tsx
<IconButton label="Archive" icon={<Archive />} hint="Archive the project (it stays readable)" />
```

- Every icon button has a `label`: an icon is never its only name.
- Use it where space is short and the icon is well known; otherwise a `Button` with words.
