# SmartComparison

Several things side by side, row by row, with the differences alone on demand: plans, offers, configurations. Read by screen readers as a table.

**You provide** `plans` (`[{ id, name, tagline, price, billingPeriod?, badge?, featured?, ctaText?, onCtaClick?, href?, accent? }]`), `categories` (`[{ id, title, features: [{ id, name, description?, values, keys? }] }]`, `values` by plan id: text, `true`/`false`, or a node), `label`; `enableSearch` and `enableDiffFilter` (both on); `matrixTitle`, `countLabel`, `searchPlaceholder`, `diffLabel`, `emptyText` in the page's words.

```tsx
<SmartComparison label="Plans compared" plans={PLANS} categories={[{ id: 'use', title: 'Use', features: [
  { id: 'users', name: 'Users', values: { solo: '1', team: '10', company: 'Unlimited' } },
  { id: 'sso', name: 'Single sign-on', values: { solo: false, team: false, company: true } },
] }]} />
```

- `true` is a check in green, `false` a dash. A value given as a node needs `keys` (its text) for "Differences only" to compare it.
- The `featured` plan is set apart by a stronger border and a shadow, its `badge` and button in ink, the accent's `brand` where one is chosen. A plan's button shows only with `ctaText` or `onCtaClick`.
- Below 640px one plan is shown at a time, chosen above the rows (the featured one first). A plain list of figures is a `Table`.
