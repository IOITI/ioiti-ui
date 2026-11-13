# BarList

Things ranked by a figure, a row each: its label, its bar and the figure; a row may lead to what it counts.

**You provide** `items` (`[{ label, value, href?, tone? }]`, `tone` one of `neutral` · `positive` · `warning` · `negative`), `label` (the list's name for a screen reader); `max` (the value of a full bar, the largest value otherwise), `format` (`formatNumber` by default).

```tsx
<BarList label="Returns by reason" items={[
  { label: 'Too small', value: 42, href: '/returns?reason=too-small' },
  { label: 'Not as described', value: 28 },
  { label: 'Damaged on the way', value: 17, tone: 'negative' },
]} />
```

- The bar is `foreground` at 70 % on a track of it at 10 % (the accent's `brand` with one); a tone fills it in `positive`, `warning` or `negative` on a track of the same at 15 %.
- A row with `href` is a link, drawn by the application's `LinkProvider`. Labels in `text-secondary`, figures in `text-primary` with `tabular-nums`; the bar itself is hidden from screen readers.
- Values read against an axis, or over categories: a `BarChart`. A piece of work under way: a `ProgressBar`.
