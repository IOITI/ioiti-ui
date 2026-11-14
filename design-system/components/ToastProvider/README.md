# ToastProvider

Toasts: one at a time at the bottom centre, each for its whole time, shown with `useToast()` from inside `ToastProvider`.

**You provide** `ToastProvider` once around the application (`RouterRoot` includes it); then `toast({ title, description?, variant?, action? })`, `variant` being `default` · `success` · `warning` · `error` · `info`, `action` a link or a button.

```tsx
const toast = useToast()
toast({ title: 'Settings saved', variant: 'success' })
```

- The title is what was done, in a past participle ("Settings saved", "Project deleted"); one sentence more if needed.
- An error stays 8s, a toast with an action 6s, its time stopping under the pointer. When others wait, the one shown moves along faster.
- Under glass a toast is `glass-float`.
