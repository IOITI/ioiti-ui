# RouterLeaveGuard

Asks before a page is left with changes not saved: another page of the application (a dialog, Stay or Leave), or the tab closed or reloaded (the browser's own question). Beside a `SaveBar`, with the same `when`.

**You provide** `when` (there is something to lose); `within` (the address under which the page's views share one draft: `/settings` for `/settings/mail` and `/settings/billing`), `allowed(pathname)` (where it may go without asking: the sign-in page a lapsed session is sent to); `title`, `message`, `stayLabel`, `leaveLabel`.

```tsx
<SaveBar open={dirty} message="1 unsaved change" onDiscard={discard} onSave={save} />
<RouterLeaveGuard when={dirty} allowed={(pathname) => pathname === '/sign-in'} />
```

- A change of the query or of the part shown is no leaving. Nothing listens while `when` is false.
- It needs a data router (`createBrowserRouter`), whose navigations can wait; it is in `ioiti-ui/react-router`.
- The dialog is a small `SettleModal`: Leave is destructive, Stay the primary button; Escape stays.
