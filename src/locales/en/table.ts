import type { MessageKit } from '../../lib/messages.js'

/** The tables: DataTable, ComparisonTable, SelectionBasket, ChangeList, Table. */
export const table = {
  // DataTable's toolbar.
  /** "Search…": the placeholder of the table's search, and of a filter's list of options. */
  searchPlaceholder: 'Search…',
  /** "Search the table": the name of the table's search (its placeholder is no name). */
  searchTable: 'Search the table',
  /** "Clear the search": the name and the hint of the × that empties it. */
  clearSearch: 'Clear the search',
  /** "3 selected": how many rows are selected, beside the table's title, where it has no selection basket. */
  selectedCount: (count: number, { number }: MessageKit) => `${number(count)} selected`,
  /** "Show as a table": the name and the hint of the button that shows the rows as a table, while they are cards. */
  showAsTable: 'Show as a table',
  /** "Show as cards": the name and the hint of the button that shows the rows as cards, while they are a table. */
  showAsCards: 'Show as cards',
  /** "Columns shown": the name and the hint of the button that picks the columns, and the name of its list. */
  columnsShown: 'Columns shown',
  /** "Columns": the heading of that list. */
  columns: 'Columns',
  /** "3 items selected:": the selection, before the bulk actions of the toolbar. */
  bulkSelected: (count: number, { plural }: MessageKit) => plural(count, { one: '# item selected:', other: '# items selected:' }),
  /** "Export": the bulk action that exports the rows selected; one of the selection basket's by default. */
  exportAction: 'Export',
  /** "Delete": the bulk action that deletes them; one of the selection basket's by default. */
  deleteAction: 'Delete',

  // DataTable's filters.
  /** "Filters": the name of the group of filters. */
  filters: 'Filters',
  /** "Status: Paid": the name of an option drawn as a button of its own, its column's header first. */
  filterOption: ({ column, option }: { column: string; option: string }) => `${column}: ${option}`,
  /** "2 of 5 chosen": what a filter's button says to a screen reader once options are ticked, after its column's header. */
  filterChosen: ({ chosen, count }: { chosen: number; count: number }, { number }: MessageKit) => `${number(chosen)} of ${number(count)} chosen`,
  /** "5 options": what it says while none is, after its column's header. */
  filterOptionCount: (count: number, { plural }: MessageKit) => plural(count, { one: '# option', other: '# options' }),
  /** "Filter by Status": the name of a filter's list of options. */
  filterBy: (column: string) => `Filter by ${column}`,
  /** "Search the options of Status": the name of the search of a long list of options. */
  searchOptions: (column: string) => `Search the options of ${column}`,
  /** "No option matches.": what that list says when its search finds nothing. */
  noOptionMatches: 'No option matches.',
  /** "12 rows": how many rows an option would leave, said after it to a screen reader. */
  optionRows: (count: number, { plural }: MessageKit) => plural(count, { one: '# row', other: '# rows' }),
  /** "Clear": the button that unticks a list's options. */
  clear: 'Clear',
  /** "Clear filters": the button that clears the search and every filter. */
  clearFilters: 'Clear filters',

  // DataTable's rows.
  /** "Nothing to show": what a table without a row says, where the application says nothing (`emptyTitle`). */
  emptyTitle: 'Nothing to show',
  /** "No matching records found": the heading of what a table says when its search or its filters leave no row. */
  noMatchTitle: 'No matching records found',
  /** "Nothing matches the search or the filters.": what it says under that heading. */
  noMatchText: 'Nothing matches the search or the filters.',
  /** "Failed to load data": the heading of what a table says when its rows could not be had. */
  loadFailed: 'Failed to load data',
  /** "Loading the records": the name of the rows drawn while the records load. */
  loadingRecords: 'Loading the records',
  /** "Select all rows": the box that selects every row of the page. */
  selectAll: 'Select all rows',
  /** "Select Order 1042": the box of a row, its name given (`rowLabel`). */
  selectRow: (name: string) => `Select ${name}`,
  /** "Select row 7": the box of a row that has no name, its id given. */
  selectRowById: (id: string) => `Select row ${id}`,
  /** "Open Order 1042": the button that opens a row's details, its name given. */
  openRow: (name: string) => `Open ${name}`,
  /** "Close Order 1042": the button that closes them. */
  closeRow: (name: string) => `Close ${name}`,
  /** "Expand row details": the button that opens the details of a row that has no name. */
  expandRow: 'Expand row details',
  /** "Collapse row details": the button that closes them. */
  collapseRow: 'Collapse row details',

  // DataTable's pages.
  /** "Loading…": what the count of the records says while they load. */
  loading: 'Loading…',
  /**
   * "Showing 1–10 of 57 records": the rows of the page among those the search and the filters leave. `range` and
   * `total` are written as they are given (each in a span of its own), `count` the number of records they agree with.
   */
  showing: ({ range, total, count }: { range: string; total: string; count: number }, { plural }: MessageKit) =>
    plural(count, { one: `Showing ${range} of ${total} record`, other: `Showing ${range} of ${total} records` }),
  /** "Rows per page:": the words before the list of page sizes, on a wide screen. */
  rowsPerPageLabel: 'Rows per page:',
  /** "Rows per page": that list's name. */
  rowsPerPage: 'Rows per page',
  /** "First page": the button to the first page. */
  firstPage: 'First page',
  /** "Previous page": the button to the page before. */
  previousPage: 'Previous page',
  /** "Next page": the button to the page after. */
  nextPage: 'Next page',
  /** "Last page": the button to the last page. */
  lastPage: 'Last page',

  // SelectionBasket.
  /** "Bulk actions toolbar": the name of the basket's bar. */
  basketToolbar: 'Bulk actions toolbar',
  /** "items selected" ("item selected" after 1): what follows the count of the selection, where no noun is given. */
  basketSelected: (count: number, { plural }: MessageKit) => plural(count, { one: 'item selected', other: 'items selected' }),
  /** "files selected" ("file selected" after 1): what follows it, with the noun given (`noun`, one and several). */
  basketSelectedNoun: ({ count, noun }: { count: number; noun: readonly [string, string] }, { plural }: MessageKit) =>
    plural(count, { one: `${noun[0]} selected`, other: `${noun[1]} selected` }),
  /** "All (24)": the button that selects every item that can be, and how many there are. */
  basketSelectAll: (count: number, { number }: MessageKit) => `All (${number(count)})`,
  /** "Select none": that button once every item is selected. */
  basketSelectNone: 'Select none',
  /** "Clear the selection": the name and the hint of the button that empties the basket. */
  basketClear: 'Clear the selection',
  /** "Move to Folder": one of the basket's actions by default. */
  moveAction: 'Move to Folder',
  /** "Share": one of the basket's actions by default. */
  shareAction: 'Share',

  // ComparisonTable.
  /** "Feature and plan comparison": the matrix's name, where the application gives none (`label`). */
  comparisonName: 'Feature and plan comparison',
  /** "Feature matrix": the head of the matrix's own column (`matrixTitle`). */
  comparisonMatrix: 'Feature matrix',
  /** "12 specifications": how many rows the matrix has, under that head (`countLabel`). */
  comparisonCount: (count: number, { plural }: MessageKit) => plural(count, { one: '# specification', other: '# specifications' }),
  /** "Filter capabilities…": the placeholder and the name of the matrix's search (`searchPlaceholder`). */
  comparisonSearch: 'Filter capabilities…',
  /** "Differences only": the button that leaves out the rows every plan has alike (`diffLabel`). */
  comparisonDifferences: 'Differences only',
  /** "No features match your current search or difference filters.": what the matrix says when nothing is left (`emptyText`). */
  comparisonEmpty: 'No features match your current search or difference filters.',
  /** "Get started": a plan's button, where it is given no words (`ctaText`). */
  comparisonAction: 'Get started',
  /** "Info about Single sign-on": the button that shows what a feature is. */
  comparisonInfo: (feature: string) => `Info about ${feature}`,
  /** "Pro:": a plan's name before its value, on a phone, where one plan is shown at a time. */
  comparisonPlan: (plan: string) => `${plan}:`,

  // ChangeList.
  /** "New": the value before of what is added. */
  changeNew: 'New',
  /** "Removed": the value after of what is removed. */
  changeRemoved: 'Removed',
  /** "from": said to a screen reader before a value before ("from 10 to 20"). */
  changeFrom: 'from',
  /** "to": said to a screen reader before a value after. */
  changeTo: 'to',

  // Table.
  /** "Table": the name of a table's frame that scrolls, where the table has none of its own. */
  region: 'Table',
}
