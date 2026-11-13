# LiveLineChart

A value as it arrives, over the last minutes: the line scrolls, a frame only when it moves, and a pause, or the pointer over it, holds it still for reading.

**You provide** `source` (called once with `push(value, time?)`, it returns what stops the feed), `ariaLabel`, `formatValue`; `initial` (values already known, `intervalMs` apart and ending now) or `initialPoints` (`[{ t, v }]`), `intervalMs` (`1000` by default), `windowSeconds` (`60` by default), `height`, `formatChange` (the change over the window), `formatTick`, `domain`, `unit`, `color`, `showReadout`.

```tsx
const feed = (push: (value: number) => void) => {
  const socket = new WebSocket(url)
  socket.onmessage = (event) => push(Number(event.data))
  return () => socket.close()
}
<LiveLineChart ariaLabel="Response time" source={feed} windowSeconds={60} height={180}
  formatValue={(v) => `${v.toFixed(1)} ms`} formatChange={(c) => `${c > 0 ? '+' : c < 0 ? '−' : ''}${Math.abs(c).toFixed(1)} ms`} />
```

- The line is `chart-series` (the accent's with one) over a fading area of it; the zero line is `chart-axis` while zero is in view. The change over the window is in `positive` or `negative`, with its arrow.
- Live and Paused are a toggle button above it. It draws only while on screen and its tab is shown; where motion is reduced, it moves a step per reading.
- Values over hours or days, or several series: a `LineChart`.
