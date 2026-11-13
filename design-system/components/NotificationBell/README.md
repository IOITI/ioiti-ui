# NotificationBell

What happened while the page was open, newest first, each leading to where it is dealt with; only what is urgent pulses.

**You provide** `notifications` (`[{ id, message, detail?, timestamp, read, href?, tone?, action? }]`, `tone` being `neutral` · `info` · `success` · `warning` · `danger`, `timestamp` a `Date` said from now or words), `onMarkAsRead`; `onMarkAllAsRead`; `footer`; `loading` while they are read; `error` (`true` or your words) with `onRetry`; `showCount`; `isOpen` / `onOpenChange`; `triggerClassName`.

```tsx
<NotificationBell notifications={items} onMarkAsRead={markRead} onMarkAllAsRead={markAllRead}
  loading={isPending} error={isError} onRetry={refetch} />
```

- Never "No notifications" before it knows: `loading` shows rows to come, `error` says they could not be read, with a Try again.
- An entry with an `href` is a link (the application's); followed, it is marked read and the list closes. Its list is a layer of the page, placed under the bell: the focus goes into it; Escape, a press elsewhere or a Tab past its ends closes it and gives the bell the focus back.
- Give each entry a `tone`: an unread one without it is drawn as `danger`, which pulses. An error is `negative`.
- It sits at the end of the top bar, drawn as an `IconButton`. Under glass its list is `glass-float`.
