# ProductTour

A walk through a page, one part at a time: the page dims around each part, scrolled to it, with its step beside it (on a phone, at the bottom).

**You provide** `open`, `onClose` (given `done` · `skip` · `dismiss`), `steps`: `{ title, body, target?, placement? }`, `target` being a CSS selector, a function returning the element, or a ref, and `placement` `auto` · `top` · `bottom` · `left` · `right`; a step without a target is centred (a welcome, a goodbye). Also `startAt`, `onStepChange`, `closeOnOverlayClick`; per step `padding`, `radius`, `scroll: false`.

```tsx
<ProductTour open={open} onClose={() => setOpen(false)} steps={[
  { title: 'What floats over the page', body: 'The arrows move from one to the next, Escape ends it.' },
  { target: '#filters', title: 'A popover', body: 'A panel beside its button: filters, a few settings.', placement: 'bottom' },
]} />
```

- Opened from a button the user presses ("Take the tour of this page"). The focus goes to Next; the arrows move, Escape ends it, Tab stays in its card, and the focus comes back where it was.
- The scrim is black at 50% (`glass-scrim` under glass); the card is `surface` with `border`, `radius-2xl`, `glass-float` under glass. The current step's dot is `foreground`, the accent's `brand` under an accent.
