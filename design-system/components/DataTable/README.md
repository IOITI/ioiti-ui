# DataTable

Records to search, sort, filter and open, a page at a time: whole as `AdvancedDataTable`, or composed from its parts (`DataTableToolbar`, `DataTableFilters`, `DataTableContent`, `DataTablePagination`) for a page that puts its toolbar or its paging elsewhere.

**You provide** `data`, `columns` (`ColumnDef`: `id`, `header`, `accessorKey` or `accessorFn`, `cell`, `sortable`, `filterable` with `filterOptions`, `filterDisplay` `auto` · `list` · `toggle`, `align`, `defaultHidden`), `getRowId`; `defaultPageSize`; `title` and `searchPlaceholder` (on `AdvancedDataTable` or `DataTableToolbar`); `renderSubComponent` with `rowLabel` for a row that opens; `selectable` (on by default) and `selectionBasket` (`{ noun, actions }`); `state` / `onStateChange` to keep the search, filters, sort and page in the address; `loading` (formerly `isLoading`), `error`, `emptyTitle`, `emptyDescription`.

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

## Accessibility

A table whose sortable columns say how they sort, their headings buttons. Each row's box and its arrow are named after it with `rowLabel` ("Select order IT-1042", "Open order IT-1042"), the box of the page's rows said mixed while some are ticked. The filters are a group: a list's button says how many options it has, or how many are ticked; an on/off pair's buttons say the column they filter, and whether they are pressed. While it loads, it says so ("Loading the records"). Its pages are buttons named by where they lead ("First page"), and a select of how many rows a page holds.

| Key | What it does |
|---|---|
| Enter, Space | On a column's heading: sorts by it, up, then down, then not |
| Space | On a box: ticks the row, or every row of the page |
| Enter, Space | On a row's arrow: opens it, or closes it |
| Enter, Space | On a filter's button: opens its list, the focus in its search (on its first option, without one) |
| Space | In a filter's list: ticks the option, or unticks it |
| Enter, Space | On Columns shown: opens the list of columns, each a box |
| Tab, Shift+Tab | Through a list; past its ends, closes it, the focus back on its button |
| Escape | Closes a list, the focus back on its button |
