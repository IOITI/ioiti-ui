'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search } from 'lucide-react';
import { isPlainClick } from '../../lib/links.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { useLinkComponent, useNavigateTo } from '../link-context.js';
import { Kbd } from '../Kbd.js';

export interface SpotlightSearchItem {
  id: string;
  title: string;
  category: 'Components' | 'Documentation' | 'Actions' | 'Navigation' | string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  action?: () => void;
  /** ioiti-ui: where it leads: the entry is then a link (opened elsewhere with ⌘ or Ctrl), followed with Enter too. */
  href?: string;
  /** ioiti-ui: more words it is found by. */
  keywords?: string[];
}

export interface SpotlightSearchProps {
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Optional close callback */
  onClose?: () => void;
  /** Searchable items database override */
  items?: SpotlightSearchItem[];
  /** Search input placeholder */
  placeholder?: string;
  /** Recent searches list */
  recentSearches?: string[];
  /** Callback when an item is selected */
  onSelect?: (item: SpotlightSearchItem) => void;
  /** Enable internal global Cmd+K shortcut */
  enableGlobalShortcut?: boolean;
  /**
   * ioiti-ui: what follows an entry's `href` when Enter chooses it (the router's navigate); the
   * application's (LinkProvider) by default.
   */
  onNavigate?: (href: string) => void;
  /** ioiti-ui: what draws an entry with an `href`; the application's link (LinkProvider) by default. */
  linkComponent?: React.ElementType;
  /** ioiti-ui: told of what is typed, for entries made from it. */
  onQueryChange?: (query: string) => void;
  /** ioiti-ui: the most entries listed at once; the others are found by typing. */
  limit?: number;
  /** ioiti-ui: what the dialog is called. */
  label?: string;
  /** ioiti-ui: the entries under a heading for each category, in the order the categories first come. */
  grouped?: boolean;
  /** Custom class name */
  className?: string;
}

/** ioiti-ui: the entries by category, each category where its first entry was, the entries in their order within it. */
function byCategory(items: SpotlightSearchItem[]): SpotlightSearchItem[] {
  const order: string[] = [];
  for (const item of items) if (!order.includes(item.category)) order.push(item.category);
  return order.flatMap((category) => items.filter((item) => item.category === category));
}

/** ioiti-ui: a row of the list: a search made before (typed again when chosen), or an entry. */
type Row = { kind: 'recent'; text: string } | { kind: 'item'; item: SpotlightSearchItem };

/** ioiti-ui: every word typed is somewhere in the entry: "ema us100" finds "EMA cross on US100". */
function matches(item: SpotlightSearchItem, words: string[]): boolean {
  const text = [item.title, item.category, item.description ?? '', ...(item.keywords ?? [])].join(' ').toLowerCase();
  return words.every((word) => text.includes(word));
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  open,
  onOpenChange,
  onClose,
  items: customItems,
  placeholder = 'Search…',
  recentSearches = [],
  onSelect,
  enableGlobalShortcut = false,
  onNavigate,
  linkComponent,
  onQueryChange,
  limit = 50,
  label = 'Spotlight Search',
  grouped = false,
  className,
}) => {
  // ioiti-ui: the application's link (LinkProvider) unless one is given.
  const LinkComponent = useLinkComponent(linkComponent);
  const navigateTo = useNavigateTo();
  const uniqueId = React.useId();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  // ioiti-ui: what had the focus before, given it back on closing.
  const returnFocus = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(false);
      onClose?.();
    } else {
      setInternalOpen(false);
      onOpenChange?.(false);
      onClose?.();
    }
  }, [isControlled, onOpenChange, onClose]);

  const handleOpen = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setInternalOpen(true);
      onOpenChange?.(true);
    }
    setQuery('');
    setSelectedIndex(0);
  }, [isControlled, onOpenChange]);

  // Global shortcut (only active when enableGlobalShortcut is true and not externally controlled)
  useEffect(() => {
    if (!enableGlobalShortcut) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          handleOpen();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableGlobalShortcut, isOpen, handleClose, handleOpen]);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(timer);
    }
    returnFocus.current?.focus?.();
    returnFocus.current = null;
  }, [isOpen]);

  useEffect(() => {
    onQueryChange?.(query);
  }, [query, onQueryChange]);

  // ioiti-ui: the caller's entries only (EasyUI listed its own site's).
  const items = useMemo<SpotlightSearchItem[]>(() => customItems ?? [], [customItems]);

  const matching = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return words.length === 0 ? items : items.filter((item) => matches(item, words));
  }, [items, query]);
  const filteredItems = matching.slice(0, limit);
  // ioiti-ui: the searches made before, while nothing is typed; then the entries, by category when grouped.
  const shownItems = grouped ? byCategory(filteredItems) : filteredItems;
  const rows: Row[] = [
    ...(query === '' ? recentSearches.map((text): Row => ({ kind: 'recent', text })) : []),
    ...shownItems.map((item): Row => ({ kind: 'item', item })),
  ];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const choose = (item: SpotlightSearchItem) => {
    item.action?.();
    onSelect?.(item);
    if (item.href !== undefined) (onNavigate ?? navigateTo)(item.href);
    handleClose();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
      return;
    }

    if (rows.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % rows.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + rows.length) % rows.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = rows[selectedIndex];
      // ioiti-ui: a search made before is typed again; an entry is chosen.
      if (current?.kind === 'recent') setQuery(current.text);
      else if (current) choose(current.item);
    }
  };

  const listId = `${uniqueId}-list`;
  const optionId = (index: number) => `${uniqueId}-option-${index}`;

  return (
    <AnimatePresence>
      {isOpen && (
        // ioiti-ui: kept above the page while a page changes, as every layer over it (over-page, motion.css).
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans select-none over-page">
          {/* Calm backdrop. ioiti-ui: lighter under the glass material, and the dialog glass (glass-float). */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // ioiti-ui: the scrims' motion: easeFast arriving, easeExit leaving.
            exit={{ opacity: 0, transition: motionTransitions.easeExit }}
            transition={motionTransitions.easeFast}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm glass:bg-[var(--glass-scrim)]"
          />

          {/* Ultra-minimal Spotlight Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            // ioiti-ui: it leaves quicker than it came (easeExit), as everything that floats.
            exit={{ opacity: 0, scale: 0.98, y: -6, transition: motionTransitions.easeExit }}
            transition={motionTransitions.springSnappy}
            className={cn(
              'relative w-full max-w-lg rounded-2xl border border-border bg-surface-raised shadow-elevated overflow-hidden z-10 glass-float',
              className
            )}
          >
            {/* Top Search Input Bar with ESC */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-4 h-4 text-text-subtle shrink-0" />
              {/* ioiti-ui: a combobox over a listbox, the entry shown named for screen readers. */}
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-[16px] text-text-primary placeholder-text-muted focus:outline-none"
                aria-label="Search"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={rows[selectedIndex] ? optionId(selectedIndex) : undefined}
              />
              <kbd
                onClick={handleClose}
                className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-surface border border-border rounded cursor-pointer hover:text-text-primary transition-colors shrink-0"
              >
                ESC
              </kbd>
            </div>

            {/* Search Results List (ioiti-ui: with what each is, and its category) */}
            <div id={listId} role="listbox" aria-label={label} className="max-h-[340px] overflow-y-auto p-1.5 space-y-0.5">
              {rows.length > 0 ? (
                rows.map((row, index) => {
                  const isSelected = index === selectedIndex;
                  // ioiti-ui: the moving highlight, in the accent's tint where the theme has one (accent:).
                  const highlight = isSelected && (
                    <motion.div
                      layoutId={`spotlight-active-${uniqueId}`}
                      transition={motionTransitions.springGentle}
                      className="absolute inset-0 rounded-xl bg-surface-hover border border-border-hover accent:bg-brand-soft accent:border-brand/30 z-0"
                    />
                  );
                  const rowClass = cn(
                    'relative flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors text-sm',
                    isSelected ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                  );
                  // ioiti-ui: a heading before the first search made before, and before each category when grouped.
                  const previous = rows[index - 1];
                  const heading =
                    row.kind === 'recent'
                      ? index === 0 && 'Recent searches'
                      : grouped && (previous?.kind !== 'item' || previous.item.category !== row.item.category) && row.item.category;
                  const title = heading && (
                    <div role="presentation" className="px-3.5 pb-1 pt-2.5 text-[11px] font-medium text-text-muted">
                      {heading}
                    </div>
                  );

                  if (row.kind === 'recent') {
                    return (
                      <React.Fragment key={`recent-${row.text}`}>
                        {title}
                        <div
                          id={optionId(index)}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => setQuery(row.text)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={rowClass}
                        >
                          {highlight}
                          <span className="relative z-10 flex min-w-0 items-center gap-3">
                            <History aria-hidden className="size-4 shrink-0 text-text-muted" />
                            <span className="truncate">{row.text}</span>
                          </span>
                        </div>
                      </React.Fragment>
                    );
                  }

                  const item = row.item;
                  const content = (
                    <>
                      {highlight}
                      {/* ioiti-ui: its icon, its words, and its category where the entries are not grouped. */}
                      <span className="relative z-10 flex min-w-0 items-center gap-3">
                        {item.icon && (
                          <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-lg border border-border bg-surface text-text-secondary [&>svg]:size-4">
                            {item.icon}
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block font-medium truncate">{item.title}</span>
                          {item.description && <span className="block truncate text-xs text-text-muted">{item.description}</span>}
                        </span>
                      </span>
                      <span className="relative z-10 flex shrink-0 items-center gap-2">
                        {item.shortcut && item.shortcut.length > 0 && (
                          <span className="inline-flex items-center gap-0.5">
                            {item.shortcut.map((key) => (
                              <Kbd key={key}>{key}</Kbd>
                            ))}
                          </span>
                        )}
                        {!grouped && <span className="text-[11px] text-text-muted">{item.category}</span>}
                      </span>
                    </>
                  );

                  return (
                    <React.Fragment key={item.id}>
                      {title}
                      {item.href !== undefined ? (
                        <LinkComponent
                          id={optionId(index)}
                          role="option"
                          aria-selected={isSelected}
                          href={item.href}
                          tabIndex={-1}
                          onClick={(e: React.MouseEvent) => {
                            // A click with ⌘ or Ctrl opens it elsewhere and leaves the palette open.
                            if (!isPlainClick(e)) return;
                            item.action?.();
                            onSelect?.(item);
                            handleClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={rowClass}
                        >
                          {content}
                        </LinkComponent>
                      ) : (
                        <div
                          id={optionId(index)}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => choose(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={rowClass}
                        >
                          {content}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="py-10 text-center text-xs text-text-muted">
                  No results found for <span className="text-text-primary">"{query}"</span>
                </div>
              )}
              {matching.length > filteredItems.length && (
                <p className="px-3.5 py-2 text-xs text-text-muted">
                  {matching.length - filteredItems.length} more: type to narrow them down.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
