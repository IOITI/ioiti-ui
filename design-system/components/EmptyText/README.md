# EmptyText

One quiet line where a list or a panel has nothing to show, saying what would be there; `ErrorText` says what went wrong with an action, under its button.

**You provide** the words as `children`; `className` (`py-4` for a closer line). `ErrorText` takes the same.

```tsx
{orders.length === 0 && <EmptyText>No order yet today: they appear here as they are placed.</EmptyText>}
<Button onClick={send}>Send the invoice</Button>
{error && <ErrorText>Could not send the invoice: the mail server does not answer.</ErrorText>}
```

- `EmptyText` is centred, `text-sm`, `muted-foreground`. A heading, a reason and a way to something make an `EmptyState`.
- `ErrorText` is `negative` and read out at once (`role="alert"`): what failed and why, in a sentence. A page that could not load says so with `QueryState`.
