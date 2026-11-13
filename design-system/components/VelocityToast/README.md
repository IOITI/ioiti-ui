# VelocityToast

The toast under `useToast()`: a short message at the bottom centre, its time running out in a bar, which stops under the pointer and while the keyboard is in it.

**You provide** `open`, `onDismiss`, `title`; `description`; `variant` (`default` · `success` · `warning` · `error` · `info`); `action` (`{ label, href }` for a link, `{ label, onClick }` for a button: using it closes the toast); `duration` (ms, `4000` by default); `position` (`bottom-center` by default, or `top-left` · `top-center` · `top-right` · `bottom-left` · `bottom-right`); `showProgress`; `icon`; `wrapperClassName` to lift it above a bar fixed at the bottom.

```tsx
<VelocityToast open={open} onDismiss={() => setOpen(false)} title="Export ready" description="orders-2026-10-26.csv"
  variant="success" action={{ label: 'Open it', href: '/exports/42' }} duration={6000} />
```

- Pages call `useToast()` inside `ToastProvider`, which shows one toast at a time and sets each one's time (an error 8s, one with an action 6s). Use `VelocityToast` alone only for a toast the page drives itself.
- It draws with `surface`, `border`, `text-primary`, `text-secondary` and `shadow-elevated`; the bar is `text-primary` (the accent's `brand` under an accent). Under glass it is `glass-float`.
- It sits above dialogs and sheets and is read out politely (`role="status"`). Its close button is named "Close notification".
