# TimeRangePicker

A range of time as people say it ("Last 24 hours", "Today"), which stays true as time goes by: chosen in two clicks or its ends set one by one, and refreshed by a press or on a timer (`AutoRefresh`, also alone beside a page's title).

**You provide** for `TimeRangePicker`: `value` / `defaultValue` / `onChange` (`{ from, to }`, each `now`, `now` moved and rounded as `now-15m` or `now/d`, or an ISO moment), `onRefresh` (on Refresh, on each new range, and on the timer), `loading` (formerly `isLoading`); `commonlyUsed` (`[{ label, range }]`, in place of the usual ones), `refresh` with `onRefreshChange` (`{ interval, paused }`, in ms), `locale` and `weekStartsOn` where they differ from IoitiProvider's (en-GB and Monday by default), whose words and clock it takes. Its name: a `Field` or a `FormItem` around it, else `aria-label` / `aria-labelledby`. In a form: `name`, its start then its end sent under it, as `value` writes them. `id`, `ref` (the group of its buttons), `aria-describedby`, `aria-invalid` (its frame in `negative`). For `AutoRefresh`: `value`, `onChange`, `onRefresh`.

```tsx
<TimeRangePicker value={range} onChange={setRange} onRefresh={load} loading={loading}
  refresh={refresh} onRefreshChange={setRefresh} />
<AutoRefresh value={every} onChange={setEvery} onRefresh={reload} />
```

- The calendar button opens the quick select (Last or Next so many units, the ranges commonly used, those recently used, refreshing every so often); the range opens its two ends (a moment, a time from now, now), applied with Update.
- `resolveTimeRange(range)` gives the dates it stands for now; `formatTimeRange(range)` says it in words.
- The timer waits while the page's tab is hidden, and starts again when it is back. `AutoRefresh` says how often ("Every 30 s", "Off"), its icon turning while it runs.
- A range of whole days, for a report, is a `DateRangeFilter`.

## Accessibility

A group named by its label: the quick select's button ("Quick select"), the range (a button that shows its start and its end, each then a button of its own), then Refresh or Update. The quick select and each end open a `Popover`, a dialog named by what it sets ("The start of the range"); an end's has tabs (Absolute, Relative, Now) over its `Calendar` and its fields. `AutoRefresh` is a button named by how often it refreshes ("Every 30 s"), its fields in a `Popover` too.

| Key | What it does |
|---|---|
| Enter, Space | On a button: opens its panel, the focus on its first control |
| Tab, Shift+Tab | Through a panel's controls; past its ends, closes it, the focus back on its button |
| ←, → | On an end's tabs: the tab before, the next, chosen at once |
| ←, →, ↑, ↓, Page Up, Page Down | In the calendar: as in a `Calendar` |
| Escape | Closes a panel, the focus back on its button |
