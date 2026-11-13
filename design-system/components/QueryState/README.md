# QueryState

The three states of data a page fetches: loading shows the shape of what comes (a skeleton as high as it will be), a failure says what went wrong, a failed refresh keeps what is on screen and says so above it.

**You provide** `isPending`, `error`, `hasData`, a `skeleton` shaped like the content, and the content as `children`.

```tsx
<QueryState isPending={query.isPending} error={query.error} hasData={!!query.data}
  skeleton={<KpiGrid>{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[7.5rem] rounded-2xl" />)}</KpiGrid>}>
  <KpiGrid>…</KpiGrid>
</QueryState>
```
