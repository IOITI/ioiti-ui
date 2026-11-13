# ProgressBar

How far a piece of work has come, in words beside the bar and for a screen reader; in a tone when it goes wrong; breathing when its length is unknown. `BarList` ranks values as bars.

**You provide** `label`, `value`, `max`; `valueText` ("42 of 120 files"); `tone` (`neutral` · `positive` · `warning` · `negative`); `size` (`sm` · `md`). Without a `value`, it is indeterminate.

```tsx
<ProgressBar label="Importing the files" value={42} max={120} valueText="42 of 120 files" />
```

- The fill is `primary` (the accent's `brand` with one). A ratio against a limit, not a piece of work, is a `Meter` in a `KpiTile`.
