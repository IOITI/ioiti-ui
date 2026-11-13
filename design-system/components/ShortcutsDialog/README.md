# ShortcutsDialog

The list of the application's keyboard shortcuts, by group, on `?`: those registered with `useShortcut` where they mean something, while that part is on the page.

**You provide** shortcuts with `useShortcut(keys, handler, { description, group, enabled, allowInInputs })`, `keys` being a combination (`mod+k`: ⌘K or Ctrl K) or a sequence (`g f`: G, then F). Inside `AppShell` the dialog is drawn for you (`shortcutsDialog={false}` for none); elsewhere `ShortcutsDialog` with `open` / `onOpenChange`, `title` (`Keyboard shortcuts`), `keys` (`?`; `null` when a button of yours opens it).

```tsx
useShortcut('g f', () => navigate('/forms'), { description: 'Go to the forms', group: 'Navigation' })
<ShortcutsDialog open={open} onOpenChange={setOpen} keys={null} />
```

- Keys without ⌘ or Ctrl wait while text is typed (`allowInInputs` for an editor's own), and every key waits while a dialog is open.
- A shortcut without a `description` works and is not listed; a `handler` of `null` lists one heard by someone else (a component's own ⌘B).
- One dialog at a time, keeping the focus: Escape closes it, the focus back on what opened it. `surface`, `radius-2xl`, `shadow-elevated`; groups in `text-secondary`, rows apart by `border`, keys drawn by `Kbd`.
