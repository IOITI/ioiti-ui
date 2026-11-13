# RelativeTime

A moment said from now ("3 min ago", "in 2 h"), kept true as time goes by, its full date in a hint and for a screen reader.

**You provide** `value` (a `Date`, milliseconds or an ISO string); `timeZone` for the full date (the browser's otherwise); `past` for a moment that has happened, taken on a clock a little ahead of this one (a server's).

```tsx
<span>Imported <RelativeTime value={job.finishedAt} timeZone="Europe/Paris" /></span>
<span>Received <RelativeTime value={message.receivedAt} past /></span>
```

- It is said again each second under a minute, each minute under two days, each hour after; every time on a page shares one clock for each precision.
- With `past`, a moment a few seconds ahead is said "0 s ago", never "in 2 s".
- A date that does not move with the clock is written with `formatDateTime`.
