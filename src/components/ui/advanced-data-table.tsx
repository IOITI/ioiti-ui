'use client';

import React, { useState, useEffect, useMemo, createContext, useContext, useId, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  Download,
  AlertCircle,
  LayoutGrid,
  List,
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
// ioiti-ui: the filters' lists float as everything that floats.
import { motionTransitions } from '../../lib/motion-tokens.js';
import { SelectionBasket } from './selection-basket.js';
import type { SelectionActionItem } from './selection-basket.js';
// ioiti-ui: every box of the table is the package's checkbox, EasyUI's draw-checkbox.
import { DrawCheckbox } from './draw-checkbox.js';

// =============================================================================
// DESIGN SYSTEM CONSTANTS & SPRING TOKENS
// =============================================================================

const SPRING_PHYSICS = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 32,
  mass: 0.6,
};

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export type SortDirection = 'asc' | 'desc' | null;
export type DataTableViewMode = 'auto' | 'table' | 'cards';

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => any;
  cell?: (info: { row: T; value: any }) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: Array<{ label: string; value: string }>;
  /**
   * ioiti-ui: how its filter is drawn in the filter group. `list`: a button that opens its options to
   * tick, each with the rows it would leave, a search of its own past seven of them. `toggle`: each
   * option a button of its own, pressed one at a time. `auto` (the default): a toggle for one or two
   * options (an on/off pair: give them labels that say themselves, "Paid" and "Unpaid"), a list for more.
   */
  filterDisplay?: 'auto' | 'list' | 'toggle';
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
  // View Mode
  viewMode: DataTableViewMode;
  setViewMode: (mode: DataTableViewMode) => void;
  // Sorting
  sortColumn: string | null;
  sortDirection: SortDirection;
  handleSort: (columnId: string) => void;
  // Searching & Filtering
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilters: Record<string, string[]>;
  toggleFilter: (columnId: string, value: string) => void;
  clearFilters: () => void;
  /** ioiti-ui: a column's filter set at once (an option pressed, the other one of its pair let go; a list cleared). */
  setFilter: (columnId: string, values: string[]) => void;
  /** ioiti-ui: how many rows each option of a column's filter would leave, the search and the other filters as they are. */
  countOptions: (columnId: string) => Record<string, number>;
  // Selection
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
  // Expandable Rows
  expandedRowIds: Set<string>;
  toggleRowExpansion: (id: string) => void;
  renderSubComponent?: (row: T) => React.ReactNode;
  /** ioiti-ui: a click anywhere on a row opens it, and what names a row for its expand button. */
  expandOnRowClick: boolean;
  rowLabel?: (row: T) => string;
  // Column Visibility
  hiddenColumnIds: Set<string>;
  toggleColumnVisibility: (columnId: string) => void;
  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  totalFilteredCount: number;
  paginatedData: T[];
  // Loading & State
  isLoading?: boolean;
  error?: string | null;
  accentColor?: string;
}

const DataTableContext = createContext<DataTableContextValue | null>(null);

export function useDataTable<T = any>() {
  const ctx = useContext(DataTableContext);
  if (!ctx) {
    throw new Error('useDataTable must be used within <DataTable>');
  }
  return ctx as DataTableContextValue<T>;
}

// =============================================================================
// SUB-COMPONENTS (MINIMAL, SPATIOUS, GEIST FONT ONLY)
// =============================================================================

export interface DataTableToolbarProps {
  title?: string;
  searchPlaceholder?: string;
  onBulkDelete?: (selectedIds: string[]) => void;
  onBulkExport?: (selectedIds: string[]) => void;
  className?: string;
}

export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  title,
  searchPlaceholder = 'Search...',
  onBulkDelete,
  onBulkExport,
  className,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedRowIds,
    selectionBasket,
    columns,
    hiddenColumnIds,
    toggleColumnVisibility,
    viewMode,
    setViewMode,
  } = useDataTable();

  const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);
  // ioiti-ui: the selection basket says what is selected and what can be done with it: said once.
  const selectedCount = selectionBasket ? 0 : selectedRowIds.size;
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn('px-3.5 py-3 sm:px-7 sm:py-5 border-b border-border/50 space-y-3 sm:space-y-4 select-none', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Title or Selection Counter */}
        <div className="flex items-center gap-2.5 min-w-0">
          {title && (
            <h3 className="text-sm font-medium text-foreground tracking-tight truncate">
              {title}
            </h3>
          )}
          {selectedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted/40 border border-border/40 text-xs text-foreground font-normal">
              {/* ioiti-ui: the dot, the filters on, the boxes, the sorted column and the rows selected in the accent, where the theme has one (accent:). */}
              <span className="w-1.5 h-1.5 rounded-full bg-foreground accent:bg-brand" />
              {selectedCount} selected
            </span>
          )}
        </div>

        {/* Global Search + Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64 min-w-0">
            <Search className="w-3.5 h-3.5 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 rounded-lg border border-border/60 bg-surface-raised/20 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border transition-colors font-sans"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* View Mode Switcher */}
          <motion.button
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            className="p-1.5 sm:p-2 rounded-lg border border-border/60 bg-surface-raised/20 text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer shrink-0"
            title={viewMode === 'cards' ? 'Switch to Table view' : 'Switch to Cards view'}
            aria-label="Toggle view mode"
          >
            {viewMode === 'cards' ? <List className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
          </motion.button>

          {/* Column Visibility Menu */}
          <div className="relative shrink-0">
            <motion.button
              type="button"
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              onClick={() => setIsColumnPickerOpen(!isColumnPickerOpen)}
              className="p-1.5 sm:p-2 rounded-lg border border-border/60 bg-surface-raised/20 text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer"
              title="Toggle columns"
              aria-label="Toggle visible columns"
              aria-expanded={isColumnPickerOpen}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </motion.button>

            {isColumnPickerOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 max-h-60 overflow-y-auto rounded-xl border border-border/70 bg-surface p-2 shadow-elevated z-30 font-sans glass-float">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                  Columns
                </div>
                <div className="divide-y divide-border/40">
                  {columns.map((col) => {
                    const isVisible = !hiddenColumnIds.has(col.id);
                    return (
                      <label
                        key={col.id}
                        className="flex items-center gap-2 px-2 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-surface-hover/50 rounded-md cursor-pointer select-none font-normal"
                      >
                        <DrawCheckbox
                          checked={isVisible}
                          onChange={() => toggleColumnVisibility(col.id)}
                        />
                        <span className="truncate">{col.header}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={SPRING_PHYSICS}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-lg bg-surface-raised/30 border border-border/50 text-xs">
              <span className="text-xs text-muted-foreground font-normal">
                {selectedCount} item{selectedCount === 1 ? '' : 's'} selected:
              </span>
              <div className="flex items-center gap-2">
                {onBulkExport && (
                  <motion.button
                    type="button"
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                    onClick={() => onBulkExport(Array.from(selectedRowIds))}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/60 hover:bg-surface-hover text-foreground transition-colors text-xs font-normal cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export</span>
                  </motion.button>
                )}
                {onBulkDelete && (
                  <motion.button
                    type="button"
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                    onClick={() => onBulkDelete(Array.from(selectedRowIds))}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors text-xs font-normal cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface DataTableFiltersProps {
  className?: string;
}

// ioiti-ui: what the filters compare a row by in a column (its value as text), and whether the search finds a
// row: one rule for the rows shown and for the counts of the filters' options.
function filterValue<T>(row: T, column: ColumnDef<T>): string {
  const value = column.accessorKey ? row[column.accessorKey] : column.accessorFn ? column.accessorFn(row) : '';
  return String(value);
}

function searchFinds(row: unknown, query: string): boolean {
  return Object.values(row as Record<string, unknown>).some((value) =>
    typeof value === 'string' || typeof value === 'number' ? String(value).toLowerCase().includes(query) : false
  );
}

/** ioiti-ui: drawn as an on/off pair, or as a list (ColumnDef's filterDisplay). */
function drawnAsToggles(column: ColumnDef<any>): boolean {
  const display = column.filterDisplay ?? 'auto';
  return display === 'toggle' || (display === 'auto' && (column.filterOptions?.length ?? 0) <= 2);
}

// ioiti-ui: a button of the filter group, as Elastic UI's EuiFilterButton: the group's border around it, a
// divider between two, its ends rounded as the group is.
const FILTER_BUTTON =
  'inline-flex h-8 shrink-0 items-center gap-1.5 px-3 text-xs whitespace-nowrap transition-colors cursor-pointer first:rounded-l-[calc(var(--radius-lg)-1px)] last:rounded-r-[calc(var(--radius-lg)-1px)] hover:bg-surface-hover/60';
const FILTER_BUTTON_IDLE = 'text-muted-foreground hover:text-foreground';
// What is on, in the accent where the theme has one (accent:).
const FILTER_BUTTON_ON = 'text-foreground font-medium accent:text-brand-text';

// ioiti-ui: how many options a list has (subdued), or how many are ticked (bright): EUI's numFilters and
// numActiveFilters.
const FILTER_COUNT = 'inline-grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-medium tabular-nums';
const FILTER_COUNT_ALL = 'bg-foreground/10 text-foreground';
const FILTER_COUNT_TICKED = 'bg-foreground text-background accent:bg-brand accent:text-brand-foreground';

/** ioiti-ui: from this many options, a list has a search of its own. */
const FILTER_SEARCH_FROM = 8;
const FILTER_LIST_WIDTH = 256;
const FILTER_LIST_MARGIN = 8;

/** ioiti-ui: a column's options as buttons of their own, pressed one at a time: an on/off pair (EUI's withNext). */
function FilterToggles<T>({ column }: { column: ColumnDef<T> }) {
  const { activeFilters, setFilter } = useDataTable<T>();
  const chosen = activeFilters[column.id] ?? [];
  return (
    <>
      {column.filterOptions?.map((option) => {
        const pressed = chosen.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            // Which column it filters, said to screen readers: the label alone shows it.
            aria-label={`${column.header}: ${option.label}`}
            onClick={() => setFilter(column.id, pressed ? [] : [option.value])}
            className={cn(FILTER_BUTTON, pressed ? cn(FILTER_BUTTON_ON, 'bg-foreground/[0.06] accent:bg-brand-soft') : FILTER_BUTTON_IDLE)}
          >
            {option.label}
          </button>
        );
      })}
    </>
  );
}

interface FilterListPlace {
  left: number;
  top?: number;
  bottom?: number;
  width: number;
  maxHeight: number;
  below: boolean;
}

/**
 * ioiti-ui: where a list goes, from its button's rect: under it, or above it where the window has no room
 * below. A list open keeps its side as it follows its button; its height too as the page scrolls
 * (`keepHeight`), fitting the room a new size of the window leaves it.
 */
function placeFilterList(button: DOMRect, opened?: FilterListPlace, keepHeight = false): FilterListPlace {
  const roomBelow = window.innerHeight - button.bottom - FILTER_LIST_MARGIN;
  const roomAbove = button.top - FILTER_LIST_MARGIN;
  const width = Math.min(FILTER_LIST_WIDTH, window.innerWidth - FILTER_LIST_MARGIN * 2);
  const left = Math.min(Math.max(button.left, FILTER_LIST_MARGIN), window.innerWidth - width - FILTER_LIST_MARGIN);
  const below = opened ? opened.below : roomBelow >= 240 || roomBelow >= roomAbove;
  const maxHeight = opened && keepHeight ? opened.maxHeight : Math.max((below ? roomBelow : roomAbove) - 6, 0);
  return below
    ? { left, top: button.bottom + 6, width, maxHeight, below }
    : { left, bottom: window.innerHeight - button.top + 6, width, maxHeight, below };
}

/**
 * ioiti-ui: a column's options in a list that opens from its button (EUI's EuiFilterButton in a popover, with
 * a searchable list): each ticked or not, with the rows it would leave. Drawn in document.body at fixed
 * coordinates under its button, or above it where the window has no room below (the table's frame cuts what
 * overflows it), following its button when the page scrolls or the window changes size. The focus goes in
 * when it opens, on its search, or on its first option when a finger opened it; Escape, or a Tab past its
 * ends, gives it back to the button; a click elsewhere closes it.
 */
function FilterList<T>({ column }: { column: ColumnDef<T> }) {
  const { activeFilters, toggleFilter, setFilter, countOptions } = useDataTable<T>();
  const options = column.filterOptions ?? [];
  const chosen = activeFilters[column.id] ?? [];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [place, setPlace] = useState<FilterListPlace | null>(null);
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // What pressed the button, and whether a finger opened the list.
  const lastPointer = useRef<string | null>(null);
  const openedByFinger = useRef(false);
  const searchable = options.length >= FILTER_SEARCH_FROM;
  const counts = open ? countOptions(column.id) : {};
  // Every word typed is in the option's label.
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const listed = options.filter((option) => words.every((word) => option.label.toLowerCase().includes(word)));

  const close = (giveBackFocus: boolean) => {
    setOpen(false);
    setQuery('');
    // Placed again when it opens again: the button may have moved.
    setPlace(null);
    if (giveBackFocus) buttonRef.current?.focus();
  };

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    setPlace(placeFilterList(buttonRef.current.getBoundingClientRect()));
  }, [open]);

  // Once, when it is first placed: not again as it follows its button.
  const placed = place !== null;
  useEffect(() => {
    if (!open || !placed || !panelRef.current) return;
    // Not the search under a finger: a phone's keyboard would open over the list.
    const first = openedByFinger.current ? panelRef.current.querySelector<HTMLElement>('input[type="checkbox"]') : null;
    (first ?? panelRef.current.querySelector<HTMLElement>('input'))?.focus();
  }, [open, placed]);

  useEffect(() => {
    if (!open) return;
    const inside = (target: EventTarget | null) =>
      target instanceof Node && (!!panelRef.current?.contains(target) || !!buttonRef.current?.contains(target));
    const pointerDown = (event: PointerEvent) => {
      if (!inside(event.target)) close(false);
    };
    // A scroll or a new size moves it with its button, never closes it: a phone's keyboard scrolls the page
    // as it opens, or shortens the window, which would close the list under the finger typing in its search.
    const follow = (keepHeight: boolean) => {
      const button = buttonRef.current?.getBoundingClientRect();
      if (button) setPlace((opened) => opened && placeFilterList(button, opened, keepHeight));
    };
    // Not its own list scrolling.
    const scroll = (event: Event) => {
      if (!(event.target instanceof Node && panelRef.current?.contains(event.target))) follow(true);
    };
    const resize = () => follow(false);
    document.addEventListener('pointerdown', pointerDown);
    window.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', resize);
    return () => {
      document.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('scroll', scroll, true);
      window.removeEventListener('resize', resize);
    };
  }, [open]);

  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      // Its own: not a sheet's or a dialog's around the table.
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if (event.key !== 'Tab' || !panelRef.current) return;
    const stops = Array.from(panelRef.current.querySelectorAll<HTMLElement>('input, button')).filter((stop) => !stop.hasAttribute('disabled'));
    const leaving = event.shiftKey ? document.activeElement === stops[0] : document.activeElement === stops[stops.length - 1];
    if (leaving) {
      event.preventDefault();
      close(true);
    }
  };

  const clearColumn = () => {
    setFilter(column.id, []);
    // The button pressed goes: the focus stays in the list, on its first option.
    panelRef.current?.querySelector<HTMLInputElement>('input[type="checkbox"]')?.focus();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        onPointerDown={(event) => {
          lastPointer.current = event.pointerType;
        }}
        onClick={() => {
          // A click without a pointer before it is the keyboard's.
          const finger = lastPointer.current === 'touch' || lastPointer.current === 'pen';
          lastPointer.current = null;
          if (open) return close(false);
          openedByFinger.current = finger;
          setOpen(true);
        }}
        className={cn(FILTER_BUTTON, chosen.length > 0 ? FILTER_BUTTON_ON : FILTER_BUTTON_IDLE, open && 'bg-surface-hover/60')}
      >
        {column.header}
        <span aria-hidden className={cn(FILTER_COUNT, chosen.length > 0 ? FILTER_COUNT_TICKED : FILTER_COUNT_ALL)}>
          {chosen.length > 0 ? chosen.length : options.length}
        </span>
        <span className="sr-only">
          {chosen.length > 0 ? `, ${chosen.length} of ${options.length} chosen` : `, ${options.length} options`}
        </span>
        <ChevronDown aria-hidden className={cn('size-3 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {createPortal(
        <AnimatePresence>
          {open && place && (
            <motion.div
              ref={panelRef}
              id={`${id}-list`}
              role="group"
              aria-label={`Filter by ${column.header}`}
              onKeyDown={onPanelKeyDown}
              initial={{ opacity: 0, scale: 0.98, y: place.below ? -4 : 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, transition: motionTransitions.easeExit }}
              transition={motionTransitions.springSnappy}
              style={{
                left: place.left,
                top: place.top,
                bottom: place.bottom,
                width: place.width,
                maxHeight: place.maxHeight,
                transformOrigin: place.below ? 'top left' : 'bottom left',
              }}
              className="fixed z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-elevated font-sans select-none glass-float"
            >
              {searchable && (
                <div className="border-b border-border/60 p-2">
                  <div className="relative">
                    <Search aria-hidden className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label={`Search the options of ${column.header}`}
                      placeholder="Search…"
                      className="w-full rounded-lg border border-border/60 bg-surface-raised/20 py-1.5 pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground transition-colors focus:border-border"
                    />
                  </div>
                </div>
              )}
              <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
                {listed.length === 0 ? (
                  <p className="px-2 py-3 text-xs text-muted-foreground">No option matches.</p>
                ) : (
                  listed.map((option) => {
                    const ticked = chosen.includes(option.value);
                    const count = counts[option.value] ?? 0;
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          'flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-xs hover:bg-surface-hover/60',
                          // An option that would leave no row, unless ticked, recedes.
                          count === 0 && !ticked ? 'text-muted-foreground' : 'text-foreground'
                        )}
                      >
                        <DrawCheckbox checked={ticked} onChange={() => toggleFilter(column.id, option.value)} />
                        <span className="min-w-0 flex-1 truncate">{option.label}</span>
                        <span aria-hidden className="tabular-nums text-muted-foreground">
                          {count}
                        </span>
                        <span className="sr-only">, {count === 1 ? '1 row' : `${count} rows`}</span>
                      </label>
                    );
                  })
                )}
              </div>
              {chosen.length > 0 && (
                <div className="border-t border-border/60 p-1.5">
                  <button
                    type="button"
                    onClick={clearColumn}
                    className="w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-surface-hover/60 hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

/**
 * ioiti-ui: the filters as Elastic UI's filter group (EuiFilterGroup, EuiFilterButton), written from its
 * documentation (none of its code): one bar of buttons joined together, a column that filters a button, or an
 * on/off pair; then a way to clear them. EasyUI showed every option of every column at once.
 */
export const DataTableFilters: React.FC<DataTableFiltersProps> = ({ className }) => {
  const { columns, activeFilters, clearFilters } = useDataTable();

  const filterableColumns = columns.filter((c) => c.filterable && c.filterOptions && c.filterOptions.length > 0);
  const activeCount = Object.values(activeFilters).reduce((sum, vals) => sum + vals.length, 0);

  if (filterableColumns.length === 0) return null;

  return (
    <div className={cn('px-4 py-2 sm:px-7 sm:py-2.5 border-b border-border/50 bg-surface-raised/15 flex items-center gap-2 sm:gap-3 text-xs overflow-x-auto scrollbar-none font-sans select-none', className)}>
      <div role="group" aria-label="Filters" className="flex shrink-0 items-stretch divide-x divide-border/60 rounded-lg border border-border/60 bg-surface-raised/20">
        {filterableColumns.map((col) =>
          drawnAsToggles(col) ? <FilterToggles key={col.id} column={col} /> : <FilterList key={col.id} column={col} />
        )}
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto shrink-0 cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export interface DataTableContentProps {
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const DataTableContent: React.FC<DataTableContentProps> = ({
  className,
  emptyTitle = 'Nothing to show',
  emptyDescription,
}) => {
  const {
    columns,
    data,
    searchTerm,
    activeFilters,
    paginatedData,
    hiddenColumnIds,
    getRowId,
    sortColumn,
    sortDirection,
    handleSort,
    selectable,
    selectedRowIds,
    isRowSelectable,
    toggleRowSelection,
    toggleSelectAll,
    isAllSelected,
    canSelectPage,
    isIndeterminate,
    expandedRowIds,
    toggleRowExpansion,
    renderSubComponent,
    expandOnRowClick,
    rowLabel,
    viewMode,
    isLoading,
    error,
    clearFilters,
  } = useDataTable();

  // ioiti-ui: a click on a row opens it, unless it was meant for something inside
  // the row (a link, a button, a box) or it ended a selection of its text.
  const expandOnClick = (rowId: string) =>
    renderSubComponent && expandOnRowClick
      ? (event: React.MouseEvent<HTMLElement>) => {
          const target = event.target as HTMLElement;
          if (target.closest('a, button, input, select, textarea, label, [role="button"], [data-no-row-click]')) return;
          if (window.getSelection?.()?.toString()) return;
          toggleRowExpansion(rowId);
        }
      : undefined;
  const expandLabel = (row: any, isExpanded: boolean) => {
    const name = rowLabel ? rowLabel(row) : null;
    if (name) return isExpanded ? `Close ${name}` : `Open ${name}`;
    return isExpanded ? 'Collapse row details' : 'Expand row details';
  };
  // ioiti-ui: a row's box named after the row, as its arrow is.
  const selectLabel = (row: any, rowId: string) => {
    const name = rowLabel ? rowLabel(row) : null;
    return name ? `Select ${name}` : `Select row ${rowId}`;
  };

  const visibleColumns = useMemo(
    () => columns.filter((col) => !hiddenColumnIds.has(col.id)),
    [columns, hiddenColumnIds]
  );

  if (error) {
    return (
      <div className="py-12 px-6 text-center flex flex-col items-center justify-center gap-2 font-sans">
        <AlertCircle className="w-5 h-5 text-rose-500" />
        <p className="text-sm font-medium text-foreground">Failed to load data</p>
        <p className="text-xs text-muted-foreground max-w-sm">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-3 font-sans">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 rounded-lg bg-surface-raised/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (paginatedData.length === 0) {
    // ioiti-ui: "nothing matches" only when something is being searched or
    // filtered; a table that simply has no row says so in the caller's words.
    const filtering =
      data.length > 0 && (searchTerm.trim() !== '' || Object.values(activeFilters).some((values) => values.length > 0));
    if (!filtering) {
      return (
        <div className="py-10 sm:py-12 px-6 text-center flex flex-col items-center justify-center gap-1.5 font-sans">
          <h4 className="text-sm font-medium text-foreground">{emptyTitle}</h4>
          {emptyDescription && <p className="text-xs text-muted-foreground max-w-sm">{emptyDescription}</p>}
        </div>
      );
    }
    return (
      <div className="py-12 sm:py-16 px-6 text-center flex flex-col items-center justify-center gap-2 font-sans">
        <div className="w-9 h-9 rounded-full bg-surface-raised/40 border border-border/50 flex items-center justify-center text-muted-foreground mb-1">
          <Search className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-medium text-foreground">No matching records found</h4>
        <p className="text-xs text-muted-foreground max-w-xs">
          Nothing matches the search or the filters.
        </p>
        <button
          type="button"
          onClick={clearFilters}
          className="mt-2 px-3 py-1 rounded-md border border-border/60 hover:bg-surface-hover text-xs text-foreground transition-colors cursor-pointer"
        >
          Clear filters
        </button>
      </div>
    );
  }

  // CARDS VIEW
  if (viewMode === 'cards') {
    return (
      <div className={cn('p-3.5 sm:p-6 space-y-2.5 sm:space-y-3 font-sans', className)}>
        {paginatedData.map((row, index) => {
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

          return (
            <div
              key={rowId}
              onClick={expandOnClick(rowId)}
              className={cn(
                'rounded-xl border border-border/60 bg-surface/30 p-3.5 sm:p-4 space-y-2.5 sm:space-y-3 transition-colors',
                isSelected && 'bg-surface-raised/40 border-border',
                expandOnClick(rowId) && 'cursor-pointer'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  {selectable && isRowSelectable(row) && (
                    <DrawCheckbox
                      checked={isSelected}
                      onChange={() => toggleRowSelection(rowId)}
                      aria-label={selectLabel(row, rowId)}
                      className="shrink-0"
                    />
                  )}
                  <span className="font-medium text-xs text-foreground truncate">
                    {primaryCol?.cell
                      ? primaryCol.cell({ row, value: primaryVal })
                      : String(primaryVal ?? '')}
                  </span>
                </div>

                {renderSubComponent && (
                  <button
                    type="button"
                    onClick={() => toggleRowExpansion(rowId)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                    aria-expanded={isExpanded}
                    aria-label={expandLabel(row, isExpanded)}
                  >
                    <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={SPRING_PHYSICS}>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </motion.div>
                  </button>
                )}
              </div>

              {remainingCols.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-2.5 sm:pt-3 border-t border-border/40 text-xs">
                  {remainingCols.map((col) => {
                    const value = col.accessorKey
                      ? row[col.accessorKey]
                      : col.accessorFn
                      ? col.accessorFn(row)
                      : null;
                    return (
                      <div key={col.id} className="min-w-0">
                        <span className="text-xs text-muted-foreground block truncate font-normal">
                          {col.header}
                        </span>
                        <div className="text-foreground/80 truncate mt-0.5">
                          {col.cell ? col.cell({ row, value }) : String(value ?? '—')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {renderSubComponent && isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={SPRING_PHYSICS}
                  className="pt-2.5 sm:pt-3 border-t border-border/40 overflow-hidden"
                >
                  {renderSubComponent(row)}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // DESKTOP TABLE VIEW
  return (
    <div className={cn('overflow-x-auto scrollbar-none font-sans', className)}>
      <table className="w-full border-collapse text-left font-sans text-xs min-w-[500px] sm:min-w-full">
        <thead>
          <tr className="border-b border-border/50 bg-surface-raised/20 text-xs text-muted-foreground select-none">
            {/* Checkbox Column */}
            {selectable && (
              <th className="w-10 sm:w-12 px-3.5 sm:px-6 py-3 sm:py-3.5">
                <DrawCheckbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={toggleSelectAll}
                  disabled={!canSelectPage}
                  aria-label="Select all rows"
                />
              </th>
            )}

            {/* Expand Column */}
            {renderSubComponent && <th className="w-7 sm:w-8 px-1.5 sm:px-2 py-3 sm:py-3.5" />}

            {/* Data Columns */}
            {visibleColumns.map((col) => {
              const isSorted = sortColumn === col.id;
              return (
                <th
                  key={col.id}
                  style={{ width: col.width }}
                  className={cn(
                    'px-3.5 sm:px-5 py-3 sm:py-3.5 font-medium whitespace-nowrap',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center'
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.id)}
                      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <span>{col.header}</span>
                      {isSorted ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="w-3.5 h-3.5 text-foreground accent:text-brand-text" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-foreground accent:text-brand-text" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-3 h-3 opacity-30 hover:opacity-100" />
                      )}
                    </button>
                  ) : (
                    <span>{col.header}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-border/40">
          {paginatedData.map((row, index) => {
            const rowId = getRowId(row, index);
            const isSelected = selectedRowIds.has(rowId);
            const isExpanded = expandedRowIds.has(rowId);

            return (
              <React.Fragment key={rowId}>
                <tr
                  onClick={expandOnClick(rowId)}
                  className={cn(
                    'transition-colors hover:bg-surface-hover/40 group',
                    isSelected && 'bg-surface-raised/35 accent:bg-brand-soft',
                    expandOnClick(rowId) && 'cursor-pointer',
                    isExpanded && expandOnRowClick && 'bg-surface-raised/25'
                  )}
                >
                  {/* Checkbox Cell */}
                  {selectable && (
                    <td className="w-10 sm:w-12 px-3.5 sm:px-6 py-3 sm:py-3.5">
                      {isRowSelectable(row) && (
                        <DrawCheckbox
                          checked={isSelected}
                          onChange={() => toggleRowSelection(rowId)}
                          aria-label={selectLabel(row, rowId)}
                        />
                      )}
                    </td>
                  )}

                  {/* Expand Toggle Cell */}
                  {renderSubComponent && (
                    <td className="w-7 sm:w-8 px-1.5 sm:px-2 py-3 sm:py-3.5">
                      <button
                        type="button"
                        onClick={() => toggleRowExpansion(rowId)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        aria-expanded={isExpanded}
                        aria-label={expandLabel(row, isExpanded)}
                      >
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={SPRING_PHYSICS}
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </motion.div>
                      </button>
                    </td>
                  )}

                  {/* Data Cells */}
                  {visibleColumns.map((col) => {
                    const value = col.accessorKey
                      ? row[col.accessorKey]
                      : col.accessorFn
                      ? col.accessorFn(row)
                      : null;

                    return (
                      <td
                        key={col.id}
                        className={cn(
                          'px-3.5 sm:px-5 py-3 sm:py-3.5 text-foreground/80 whitespace-nowrap',
                          col.align === 'right' && 'text-right tabular-nums',
                          col.align === 'center' && 'text-center'
                        )}
                      >
                        {col.cell ? col.cell({ row, value }) : String(value ?? '')}
                      </td>
                    );
                  })}
                </tr>

                {/* Sub-component Expansion Drawer */}
                {renderSubComponent && isExpanded && (
                  <tr className="bg-surface-raised/15">
                    <td colSpan={visibleColumns.length + (selectable ? 2 : 1)} className="p-0 border-b border-border/50">
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={SPRING_PHYSICS}
                        className="p-3.5 sm:p-6 overflow-hidden border-t border-border/40"
                      >
                        {renderSubComponent(row)}
                      </motion.div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export interface DataTablePaginationProps {
  pageSizeOptions?: number[];
  className?: string;
}

export const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  pageSizeOptions = [5, 10, 20, 50],
  className,
}) => {
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalFilteredCount,
  } = useDataTable();
  const shouldReduceMotion = useReducedMotion();

  const startRecord = totalFilteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalFilteredCount);

  return (
    <div
      className={cn(
        'px-4 py-3 sm:px-7 sm:py-4 border-t border-border/50 bg-surface/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs font-sans select-none',
        className
      )}
    >
      {/* Count Indicator */}
      <div className="text-muted-foreground tabular-nums">
        Showing <span className="text-foreground font-medium">{startRecord}–{endRecord}</span> of{' '}
        <span className="text-foreground font-medium">{totalFilteredCount}</span> records
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
        {/* Page Size Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-muted-foreground hidden sm:inline">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            aria-label="Rows per page"
            className="px-2 py-1 rounded-md border border-border/60 bg-surface-raised/20 text-foreground text-xs focus:outline-none focus:border-border cursor-pointer font-sans"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Page Nav Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <motion.button
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage <= 1}
            aria-label="First page"
            className="p-1.5 rounded-md border border-border/60 bg-surface-raised/20 text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="p-1.5 rounded-md border border-border/60 bg-surface-raised/20 text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </motion.button>

          <span className="px-2 text-foreground/90 text-xs tabular-nums font-normal">
            {currentPage}/{totalPages || 1}
          </span>

          <motion.button
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
            className="p-1.5 rounded-md border border-border/60 bg-surface-raised/20 text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage >= totalPages}
            aria-label="Last page"
            className="p-1.5 rounded-md border border-border/60 bg-surface-raised/20 text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ROOT COMPOUND CONTAINER & CONTEXT PROVIDER
// =============================================================================

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

export function DataTable<T = any>({
  data,
  columns,
  getRowId = (row: any, i) => row.id || `row-${i}`,
  defaultPageSize = 10,
  defaultViewMode = 'auto',
  accentColor,
  selectable = true,
  selectedRowIds: heldSelection,
  onSelectionChange,
  isRowSelectable = () => true,
  selectionBasket,
  renderSubComponent,
  initialSearch = '',
  initialExpandedRowIds,
  initialFilters,
  expandOnRowClick = false,
  singleExpand = false,
  rowLabel,
  isLoading,
  error,
  className,
  children,
}: DataTableProps<T>) {
  const [viewMode, setViewMode] = useState<DataTableViewMode>(() => {
    if (defaultViewMode === 'auto') {
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
        return 'cards';
      }
      return 'table';
    }
    return defaultViewMode;
  });

  useEffect(() => {
    if (defaultViewMode !== 'auto') return;
    const handleResize = () => {
      setViewMode((prev) => {
        const isMobile = window.innerWidth < 640;
        if (isMobile && prev === 'table') return 'cards';
        if (!isMobile && prev === 'cards') return 'table';
        return prev;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [defaultViewMode]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchTerm, setSearchTermState] = useState(initialSearch);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(() => initialFilters ?? {});
  const [ownSelection, setOwnSelection] = useState<ReadonlySet<string>>(new Set());
  // ioiti-ui: the page's selection when it holds one, the table's own otherwise.
  const selectedRowIds: ReadonlySet<string> = heldSelection ?? ownSelection;
  const setSelectedRowIds = (change: (prev: ReadonlySet<string>) => Set<string>) => {
    if (heldSelection && onSelectionChange) onSelectionChange(change(heldSelection));
    else setOwnSelection((prev) => change(prev));
  };
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(() => new Set(initialExpandedRowIds));
  const [hiddenColumnIds, setHiddenColumnIds] = useState<Set<string>>(
    () => new Set(columns.filter((column) => column.defaultHidden).map((column) => column.id))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // ioiti-ui: what is found is shown from its first page, wherever the reader was.
  const setSearchTerm = (term: string) => {
    setSearchTermState(term);
    setCurrentPage(1);
  };

  const handleSort = (columnId: string) => {
    if (sortColumn !== columnId) {
      setSortColumn(columnId);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortColumn(null);
      setSortDirection(null);
    }
  };

  const toggleFilter = (columnId: string, value: string) => {
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

  // ioiti-ui: a column's filter set at once: an option of a pair pressed, the other let go; a list cleared.
  const setFilter = (columnId: string, values: string[]) => {
    setActiveFilters((prev) => ({ ...prev, [columnId]: values }));
    setCurrentPage(1);
  };

  // ioiti-ui: the rows each option of a column's filter would leave: the search and the other columns'
  // filters as they are, this column's own left out, its options being alternatives to one another.
  const countOptions = (columnId: string) => {
    const counts: Record<string, number> = {};
    const column = columns.find((c) => c.id === columnId);
    if (!column) return counts;
    const query = searchTerm.toLowerCase();
    const others = Object.entries(activeFilters).flatMap(([id, values]) => {
      const other = id !== columnId && values.length > 0 ? columns.find((c) => c.id === id) : undefined;
      return other ? [{ column: other, values }] : [];
    });
    for (const row of data) {
      if (searchTerm.trim() && !searchFinds(row, query)) continue;
      if (!others.every((other) => other.values.includes(filterValue(row, other.column)))) continue;
      const value = filterValue(row, column);
      counts[value] = (counts[value] ?? 0) + 1;
    }
    return counts;
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRowIds((prev) => {
      if (singleExpand) return prev.has(id) ? new Set() : new Set([id]);
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleColumnVisibility = (columnId: string) => {
    setHiddenColumnIds((prev) => {
      const next = new Set(prev);
      if (next.has(columnId)) next.delete(columnId);
      else next.add(columnId);
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
      if (filterVals.length === 0) return;
      const col = columns.find((c) => c.id === colId);
      if (!col) return;

      result = result.filter((row) => filterVals.includes(filterValue(row, col)));
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

          if (aVal === bVal) return 0;
          if (aVal === null || aVal === undefined) return 1;
          if (bVal === null || bVal === undefined) return -1;

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
  const currentPageIds = useMemo(
    () => paginatedData.flatMap((row, i) => (isRowSelectable(row) ? [getRowId(row, i)] : [])),
    [paginatedData, getRowId, isRowSelectable]
  );
  // ioiti-ui: every row the search and the filters leave that can be selected, on every page: the basket's "All".
  const selectableIds = useMemo(
    () => filteredData.flatMap((row, i) => (isRowSelectable(row) ? [getRowId(row, i)] : [])),
    [filteredData, getRowId, isRowSelectable]
  );
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
      } else {
        currentPageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const contextValue: DataTableContextValue<T> = {
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
    isLoading,
    error,
    accentColor,
  };

  return (
    <DataTableContext.Provider value={contextValue}>
      <div
        style={{
          fontFamily: "var(--font-sans, 'Geist', sans-serif)",
          ...(accentColor ? ({ '--accent-custom': accentColor } as React.CSSProperties) : {}),
        }}
        className={cn(
          // ioiti-ui: glass under the glass material, as a panel; its column list floats (glass-float).
          'w-full font-sans rounded-2xl border border-border/70 bg-surface/50 dark:bg-surface/25 text-foreground overflow-hidden transition-colors glass-card',
          className
        )}
      >
        {children || (
          <>
            <DataTableToolbar />
            <DataTableFilters />
            <DataTableContent />
            <DataTablePagination />
          </>
        )}
      </div>
      {/* ioiti-ui: after the frame, not in it: its overflow would hold the basket, which sticks to the bottom of the screen. */}
      {selectionBasket && selectable && (
        <SelectionBasket
          mode="sticky"
          className="mt-2"
          selectedCount={selectedRowIds.size}
          totalCount={selectableIds.length}
          allSelected={allSelectableSelected}
          onSelectAll={toggleAllSelectable}
          onClearSelection={() => setSelectedRowIds(() => new Set())}
          actions={selectionBasket.actions}
          noun={selectionBasket.noun}
          linkComponent={selectionBasket.linkComponent}
        />
      )}
    </DataTableContext.Provider>
  );
}

// =============================================================================
// STANDALONE CONVENIENCE COMPONENT
// =============================================================================

export interface AdvancedDataTableProps<T = any> extends DataTableProps<T> {
  title?: string;
  searchPlaceholder?: string;
  /** ioiti-ui: what to say when there is no row at all (as opposed to none matching a search). */
  emptyTitle?: string;
  emptyDescription?: string;
  onBulkDelete?: (selectedIds: string[]) => void;
  onBulkExport?: (selectedIds: string[]) => void;
}

export function AdvancedDataTable<T = any>({
  data,
  columns,
  title,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
  onBulkDelete,
  onBulkExport,
  ...props
}: AdvancedDataTableProps<T>) {
  return (
    <DataTable data={data} columns={columns} {...props}>
      <DataTableToolbar
        title={title}
        searchPlaceholder={searchPlaceholder}
        onBulkDelete={onBulkDelete}
        onBulkExport={onBulkExport}
      />
      <DataTableFilters />
      <DataTableContent emptyTitle={emptyTitle} emptyDescription={emptyDescription} />
      <DataTablePagination />
    </DataTable>
  );
}
