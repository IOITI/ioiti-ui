# Kbd

The keys of a shortcut, as this computer writes them: ⌘ on an Apple computer, Ctrl elsewhere; a sequence is one key, then the next.

**You provide** `keys` in the shortcut's notation (`"mod+k"`, `"mod+shift+p"`, `"g o"`), or the key's name as `children` (`<Kbd>Esc</Kbd>`).

```tsx
<span className="inline-flex items-center gap-2">Search <Kbd keys="mod+k" /></span>
```

- Write `mod`, never ⌘ or Ctrl yourself: the component chooses for the reader's computer.
- ⌘K opens a palette that only leads somewhere; ⌘B folds the sidebar. Do not take these for anything else.
