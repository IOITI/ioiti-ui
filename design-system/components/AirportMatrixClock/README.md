# AirportMatrixClock

The time of a few cities, as a departures board of dot-matrix characters; small, two of them fit beside a page's title.

**You provide** `cities` (one to five, `[{ id, name, timeZone }]`, an IANA zone each); `title` (`null` for none); `footer` in the page's words; `size` (`md` · `sm`); `format` (`24h` · `12h`), `showSeconds`, `updateInterval` (1000ms by default).

```tsx
<PageHeader title="Dashboard" actions={
  <AirportMatrixClock size="sm" title={null} cities={[
    { id: 'paris', name: 'Paris', timeZone: 'Europe/Paris' },
    { id: 'new-york', name: 'New York', timeZone: 'America/New_York' },
  ]} />
} />
```

- It keeps its own time. A row's characters flip under the pointer, not where motion is reduced; a screen reader hears the times and the cities.
- Its board is a light grey or a dark grey of its own, with a `border`, `radius-xl`; the characters in `text-primary`, the footer in `text-muted`. Under glass it is `glass-card`.
- Give `title` and `footer` in the page's words: the defaults are "WORLD CLOCK" and "N CITIES / IANA TIME ZONES".
