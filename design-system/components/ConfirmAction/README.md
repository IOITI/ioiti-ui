# ConfirmAction

The last step before an action that matters: a dialog that says what will happen, in the user's words, then asks for a gesture: a slide for what cannot be taken back, a plain button for the protective direction.

**You provide** `open`, `onClose`, `onConfirm`, `title`, `description` (exactly what will happen), `confirmLabel` (the slider's words, or the button's with `gesture="button"`); `warning` (what is at stake, said first), `gesture` (`slide` by default · `button`), `doneLabel` (`Done`), `workingLabel` (`Working…`), `cancelLabel` (`Cancel`), `pending` while the action runs, `blocked` while the description asks for something first (a box ticked), `error`.

```tsx
<ConfirmAction open={open} title="Delete this project"
  description="The project, its 42 files and their history are removed for everyone."
  warning="This cannot be undone." confirmLabel="Slide to delete" doneLabel="Deleted"
  pending={pending} onConfirm={remove} onClose={close} />
```

- The slide is for what puts something at risk or cannot be undone; pausing, which must be quick, is `gesture="button"`. Its words say the action ("Pause the imports"), never "OK".
- The slider is a `DragToConfirm` in the `warning` tone: dragged to the end, or Enter once it has the focus. The warning is an `Alert` in the `warning` tone, the description in `text-secondary`.
- While `pending`, it cannot be closed; an `error` shows in a `danger` alert, with a fresh slider.
- One dialog at a time, in the document's body, keeping the focus; Escape or Cancel closes it.
