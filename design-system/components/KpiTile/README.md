# KpiTile

The figures a page is about, in a `KpiGrid` (four across from 1280px, or the `columns` asked; two on a phone): a lead tile two columns wide, each change in the tone of what it means, a tile that needs attention tinted and saying why; a `Meter` is one ratio against a limit.

**You provide** for `KpiTile`: `label`, `value` (already formatted), `hint` (what it is out of, or since when), a `Sparkline` or a `Meter` as children; `change` (a percentage: `2.5` is "+2.5%"), `goodWhen` (`up` · `down`: down for a cost, a latency), `changeFormat` for another unit; `lead`; `tone` (`warning` · `negative`) always with its `toneLabel`. For `KpiGrid`: `columns`, `period` (what the changes are compared with). For `Meter`: `ratio` (0–1), `tone`, `label`, `scale`.

```tsx
<KpiGrid period="Compared with yesterday">
  <KpiTile lead label="Revenue" value={formatMoney(12400)} change={8.4}><Sparkline values={day} /></KpiTile>
  <KpiTile label="Median delivery" value="2.4 days" change={-6.1} goodWhen="down" />
  <KpiTile label="Disk" value="91%" tone="warning" toneLabel="Near the limit"><Meter ratio={0.91} tone="warning" label="Disk used" /></KpiTile>
</KpiGrid>
```

- The label in `small`, the figure in `figure` with proportional digits. Tiles come first on a dashboard, under the `PageHeader`.
- A change is signed, an arrow its way, in `positive` or `negative` by its meaning; a screen reader hears "up 8.4%". Say the period once, with `period`, not in every tile.
- A lead tile takes two columns, its chart beside the figure from 640px; on a phone it is a whole row.
- A tone is a 5% tint of `warning` or `negative` and its word with a dot: never the colour alone.
- Under glass a tile is `glass-tile` with a lit edge: frosted, blurred 24px; in light, lit from above with a glow of the accent from a corner that changes from tile to tile.
