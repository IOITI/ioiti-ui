# ProductTour

A walk through a page, one part at a time: the page dims around each part, scrolled to it, with its step beside it (on a phone, at the bottom).

**You provide** `open` / `onOpenChange` (or `defaultOpen`, the tour then ending itself), `onClose` (given `done` · `skip` · `dismiss`, as `onOpenChange` is with `{ reason }`), `steps`: `{ title, body, target?, placement? }`, `target` being a CSS selector, a function returning the element, or a ref, and `placement` `auto` · `top` · `bottom` · `left` · `right`; a step without a target is centred (a welcome, a goodbye). Also `startAt`, `onStepChange`, `closeOnOverlayClick`; per step `padding`, `radius`, `scroll: false`.

```tsx
<ProductTour open={open} onOpenChange={setOpen} steps={[
  { title: 'What floats over the page', body: 'The arrows move from one to the next, Escape ends it.' },
  { target: '#filters', title: 'A popover', body: 'A panel beside its button: filters, a few settings.', placement: 'bottom' },
]} />
```

- Opened from a button the user presses ("Take the tour of this page").
- The scrim is black at 50% (`glass-scrim` under glass); the card is `surface` with `border`, `radius-2xl`, `glass-float` under glass. The current step's dot is `foreground`, the accent's `brand` under an accent.

## Accessibility

Its card is a modal dialog named by the step's title, whose words are said as each step comes. The focus goes to Next (Done on the last step), Tab stays in the card, and the focus comes back where it was once the tour ends. Its dots are buttons named by their step ("Go to step 2"), the current one marked.

| Key | What it does |
|---|---|
| →, ← | The next step, or the one before; past the last, the tour ends |
| Tab, Shift+Tab | Round the card's buttons: Skip, the steps, Back, Next |
| Enter, Space | Presses the button that has the focus (Next, as the tour opens) |
| Escape | Ends the tour |
