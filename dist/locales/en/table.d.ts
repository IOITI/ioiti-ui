import type { MessageKit } from '../../lib/messages.js';
/** The tables: DataTable, ComparisonTable, SelectionBasket, ChangeList, Table. */
export declare const table: {
    /** "Search…": the placeholder of the table's search, and of a filter's list of options. */
    searchPlaceholder: string;
    /** "Search the table": the name of the table's search (its placeholder is no name). */
    searchTable: string;
    /** "Clear the search": the name and the hint of the × that empties it. */
    clearSearch: string;
    /** "3 selected": how many rows are selected, beside the table's title, where it has no selection basket. */
    selectedCount: (count: number, { number }: MessageKit) => string;
    /** "Show as a table": the name and the hint of the button that shows the rows as a table, while they are cards. */
    showAsTable: string;
    /** "Show as cards": the name and the hint of the button that shows the rows as cards, while they are a table. */
    showAsCards: string;
    /** "Columns shown": the name and the hint of the button that picks the columns, and the name of its list. */
    columnsShown: string;
    /** "Columns": the heading of that list. */
    columns: string;
    /** "3 items selected:": the selection, before the bulk actions of the toolbar. */
    bulkSelected: (count: number, { plural }: MessageKit) => string;
    /** "Export": the bulk action that exports the rows selected; one of the selection basket's by default. */
    exportAction: string;
    /** "Delete": the bulk action that deletes them; one of the selection basket's by default. */
    deleteAction: string;
    /** "Filters": the name of the group of filters. */
    filters: string;
    /** "Status: Paid": the name of an option drawn as a button of its own, its column's header first. */
    filterOption: ({ column, option }: {
        column: string;
        option: string;
    }) => string;
    /** "2 of 5 chosen": what a filter's button says to a screen reader once options are ticked, after its column's header. */
    filterChosen: ({ chosen, count }: {
        chosen: number;
        count: number;
    }, { number }: MessageKit) => string;
    /** "5 options": what it says while none is, after its column's header. */
    filterOptionCount: (count: number, { plural }: MessageKit) => string;
    /** "Filter by Status": the name of a filter's list of options. */
    filterBy: (column: string) => string;
    /** "Search the options of Status": the name of the search of a long list of options. */
    searchOptions: (column: string) => string;
    /** "No option matches.": what that list says when its search finds nothing. */
    noOptionMatches: string;
    /** "12 rows": how many rows an option would leave, said after it to a screen reader. */
    optionRows: (count: number, { plural }: MessageKit) => string;
    /** "Clear": the button that unticks a list's options. */
    clear: string;
    /** "Clear filters": the button that clears the search and every filter. */
    clearFilters: string;
    /** "Nothing to show": what a table without a row says, where the application says nothing (`emptyTitle`). */
    emptyTitle: string;
    /** "No matching records found": the heading of what a table says when its search or its filters leave no row. */
    noMatchTitle: string;
    /** "Nothing matches the search or the filters.": what it says under that heading. */
    noMatchText: string;
    /** "Failed to load data": the heading of what a table says when its rows could not be had. */
    loadFailed: string;
    /** "Loading the records": the name of the rows drawn while the records load. */
    loadingRecords: string;
    /** "Select all rows": the box that selects every row of the page. */
    selectAll: string;
    /** "Select Order 1042": the box of a row, its name given (`rowLabel`). */
    selectRow: (name: string) => string;
    /** "Select row 7": the box of a row that has no name, its id given. */
    selectRowById: (id: string) => string;
    /** "Open Order 1042": the button that opens a row's details, its name given. */
    openRow: (name: string) => string;
    /** "Close Order 1042": the button that closes them. */
    closeRow: (name: string) => string;
    /** "Expand row details": the button that opens the details of a row that has no name. */
    expandRow: string;
    /** "Collapse row details": the button that closes them. */
    collapseRow: string;
    /** "Loading…": what the count of the records says while they load. */
    loading: string;
    /**
     * "Showing 1–10 of 57 records": the rows of the page among those the search and the filters leave. `range` and
     * `total` are written as they are given (each in a span of its own), `count` the number of records they agree with.
     */
    showing: ({ range, total, count }: {
        range: string;
        total: string;
        count: number;
    }, { plural }: MessageKit) => string;
    /** "Rows per page:": the words before the list of page sizes, on a wide screen. */
    rowsPerPageLabel: string;
    /** "Rows per page": that list's name. */
    rowsPerPage: string;
    /** "First page": the button to the first page. */
    firstPage: string;
    /** "Previous page": the button to the page before. */
    previousPage: string;
    /** "Next page": the button to the page after. */
    nextPage: string;
    /** "Last page": the button to the last page. */
    lastPage: string;
    /** "Bulk actions toolbar": the name of the basket's bar. */
    basketToolbar: string;
    /** "items selected" ("item selected" after 1): what follows the count of the selection, where no noun is given. */
    basketSelected: (count: number, { plural }: MessageKit) => string;
    /** "files selected" ("file selected" after 1): what follows it, with the noun given (`noun`, one and several). */
    basketSelectedNoun: ({ count, noun }: {
        count: number;
        noun: readonly [string, string];
    }, { plural }: MessageKit) => string;
    /** "All (24)": the button that selects every item that can be, and how many there are. */
    basketSelectAll: (count: number, { number }: MessageKit) => string;
    /** "Select none": that button once every item is selected. */
    basketSelectNone: string;
    /** "Clear the selection": the name and the hint of the button that empties the basket. */
    basketClear: string;
    /** "Move to Folder": one of the basket's actions by default. */
    moveAction: string;
    /** "Share": one of the basket's actions by default. */
    shareAction: string;
    /** "Feature and plan comparison": the matrix's name, where the application gives none (`label`). */
    comparisonName: string;
    /** "Feature matrix": the head of the matrix's own column (`matrixTitle`). */
    comparisonMatrix: string;
    /** "12 specifications": how many rows the matrix has, under that head (`countLabel`). */
    comparisonCount: (count: number, { plural }: MessageKit) => string;
    /** "Filter capabilities…": the placeholder and the name of the matrix's search (`searchPlaceholder`). */
    comparisonSearch: string;
    /** "Differences only": the button that leaves out the rows every plan has alike (`diffLabel`). */
    comparisonDifferences: string;
    /** "No features match your current search or difference filters.": what the matrix says when nothing is left (`emptyText`). */
    comparisonEmpty: string;
    /** "Get started": a plan's button, where it is given no words (`ctaText`). */
    comparisonAction: string;
    /** "Info about Single sign-on": the button that shows what a feature is. */
    comparisonInfo: (feature: string) => string;
    /** "Pro:": a plan's name before its value, on a phone, where one plan is shown at a time. */
    comparisonPlan: (plan: string) => string;
    /** "New": the value before of what is added. */
    changeNew: string;
    /** "Removed": the value after of what is removed. */
    changeRemoved: string;
    /** "from": said to a screen reader before a value before ("from 10 to 20"). */
    changeFrom: string;
    /** "to": said to a screen reader before a value after. */
    changeTo: string;
    /** "Table": the name of a table's frame that scrolls, where the table has none of its own. */
    region: string;
};
