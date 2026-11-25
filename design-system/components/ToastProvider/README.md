# ToastProvider

Toasts: one at a time at the bottom centre, each for its whole time, shown with `useToast()` from inside `ToastProvider`.

**You provide** `ToastProvider` once around the application (`RouterRoot` includes it); then `toast({ title, description?, tone?, action? })`, `tone` a `StatusTone` (`neutral` by default · `info` · `success` · `warning` · `danger`), `action` a link or a button.

```tsx
const toast = useToast()
toast({ title: 'Settings saved', tone: 'success' })
```

- The title is what was done, in a past participle ("Settings saved", "Project deleted"); one sentence more if needed.
- What went wrong (`danger`) stays 8s, a toast with an action 6s, its time stopping under the pointer. When others wait, the one shown moves along faster.
- Under glass a toast is `glass-float`.
- A screen reader says each toast as it comes, in two live regions the provider holds from the start: politely, a `danger` at once (`role="alert"`). A test finds a toast in them: `within(screen.getByRole('status'))`.
