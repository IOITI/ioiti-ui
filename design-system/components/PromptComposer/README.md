# PromptComposer

A request to an assistant: a field that grows with its text, sent with Enter, stopped while it is answered, with requests to start from and what it goes with above its field.

**You provide** `label` (shown unless `hideLabel`), `value`, `onValueChange`, `onSubmit`; `busy` with `onStop`; `disabled` with `disabledReason`; `placeholder`; `suggestions` (`[{ label, prompt }]`); `attachments` (`AttachmentChip`s) and `onFiles` for files dropped or pasted; `controls` (a model's menu, a meter) and `footer` under the field; `maxLength`, `minRows` (2), `maxRows` (10); `floating` at a page's foot.

```tsx
<PromptComposer label="Ask the assistant" value={value} onValueChange={setValue} onSubmit={send}
  busy={answering} onStop={stop} maxLength={2000} footer="about 2 cents a question"
  suggestions={[{ label: 'Summarise', prompt: 'Summarise October in three lines.' }]} />
```

- Enter sends, Shift+Enter breaks a line; on a touch screen Enter breaks a line and the button sends. A suggestion fills the field, to be read before it is sent.
- The frame is `surface` with a `border` (`border-hover` with the focus), `radius-2xl`; the send button `primary`, the accent's fill where one is chosen.
- `floating` lifts it with `shadow-elevated` over what scrolls under it, with no band behind it; `glass-float` under glass.
