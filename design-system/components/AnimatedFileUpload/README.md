# AnimatedFileUpload

A drop zone for files, each listed with its progress and answered, once done, with a link to what it became.

**You provide** `uploadHandler` (`(file, onProgress) => Promise`, answering `{ href, label }` for the link), `label` (the name of its file input: "Invoices to import"); `multiple`, `sequential` (one file after the other), `accept` (`"application/pdf"` or `[".png", ".jpg"]`), `maxSize` (in bytes, 25 MB by default), `maxFiles` (10), `dropTitle` / `dropSubtitle`, `workingLabel` / `doneLabel`, `variant` (`standard` · `compact`), `onFilesSelected`, `onUploadComplete`, `onRemove`, `disabled`.

```tsx
<AnimatedFileUpload multiple sequential uploadHandler={importInvoice} label="Invoices to import" />
```

- A press, Enter or Space on the zone opens the system's file chooser. A file larger than `maxSize` is listed with why; an upload that fails says so, with its error's message.
- A done file's link is drawn by the application's link (`LinkProvider`), or by `linkComponent`.
- `standard` is the full-size zone; `compact` the inline one, for a form's column.
