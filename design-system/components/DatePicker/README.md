# DatePicker

A day (`DatePicker`) or a range (`DateRangePicker`) from a field and its calendar; `Calendar` alone; `DateRangeFilter` for the ranges a page is filtered by.

**You provide** `value`, `onChange`, `locale="en-GB"`, `weekStartsOn={1}`; for `DateRangeFilter`, `presets` (`[{ label, days }]` or `[{ label, range }]`), `maxDate` (the last day there is data for), `allTime`.

```tsx
<DateRangePicker value={range} onChange={setRange} locale="en-GB" weekStartsOn={1} />
```

- Weeks start on Monday; days are written as en-GB writes them (14 Oct 2026).
- The day chosen is filled with `primary` (the accent's `brand` with one); today is marked, not filled.
