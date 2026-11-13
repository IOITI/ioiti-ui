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

- On a focused handle the arrows move it 2%, 10% with Shift; Home and End go to the ends; Enter folds a `collapsible` panel away and back. A double click puts the first sizes back. To a screen reader it is a separator with its value.
- The handle is a 1px line in `border`, `border-hover` under the pointer, `brand` while dragged under an accent. A panel's content scrolls inside it.
- Under `stackBelow` the handles go and the panels stack, each at its own height.
