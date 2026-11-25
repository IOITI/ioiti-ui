# Calendar

A month of days to choose a day or a range from, always open: in a panel or beside a list, where a `DatePicker`'s field would hide it.

**You provide** `mode` (`single` by default · `range`), `value` / `defaultValue`, `onChange` (a `Date` or `null`; in `range`, a `DateRange`, `{ from, to }`); `locale` and `weekStartsOn` where they differ from IoitiProvider's (en-GB and Monday by default); `defaultMonth` (the month shown first); `minDate` / `maxDate` and `isDateDisabled(day)` for the days that cannot be chosen.

```tsx
<Calendar mode="range" value={range} onChange={setRange} />
```

- In `range`, a first press sets the start and a second the end, the days between filled as the pointer moves.
- The day chosen is filled with `primary` (the accent's `brand` with one); today is marked, not filled. The months past `minDate` and `maxDate` cannot be reached.

## Accessibility

A grid named by its month ("November 2026"), the month's name said as it changes; each day a button named in full ("Friday, 20 November 2026"), today said current, the day or the days chosen said selected, a day that cannot be chosen said dimmed. The grid is one stop of the keyboard, on the day chosen (today, while none is); the keys stop at `minDate` and `maxDate`. The months before and after are buttons of their own.

| Key | What it does |
|---|---|
| ←, → | The day before, the next |
| ↑, ↓ | The same day a week before, a week after |
| Home, End | The first day of the week (the locale's), the last |
| Page Up, Page Down | The same day a month before, a month after |
| Shift+Page Up, Shift+Page Down | The same day a year before, a year after |
| Enter, Space | Chooses the day; in `range`, the first its start, the second its end |
