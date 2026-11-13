# DataTable

Records to search, sort, filter and open, a page at a time: whole as `AdvancedDataTable`, or composed from its parts (`DataTableToolbar`, `DataTableFilters`, `DataTableContent`, `DataTablePagination`) for a page that puts its toolbar or its paging elsewhere.

**You provide** `data`, `columns` (`ColumnDef`: `id`, `header`, `accessorKey` or `accessorFn`, `cell`, `sortable`, `filterable` with `filterOptions`, `filterDisplay` `auto` · `list` · `toggle`, `align`, `defaultHidden`), `getRowId`; `defaultPageSize`; `title` and `searchPlaceholder` (on `AdvancedDataTable` or `DataTableToolbar`); `renderSubComponent` with `rowLabel` for a row that opens; `selectable` (on by default) and `selectionBasket` (`{ noun, actions }`); `state` / `onStateChange` to keep the search, filters, sort and page in the address; `isLoading`, `error`, `emptyTitle`, `emptyDescription`.

```tsx
<AdvancedDataTable title="Orders" data={orders} columns={COLUMNS} getRowId={(o) => o.id} defaultPageSize={5}
  searchPlaceholder="Find an order or a customer" rowLabel={(o) => `order ${o.id}`}
  selectionBasket={{ noun: ['order', 'orders'], actions: [{ id: 'compare', label: 'Compare', href: '/compare' }] }} />

<DataTable data={orders} columns={COLUMNS} getRowId={(o) => o.id} selectable={false}>
  <DataTableToolbar title="Orders" />
  <DataTableFilters />
  <DataTableContent />
  <DataTablePagination />
</DataTable>
```

- The filters are one group of buttons: a list to tick for a column (each option with the rows it would leave, a search past seven), two options an on/off pair. Give the pair labels that say themselves ("Online", "In shop").
- Below 640px its rows become cards. A selection shows the basket of what can be done with it, under the table.
- Drawn as a panel: `surface` at half its strength, `border` at 70%, `radius-2xl`; `glass-card` under glass. A short list with no search or pages is a plain `Table`.
