# DatePicker

A day (`DatePicker`) or a range (`DateRangePicker`) from a field and its calendar.

**You provide** `value`, `onChange`, `locale` and `weekStartsOn` where they differ from IoitiProvider's, `minDate` / `maxDate`; `aria-label` (or a `Field` or a `FormItem` around it, or `id` for its `htmlFor`), `error`. In a form: `name`, the day sent as a date field sends it (`yyyy-mm-dd`, empty while none is chosen); a range's first day, then its last, under the same name. `ref` (its button), `aria-labelledby`, `aria-describedby`, `aria-invalid`, as a native control takes them.

```tsx
<DateRangePicker value={range} onChange={setRange} />
```

- Weeks start on the locale's day and days are written as it writes them: IoitiProvider's (Monday and 14 Oct 2026 in en-GB, the default; « 14 oct. 2026 » in French).
- The day chosen is filled with `primary` (the accent's `brand` with one); today is marked, not filled.
- The calendar opens over the page, beside its field. A calendar always in sight is a `Calendar`; the ranges a page is filtered by, a `DateRangeFilter`.

## Accessibility

Its button is named by its label and the day it shows, and says it opens a dialog, and whether it is open. The calendar is that dialog ("Choose date"), not modal, holding a `Calendar`: each day named in full ("Friday, 20 November 2026"), today and the day chosen said so, the month said as it changes.

| Key | What it does |
|---|---|
| Enter, Space | On its button: opens the calendar, the focus on the day chosen (today, while none is) |
| ←, → | The day before, the next |
| ↑, ↓ | The same day a week before, a week after |
| Home, End | The first day of the week, the last |
| Page Up, Page Down | The same day a month before, a month after; a year with Shift |
| Enter, Space | Chooses the day, closes the calendar, the focus back on its button; a range closes once its last day is chosen |
| Tab, Shift+Tab | Between the days and the month's buttons; past them, closes the calendar, the focus back on its button |
| Escape | Closes it without a change, the focus back on its button |
