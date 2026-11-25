# ActivityHeatmap

Days on a calendar, or weekday by hour: signed values take two scales (gains in teal, losses in red), each step one size on either side, and a cell with nothing is not a cell of zero.

**You provide** `aria-label`. For days: `data` (`[{ date: 'YYYY-MM-DD', value, detail? }]`), `weeks` (the most shown, `53` by default), `startDate`, `endDate`, `weekStart` (`0` Sunday … `6` Saturday; IoitiProvider's first day by default). For hours: `mode="hours"`, `matrix` (a row per `rowLabels`, a column per `hours`, `null` for a cell with nothing), `details`. Then `diverging` (`{ positive, negative }`, four colours each) for signed values or `color` for one scale; `format`, or `unit`; `summary`, `emptyText`, `legend` (the catalogue's "Less" and "More" by default), `minCell`, `animated`.

```tsx
<ActivityHeatmap aria-label="Result of each day" data={days} weeks={21} weekStart={1} legend={['Loss', 'Gain']}
  diverging={{
    positive: ['var(--chart-gain-1)', 'var(--chart-gain-2)', 'var(--chart-gain-3)', 'var(--chart-gain-4)'],
    negative: ['var(--chart-loss-1)', 'var(--chart-loss-2)', 'var(--chart-loss-3)', 'var(--chart-loss-4)'],
  }}
  format={(value) => formatMoney(value, 'EUR', true)} />
```

- One scale is `chart-series` in four steps of strength (the accent's with one); signed values take `chart-gain-1…4` and `chart-loss-1…4`, given as `diverging`. A cell with nothing is a faint grey.
- Above the grid, the total (or `summary`) and the best and worst cell (the peak, on one scale); below it, the legend's steps between its two words.
- The arrow keys move from cell to cell and Escape leaves; a cell's figure, with its `detail`, is in a tooltip and said to screen readers. Narrow, it drops its oldest weeks before a cell gets smaller than `minCell`.

## Accessibility

An image named by its `aria-label` (its summary, without one) and a stop of the keyboard: its arrows go from cell to cell, from the first of its newest column, each cell said as it is reached (its day or its hour, its figure, its `detail`).

| Key | What it does |
|---|---|
| ←, → | The column before, the next: a week, or an hour |
| ↑, ↓ | The row above, below: a day of the week, or a row of `rowLabels` |
| Escape | Hides the tooltip |
