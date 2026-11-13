# DateRangeFilter

The range of days a page is filtered by: the ranges people ask for first, as buttons, then a calendar for any other.

**You provide** `value`, `onChange` (a `DateRange`, `{ from, to }`); `presets` (`[{ label, days }]` or `[{ label, range }]`; the last 7, 30 and 90 days by default), `allTime` (an "All time" button, on by default), `today` (the day presets of days end on: the last day there is data for), `minDate` / `maxDate` (the days the calendar offers).

```tsx
<DateRangeFilter value={range} onChange={setRange} allTime={false}
  today={lastDataDay} maxDate={lastDataDay}
  presets={[{ label: 'Last week of data', days: 7 }]} />
```

- The range shown is the one button filled (`primary`, the accent's `brand` with one), pressed for a screen reader; the others are outline.
- Any other range is chosen on a `DateRangePicker` after the buttons ("Custom range" while empty): weeks start on Monday, days are written as en-GB writes them.
- `lastDays(30)` gives a range to start from, `ALL_TIME` the open one, `rangeParams(range)` the `from` / `to` days for an API.
