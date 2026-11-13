# FunnelChart

Where things went, stage after stage: each stage's count and its share of the first, and what it lost on the way to the next, in words.

**You provide** `stages` (`[{ label, value, dropLabel?, color? }]`, the widest first), `noun` (what is counted, `Users` by default), `summaryLabel` (beside the last stage's share, `overall conversion` by default), `formatValue`; `showSummary`, `ariaLabel`, `emptyText`, `animated`.

```tsx
<FunnelChart noun="Visits" summaryLabel="of the visits ended in a purchase" stages={[
  { label: 'Visited', value: 12480, dropLabel: 'left on the first page' },
  { label: 'Added to the basket', value: 1380, dropLabel: 'left the basket' },
  { label: 'Paid', value: 642 },
]} />
```

- The stages take `chart-funnel-1…5`, one hue from strong to light (the accent's own ramp with one); a sixth stage keeps the fifth's colour. What is lost between two stages is a fading band, its share in `negative`.
- Above it: the share that went all the way, and the biggest drop, named by its `dropLabel`.
- The up and down arrows read a stage (its count, its share, what it lost), Escape leaves; a table gives screen readers every figure.
