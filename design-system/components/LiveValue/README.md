# LiveValue

A figure that changes as it is watched (a price, a queue's length): each change shows in its tone a moment, then fades back; muted, and said stale, once what sends it stops.

**You provide** `value` (a number, `null` while there is none); `format`; `invert` where down is good (a delay, a cost); `stale` with `staleLabel`; `flash={false}` to keep the tones off.

```tsx
<LiveValue value={price} format={(v) => v.toLocaleString('en-GB', { minimumFractionDigits: 2 })} stale={!connected} />
<LiveValue value={queue} invert />
```

- Up in `positive`, down in `negative`, for 0.6s, then a fade of 0.5s. A fade, not a movement, so it stays where motion is reduced.
- Stale, it is `text-muted`. Digits of one width (`tabular-nums`), so the figure does not jump.
- For a signed amount, use `SignedValue`; for a count that rolls its digits, `AnimatedNumber`.
