'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, X, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, Download, AlertCircle, LayoutGrid, List, } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { SelectionBasket } from './selection-basket.js';
// =============================================================================
// DESIGN SYSTEM CONSTANTS & SPRING TOKENS
// =============================================================================
const SPRING_PHYSICS = {
    type: 'spring',
    stiffness: 300,
    damping: 32,
    mass: 0.6,
};
const DataTableContext = createContext(null);
export function useDataTable() {
    const ctx = useContext(DataTableContext);
    if (!ctx) {
        throw new Error('useDataTable must be used within <DataTable>');
    }
    return ctx;
}
export const DataTableToolbar = ({ title, searchPlaceholder = 'Search...', onBulkDelete, onBulkExport, className, }) => {
    const { searchTerm, setSearchTerm, selectedRowIds, selectionBasket, columns, hiddenColumnIds, toggleColumnVisibility, viewMode, setViewMode, } = useDataTable();
    const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);
    // ioiti-ui: the selection basket says what is selected and what can be done with it: said once.
    const selectedCount = selectionBasket ? 0 : selectedRowIds.size;
    const shouldReduceMotion = useReducedMotion();
    return (_jsxs("div", { className: cn('px-3.5 py-3 sm:px-7 sm:py-5 border-b border-border/50 space-y-3 sm:space-y-4 select-none', className), children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4", children: [_jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [title && (_jsx("h3", { className: "text-sm font-medium text-foreground tracking-tight truncate", children: title })), selectedCount > 0 && (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted/40 border border-border/40 text-xs text-foreground font-normal", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-foreground" }), selectedCount, " selected"] }))] }), _jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2.5 w-full sm:w-auto", children: [_jsxs("div", { className: "relative flex-1 sm:w-64 min-w-0", children: [_jsx(Search, { className: "w-3.5 h-3.5 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: searchPlaceholder, className: "w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 rounded-lg border border-border/60 bg-surface-raised/20 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border transition-colors font-sans" }), searchTerm && (_jsx("button", { type: "button", onClick: () => setSearchTerm(''), className: "absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer", children: _jsx(X, { className: "w-3 h-3" }) }))] }), _jsx(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.96 }, onClick: () => setViewMode(viewMode === 'cards' ? 'table' : 'cards'), className: "p-1.5 sm:p-2 rounded-lg border border-border/60 bg-surface-raised/20 text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer shrink-0", title: viewMode === 'cards' ? 'Switch to Table view' : 'Switch to Cards view', "aria-label": "Toggle view mode", children: viewMode === 'cards' ? _jsx(List, { className: "w-3.5 h-3.5" }) : _jsx(LayoutGrid, { className: "w-3.5 h-3.5" }) }), _jsxs("div", { className: "relative shrink-0", children: [_jsx(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.96 }, onClick: () => setIsColumnPickerOpen(!isColumnPickerOpen), className: "p-1.5 sm:p-2 rounded-lg border border-border/60 bg-surface-raised/20 text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer", title: "Toggle columns", "aria-label": "Toggle visible columns", "aria-expanded": isColumnPickerOpen, children: _jsx(SlidersHorizontal, { className: "w-3.5 h-3.5" }) }), isColumnPickerOpen && (_jsxs("div", { className: "absolute right-0 top-full mt-2 w-48 max-h-60 overflow-y-auto rounded-xl border border-border/70 bg-surface p-2 shadow-elevated z-30 font-sans", children: [_jsx("div", { className: "text-xs font-medium text-muted-foreground px-2 py-1", children: "Columns" }), _jsx("div", { className: "divide-y divide-border/40", children: columns.map((col) => {
                                                    const isVisible = !hiddenColumnIds.has(col.id);
                                                    return (_jsxs("label", { className: "flex items-center gap-2 px-2 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-surface-hover/50 rounded-md cursor-pointer select-none font-normal", children: [_jsx("input", { type: "checkbox", checked: isVisible, onChange: () => toggleColumnVisibility(col.id), className: "rounded border-border accent-foreground cursor-pointer" }), _jsx("span", { className: "truncate", children: col.header })] }, col.id));
                                                }) })] }))] })] })] }), _jsx(AnimatePresence, { children: selectedCount > 0 && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: SPRING_PHYSICS, className: "overflow-hidden", children: _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-lg bg-surface-raised/30 border border-border/50 text-xs", children: [_jsxs("span", { className: "text-xs text-muted-foreground font-normal", children: [selectedCount, " item", selectedCount === 1 ? '' : 's', " selected:"] }), _jsxs("div", { className: "flex items-center gap-2", children: [onBulkExport && (_jsxs(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.96 }, onClick: () => onBulkExport(Array.from(selectedRowIds)), className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/60 hover:bg-surface-hover text-foreground transition-colors text-xs font-normal cursor-pointer", children: [_jsx(Download, { className: "w-3 h-3" }), _jsx("span", { children: "Export" })] })), onBulkDelete && (_jsxs(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.96 }, onClick: () => onBulkDelete(Array.from(selectedRowIds)), className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors text-xs font-normal cursor-pointer", children: [_jsx(Trash2, { className: "w-3 h-3" }), _jsx("span", { children: "Delete" })] }))] })] }) })) })] }));
};
export const DataTableFilters = ({ className }) => {
    const { columns, activeFilters, toggleFilter, clearFilters } = useDataTable();
    const filterableColumns = columns.filter((c) => c.filterable && c.filterOptions && c.filterOptions.length > 0);
    const activeCount = Object.values(activeFilters).reduce((sum, vals) => sum + vals.length, 0);
    if (filterableColumns.length === 0)
        return null;
    return (_jsxs("div", { className: cn('px-4 py-2 sm:px-7 sm:py-2.5 border-b border-border/50 bg-surface-raised/15 flex items-center gap-2 sm:gap-2.5 text-xs overflow-x-auto scrollbar-none sm:flex-wrap font-sans select-none', className), children: [_jsx("span", { className: "text-xs text-muted-foreground font-normal shrink-0", children: "Filters:" }), filterableColumns.map((col) => {
                const selectedValues = activeFilters[col.id] || [];
                return (_jsxs("div", { className: "flex items-center gap-1 bg-surface-raised/30 border border-border/50 p-0.5 rounded-lg shrink-0 sm:shrink sm:flex-wrap sm:max-w-full", children: [_jsxs("span", { className: "text-xs text-muted-foreground px-2 font-normal", children: [col.header, ":"] }), col.filterOptions?.map((opt) => {
                            const isSelected = selectedValues.includes(opt.value);
                            return (_jsx("button", { type: "button", onClick: () => toggleFilter(col.id, opt.value), className: cn('px-2 py-0.5 rounded-md text-xs font-normal transition-colors cursor-pointer', isSelected
                                    ? 'bg-foreground text-background font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover/50'), children: opt.label }, opt.value));
                        })] }, col.id));
            }), activeCount > 0 && (_jsxs("button", { type: "button", onClick: clearFilters, className: "text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto shrink-0 cursor-pointer", children: ["Reset (", activeCount, ")"] }))] }));
};
export const DataTableContent = ({ className, emptyTitle = 'Nothing to show', emptyDescription, }) => {
    const { columns, data, searchTerm, activeFilters, paginatedData, hiddenColumnIds, getRowId, sortColumn, sortDirection, handleSort, selectable, selectedRowIds, isRowSelectable, toggleRowSelection, toggleSelectAll, isAllSelected, canSelectPage, isIndeterminate, expandedRowIds, toggleRowExpansion, renderSubComponent, expandOnRowClick, rowLabel, viewMode, isLoading, error, clearFilters, } = useDataTable();
    // ioiti-ui: a click on a row opens it, unless it was meant for something inside
    // the row (a link, a button, a box) or it ended a selection of its text.
    const expandOnClick = (rowId) => renderSubComponent && expandOnRowClick
        ? (event) => {
            const target = event.target;
            if (target.closest('a, button, input, select, textarea, label, [role="button"], [data-no-row-click]'))
                return;
            if (window.getSelection?.()?.toString())
                return;
            toggleRowExpansion(rowId);
        }
        : undefined;
    const expandLabel = (row, isExpanded) => {
        const name = rowLabel ? rowLabel(row) : null;
        if (name)
            return isExpanded ? `Close ${name}` : `Open ${name}`;
        return isExpanded ? 'Collapse row details' : 'Expand row details';
    };
    // ioiti-ui: a row's box named after the row, as its arrow is.
    const selectLabel = (row, rowId) => {
        const name = rowLabel ? rowLabel(row) : null;
        return name ? `Select ${name}` : `Select row ${rowId}`;
    };
    const visibleColumns = useMemo(() => columns.filter((col) => !hiddenColumnIds.has(col.id)), [columns, hiddenColumnIds]);
    if (error) {
        return (_jsxs("div", { className: "py-12 px-6 text-center flex flex-col items-center justify-center gap-2 font-sans", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-rose-500" }), _jsx("p", { className: "text-sm font-medium text-foreground", children: "Failed to load data" }), _jsx("p", { className: "text-xs text-muted-foreground max-w-sm", children: error })] }));
    }
    if (isLoading) {
        return (_jsx("div", { className: "p-6 space-y-3 font-sans", children: [1, 2, 3, 4, 5].map((i) => (_jsx("div", { className: "h-9 rounded-lg bg-surface-raised/30 animate-pulse" }, i))) }));
    }
    if (paginatedData.length === 0) {
        // ioiti-ui: "nothing matches" only when something is being searched or
        // filtered; a table that simply has no row says so in the caller's words.
        const filtering = data.length > 0 && (searchTerm.trim() !== '' || Object.values(activeFilters).some((values) => values.length > 0));
        if (!filtering) {
            return (_jsxs("div", { className: "py-10 sm:py-12 px-6 text-center flex flex-col items-center justify-center gap-1.5 font-sans", children: [_jsx("h4", { className: "text-sm font-medium text-foreground", children: emptyTitle }), emptyDescription && _jsx("p", { className: "text-xs text-muted-foreground max-w-sm", children: emptyDescription })] }));
        }
        return (_jsxs("div", { className: "py-12 sm:py-16 px-6 text-center flex flex-col items-center justify-center gap-2 font-sans", children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-surface-raised/40 border border-border/50 flex items-center justify-center text-muted-foreground mb-1", children: _jsx(Search, { className: "w-4 h-4" }) }), _jsx("h4", { className: "text-xs font-medium text-foreground", children: "No matching records found" }), _jsx("p", { className: "text-xs text-muted-foreground max-w-xs", children: "Nothing matches the search or the filters." }), _jsx("button", { type: "button", onClick: clearFilters, className: "mt-2 px-3 py-1 rounded-md border border-border/60 hover:bg-surface-hover text-xs text-foreground transition-colors cursor-pointer", children: "Clear filters" })] }));
    }
    // CARDS VIEW
    if (viewMode === 'cards') {
        return (_jsx("div", { className: cn('p-3.5 sm:p-6 space-y-2.5 sm:space-y-3 font-sans', className), children: paginatedData.map((row, index) => {
                const rowId = getRowId(row, index);
                const isSelected = selectedRowIds.has(rowId);
                const isExpanded = expandedRowIds.has(rowId);
                const primaryCol = visibleColumns[0];
                const primaryVal = primaryCol?.accessorKey
                    ? row[primaryCol.accessorKey]
                    : primaryCol?.accessorFn
                        ? primaryCol.accessorFn(row)
                        : null;
                const remainingCols = visibleColumns.slice(1);
                return (_jsxs("div", { onClick: expandOnClick(rowId), className: cn('rounded-xl border border-border/60 bg-surface/30 p-3.5 sm:p-4 space-y-2.5 sm:space-y-3 transition-colors', isSelected && 'bg-surface-raised/40 border-border', expandOnClick(rowId) && 'cursor-pointer'), children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("div", { className: "flex items-center gap-2.5 sm:gap-3 min-w-0", children: [selectable && isRowSelectable(row) && (_jsx("input", { type: "checkbox", checked: isSelected, onChange: () => toggleRowSelection(rowId), "aria-label": selectLabel(row, rowId), className: "rounded border-border accent-foreground cursor-pointer w-4 h-4 shrink-0" })), _jsx("span", { className: "font-medium text-xs text-foreground truncate", children: primaryCol?.cell
                                                ? primaryCol.cell({ row, value: primaryVal })
                                                : String(primaryVal ?? '') })] }), renderSubComponent && (_jsx("button", { type: "button", onClick: () => toggleRowExpansion(rowId), className: "p-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0", "aria-expanded": isExpanded, "aria-label": expandLabel(row, isExpanded), children: _jsx(motion.div, { animate: { rotate: isExpanded ? 90 : 0 }, transition: SPRING_PHYSICS, children: _jsx(ChevronRight, { className: "w-3.5 h-3.5" }) }) }))] }), remainingCols.length > 0 && (_jsx("div", { className: "grid grid-cols-2 gap-2.5 sm:gap-3 pt-2.5 sm:pt-3 border-t border-border/40 text-xs", children: remainingCols.map((col) => {
                                const value = col.accessorKey
                                    ? row[col.accessorKey]
                                    : col.accessorFn
                                        ? col.accessorFn(row)
                                        : null;
                                return (_jsxs("div", { className: "min-w-0", children: [_jsx("span", { className: "text-xs text-muted-foreground block truncate font-normal", children: col.header }), _jsx("div", { className: "text-foreground/80 truncate mt-0.5", children: col.cell ? col.cell({ row, value }) : String(value ?? '—') })] }, col.id));
                            }) })), renderSubComponent && isExpanded && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: SPRING_PHYSICS, className: "pt-2.5 sm:pt-3 border-t border-border/40 overflow-hidden", children: renderSubComponent(row) }))] }, rowId));
            }) }));
    }
    // DESKTOP TABLE VIEW
    return (_jsx("div", { className: cn('overflow-x-auto scrollbar-none font-sans', className), children: _jsxs("table", { className: "w-full border-collapse text-left font-sans text-xs min-w-[500px] sm:min-w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border/50 bg-surface-raised/20 text-xs text-muted-foreground select-none", children: [selectable && (_jsx("th", { className: "w-10 sm:w-12 px-3.5 sm:px-6 py-3 sm:py-3.5", children: _jsx("input", { type: "checkbox", checked: isAllSelected, ref: (el) => {
                                        if (el)
                                            el.indeterminate = isIndeterminate;
                                    }, onChange: toggleSelectAll, disabled: !canSelectPage, "aria-label": "Select all rows", className: "rounded border-border accent-foreground cursor-pointer w-4 h-4 disabled:cursor-not-allowed disabled:opacity-40" }) })), renderSubComponent && _jsx("th", { className: "w-7 sm:w-8 px-1.5 sm:px-2 py-3 sm:py-3.5" }), visibleColumns.map((col) => {
                                const isSorted = sortColumn === col.id;
                                return (_jsx("th", { style: { width: col.width }, className: cn('px-3.5 sm:px-5 py-3 sm:py-3.5 font-medium whitespace-nowrap', col.align === 'right' && 'text-right', col.align === 'center' && 'text-center'), children: col.sortable ? (_jsxs("button", { type: "button", onClick: () => handleSort(col.id), className: "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer", children: [_jsx("span", { children: col.header }), isSorted ? (sortDirection === 'asc' ? (_jsx(ChevronUp, { className: "w-3.5 h-3.5 text-foreground" })) : (_jsx(ChevronDown, { className: "w-3.5 h-3.5 text-foreground" }))) : (_jsx(ChevronsUpDown, { className: "w-3 h-3 opacity-30 hover:opacity-100" }))] })) : (_jsx("span", { children: col.header })) }, col.id));
                            })] }) }), _jsx("tbody", { className: "divide-y divide-border/40", children: paginatedData.map((row, index) => {
                        const rowId = getRowId(row, index);
                        const isSelected = selectedRowIds.has(rowId);
                        const isExpanded = expandedRowIds.has(rowId);
                        return (_jsxs(React.Fragment, { children: [_jsxs("tr", { onClick: expandOnClick(rowId), className: cn('transition-colors hover:bg-surface-hover/40 group', isSelected && 'bg-surface-raised/35', expandOnClick(rowId) && 'cursor-pointer', isExpanded && expandOnRowClick && 'bg-surface-raised/25'), children: [selectable && (_jsx("td", { className: "w-10 sm:w-12 px-3.5 sm:px-6 py-3 sm:py-3.5", children: isRowSelectable(row) && (_jsx("input", { type: "checkbox", checked: isSelected, onChange: () => toggleRowSelection(rowId), "aria-label": selectLabel(row, rowId), className: "rounded border-border accent-foreground cursor-pointer w-4 h-4" })) })), renderSubComponent && (_jsx("td", { className: "w-7 sm:w-8 px-1.5 sm:px-2 py-3 sm:py-3.5", children: _jsx("button", { type: "button", onClick: () => toggleRowExpansion(rowId), className: "p-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer", "aria-expanded": isExpanded, "aria-label": expandLabel(row, isExpanded), children: _jsx(motion.div, { animate: { rotate: isExpanded ? 90 : 0 }, transition: SPRING_PHYSICS, children: _jsx(ChevronRight, { className: "w-3.5 h-3.5" }) }) }) })), visibleColumns.map((col) => {
                                            const value = col.accessorKey
                                                ? row[col.accessorKey]
                                                : col.accessorFn
                                                    ? col.accessorFn(row)
                                                    : null;
                                            return (_jsx("td", { className: cn('px-3.5 sm:px-5 py-3 sm:py-3.5 text-foreground/80 whitespace-nowrap', col.align === 'right' && 'text-right tabular-nums', col.align === 'center' && 'text-center'), children: col.cell ? col.cell({ row, value }) : String(value ?? '') }, col.id));
                                        })] }), renderSubComponent && isExpanded && (_jsx("tr", { className: "bg-surface-raised/15", children: _jsx("td", { colSpan: visibleColumns.length + (selectable ? 2 : 1), className: "p-0 border-b border-border/50", children: _jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: SPRING_PHYSICS, className: "p-3.5 sm:p-6 overflow-hidden border-t border-border/40", children: renderSubComponent(row) }) }) }))] }, rowId));
                    }) })] }) }));
};
export const DataTablePagination = ({ pageSizeOptions = [5, 10, 20, 50], className, }) => {
    const { currentPage, setCurrentPage, pageSize, setPageSize, totalPages, totalFilteredCount, } = useDataTable();
    const shouldReduceMotion = useReducedMotion();
    const startRecord = totalFilteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalFilteredCount);
    return (_jsxs("div", { className: cn('px-4 py-3 sm:px-7 sm:py-4 border-t border-border/50 bg-surface/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs font-sans select-none', className), children: [_jsxs("div", { className: "text-muted-foreground tabular-nums", children: ["Showing ", _jsxs("span", { className: "text-foreground font-medium", children: [startRecord, "\u2013", endRecord] }), " of", ' ', _jsx("span", { className: "text-foreground font-medium", children: totalFilteredCount }), " records"] }), _jsxs("div", { className: "flex items-center justify-between sm:justify-end gap-2 sm:gap-4", children: [_jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [_jsx("span", { className: "text-muted-foreground hidden sm:inline", children: "Rows per page:" }), _jsx("select", { value: pageSize, onChange: (e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }, "aria-label": "Rows per page", className: "px-2 py-1 rounded-md border border-border/60 bg-surface-raised/20 text-foreground text-xs focus:outline-none focus:border-border cursor-pointer font-sans", children: pageSizeOptions.map((opt) => (_jsx("option", { value: opt, children: opt }, opt))) })] }), _jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [_jsx(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.96 }, onClick: () => setCurrentPage(1), disabled: currentPage <= 1, "aria-label": "First page", className: "p-1.5 rounded-md border border-border/60 bg-surface-raised/20 text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer", children: _jsx(ChevronsLeft, { className: "w-3.5 h-3.5" }) }), _jsx(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.96 }, onClick: () => setCurrentPage(currentPage - 1), disabled: currentPage <= 1, "aria-label": "Previous page", className: "p-1.5 rounded-md border border-border/60 bg-surface-raised/20 text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer", children: _jsx(ChevronLeft, { className: "w-3.5 h-3.5" }) }), _jsxs("span", { className: "px-2 text-foreground/90 text-xs tabular-nums font-normal", children: [currentPage, "/", totalPages || 1] }), _jsx(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.96 }, onClick: () => setCurrentPage(currentPage + 1), disabled: currentPage >= totalPages, "aria-label": "Next page", className: "p-1.5 rounded-md border border-border/60 bg-surface-raised/20 text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer", children: _jsx(ChevronRight, { className: "w-3.5 h-3.5" }) }), _jsx(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.96 }, onClick: () => setCurrentPage(totalPages), disabled: currentPage >= totalPages, "aria-label": "Last page", className: "p-1.5 rounded-md border border-border/60 bg-surface-raised/20 text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer", children: _jsx(ChevronsRight, { className: "w-3.5 h-3.5" }) })] })] })] }));
};
export function DataTable({ data, columns, getRowId = (row, i) => row.id || `row-${i}`, defaultPageSize = 10, defaultViewMode = 'auto', accentColor, selectable = true, selectedRowIds: heldSelection, onSelectionChange, isRowSelectable = () => true, selectionBasket, renderSubComponent, initialSearch = '', initialExpandedRowIds, initialFilters, expandOnRowClick = false, singleExpand = false, rowLabel, isLoading, error, className, children, }) {
    const [viewMode, setViewMode] = useState(() => {
        if (defaultViewMode === 'auto') {
            if (typeof window !== 'undefined' && window.innerWidth < 640) {
                return 'cards';
            }
            return 'table';
        }
        return defaultViewMode;
    });
    useEffect(() => {
        if (defaultViewMode !== 'auto')
            return;
        const handleResize = () => {
            setViewMode((prev) => {
                const isMobile = window.innerWidth < 640;
                if (isMobile && prev === 'table')
                    return 'cards';
                if (!isMobile && prev === 'cards')
                    return 'table';
                return prev;
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [defaultViewMode]);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [searchTerm, setSearchTermState] = useState(initialSearch);
    const [activeFilters, setActiveFilters] = useState(() => initialFilters ?? {});
    const [ownSelection, setOwnSelection] = useState(new Set());
    // ioiti-ui: the page's selection when it holds one, the table's own otherwise.
    const selectedRowIds = heldSelection ?? ownSelection;
    const setSelectedRowIds = (change) => {
        if (heldSelection && onSelectionChange)
            onSelectionChange(change(heldSelection));
        else
            setOwnSelection((prev) => change(prev));
    };
    const [expandedRowIds, setExpandedRowIds] = useState(() => new Set(initialExpandedRowIds));
    const [hiddenColumnIds, setHiddenColumnIds] = useState(() => new Set(columns.filter((column) => column.defaultHidden).map((column) => column.id)));
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    // ioiti-ui: what is found is shown from its first page, wherever the reader was.
    const setSearchTerm = (term) => {
        setSearchTermState(term);
        setCurrentPage(1);
    };
    const handleSort = (columnId) => {
        if (sortColumn !== columnId) {
            setSortColumn(columnId);
            setSortDirection('asc');
        }
        else if (sortDirection === 'asc') {
            setSortDirection('desc');
        }
        else {
            setSortColumn(null);
            setSortDirection(null);
        }
    };
    const toggleFilter = (columnId, value) => {
        setActiveFilters((prev) => {
            const existing = prev[columnId] || [];
            const updated = existing.includes(value)
                ? existing.filter((v) => v !== value)
                : [...existing, value];
            return { ...prev, [columnId]: updated };
        });
        setCurrentPage(1);
    };
    const clearFilters = () => {
        setActiveFilters({});
        setSearchTermState('');
        setCurrentPage(1);
    };
    const toggleRowSelection = (id) => {
        setSelectedRowIds((prev) => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    const toggleRowExpansion = (id) => {
        setExpandedRowIds((prev) => {
            if (singleExpand)
                return prev.has(id) ? new Set() : new Set([id]);
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    const toggleColumnVisibility = (columnId) => {
        setHiddenColumnIds((prev) => {
            const next = new Set(prev);
            if (next.has(columnId))
                next.delete(columnId);
            else
                next.add(columnId);
            return next;
        });
    };
    const filteredData = useMemo(() => {
        let result = [...data];
        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase();
            result = result.filter((row) => Object.values(row).some((val) => typeof val === 'string' || typeof val === 'number'
                ? String(val).toLowerCase().includes(query)
                : false));
        }
        Object.entries(activeFilters).forEach(([colId, filterVals]) => {
            if (filterVals.length === 0)
                return;
            const col = columns.find((c) => c.id === colId);
            if (!col)
                return;
            result = result.filter((row) => {
                const val = col.accessorKey
                    ? row[col.accessorKey]
                    : col.accessorFn
                        ? col.accessorFn(row)
                        : '';
                return filterVals.includes(String(val));
            });
        });
        if (sortColumn && sortDirection) {
            const col = columns.find((c) => c.id === sortColumn);
            if (col) {
                result.sort((a, b) => {
                    const aVal = col.accessorKey
                        ? a[col.accessorKey]
                        : col.accessorFn
                            ? col.accessorFn(a)
                            : '';
                    const bVal = col.accessorKey
                        ? b[col.accessorKey]
                        : col.accessorFn
                            ? col.accessorFn(b)
                            : '';
                    if (aVal === bVal)
                        return 0;
                    if (aVal === null || aVal === undefined)
                        return 1;
                    if (bVal === null || bVal === undefined)
                        return -1;
                    const comparison = aVal > bVal ? 1 : -1;
                    return sortDirection === 'asc' ? comparison : -comparison;
                });
            }
        }
        return result;
    }, [data, columns, searchTerm, activeFilters, sortColumn, sortDirection]);
    const totalFilteredCount = filteredData.length;
    const totalPages = Math.ceil(totalFilteredCount / pageSize);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage, pageSize]);
    // ioiti-ui: only the rows that can be selected.
    const currentPageIds = useMemo(() => paginatedData.flatMap((row, i) => (isRowSelectable(row) ? [getRowId(row, i)] : [])), [paginatedData, getRowId, isRowSelectable]);
    // ioiti-ui: every row the search and the filters leave that can be selected, on every page: the basket's "All".
    const selectableIds = useMemo(() => filteredData.flatMap((row, i) => (isRowSelectable(row) ? [getRowId(row, i)] : [])), [filteredData, getRowId, isRowSelectable]);
    const allSelectableSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedRowIds.has(id));
    const toggleAllSelectable = () => {
        setSelectedRowIds((prev) => {
            const next = new Set(prev);
            selectableIds.forEach((id) => (allSelectableSelected ? next.delete(id) : next.add(id)));
            return next;
        });
    };
    const selectedOnCurrentPage = currentPageIds.filter((id) => selectedRowIds.has(id));
    const isAllSelected = currentPageIds.length > 0 && selectedOnCurrentPage.length === currentPageIds.length;
    const isIndeterminate = selectedOnCurrentPage.length > 0 && !isAllSelected;
    const toggleSelectAll = () => {
        setSelectedRowIds((prev) => {
            const next = new Set(prev);
            if (isAllSelected) {
                currentPageIds.forEach((id) => next.delete(id));
            }
            else {
                currentPageIds.forEach((id) => next.add(id));
            }
            return next;
        });
    };
    const contextValue = {
        data,
        columns,
        getRowId,
        viewMode,
        setViewMode,
        sortColumn,
        sortDirection,
        handleSort,
        searchTerm,
        setSearchTerm,
        activeFilters,
        toggleFilter,
        clearFilters,
        selectable,
        selectedRowIds,
        isRowSelectable,
        selectionBasket,
        toggleRowSelection,
        toggleSelectAll,
        isAllSelected,
        canSelectPage: currentPageIds.length > 0,
        isIndeterminate,
        expandedRowIds,
        toggleRowExpansion,
        renderSubComponent,
        expandOnRowClick,
        rowLabel,
        hiddenColumnIds,
        toggleColumnVisibility,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        totalPages,
        totalFilteredCount,
        paginatedData,
        isLoading,
        error,
        accentColor,
    };
    return (_jsxs(DataTableContext.Provider, { value: contextValue, children: [_jsx("div", { style: {
                    fontFamily: "var(--font-sans, 'Geist', sans-serif)",
                    ...(accentColor ? { '--accent-custom': accentColor } : {}),
                }, className: cn('w-full font-sans rounded-2xl border border-border/70 bg-surface/50 dark:bg-surface/25 text-foreground overflow-hidden transition-colors', className), children: children || (_jsxs(_Fragment, { children: [_jsx(DataTableToolbar, {}), _jsx(DataTableFilters, {}), _jsx(DataTableContent, {}), _jsx(DataTablePagination, {})] })) }), selectionBasket && selectable && (_jsx(SelectionBasket, { mode: "sticky", className: "mt-2", selectedCount: selectedRowIds.size, totalCount: selectableIds.length, allSelected: allSelectableSelected, onSelectAll: toggleAllSelectable, onClearSelection: () => setSelectedRowIds(() => new Set()), actions: selectionBasket.actions, noun: selectionBasket.noun, linkComponent: selectionBasket.linkComponent }))] }));
}
export function AdvancedDataTable({ data, columns, title, searchPlaceholder, emptyTitle, emptyDescription, onBulkDelete, onBulkExport, ...props }) {
    return (_jsxs(DataTable, { data: data, columns: columns, ...props, children: [_jsx(DataTableToolbar, { title: title, searchPlaceholder: searchPlaceholder, onBulkDelete: onBulkDelete, onBulkExport: onBulkExport }), _jsx(DataTableFilters, {}), _jsx(DataTableContent, { emptyTitle: emptyTitle, emptyDescription: emptyDescription }), _jsx(DataTablePagination, {})] }));
}
