# Toast

The toast under `useToast()`: a short message at the bottom centre, its time running out in a bar, which stops under the pointer and while the keyboard is in it.

**You provide** `open`, `onDismiss`, `title`; `description`; `tone` (a `StatusTone`: `neutral` by default · `info` · `success` · `warning` · `danger`); `action` (`{ label, href }` for a link, `{ label, onClick }` for a button: using it closes the toast); `duration` (ms, `4000` by default); `position` (`bottom-center` by default, or `top-left` · `top-center` · `top-right` · `bottom-left` · `bottom-right`); `showProgress`; `icon`; `wrapperClassName` to lift it above a bar fixed at the bottom.

```tsx
<Toast open={open} onDismiss={() => setOpen(false)} title="Export ready" description="orders-2026-10-26.csv"
  tone="success" action={{ label: 'Open it', href: '/exports/42' }} duration={6000} />
```

- Pages call `useToast()` inside `ToastProvider`, which shows one toast at a time and sets each one's time (a `danger` 8s, one with an action 6s). Use `Toast` alone only for a toast the page drives itself.
- It draws with `surface`, `border`, `text-primary`, `text-secondary` and `shadow-elevated`; the bar is `text-primary` (the accent's `brand` under an accent). Under glass it is `glass-float`.
- It sits above dialogs and sheets and is said by a screen reader as it comes: its frame is a live region there before its words (`status`, `alert` for a `danger`, said at once); in `ToastProvider`, the provider's regions, there from the start, say it. Its close button is named "Close notification", in IoitiProvider's language.
- Formerly `VelocityToast`, removed in 1.0: `npx ioiti-ui-codemod` rewrites it.
