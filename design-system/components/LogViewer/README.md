# LogViewer

A job's output as it is written (a build, a deploy, an import): numbered lines, errors and warnings in their tones, the newest line in sight until the reader scrolls up, a search going from one line found to the next, wrapping, copying, downloading.

**You provide** `label` (its header and its name for a screen reader), `lines` (oldest first, appended as they arrive) or `text`; `height` (384px by default); `downloadName`; `follow` (on by default), `defaultWrap`, `maxLines` (50,000 kept) and `droppedLines` for lines a server already left out; `emptyText`.

```tsx
<LogViewer label="Deploy to sandbox" lines={lines} height={280} downloadName="deploy-1024-sandbox.log" />
```

- A line's level is read from its words (ERROR, WARN, INFO, a traceback): an error in `negative`, a warning in `warning`, each marked at its edge, info's edge in `info`. Set in `mono` on `surface`, `radius-xl`.
- In the search, Enter goes to the next line found, Shift+Enter to the one before. Scrolled up, "Jump to the end" follows the newest line again.
- Only the lines in sight are drawn: a log of a hundred thousand lines scrolls as one of a hundred. Code to read is a `CodeBlock`.
