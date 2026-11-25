# LogViewer

A job's output as it is written (a build, a deploy, an import): numbered lines, errors and warnings in their tones, the newest line in sight until the reader scrolls up, a search going from one line found to the next, wrapping, copying, downloading.

**You provide** `label` (its header and its name for a screen reader), `lines` (oldest first, appended as they arrive) or `text`; `height` (384px by default); `downloadName`; `follow` (on by default), `defaultWrap`, `maxLines` (50,000 kept) and `droppedLines` for lines a server already left out; `emptyText`.

```tsx
<LogViewer label="Deploy to sandbox" lines={lines} height={280} downloadName="deploy-1024-sandbox.log" />
```

- A line's level is read from its words (ERROR, WARN, INFO, a traceback): an error in `negative`, a warning in `warning`, each marked at its edge, info's edge in `info`. Set in `mono` on `surface`, `radius-xl`.
- Scrolled up, "Jump to the end" follows the newest line again.
- Only the lines in sight are drawn: a log of a hundred thousand lines scrolls as one of a hundred. Code to read is a `CodeBlock`.

## Accessibility

A region named by its `label`. Its lines are a log a screen reader reads when asked, not as it grows, and, while they scroll, a stop of the keyboard whose keys scroll them: none while they fit. The search says where it is ("3 of 12", "No match"); Wrap long lines says whether it is on.

| Key | What it does |
|---|---|
| Enter, Shift+Enter | In the search: the next line found, the one before |
| ↓, ↑, Page Down, Page Up, Home, End | On the lines: scroll them |
| Tab | From the search through its buttons, then onto the lines while they scroll |
