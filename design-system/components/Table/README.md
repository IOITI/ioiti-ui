# Table

The plain table of the pages: `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`, in three densities.

**You provide** `aria-label` (every table is named), the rows; `density="dense"` for figures side by side (`regular` is the default, for records in a panel; `compact`, the same in `small`, only for a screen of data that asks for it); `numeric` on the cells of figures.

```tsx
<Table aria-label="Latest orders">
  <TableHead><TableRow><TableHeaderCell>Order</TableHeaderCell><TableHeaderCell numeric>Amount</TableHeaderCell></TableRow></TableHead>
  <TableBody>{orders.map((o) => <TableRow key={o.id}><TableCell className="font-mono">{o.id}</TableCell><TableCell numeric>{formatMoney(o.amount)}</TableCell></TableRow>)}</TableBody>
</Table>
```

- The rows in `body` (14px), the head in `small`, `muted-foreground`. Figures go right, in `tabular-nums`; ids in `mono`.
- Rows are apart by `border` at 40%. Wider than the page, a table scrolls sideways in its own frame. Sorting, filters and pages: `DataTable`.
- Nothing to show: an `EmptyState` across its columns (`density="compact"`).
