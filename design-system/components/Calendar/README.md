# Calendar

A month of days to choose a day or a range from, always open: in a panel or beside a list, where a `DatePicker`'s field would hide it.

**You provide** `mode` (`single` by default · `range`), `value` / `defaultValue`, `onChange` (a `Date` or `null`; in `range`, a `DateRange`, `{ from, to }`); `locale="en-GB"`, `weekStartsOn={1}`; `defaultMonth` (the month shown first); `minDate` / `maxDate` and `isDateDisabled(day)` for the days that cannot be chosen.

```tsx
<Calendar mode="range" value={range} onChange={setRange} locale="en-GB" weekStartsOn={1} />
```

- The arrows move by a day, Home and End to the week's ends, Page Up and Page Down by a month (a year with Shift); the month's name is said as it changes.
- In `range`, a first press sets the start and a second the end, the days between filled as the pointer moves.
- The day chosen is filled with `primary` (the accent's `brand` with one); today is marked, not filled. The months past `minDate` and `maxDate` cannot be reached.
