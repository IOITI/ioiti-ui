import React from 'react';
import type { SelectionActionItem } from './selection-basket.js';
export type SortDirection = 'asc' | 'desc' | null;
export type DataTableViewMode = 'auto' | 'table' | 'cards';
export interface ColumnDef<T> {
    id: string;
    header: string;
    accessorKey?: keyof T;
    accessorFn?: (row: T) => any;
    cell?: (info: {
        row: T;
        value: any;
    }) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    filterOptions?: Array<{
        label: string;
        value: string;
    }>;
    width?: string;
    align?: 'left' | 'center' | 'right';
    priority?: 'high' | 'medium' | 'low';
    /** ioiti-ui: not shown until it is picked in the column list. */
    defaultHidden?: boolean;
}
export interface DataTableContextValue<T = any> {
    data: T[];
    columns: ColumnDef<T>[];
    getRowId: (row: T, index: number) => string;
    viewMode: DataTableViewMode;
    setViewMode: (mode: DataTableViewMode) => void;
    sortColumn: string | null;
    sortDirection: SortDirection;
    handleSort: (columnId: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    activeFilters: Record<string, string[]>;
    toggleFilter: (columnId: string, value: string) => void;
    clearFilters: () => void;
    selectable: boolean;
    selectedRowIds: ReadonlySet<string>;
    /** ioiti-ui: whether a row can be selected (a box of its own, counted by "select all"). */
    isRowSelectable: (row: T) => boolean;
    /** ioiti-ui: the bulk actions are in the selection basket under the table. */
    selectionBasket?: DataTableSelectionBasket;
    toggleRowSelection: (id: string) => void;
    toggleSelectAll: () => void;
    isAllSelected: boolean;
    /** ioiti-ui: whether a row of the page can be selected at all (the header's box is disabled otherwise). */
    canSelectPage: boolean;
    isIndeterminate: boolean;
    expandedRowIds: Set<string>;
    toggleRowExpansion: (id: string) => void;
    renderSubComponent?: (row: T) => React.ReactNode;
    /** ioiti-ui: a click anywhere on a row opens it, and what names a row for its expand button. */
    expandOnRowClick: boolean;
    rowLabel?: (row: T) => string;
    hiddenColumnIds: Set<string>;
    toggleColumnVisibility: (columnId: string) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    pageSize: number;
    setPageSize: (size: number) => void;
    totalPages: number;
    totalFilteredCount: number;
    paginatedData: T[];
    isLoading?: boolean;
    error?: string | null;
    accentColor?: string;
}
export declare function useDataTable<T = any>(): DataTableContextValue<T>;
export interface DataTableToolbarProps {
    title?: string;
    searchPlaceholder?: string;
    onBulkDelete?: (selectedIds: string[]) => void;
    onBulkExport?: (selectedIds: string[]) => void;
    className?: string;
}
export declare const DataTableToolbar: React.FC<DataTableToolbarProps>;
export interface DataTableFiltersProps {
    className?: string;
}
export declare const DataTableFilters: React.FC<DataTableFiltersProps>;
export interface DataTableContentProps {
    className?: string;
    emptyTitle?: string;
    emptyDescription?: string;
}
export declare const DataTableContent: React.FC<DataTableContentProps>;
export interface DataTablePaginationProps {
    pageSizeOptions?: number[];
    className?: string;
}
export declare const DataTablePagination: React.FC<DataTablePaginationProps>;
/** ioiti-ui: what the selection basket of a table offers, and what it calls a row. */
export interface DataTableSelectionBasket {
    noun: [string, string];
    actions: SelectionActionItem[];
    /** What draws an action that leads to another page; the application's link (LinkProvider) by default. */
    linkComponent?: React.ElementType;
}
export interface DataTableProps<T = any> {
    data: T[];
    columns: ColumnDef<T>[];
    getRowId?: (row: T, index: number) => string;
    defaultPageSize?: number;
    defaultViewMode?: DataTableViewMode;
    accentColor?: string;
    /** Row checkboxes for bulk actions (default true). */
    selectable?: boolean;
    /** ioiti-ui: a selection the page holds, told of each change; without it the table keeps its own. */
    selectedRowIds?: ReadonlySet<string>;
    onSelectionChange?: (ids: Set<string>) => void;
    /** ioiti-ui: the rows that can be selected; the others have no box, and "select all" leaves them out. */
    isRowSelectable?: (row: T) => boolean;
    /** ioiti-ui: the bulk actions, in EasyUI's selection basket under the table once a row is selected. */
    selectionBasket?: DataTableSelectionBasket;
    renderSubComponent?: (row: T) => React.ReactNode;
    /** ioiti-ui: what the search holds when the table appears (a link to one row). */
    initialSearch?: string;
    /** ioiti-ui: the rows shown opened when the table appears. */
    initialExpandedRowIds?: string[];
    /** ioiti-ui: the filters chosen when the table appears (a link to some of the rows), by column id. */
    initialFilters?: Record<string, string[]>;
    /** ioiti-ui: a click anywhere on a row opens it, not only its arrow. */
    expandOnRowClick?: boolean;
    /** ioiti-ui: one row open at a time: opening another closes it. */
    singleExpand?: boolean;
    /** ioiti-ui: what names a row, for its expand button ("Open …"). */
    rowLabel?: (row: T) => string;
    isLoading?: boolean;
    error?: string | null;
    className?: string;
    children?: React.ReactNode;
}
export declare function DataTable<T = any>({ data, columns, getRowId, defaultPageSize, defaultViewMode, accentColor, selectable, selectedRowIds: heldSelection, onSelectionChange, isRowSelectable, selectionBasket, renderSubComponent, initialSearch, initialExpandedRowIds, initialFilters, expandOnRowClick, singleExpand, rowLabel, isLoading, error, className, children, }: DataTableProps<T>): React.JSX.Element;
export interface AdvancedDataTableProps<T = any> extends DataTableProps<T> {
    title?: string;
    searchPlaceholder?: string;
    /** ioiti-ui: what to say when there is no row at all (as opposed to none matching a search). */
    emptyTitle?: string;
    emptyDescription?: string;
    onBulkDelete?: (selectedIds: string[]) => void;
    onBulkExport?: (selectedIds: string[]) => void;
}
export declare function AdvancedDataTable<T = any>({ data, columns, title, searchPlaceholder, emptyTitle, emptyDescription, onBulkDelete, onBulkExport, ...props }: AdvancedDataTableProps<T>): React.JSX.Element;
