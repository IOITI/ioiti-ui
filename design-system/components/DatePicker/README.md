# DatePicker

A day (`DatePicker`) or a range (`DateRangePicker`) from a field and its calendar.

**You provide** `value`, `onChange`, `locale` and `weekStartsOn` where they differ from IoitiProvider's, `minDate` / `maxDate`; `aria-label` (or a `Field` or a `FormItem` around it, or `id` for its `htmlFor`), `error`. In a form: `name`, the day sent as a date field sends it (`yyyy-mm-dd`, empty while none is chosen); a range's first day, then its last, under the same name. `ref` (its button), `aria-labelledby`, `aria-describedby`, `aria-invalid`, as a native control takes them.

```tsx
<DateRangePicker value={range} onChange={setRange} />
```

- Weeks start on the locale's day and days are written as it writes them: IoitiProvider's (Monday and 14 Oct 2026 in en-GB, the default; « 14 oct. 2026 » in French).
- The day chosen is filled with `primary` (the accent's `brand` with one); today is marked, not filled.
- The calendar opens over the page, beside its field, the focus on the day to choose; Escape closes it. A calendar always in sight is a `Calendar`; the ranges a page is filtered by, a `DateRangeFilter`.
