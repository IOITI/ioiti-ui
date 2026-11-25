'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo, createContext, useContext, useId, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotionConfig } from 'framer-motion';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, X, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, Download, AlertCircle, LayoutGrid, List, } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { fieldBorder } from '../../lib/field-border.js';
// ioiti-ui: the filters' lists float as everything that floats.
import { useAnchoredLayer } from '../../lib/anchor.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, DISABLED, FLOATING, MENU_ROW, PRESSABLE, SECTION } from '../../lib/recipes.js';
import { SelectionBasket } from './selection-basket.js';
// ioiti-ui: every box of the table is the package's checkbox, EasyUI's draw-checkbox.
import { DrawCheckbox } from './draw-checkbox.js';
import { Skeleton } from './skeleton.js';
import { Hint } from '../Hint.js';
// ioiti-ui: its words in the provider's language (`table`), its counts in its locale.
import { useFormat, useMessages } from '../locale-context.js';
const DataTableContext = createContext(null);
export function useDataTable() {
    const ctx = useContext(DataTableContext);
    if (!ctx) {
        throw new Error('useDataTable must be used within <DataTable>');
    }
    return ctx;
}
export const DataTableToolbar = ({ title, searchPlaceholder, onBulkDelete, onBulkExport, className, }) => {
    // ioiti-ui: its words in the provider's language, its own props given over them.
    const words = useMessages().table;
    const { searchTerm, setSearchTerm, selectedRowIds, selectionBasket, columns, hiddenColumnIds, toggleColumnVisibility, viewMode, setViewMode, } = useDataTable();
    // ioiti-ui: the search, to give it the focus back once its × has emptied it (the × goes with what was typed).
    const searchRef = useRef(null);
    const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);
    // ioiti-ui: the columns' list is an anchored layer (src/lib/anchor.ts): in document.body, out of the frame's
    // overflow that cut it, beside its button where the window has room; Escape, a Tab out of it or a press elsewhere
    // closes it (none did), the focus back on its button.
    const columnPickerId = useId();
    const columnTriggerRef = useRef(null);
    const columnLayerRef = useRef(null);
    const columnLayer = useAnchoredLayer({
        open: isColumnPickerOpen,
        onClose: () => setIsColumnPickerOpen(false),
        triggerRef: columnTriggerRef,
        layerRef: columnLayerRef,
        side: 'bottom',
        align: 'end',
    });
    // ioiti-ui: the selection basket says what is selected and what can be done with it: said once.
    const selectedCount = selectionBasket ? 0 : selectedRowIds.size;
    const shouldReduceMotion = useReducedMotionConfig();
    return (_jsxs("div", { className: cn('px-3.5 py-3 sm:px-7 sm:py-5 border-b border-border/40 space-y-3 sm:space-y-4 select-none', className), children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4", children: [_jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [title && (_jsx("h3", { className: "text-sm font-semibold text-foreground tracking-tight truncate", children: title })), selectedCount > 0 && (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted/40 border border-border text-xs text-foreground font-normal tabular-nums", children: [_jsx("span", { className: "size-1.5 rounded-full bg-foreground accent:bg-brand" }), words.selectedCount(selectedCount)] }))] }), _jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2.5 w-full sm:w-auto", children: [_jsxs("div", { className: "relative flex-1 sm:w-64 min-w-0", children: [_jsx(Search, { className: "size-4 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { ref: searchRef, type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), "aria-label": words.searchTable, placeholder: searchPlaceholder ?? words.searchPlaceholder, className: cn('w-full h-8 pl-8 sm:pl-9 pr-7 sm:pr-8 rounded-lg border bg-surface text-base sm:text-sm text-foreground placeholder:text-text-subtle focus:outline-none transition-colors font-sans', fieldBorder(false)) }), searchTerm && (_jsx(Hint, { content: words.clearSearch, className: "absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2", children: _jsx("button", { type: "button", "aria-label": words.clearSearch, onClick: () => {
                                                setSearchTerm('');
                                                searchRef.current?.focus();
                                            }, className: cn(CLOSE_SM, '[&>svg]:size-3'), children: _jsx(X, { "aria-hidden": true }) }) }))] }), _jsx(Hint, { content: viewMode === 'cards' ? words.showAsTable : words.showAsCards, children: _jsx(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.97 }, onClick: () => setViewMode(viewMode === 'cards' ? 'table' : 'cards'), className: "grid size-8 place-items-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors cursor-pointer shrink-0", "aria-label": viewMode === 'cards' ? words.showAsTable : words.showAsCards, children: viewMode === 'cards' ? _jsx(List, { className: "size-4" }) : _jsx(LayoutGrid, { className: "size-4" }) }) }), _jsxs("div", { className: "relative shrink-0", children: [_jsx(Hint, { content: words.columnsShown, children: _jsx(motion.button, { ref: columnTriggerRef, type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.97 }, onClick: () => setIsColumnPickerOpen(!isColumnPickerOpen), onKeyDown: columnLayer.onTriggerKeyDown, "aria-haspopup": "dialog", "aria-controls": isColumnPickerOpen ? columnPickerId : undefined, className: "grid size-8 place-items-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors cursor-pointer", "aria-label": words.columnsShown, "aria-expanded": isColumnPickerOpen, children: _jsx(SlidersHorizontal, { className: "size-4" }) }) }), isColumnPickerOpen && typeof document !== 'undefined' && createPortal(_jsxs("div", { ref: columnLayerRef, id: columnPickerId, role: "dialog", "aria-label": words.columnsShown, tabIndex: -1, onKeyDown: columnLayer.onLayerKeyDown, style: columnLayer.style, className: cn(FLOATING, 'z-50 w-48 overflow-y-auto p-2 font-sans outline-none'), children: [_jsx("div", { className: "text-xs font-medium text-muted-foreground px-2 py-1", children: words.columns }), _jsx("div", { className: "divide-y divide-border/40", children: columns.map((col) => {
                                                    const isVisible = !hiddenColumnIds.has(col.id);
                                                    return (_jsxs("label", { className: cn(MENU_ROW, 'hover:bg-surface-hover'), children: [_jsx(DrawCheckbox, { checked: isVisible, onChange: () => toggleColumnVisibility(col.id) }), _jsx("span", { className: "truncate", children: col.header })] }, col.id));
                                                }) })] }), document.body)] })] })] }), _jsx(AnimatePresence, { children: selectedCount > 0 && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: motionTransitions.springSnappy, className: "overflow-hidden", children: _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-lg bg-surface-raised/30 border border-border/60 text-xs", children: [_jsx("span", { className: "text-xs text-muted-foreground font-normal tabular-nums", children: words.bulkSelected(selectedCount) }), _jsxs("div", { className: "flex items-center gap-2", children: [onBulkExport && (_jsxs(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.97 }, onClick: () => onBulkExport(Array.from(selectedRowIds)), className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-surface hover:bg-surface-hover text-foreground transition-colors text-sm font-normal cursor-pointer", children: [_jsx(Download, { className: "size-4" }), _jsx("span", { children: words.exportAction })] })), onBulkDelete && (_jsxs(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.97 }, onClick: () => onBulkDelete(Array.from(selectedRowIds)), className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-negative/30 bg-negative/5 hover:bg-negative/10 text-negative transition-colors text-sm font-normal cursor-pointer dark:bg-negative/10 dark:hover:bg-negative/20", children: [_jsx(Trash2, { className: "size-4" }), _jsx("span", { children: words.deleteAction })] }))] })] }) })) })] }));
};
// ioiti-ui: what the filters compare a row by in a column (its values as text: one, or each of an array's, a row
// with tags matching an option that any of its tags is), and whether the search finds a row: one rule for the
// rows shown and for the counts of the filters' options.
function filterValues(row, column) {
    const value = column.accessorKey ? row[column.accessorKey] : column.accessorFn ? column.accessorFn(row) : '';
    return Array.isArray(value) ? [...new Set(value.map(String))] : [String(value)];
}
function filterMatches(row, column, chosen) {
    return filterValues(row, column).some((value) => chosen.includes(value));
}
function searchFinds(row, query) {
    return Object.values(row).some((value) => typeof value === 'string' || typeof value === 'number' ? String(value).toLowerCase().includes(query) : false);
}
/** ioiti-ui: drawn as an on/off pair, or as a list (ColumnDef's filterDisplay). */
function drawnAsToggles(column) {
    const display = column.filterDisplay ?? 'auto';
    return display === 'toggle' || (display === 'auto' && (column.filterOptions?.length ?? 0) <= 2);
}
// ioiti-ui: a button of the filter group, as Elastic UI's EuiFilterButton: the group's border around it, a
// divider between two, its ends rounded as the group is.
const FILTER_BUTTON = 'inline-flex h-8 shrink-0 items-center gap-1.5 px-3 text-sm whitespace-nowrap transition-colors cursor-pointer first:rounded-l-[calc(var(--radius-lg)-1px)] last:rounded-r-[calc(var(--radius-lg)-1px)] hover:bg-surface-hover';
const FILTER_BUTTON_IDLE = 'text-muted-foreground hover:text-foreground';
// What is on, in the accent where the theme has one (accent:).
const FILTER_BUTTON_ON = 'text-foreground font-medium accent:text-brand-text';
// ioiti-ui: how many options a list has (subdued), or how many are ticked (bright): EUI's numFilters and
// numActiveFilters.
const FILTER_COUNT = 'inline-grid h-4 min-w-4 place-items-center rounded-full px-1 text-[11px] font-medium tabular-nums';
const FILTER_COUNT_ALL = 'bg-foreground/10 text-foreground';
const FILTER_COUNT_TICKED = 'bg-foreground text-background accent:bg-brand accent:text-brand-foreground';
/** ioiti-ui: from this many options, a list has a search of its own. */
const FILTER_SEARCH_FROM = 8;
/** ioiti-ui: a column's options as buttons of their own, pressed one at a time: an on/off pair (EUI's withNext). */
function FilterToggles({ column }) {
    const { activeFilters, setFilter } = useDataTable();
    const words = useMessages().table;
    const chosen = activeFilters[column.id] ?? [];
    return (_jsx(_Fragment, { children: column.filterOptions?.map((option) => {
            const pressed = chosen.includes(option.value);
            return (_jsx("button", { type: "button", "aria-pressed": pressed, "aria-label": words.filterOption({ column: column.header, option: option.label }), onClick: () => setFilter(column.id, pressed ? [] : [option.value]), className: cn(FILTER_BUTTON, pressed ? cn(FILTER_BUTTON_ON, 'bg-foreground/[0.06] accent:bg-brand-soft') : FILTER_BUTTON_IDLE), children: option.label }, option.value));
        }) }));
}
/**
 * ioiti-ui: a column's options in a list that opens from its button (EUI's EuiFilterButton in a popover, with
 * a searchable list): each ticked or not, with the rows it would leave. An anchored layer (src/lib/anchor.ts), as
 * every list beside its button: in document.body (the table's frame cut what overflowed it), under its button or above
 * it where the window has more room, on that side while it is open, following its button as the page scrolls or the
 * window changes size (a phone's keyboard does both), never closed by that. The focus goes in when it opens, on its search, or on its first option when a
 * finger opened it; Escape, or a Tab past its ends, gives it back to the button, and neither reaches a dialog or a
 * sheet around the table (whose own keeping of the focus pulled a Tab in the list back into it); a press elsewhere
 * closes it. It placed itself by hand, its keys half its own.
 */
function FilterList({ column }) {
    const { activeFilters, toggleFilter, setFilter, countOptions } = useDataTable();
    // ioiti-ui: its words in the provider's language (`table`: `words` are those typed in its search), its counts in its locale.
    const table = useMessages().table;
    const { formatNumber } = useFormat();
    const options = column.filterOptions ?? [];
    const chosen = activeFilters[column.id] ?? [];
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const id = useId();
    const buttonRef = useRef(null);
    const panelRef = useRef(null);
    // What pressed the button, and whether a finger opened the list.
    const lastPointer = useRef(null);
    const openedByFinger = useRef(false);
    const searchable = options.length >= FILTER_SEARCH_FROM;
    const counts = open ? countOptions(column.id) : {};
    // Every word typed is in the option's label.
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const listed = options.filter((option) => words.every((word) => option.label.toLowerCase().includes(word)));
    const close = () => {
        setOpen(false);
        setQuery('');
    };
    const layer = useAnchoredLayer({
        open,
        onClose: close,
        triggerRef: buttonRef,
        layerRef: panelRef,
        side: 'bottom',
        align: 'start',
        // On the side it opened on as its search shrinks it, or grows it again.
        keepSide: true,
        // Its first control (its search, or its first option); not the search under a finger: a phone's keyboard would
        // open over the list.
        initialFocus: () => openedByFinger.current ? (panelRef.current?.querySelector('input[type="checkbox"]') ?? null) : null,
    });
    const clearColumn = () => {
        setFilter(column.id, []);
        // The button pressed goes: the focus stays in the list, on its first option.
        panelRef.current?.querySelector('input[type="checkbox"]')?.focus();
    };
    return (_jsxs(_Fragment, { children: [_jsxs("button", { ref: buttonRef, type: "button", "aria-expanded": open, "aria-controls": open ? `${id}-list` : undefined, onPointerDown: (event) => {
                    lastPointer.current = event.pointerType;
                }, onClick: () => {
                    // A click without a pointer before it is the keyboard's.
                    const finger = lastPointer.current === 'touch' || lastPointer.current === 'pen';
                    lastPointer.current = null;
                    if (open)
                        return close();
                    openedByFinger.current = finger;
                    setOpen(true);
                }, onKeyDown: layer.onTriggerKeyDown, className: cn(FILTER_BUTTON, chosen.length > 0 ? FILTER_BUTTON_ON : FILTER_BUTTON_IDLE, open && 'bg-surface-hover'), children: [column.header, _jsx("span", { "aria-hidden": true, className: cn(FILTER_COUNT, chosen.length > 0 ? FILTER_COUNT_TICKED : FILTER_COUNT_ALL), children: formatNumber(chosen.length > 0 ? chosen.length : options.length) }), _jsxs("span", { className: "sr-only", children: [", ", chosen.length > 0 ? table.filterChosen({ chosen: chosen.length, count: options.length }) : table.filterOptionCount(options.length)] }), _jsx(ChevronDown, { "aria-hidden": true, className: cn('size-4 shrink-0 motion-safe:transition-transform duration-200 ease-fast', open && 'rotate-180') })] }), createPortal(_jsx(AnimatePresence, { children: open && (_jsxs(motion.div, { ref: panelRef, id: `${id}-list`, role: "group", "aria-label": table.filterBy(column.header), 
                    // A press on its empty space keeps the focus in it, and its keys with it.
                    tabIndex: -1, onKeyDown: layer.onLayerKeyDown, initial: { opacity: 0, scale: 0.98, y: layer.side === 'top' ? 4 : -4 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.98, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, style: { ...layer.style, transformOrigin: layer.side === 'top' ? 'bottom left' : 'top left' }, 
                    // 256 px wide, 8 px from each edge of a narrower window.
                    className: cn('z-50 flex w-64 max-w-[calc(100vw-1rem)] flex-col overflow-hidden font-sans outline-none select-none', FLOATING), children: [searchable && (_jsx("div", { className: "border-b border-border/60 p-2", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { "aria-hidden": true, className: "absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "search", value: query, onChange: (e) => setQuery(e.target.value), "aria-label": table.searchOptions(column.header), placeholder: table.searchPlaceholder, className: cn('w-full h-8 rounded-lg border bg-surface pl-8 pr-3.5 text-base sm:text-sm text-foreground placeholder:text-text-subtle transition-colors', fieldBorder(false)) })] }) })), _jsx("div", { className: "min-h-0 flex-1 overflow-y-auto p-1.5", children: listed.length === 0 ? (_jsx("p", { className: "px-2 py-3 text-xs text-muted-foreground", children: table.noOptionMatches })) : (listed.map((option) => {
                                const ticked = chosen.includes(option.value);
                                const count = counts[option.value] ?? 0;
                                return (_jsxs("label", { className: cn(MENU_ROW, 'hover:bg-surface-hover', 
                                    // An option that would leave no row, unless ticked, recedes.
                                    count === 0 && !ticked ? 'text-muted-foreground' : 'text-foreground'), children: [_jsx(DrawCheckbox, { checked: ticked, onChange: () => toggleFilter(column.id, option.value) }), _jsx("span", { className: "min-w-0 flex-1 truncate", children: option.label }), _jsx("span", { "aria-hidden": true, className: "tabular-nums text-muted-foreground", children: formatNumber(count) }), _jsxs("span", { className: "sr-only", children: [", ", table.optionRows(count)] })] }, option.value));
                            })) }), chosen.length > 0 && (_jsx("div", { className: "border-t border-border/60 p-1.5", children: _jsx("button", { type: "button", onClick: clearColumn, className: cn(MENU_ROW, 'w-full text-left text-muted-foreground hover:bg-surface-hover hover:text-foreground'), children: table.clear }) }))] })) }), document.body)] }));
}
/**
 * ioiti-ui: the filters as Elastic UI's filter group (EuiFilterGroup, EuiFilterButton), written from its
 * documentation (none of its code): one bar of buttons joined together, a column that filters a button, or an
 * on/off pair; then a way to clear them. EasyUI showed every option of every column at once.
 */
export const DataTableFilters = ({ className }) => {
    const { columns, activeFilters, clearFilters } = useDataTable();
    // ioiti-ui: its words in the provider's language.
    const words = useMessages().table;
    const filterableColumns = columns.filter((c) => c.filterable && c.filterOptions && c.filterOptions.length > 0);
    const activeCount = Object.values(activeFilters).reduce((sum, vals) => sum + vals.length, 0);
    if (filterableColumns.length === 0)
        return null;
    return (_jsxs("div", { className: cn('relative px-4 py-2 sm:px-7 sm:py-2.5 border-b border-border/40 bg-surface-raised/15 flex items-center gap-2 sm:gap-3 text-xs overflow-x-auto scrollbar-none font-sans select-none', className), children: [_jsx("div", { role: "group", "aria-label": words.filters, className: "flex shrink-0 items-stretch divide-x divide-border/60 rounded-lg border border-border/60 bg-surface-raised/20", children: filterableColumns.map((col) => drawnAsToggles(col) ? _jsx(FilterToggles, { column: col }, col.id) : _jsx(FilterList, { column: col }, col.id)) }), activeCount > 0 && (_jsx("button", { type: "button", onClick: clearFilters, className: "text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto shrink-0 cursor-pointer", children: words.clearFilters }))] }));
};
export const DataTableContent = ({ className, emptyTitle, emptyDescription, }) => {
    // ioiti-ui: its words in the provider's language, its own props given over them.
    const words = useMessages().table;
    const { columns, data, searchTerm, activeFilters, paginatedData, hiddenColumnIds, getRowId, sortColumn, sortDirection, handleSort, selectable, selectedRowIds, isRowSelectable, toggleRowSelection, toggleSelectAll, isAllSelected, canSelectPage, isIndeterminate, expandedRowIds, toggleRowExpansion, renderSubComponent, expandOnRowClick, rowLabel, viewMode, loading, error, clearFilters, } = useDataTable();
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
            return isExpanded ? words.closeRow(name) : words.openRow(name);
        return isExpanded ? words.collapseRow : words.expandRow;
    };
    // ioiti-ui: a row's box named after the row, as its arrow is.
    const selectLabel = (row, rowId) => {
        const name = rowLabel ? rowLabel(row) : null;
        return name ? words.selectRow(name) : words.selectRowById(rowId);
    };
    const visibleColumns = useMemo(() => columns.filter((col) => !hiddenColumnIds.has(col.id)), [columns, hiddenColumnIds]);
    // ioiti-ui: an opened row is as wide as the frame shows, not as the table: in a table wider than its frame, what it
    // draws to its own width (a chart) was drawn as wide as every column and read by scrolling sideways. Measured, as
    // container units would make the frame's width ignore its table wherever it is sized by its content.
    const [frame, setFrame] = useState(null);
    const [frameWidth, setFrameWidth] = useState(null);
    useLayoutEffect(() => {
        if (!frame || !renderSubComponent)
            return;
        const update = () => setFrameWidth(Math.round(frame.clientWidth) || null);
        update();
        if (typeof ResizeObserver === 'undefined')
            return;
        const observer = new ResizeObserver(update);
        observer.observe(frame);
        return () => observer.disconnect();
    }, [frame, renderSubComponent]);
    // ioiti-ui: what it says while it shows no row (its failure, its loading, none, none found) in the provider's words.
    if (error) {
        return (_jsxs("div", { className: "py-12 px-6 text-center flex flex-col items-center justify-center gap-2 font-sans", children: [_jsx(AlertCircle, { className: "size-5 text-negative" }), _jsx("p", { className: "text-sm font-semibold text-foreground", children: words.loadFailed }), _jsx("p", { className: "text-xs text-muted-foreground max-w-sm", children: error })] }));
    }
    if (loading) {
        // ioiti-ui: the design's skeleton (seen in both themes: `surface-raised` is darker than the frame in dark, its
        // rows were not seen), and said, as the bell's list says it.
        return (_jsx("div", { role: "status", "aria-label": words.loadingRecords, className: "p-6 space-y-3 font-sans", children: [1, 2, 3, 4, 5].map((i) => (_jsx(Skeleton, { className: "h-9 rounded-lg" }, i))) }));
    }
    if (paginatedData.length === 0) {
        // ioiti-ui: "nothing matches" only when something is being searched or
        // filtered; a table that simply has no row says so in the caller's words.
        const filtering = data.length > 0 && (searchTerm.trim() !== '' || Object.values(activeFilters).some((values) => values.length > 0));
        if (!filtering) {
            return (_jsxs("div", { className: "py-10 sm:py-12 px-6 text-center flex flex-col items-center justify-center gap-1.5 font-sans", children: [_jsx("h4", { className: "text-sm font-semibold text-foreground text-balance", children: emptyTitle ?? words.emptyTitle }), emptyDescription && _jsx("p", { className: "text-xs text-muted-foreground max-w-sm text-pretty", children: emptyDescription })] }));
        }
        return (_jsxs("div", { className: "py-12 sm:py-16 px-6 text-center flex flex-col items-center justify-center gap-2 font-sans", children: [_jsx("div", { className: "size-9 rounded-full bg-surface-raised/40 border border-border/60 flex items-center justify-center text-muted-foreground mb-1", children: _jsx(Search, { className: "size-4" }) }), _jsx("h4", { className: "text-sm font-semibold text-foreground", children: words.noMatchTitle }), _jsx("p", { className: "text-xs text-muted-foreground max-w-xs", children: words.noMatchText }), _jsx("button", { type: "button", onClick: clearFilters, className: cn('mt-2 px-3 py-1 rounded-md border border-border bg-surface hover:bg-surface-hover text-sm text-foreground transition-colors', PRESSABLE), children: words.clearFilters })] }));
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
                return (_jsxs("div", { onClick: expandOnClick(rowId), className: cn('rounded-xl border border-border/60 bg-surface/30 p-4 space-y-2.5 sm:space-y-3 transition-colors', isSelected && 'bg-surface-raised/40 border-foreground/30 accent:border-brand', expandOnClick(rowId) && 'cursor-pointer'), children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("div", { className: "flex items-center gap-2.5 sm:gap-3 min-w-0", children: [selectable && isRowSelectable(row) && (_jsx(DrawCheckbox, { checked: isSelected, onChange: () => toggleRowSelection(rowId), "aria-label": selectLabel(row, rowId), className: "shrink-0" })), _jsx("span", { className: "font-medium text-sm text-foreground truncate", children: primaryCol?.cell
                                                ? primaryCol.cell({ row, value: primaryVal })
                                                : String(primaryVal ?? '') })] }), renderSubComponent && (_jsx("button", { type: "button", onClick: () => toggleRowExpansion(rowId), className: cn('p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors shrink-0', PRESSABLE), "aria-expanded": isExpanded, "aria-label": expandLabel(row, isExpanded), children: _jsx(motion.div, { animate: { rotate: isExpanded ? 90 : 0 }, transition: motionTransitions.springSnappy, children: _jsx(ChevronRight, { className: "size-4" }) }) }))] }), remainingCols.length > 0 && (_jsx("div", { className: "grid grid-cols-2 gap-2.5 sm:gap-3 pt-2.5 sm:pt-3 border-t border-border/40 text-sm", children: remainingCols.map((col) => {
                                const value = col.accessorKey
                                    ? row[col.accessorKey]
                                    : col.accessorFn
                                        ? col.accessorFn(row)
                                        : null;
                                return (_jsxs("div", { className: "min-w-0", children: [_jsx("span", { className: "text-xs text-muted-foreground block truncate font-normal", children: col.header }), _jsx("div", { className: "text-foreground/80 truncate mt-0.5", children: col.cell ? col.cell({ row, value }) : String(value ?? '—') })] }, col.id));
                            }) })), renderSubComponent && isExpanded && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: motionTransitions.springSnappy, className: "pt-2.5 sm:pt-3 border-t border-border/40 overflow-hidden", children: renderSubComponent(row) }))] }, rowId));
            }) }));
    }
    // DESKTOP TABLE VIEW
    return (_jsx("div", { ref: setFrame, className: cn('relative overflow-x-auto [scrollbar-width:thin] font-sans', className), children: _jsxs("table", { className: "w-full border-collapse text-left font-sans text-sm min-w-[500px] sm:min-w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border/40 bg-surface-raised/20 text-xs text-muted-foreground select-none", children: [selectable && (_jsx("th", { className: "w-10 sm:w-12 px-3.5 sm:px-6 py-3 sm:py-3.5", children: _jsx(DrawCheckbox, { checked: isAllSelected, indeterminate: isIndeterminate, onChange: toggleSelectAll, disabled: !canSelectPage, "aria-label": words.selectAll }) })), renderSubComponent && _jsx("th", { className: "w-7 sm:w-8 px-1.5 sm:px-2 py-3 sm:py-3.5" }), visibleColumns.map((col) => {
                                const isSorted = sortColumn === col.id;
                                return (_jsx("th", { style: { width: col.width }, "aria-sort": col.sortable ? (isSorted && sortDirection ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none') : undefined, className: cn('px-3.5 sm:px-5 py-3 sm:py-3.5 font-medium whitespace-nowrap', col.align === 'right' && 'text-right', col.align === 'center' && 'text-center'), children: col.sortable ? (_jsxs("button", { type: "button", onClick: () => handleSort(col.id), className: "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer", children: [_jsx("span", { children: col.header }), isSorted ? (sortDirection === 'asc' ? (_jsx(ChevronUp, { className: "size-3.5 text-foreground accent:text-brand-text" })) : (_jsx(ChevronDown, { className: "size-3.5 text-foreground accent:text-brand-text" }))) : (_jsx(ChevronsUpDown, { className: "size-3.5 opacity-30 hover:opacity-100" }))] })) : (_jsx("span", { children: col.header })) }, col.id));
                            })] }) }), _jsx("tbody", { className: "divide-y divide-border/40", children: paginatedData.map((row, index) => {
                        const rowId = getRowId(row, index);
                        const isSelected = selectedRowIds.has(rowId);
                        const isExpanded = expandedRowIds.has(rowId);
                        return (_jsxs(React.Fragment, { children: [_jsxs("tr", { onClick: expandOnClick(rowId), className: cn('transition-colors hover:bg-surface-hover group', isSelected && 'bg-surface-hover accent:bg-brand-soft', expandOnClick(rowId) && 'cursor-pointer', isExpanded && expandOnRowClick && 'bg-surface-raised/25'), children: [selectable && (_jsx("td", { className: "w-10 sm:w-12 px-3.5 sm:px-6 py-3 sm:py-3.5", children: isRowSelectable(row) && (_jsx(DrawCheckbox, { checked: isSelected, onChange: () => toggleRowSelection(rowId), "aria-label": selectLabel(row, rowId) })) })), renderSubComponent && (_jsx("td", { className: "w-7 sm:w-8 px-1.5 sm:px-2 py-3 sm:py-3.5", children: _jsx("button", { type: "button", onClick: () => toggleRowExpansion(rowId), className: cn('p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors', PRESSABLE), "aria-expanded": isExpanded, "aria-label": expandLabel(row, isExpanded), children: _jsx(motion.div, { animate: { rotate: isExpanded ? 90 : 0 }, transition: motionTransitions.springSnappy, children: _jsx(ChevronRight, { className: "size-4" }) }) }) })), visibleColumns.map((col) => {
                                            const value = col.accessorKey
                                                ? row[col.accessorKey]
                                                : col.accessorFn
                                                    ? col.accessorFn(row)
                                                    : null;
                                            return (_jsx("td", { className: cn('px-3.5 sm:px-5 py-3 sm:py-3.5 text-foreground/80 whitespace-nowrap', col.align === 'right' && 'text-right tabular-nums', col.align === 'center' && 'text-center'), children: col.cell ? col.cell({ row, value }) : String(value ?? '') }, col.id));
                                        })] }), renderSubComponent && isExpanded && (_jsx("tr", { className: "bg-surface-raised/15", children: _jsx("td", { colSpan: visibleColumns.length + (selectable ? 2 : 1), className: "p-0 border-b border-border/40", children: _jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: motionTransitions.springSnappy, 
                                            // ioiti-ui: held at the frame's left edge while the table scrolls under it, at its width.
                                            style: frameWidth ? { position: 'sticky', left: 0, width: frameWidth } : undefined, "data-row-details": "", className: "p-3.5 sm:p-6 overflow-hidden border-t border-border/40", children: renderSubComponent(row) }) }) }))] }, rowId));
                    }) })] }) }));
};
// ioiti-ui: a page's button: a control's surface and border, half its strength where it leads nowhere (DISABLED).
const PAGE_BUTTON = cn('p-1.5 rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors cursor-pointer', DISABLED);
// ioiti-ui: a word said with marks where its values go, each mark then drawn as its value: the figures of the count keep
// their own spans wherever the provider's language puts them.
const RANGE_MARK = '\uE000';
const TOTAL_MARK = '\uE001';
function Marked({ said, values }) {
    return (_jsx(_Fragment, { children: said.split(/([\uE000\uE001])/).map((part, at) => (_jsx(React.Fragment, { children: values[part] ?? part }, at))) }));
}
export const DataTablePagination = ({ pageSizeOptions = [5, 10, 20, 50], className, }) => {
    const { currentPage, setCurrentPage, pageSize, setPageSize, totalPages, totalFilteredCount, loading, } = useDataTable();
    const shouldReduceMotion = useReducedMotionConfig();
    // ioiti-ui: its words in the provider's language, its count in its locale.
    const words = useMessages().table;
    const { formatNumber } = useFormat();
    const startRecord = totalFilteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalFilteredCount);
    return (_jsxs("div", { className: cn('px-4 py-3 sm:px-7 sm:py-4 border-t border-border/40 bg-surface/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs font-sans select-none', className), children: [_jsx("div", { className: "text-muted-foreground tabular-nums", children: loading ? (words.loading) : (_jsx(Marked, { said: words.showing({ range: RANGE_MARK, total: TOTAL_MARK, count: totalFilteredCount }), values: {
                        [RANGE_MARK]: (_jsxs("span", { className: "text-foreground font-medium", children: [formatNumber(startRecord), "\u2013", formatNumber(endRecord)] })),
                        [TOTAL_MARK]: _jsx("span", { className: "text-foreground font-medium", children: formatNumber(totalFilteredCount) }),
                    } })) }), _jsxs("div", { className: "flex items-center justify-between sm:justify-end gap-2 sm:gap-4", children: [_jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [_jsx("span", { className: "text-muted-foreground hidden sm:inline", children: words.rowsPerPageLabel }), _jsx("select", { value: pageSize, onChange: (e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }, "aria-label": words.rowsPerPage, className: cn('h-8 px-2.5 rounded-lg border bg-surface text-foreground text-base sm:text-sm focus:outline-none transition-colors cursor-pointer font-sans', fieldBorder(false)), children: (pageSizeOptions.includes(pageSize) ? pageSizeOptions : [...pageSizeOptions, pageSize].sort((a, b) => a - b)).map((opt) => (_jsx("option", { value: opt, children: opt }, opt))) })] }), _jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [_jsx(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.97 }, onClick: () => setCurrentPage(1), disabled: loading || currentPage <= 1, "aria-label": words.firstPage, className: PAGE_BUTTON, children: _jsx(ChevronsLeft, { className: "size-3.5" }) }), _jsx(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.97 }, onClick: () => setCurrentPage(currentPage - 1), disabled: loading || currentPage <= 1, "aria-label": words.previousPage, className: PAGE_BUTTON, children: _jsx(ChevronLeft, { className: "size-3.5" }) }), _jsxs("span", { className: "px-2 text-foreground/90 text-xs tabular-nums font-normal", children: [currentPage, "/", totalPages || 1] }), _jsx(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.97 }, onClick: () => setCurrentPage(currentPage + 1), disabled: loading || currentPage >= totalPages, "aria-label": words.nextPage, className: PAGE_BUTTON, children: _jsx(ChevronRight, { className: "size-3.5" }) }), _jsx(motion.button, { type: "button", whileTap: shouldReduceMotion ? undefined : { scale: 0.97 }, onClick: () => setCurrentPage(totalPages), disabled: loading || currentPage >= totalPages, "aria-label": words.lastPage, className: PAGE_BUTTON, children: _jsx(ChevronsRight, { className: "size-3.5" }) })] })] })] }));
};
export function DataTable({ data, columns, getRowId = (row, i) => row.id || `row-${i}`, defaultPageSize = 10, defaultViewMode = 'auto', accentColor, selectable = true, selectedRowIds: heldSelection, onSelectionChange, isRowSelectable = () => true, selectionBasket, renderSubComponent, initialSearch = '', initialExpandedRowIds, initialFilters, state: heldState, onStateChange, expandOnRowClick = false, singleExpand = false, rowLabel, 
// ioiti-ui: `loading`, the package's word for content not there yet, where EasyUI's said `isLoading`.
loading, error, className, children, }) {
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
    // ioiti-ui: the search, filters, sort and page the page holds when it does, the table's own otherwise; each change
    // told to the page either way.
    const [ownState, setOwnState] = useState(() => ({
        search: initialSearch,
        filters: initialFilters ?? {},
        sort: null,
        page: 1,
    }));
    const tableState = heldState ?? ownState;
    const changeState = (change) => {
        const next = { ...tableState, ...change };
        if (!heldState)
            setOwnState(next);
        onStateChange?.(next);
    };
    const sortColumn = tableState.sort?.column ?? null;
    const sortDirection = tableState.sort?.direction ?? null;
    const searchTerm = tableState.search;
    const activeFilters = tableState.filters;
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
    const currentPage = tableState.page;
    const setCurrentPage = (page) => changeState({ page });
    const [pageSize, setPageSize] = useState(defaultPageSize);
    // ioiti-ui: what is found is shown from its first page, wherever the reader was.
    const setSearchTerm = (term) => changeState({ search: term, page: 1 });
    const handleSort = (columnId) => {
        if (sortColumn !== columnId)
            changeState({ sort: { column: columnId, direction: 'asc' } });
        else if (sortDirection === 'asc')
            changeState({ sort: { column: columnId, direction: 'desc' } });
        else
            changeState({ sort: null });
    };
    const toggleFilter = (columnId, value) => {
        const existing = activeFilters[columnId] || [];
        const updated = existing.includes(value) ? existing.filter((v) => v !== value) : [...existing, value];
        changeState({ filters: { ...activeFilters, [columnId]: updated }, page: 1 });
    };
    const clearFilters = () => changeState({ filters: {}, search: '', page: 1 });
    // ioiti-ui: a column's filter set at once: an option of a pair pressed, the other let go; a list cleared.
    const setFilter = (columnId, values) => changeState({ filters: { ...activeFilters, [columnId]: values }, page: 1 });
    // ioiti-ui: the rows each option of a column's filter would leave: the search and the other columns'
    // filters as they are, this column's own left out, its options being alternatives to one another.
    const countOptions = (columnId) => {
        const counts = {};
        const column = columns.find((c) => c.id === columnId);
        if (!column)
            return counts;
        const query = searchTerm.toLowerCase();
        const others = Object.entries(activeFilters).flatMap(([id, values]) => {
            const other = id !== columnId && values.length > 0 ? columns.find((c) => c.id === id) : undefined;
            return other ? [{ column: other, values }] : [];
        });
        for (const row of data) {
            if (searchTerm.trim() && !searchFinds(row, query))
                continue;
            if (!others.every((other) => filterMatches(row, other.column, other.values)))
                continue;
            for (const value of filterValues(row, column))
                counts[value] = (counts[value] ?? 0) + 1;
        }
        return counts;
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
        // ioiti-ui: the search's and the filters' rules shared with the counts of the filters' options.
        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase();
            result = result.filter((row) => searchFinds(row, query));
        }
        Object.entries(activeFilters).forEach(([colId, filterVals]) => {
            if (filterVals.length === 0)
                return;
            const col = columns.find((c) => c.id === colId);
            if (!col)
                return;
            result = result.filter((row) => filterMatches(row, col, filterVals));
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
        setFilter,
        countOptions,
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
        loading,
        error,
        accentColor,
    };
    return (_jsxs(DataTableContext.Provider, { value: contextValue, children: [_jsx("div", { style: {
                    ...(accentColor ? { '--accent-custom': accentColor } : {}),
                }, className: cn(
                // ioiti-ui: glass under the glass material, as a panel; its column list floats (glass-float).
                SECTION, 'w-full font-sans text-foreground overflow-hidden transition-colors', className), children: children || (_jsxs(_Fragment, { children: [_jsx(DataTableToolbar, {}), _jsx(DataTableFilters, {}), _jsx(DataTableContent, {}), _jsx(DataTablePagination, {})] })) }), selectionBasket && selectable && (_jsx(SelectionBasket, { mode: "sticky", className: "mt-2", selectedCount: selectedRowIds.size, totalCount: selectableIds.length, allSelected: allSelectableSelected, onSelectAll: toggleAllSelectable, onClearSelection: () => setSelectedRowIds(() => new Set()), actions: selectionBasket.actions, noun: selectionBasket.noun, linkComponent: selectionBasket.linkComponent }))] }));
}
export function AdvancedDataTable({ data, columns, title, searchPlaceholder, emptyTitle, emptyDescription, onBulkDelete, onBulkExport, ...props }) {
    return (_jsxs(DataTable, { data: data, columns: columns, ...props, children: [_jsx(DataTableToolbar, { title: title, searchPlaceholder: searchPlaceholder, onBulkDelete: onBulkDelete, onBulkExport: onBulkExport }), _jsx(DataTableFilters, {}), _jsx(DataTableContent, { emptyTitle: emptyTitle, emptyDescription: emptyDescription }), _jsx(DataTablePagination, {})] }));
}
