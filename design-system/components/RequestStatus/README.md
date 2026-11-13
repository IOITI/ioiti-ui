# RequestStatus

Follows something asked to its outcome (asked, sent, done, refused, or no news) in a card that watches and acts on nothing.

**You provide** `status` (`processing` · `verifying` · `success` · `failed` · `unknown`), `title` and `description` for each step in your words; `subject` (what it is about, in a pill); `figures` (`[{ label, value }]`, once known); `reference` (`{ label, value }`, copied on a click); `link` (`{ href, label }`, drawn by the application's link); `onDismiss` for a Close button.

```tsx
<RequestStatus status="success" title="Refunded" description="The customer gets 42.00 € back in two to three days."
  subject="Refund · order 2026-0042" figures={[{ label: 'Amount', value: '42.00 €' }]}
  reference={{ label: 'Refund', value: 'RF-88213' }} link={{ href: '/orders/2026-0042', label: 'See the order' }} />
```

- It has no Retry: what to do next is the page's. `unknown` says there was no answer, never that it failed.
- The words are read out as they change (`role="status"`). The spinners stand still where motion is reduced.
- Sending turns in the text's colour (the accent's `brand` under an accent), waiting in sky, done in emerald, refused in rose. Under glass the card is `glass-card`.
