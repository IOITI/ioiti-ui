# PeekLink

A link whose page is previewed on hover, on keyboard focus and on a first tap, without leaving the page; a second tap, or a click, follows it. `PeekCard` puts the same card on any other trigger.

**You provide** for `PeekLink`: `to`, `content` (a function drawing the card), the words as `children`, `className`; `openOnTap` (`false`: a tap follows the link at once); `aria-label`. For `PeekCard`: one element as `children`, `renderContent`; `href` and `hrefLabel` (`Open` by default) for the card's own link; `placement` (`auto` · `top` · `bottom`); `delay` (ms, `200`); `openOnTap`.

```tsx
<PeekLink to="/invoices/2026-0042" content={() => <InvoicePreview />}>Invoice 2026-0042</PeekLink>
<PeekCard renderContent={() => <InvoicePreview />} href="/invoices/2026-0042">
  <button type="button">1,840.00 €</button>
</PeekCard>
```

- The card's content is drawn only while it is open: read what it shows then. Keep it to a few lines; a whole record is a `Flysheet`.
- The trigger keeps its own focus and click. Escape, a tap elsewhere, a scroll or a new window size closes the card.
- The card is drawn in the document's body, 288 px wide, above the trigger where there is room; `radius-xl`, `glass-float` under glass.
