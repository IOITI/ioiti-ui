# Sparkline

The trend of a figure, small and without axes, in a `KpiTile` or a table's cell; its colour says the direction.

**You provide** `label`, `values`, `width`, `height`; `tone` (`positive` where down is good, `neutral` for no direction); `variant="bars"` (bars start at zero, a loss below).

```tsx
<Sparkline label="Orders per day" values={[160, 172, 168, 190, 184, 201, 209]} width={180} height={32} />
```
