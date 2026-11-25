# ResizablePanels

Panels side by side or one over the other, each sized by the handle between them: dragged, or with the arrow keys once it has the focus.

**You provide** `ResizablePanels` with a height (`className="h-72"`), `direction` (`horizontal` · `vertical`), `stackBelow` (a width in px under which they go one under the other), `onSizesChange(sizes)`; as children `ResizablePanel`, `ResizableHandle`, `ResizablePanel`…, each panel with `defaultSize` (a share in percent, all making 100), `minSize`, `maxSize`, `collapsible`, `label` (what its handle resizes); a handle's own `label`.

```tsx
<ResizablePanels stackBelow={640} className="h-72 rounded-xl border border-border">
  <ResizablePanel defaultSize={22} minSize={15} maxSize={40} label="the list">…</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={48} minSize={25} label="the editor">…</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={30} minSize={20} collapsible label="the preview">…</ResizablePanel>
</ResizablePanels>
```

- A double click on a handle puts the first sizes back.
- The handle is a 1px line in `border`, `border-hover` under the pointer, `brand` while dragged under an accent. A panel's content scrolls inside it.
- Under `stackBelow` the handles go and the panels stack, each at its own height.

## Accessibility

Each handle is a stop of the keyboard: a separator named after the panel before it ("Resize the editor", from its `label`), which says that panel's share, in percent, and its bounds.

| Key | What it does |
|---|---|
| →, ← | Side by side: the handle 2% to the right, or to the left; 10% with Shift |
| ↓, ↑ | One over the other: the handle 2% down, or up; 10% with Shift |
| Home, End | The panel before it at its smallest, at its largest |
| Enter | Folds a `collapsible` panel beside it away, and back |
