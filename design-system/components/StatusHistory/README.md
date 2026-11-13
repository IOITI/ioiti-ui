# StatusHistory

The uptime strip: one block per slot of time, coloured by its state, and the whole said in words for a screen reader.

**You provide** `slots` (`[{ status, at }]`, the oldest first: `status` as `StatusBadge`'s, `at` the slot's time as read, "14:00"), `label` (what it is the history of); `unit` (`{ one, other }`, hour and hours by default); `summary` to say it in your own words; `scale` (its two ends, "24 h ago" and "Now").

```tsx
<StatusHistory label="API, the last 24 hours" slots={hours} scale={['24 h ago', 'Now']} />
```

- Up is `positive`, degraded `warning`, down `negative`, unknown and disabled the foreground at 15% and 10%.
- A screen reader hears one picture: "API, the last 24 hours: 23 hours up, 1 degraded at 14:00", the worst states first. The blocks take no focus.
- In a `Panel` that says what runs; a `StatusBadge` says its state now.
