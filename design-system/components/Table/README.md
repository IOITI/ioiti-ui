# Table

The plain table of the pages: `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`, in two densities.

**You provide** `aria-label` (every table is named), the rows; `density="dense"` for figures side by side (compact is the default, for records in a panel); `numeric` on the cells of figures.

```tsx
<Table aria-label="Latest orders">
  <TableHead><TableRow><TableHeaderCell>Order</TableHeaderCell><TableHeaderCell numeric>Amount</TableHeaderCell></TableRow></TableHead>
  <TableBody>{orders.map((o) => <TableRow key={o.id}><TableCell className="font-mono">{o.id}</TableCell><TableCell numeric>{formatMoney(o.amount)}</TableCell></TableRow>)}</TableBody>
</Table>
```

- Figures go right, in `tabular-nums`; ids in `mono`; the head in `small`, `muted-foreground`.
- Rows are apart by `border` at 40%. Wider than the page, a table scrolls sideways in its own frame. Sorting, filters and pages: `DataTable`.
- Nothing to show: an `EmptyState` across its columns (compact).
