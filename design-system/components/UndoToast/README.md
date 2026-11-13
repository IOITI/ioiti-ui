# UndoToast

A removal offered with an Undo instead of a question: the toast counts down, and nothing is sent before its time runs out.

**You provide** `open`, `title` ("2 files removed"), `description`; `onUndo`, `onDismiss`; `duration` (ms, `5000` by default); `undoLabel` (`Undo`), `restoredMessage` (shown after Undo, `Restored successfully` by default); `variant` (`default` · `success` · `warning` · `error` · `info`); `position` (`bottom-center` by default); `showProgress`; `icon`; `wrapperClassName`.

```tsx
<UndoToast open={open} title="2 files removed" description="Removed for good in a few seconds" duration={8000}
  onUndo={() => setRestored(true)} onDismiss={() => setOpen(false)} />
```

- `onDismiss` comes after an Undo too: send the removal only when `onUndo` has not come first.
- Its time runs on under the pointer and stops while the keyboard is in it, the time to reach Undo.
- For what cannot be taken back, ask first with `ConfirmAction`. For a plain result, a toast from `useToast()`.
- Its countdown bar is the text's colour, the accent's `brand` under an accent; under glass it is `glass-float`.
