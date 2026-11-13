# AttachmentChip

Something attached to a request or a message: a file, a record. Its label is cut where room ends; it may lead somewhere, be taken away, be made ready, or say why it could not be taken.

**You provide** `label` (a file's name, a record's title), `detail` (its size, "Uploading…", why it failed); `icon` (a lucide icon; a paperclip by default) or `thumbnail` (an image's address); `href` (its label becomes the application's link; `linkComponent="a"` for a file the browser opens); `onRemove`; `busy` while it is made ready; `tone="danger"` when it could not be taken.

```tsx
<AttachmentChip label="October.csv" detail="12 kB" icon={<FileText />} onRemove={() => remove(file)} />
<AttachmentChip label="statement.pdf" detail="Larger than 5 MB" tone="danger" onRemove={() => remove(file)} />
```

- Drawn on `surface-raised` with a `border`, `radius-lg`; `danger` in `negative`, its detail saying why.
- Its remove button is named "Remove <label>". Busy, a spinner takes the icon's place and a screen reader hears it.
- Put chips in `PromptComposer`'s `attachments`, or in a row of their own that wraps.
