# TimeRangePicker

A range of time as people say it ("Last 24 hours", "Today"), which stays true as time goes by: chosen in two clicks or its ends set one by one, and refreshed by a press or on a timer (`AutoRefresh`, also alone beside a page's title).

**You provide** for `TimeRangePicker`: `value` / `defaultValue` / `onChange` (`{ from, to }`, each `now`, `now` moved and rounded as `now-15m` or `now/d`, or an ISO moment), `onRefresh` (on Refresh, on each new range, and on the timer), `isLoading`; `commonlyUsed` (`[{ label, range }]`, in place of the usual ones), `refresh` with `onRefreshChange` (`{ interval, paused }`, in ms), `locale` (`en-GB`), `weekStartsOn` (`1`). For `AutoRefresh`: `value`, `onChange`, `onRefresh`.

```tsx
<TimeRangePicker value={range} onChange={setRange} onRefresh={load} isLoading={loading}
  refresh={refresh} onRefreshChange={setRefresh} />
<AutoRefresh value={every} onChange={setEvery} onRefresh={reload} />
```

- The calendar button opens the quick select (Last or Next so many units, the ranges commonly used, those recently used, refreshing every so often); the range opens its two ends (a moment, a time from now, now), applied with Update.
- `resolveTimeRange(range)` gives the dates it stands for now; `formatTimeRange(range)` says it in words.
- The timer waits while the page's tab is hidden, and starts again when it is back. `AutoRefresh` says how often ("Every 30 s", "Off"), its icon turning while it runs.
- A range of whole days, for a report, is a `DateRangeFilter`.
