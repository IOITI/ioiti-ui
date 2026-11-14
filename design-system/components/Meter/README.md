# Meter

One ratio against a limit, as a bar: a disk filled, a quota used, an error budget spent; under a `KpiTile`'s figure, or on a row of its own beside the figure it draws.

**You provide** `ratio` (0–1, held to it), `label` (what it measures, for a screen reader: "Disk used"); `tone` (`neutral` · `positive` · `warning` · `negative`, `neutral` by default); `scale` (what its two ends stand for, written under it: `['0', '50 GB']`).

```tsx
<KpiTile label="Disk" value="91%" hint="of 50 GB" tone="warning" toneLabel="Near the limit">
  <Meter ratio={0.91} tone="warning" label="Disk used" scale={['0', '50 GB']} />
</KpiTile>
```

- The fill is `foreground` at 70 % (the accent's `brand` with one), or the tone's `positive`, `warning`, `negative`; its track a faint step of the same colour, so the state reads across the whole bar.
- The figure is written beside it, by its tile or its row: the bar shows the ratio, the words say it. A screen reader hears a meter and its value in percent.
- Its tone follows thresholds the page knows (warning near the limit, negative past it). A new ratio slides to its place, at once where motion is reduced.
- A piece of work under way is a `ProgressBar`; things ranked by a figure, a `BarList`.
