# FileUpload

A drop zone for files, each listed with its progress and answered, once done, with a link to what it became.

**You provide** `uploadHandler` (`(file, onProgress) => Promise`, answering `{ href, label }` for the link), `label` (the name of its file input: "Invoices to import"); `multiple`, `sequential` (one file after the other), `accept` (`"application/pdf"` or `[".png", ".jpg"]`), `maxSize` (in bytes, 25 MB by default), `maxFiles` (10), `dropTitle` / `dropSubtitle`, `workingLabel` / `doneLabel`, `density="compact"`, `onFilesSelected`, `onUploadComplete`, `onRemove`, `disabled`.

```tsx
<FileUpload multiple sequential uploadHandler={importInvoice} label="Invoices to import" />
```

- A press on the zone opens the system's file chooser. A file larger than `maxSize` is listed with why; an upload that fails says so, with its error's message.
- A done file's link is drawn by the application's link (`LinkProvider`), or by `linkComponent`.
- The full-size zone by default; `density="compact"` the inline one, for a form's column.
- Formerly `AnimatedFileUpload`, removed in 1.0: `npx ioiti-ui-codemod` rewrites it.

## Accessibility

The zone is a button named by its words, its limit included. Each file is listed with its state, what went wrong said at once, its retry and its removal buttons named after it ("Remove invoice.pdf").

| Key | What it does |
|---|---|
| Enter, Space | On the zone: opens the system's file chooser |
| Tab | On through the files' links and buttons |
