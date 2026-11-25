# NotificationBell

What happened while the page was open, newest first, each leading to where it is dealt with; only what is urgent pulses.

**You provide** `notifications` (`[{ id, message, detail?, timestamp, read, href?, tone?, action? }]`, `tone` being `neutral` · `info` · `success` · `warning` · `danger`, `timestamp` a `Date` said from now or words), `onMarkAsRead`; `onMarkAllAsRead`; `footer`; `loading` while they are read; `error` (`true` or your words) with `onRetry`; `showCount`; `open` / `defaultOpen` with `onOpenChange` (formerly `isOpen`); `triggerClassName`.

```tsx
<NotificationBell notifications={items} onMarkAsRead={markRead} onMarkAllAsRead={markAllRead}
  loading={isPending} error={isError} onRetry={refetch} />
```

- Never "No notifications" before it knows: `loading` shows rows to come, `error` says they could not be read, with a Try again.
- An entry with an `href` is a link (the application's); followed, it is marked read and the list closes. Its list is a layer of the page, placed under the bell; a press elsewhere closes it.
- Give each entry a `tone`: an unread one without it is drawn as `danger`, which pulses. An error is `negative`.
- It sits at the end of the top bar, drawn as an `IconButton`. Under glass its list is `glass-float`.

## Accessibility

The bell is named by what is unread ("3 unread notifications", or "Notifications") and says whether its list is open. The list is a dialog ("Notifications"), not modal, which says it is reading them while `loading`. An entry that leads somewhere is a link; Read all, Close and each entry's Mark as read are buttons. A button that goes once pressed (an entry read, or every one) leaves the focus in the list: on the first control of an entry after its own, else on the list itself, whose keys stay its own.

| Key | What it does |
|---|---|
| Enter, Space | On the bell: opens the list, the focus on its first control |
| Tab, Shift+Tab | Through its buttons and its entries' links; past its ends, closes the list, the focus back on the bell |
| Enter | On an entry's link: follows it, marks it read and closes the list |
| Enter, Space | On Mark as read: marks the entry read, the focus on the next entry's link or button, else on the list. On Read all: marks them all read, the focus on the list |
| Escape | Closes the list, the focus back on the bell |
