# KpiTile

The figures a page is about, in a `KpiGrid` (four across from 1280px, or the `columns` asked; two on a phone); a `Meter` is one ratio against a limit.

**You provide** for `KpiTile`: `label`, `value` (already formatted), `hint` (what it is compared to, or since when), a `Sparkline` or a `Meter` as children. For `Meter`: `ratio` (0–1), `tone`, `label`, `scale`.

```tsx
<KpiGrid>
  <KpiTile label="Amount" value={formatMoney(4210)} hint="Since midnight" />
  <KpiTile label="Storage" value="62%" hint="of 50 GB"><Meter ratio={0.62} tone="warning" label="Storage used" /></KpiTile>
</KpiGrid>
```

- The label in `small`, the figure in `figure` with proportional digits. Tiles come first on a dashboard, under the `PageHeader`.
