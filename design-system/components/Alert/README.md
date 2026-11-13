# Alert

A message in the page, by tone; danger and warning are read out at once.

**You provide** `tone` (`neutral` · `info` · `success` · `warning` · `danger`), `AlertTitle` and `AlertDescription` as children; `action` (a small outline button); `dismissible`.

```tsx
<Alert tone="warning" action={<Button size="sm" variant="outline">Review</Button>}>
  <AlertTitle>Three orders wait for a review</AlertTitle>
  <AlertDescription>They are held until someone looks at them.</AlertDescription>
</Alert>
```

- The title says what happened; the description why, or what happens next. A failed load says so above what is still on screen (`QueryState`).
- For what an action just did, a toast; for what went wrong with it, `ErrorText` under its button.
