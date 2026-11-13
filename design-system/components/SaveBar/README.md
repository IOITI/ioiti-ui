# SaveBar

The bar of unsaved changes, at the bottom of the page while there are any: what there is to save, Discard and Save, and why it cannot be saved yet.

**You provide** `open` (there is something to save), `message` ("1 unsaved change"; `Unsaved changes` by default), `onSave`, `onDiscard` (no Discard without it), `saving`, `saveDisabled` with `error` (why it cannot be saved, or why the last save failed); `saveLabel`, `discardLabel`, other actions as `children`, `label`.

```tsx
<SaveBar open={limit !== saved} message="1 unsaved change" saving={saving}
  saveDisabled={limit === null} error={limit === null && 'The daily limit needs a value: an empty one cannot be saved.'}
  onDiscard={() => setLimit(saved)} onSave={save} />
```

- It stays in sight as the page scrolls, at the foot of the page's column, and the toasts rise above it. A screen reader hears it once as it comes, an `error` at once.
- With `RouterLeaveGuard` (`ioiti-ui/react-router`), leaving the page with changes asks first.
- It floats: `surface`, `border`, `radius-xl`, a large shadow; `glass-float` under glass. The error is in `negative`; Save is the primary button, Discard a ghost one.
