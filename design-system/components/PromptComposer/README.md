# PromptComposer

A request to an assistant: a field that grows with its text, sent with Enter, stopped while it is answered, with requests to start from and what it goes with above its field.

**You provide** `label` (shown unless `hideLabel`), `value` / `onChange`, or `defaultValue` (its own text, emptied once sent), `onSubmit`; `pending` with `onStop`; `disabled` with `disabledReason`; `placeholder`; `suggestions` (`[{ label, prompt }]`); `attachments` (`AttachmentChip`s) and `onFiles` for files dropped or pasted; `controls` (a model's menu, a meter) and `footer` under the field; `maxLength`, `minRows` (2), `maxRows` (10); `floating` at a page's foot.

```tsx
<PromptComposer label="Ask the assistant" value={value} onChange={setValue} onSubmit={send}
  pending={answering} onStop={stop} maxLength={2000} footer="about 2 cents a question"
  suggestions={[{ label: 'Summarise', prompt: 'Summarise October in three lines.' }]} />
```

- On a touch screen Enter breaks a line and the button sends. A suggestion fills the field, to be read before it is sent.
- The frame is `surface` with a `border` (`border-hover` with the focus), `radius-2xl`; the send button `primary`, the accent's fill where one is chosen.
- `floating` lifts it with `shadow-elevated` over what scrolls under it, with no band behind it; `glass-float` under glass.

## Accessibility

Its field is named by `label` (out of sight with `hideLabel`, still said), and said invalid past `maxLength`; its suggestions and what it goes with are groups of buttons, named so ("Requests to start from", "Attached"). Send is a button, its reason in a `Hint` while it cannot send; Stop takes its place while the answer comes.

| Key | What it does |
|---|---|
| Enter | Sends the request |
| Shift+Enter | Breaks a line |
| ⌘V (Ctrl+V) | Pasted files are handed over (`onFiles`) |
