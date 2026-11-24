# DatePicker

A day (`DatePicker`) or a range (`DateRangePicker`) from a field and its calendar.

**You provide** `value`, `onChange`, `locale` and `weekStartsOn` where they differ from IoitiProvider's, `minDate` / `maxDate`; `aria-label` (or a `Field` around it, or `id` for its `htmlFor`), `error`.

```tsx
<DateRangePicker value={range} onChange={setRange} />
```

- Weeks start on the locale's day and days are written as it writes them: IoitiProvider's (Monday and 14 Oct 2026 in en-GB, the default; « 14 oct. 2026 » in French).
- The day chosen is filled with `primary` (the accent's `brand` with one); today is marked, not filled.
- The calendar opens over the page, beside its field, the focus on the day to choose; Escape closes it. A calendar always in sight is a `Calendar`; the ranges a page is filtered by, a `DateRangeFilter`.
