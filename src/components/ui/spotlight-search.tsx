'use client';

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useIsPresent, useReducedMotionConfig } from 'framer-motion';
import { Check, History, Search } from 'lucide-react';
import { focusables } from '../../lib/anchor.js';
import { useControllableState } from '../../lib/controllable.js';
import { matchesStroke, parseKeys } from '../../lib/keys.js';
import { isPlainClick } from '../../lib/links.js';
import { matchRanges, rank, searchIndex, searchWords } from '../../lib/search.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { useLinkComponent, useNavigateTo } from '../link-context.js';
import { useShortcut } from '../shortcuts-context.js';
import { Kbd } from '../Kbd.js';

export interface SpotlightSearchItem {
  id: string;
  /** ioiti-ui: what it is, found first by the words typed. */
  title: string;
  /** ioiti-ui: its heading where the entries are `grouped`, said beside it otherwise; found by the words typed too. */
  category: string;
  /** ioiti-ui: a second line under its title, found by the words typed after its title, its keywords, its category. */
  description?: string;
  icon?: React.ReactNode;
  /**
   * ioiti-ui: its keys, drawn beside it: `'g o'` as `Kbd` writes them on this computer (`mod` for ⌘ or Ctrl), or each
   * key as given (`['G', 'O']`). The palette does not listen for them.
   */
  shortcut?: string | string[];
  action?: () => void;
  /** ioiti-ui: where it leads: the entry is then a link (opened elsewhere with ⌘ or Ctrl), followed with Enter too. */
  href?: string;
  /** ioiti-ui: more words it is found by, after its title. */
  keywords?: string[];
}

export interface SpotlightSearchProps {
  /** ioiti-ui: open, held by the caller with `onOpenChange`; left to the palette without it. */
  open?: boolean;
  /** ioiti-ui: told when it opens and when it closes. */
  onOpenChange?: (open: boolean) => void;
  /** ioiti-ui: told once each time it closes, after `onOpenChange(false)`. */
  onClose?: () => void;
  /** ioiti-ui: the entries, listed in this order while nothing is typed, and where they are worth the same. */
  items?: SpotlightSearchItem[];
  /** ioiti-ui: the field's words while nothing is typed. */
  placeholder?: string;
  /**
   * ioiti-ui: searches made before, offered while nothing is typed: one chosen is typed again.
   * @default []
   */
  recentSearches?: string[];
  /** ioiti-ui: told of each entry chosen; not of one opened elsewhere (⌘ or Ctrl and a click). */
  onSelect?: (item: SpotlightSearchItem) => void;
  /**
   * ioiti-ui: ⌘K (Ctrl K elsewhere) opens it from any page, and closes it: a `useShortcut`, listed by `?` under
   * Navigation as its `label`, waiting while another dialog is open. For a palette that only leads somewhere.
   */
  enableGlobalShortcut?: boolean;
  /**
   * ioiti-ui: what follows an entry's `href` when Enter chooses it (the router's navigate); the
   * application's (LinkProvider) by default.
   */
  onNavigate?: (href: string) => void;
  /** ioiti-ui: what draws an entry with an `href`; the application's link (LinkProvider) by default. */
  linkComponent?: React.ElementType;
  /** ioiti-ui: told of what is typed, as it is typed, and of `''` as it opens: for entries made from it. */
  onQueryChange?: (query: string) => void;
  /**
   * ioiti-ui: `false` lists the entries as given, neither filtered nor ranked, the words typed still marked in them:
   * what a server found for the query (`onQueryChange`).
   */
  filter?: boolean;
  /** ioiti-ui: the most entries listed at once, the best first; the others are found by typing. */
  limit?: number;
  /** ioiti-ui: what the dialog is called. */
  label?: string;
  /**
   * ioiti-ui: the entries under a heading for each category, in the order the categories first come: while
   * something is typed, the category of the best entry first.
   */
  grouped?: boolean;
  /**
   * ioiti-ui: `false` keeps it open once an entry is chosen (one without an `href`), to choose another: several
   * things attached, added, ticked. Escape or a click outside closes it.
   */
  closeOnSelect?: boolean;
  /**
   * ioiti-ui: the ids of the entries chosen already, each marked with a tick (and `aria-checked`). Choosing one again
   * calls `onSelect` again: what that means (taking it back) is the application's.
   */
  picked?: string[];
  /** ioiti-ui: under the list: what was chosen, how to finish. */
  footer?: React.ReactNode;
  /** ioiti-ui: classes for the palette itself (its panel). */
  className?: string;
}

// ioiti-ui: stable fallbacks, so that what is worked out from them is not worked out again at each render.
const NO_ITEMS: SpotlightSearchItem[] = [];
const NO_SEARCHES: string[] = [];
// ioiti-ui: ⌘K (Ctrl K elsewhere) pressed in the palette closes it.
const CLOSE_KEYS = parseKeys('mod+k')[0];

/** ioiti-ui: a row of the list: a search made before (typed again when chosen), or an entry. */
type Row = { kind: 'search'; key: string; text: string } | { kind: 'entry'; key: string; item: SpotlightSearchItem };

/** ioiti-ui: rows under a heading (a group for screen readers), or rows without one. */
interface Section {
  key: string;
  heading?: string;
  rows: Row[];
}

const entryRow = (item: SpotlightSearchItem): Row => ({ kind: 'entry', key: `entry:${item.id}`, item });

/**
 * ioiti-ui: a text, the words typed marked in it where the search found them (`<mark>`): underlined, in the text's
 * own colour or the strongest (no tint, which a theme or a material would have to hold at 4.5:1 again).
 */
function Marked({ text, words }: { text: string; words: string[] }) {
  const ranges = words.length === 0 ? [] : matchRanges(text, words);
  if (ranges.length === 0) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  let at = 0;
  for (const [start, end] of ranges) {
    if (start > at) parts.push(text.slice(at, start));
    parts.push(
      <mark key={start} className="bg-transparent text-text-primary underline decoration-text-muted underline-offset-[3px] accent:decoration-brand">
        {text.slice(start, end)}
      </mark>
    );
    at = end;
  }
  if (at < text.length) parts.push(text.slice(at));
  return <>{parts}</>;
}

/** ioiti-ui: the palette's own props, its defaults given: what an opening of it draws. */
interface PaletteProps {
  layerRef: React.RefObject<HTMLDivElement | null>;
  close: () => void;
  items: SpotlightSearchItem[];
  placeholder: string;
  recentSearches: string[];
  onSelect?: (item: SpotlightSearchItem) => void;
  onNavigate?: (href: string) => void;
  linkComponent?: React.ElementType;
  onQueryChange?: (query: string) => void;
  filter: boolean;
  limit: number;
  label: string;
  grouped: boolean;
  closeOnSelect: boolean;
  picked?: string[];
  footer?: React.ReactNode;
  className?: string;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  open,
  onOpenChange,
  onClose,
  items,
  placeholder = 'Search…',
  recentSearches = NO_SEARCHES,
  onSelect,
  enableGlobalShortcut = false,
  onNavigate,
  linkComponent,
  onQueryChange,
  filter = true,
  limit = 50,
  label = 'Spotlight Search',
  grouped = false,
  closeOnSelect = true,
  picked,
  footer,
  className,
}) => {
  // ioiti-ui: held by its caller or by itself, as every dialog (useControllableState).
  const [isOpen, setOpen] = useControllableState(open, false, onOpenChange);
  const close = () => {
    setOpen(false);
    onClose?.();
  };

  // ioiti-ui: ⌘K (Ctrl K elsewhere) is one of the application's shortcuts: listed by `?`, waiting while a dialog
  // is open (its own too: pressed in it, the palette closes itself). EasyUI's listened to the window, Ctrl on a Mac too.
  useShortcut('mod+k', () => setOpen(true), { enabled: enableGlobalShortcut, description: label, group: 'Navigation' });

  // ioiti-ui: what had the focus before, read before the field takes it (a layout effect), given it back as it
  // closes, while the focus is in the palette (not when what an entry did took it elsewhere) and where it is still
  // in the page: after the commit (an effect's cleanup), as React gives the focus back to the field in it.
  const layerRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (isOpen) opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    return () => {
      const back = opener.current;
      opener.current = null;
      const active = document.activeElement;
      const inside = !active || active === document.body || !!layerRef.current?.contains(active);
      if (inside && back?.isConnected) back.focus({ preventScroll: true });
    };
  }, [isOpen]);

  // ioiti-ui: in document.body, as every dialog: drawn where it is used (a top bar), it was held by whatever makes
  // that place a stacking context or the containing block of what is fixed (a blur, a filter, a transform): the
  // page was drawn over it, its scrim and its frame cut to the bar.
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {/* ioiti-ui: each opening draws it anew: nothing typed, the first row chosen. */}
      {isOpen && (
        <Palette
          key="palette"
          layerRef={layerRef}
          close={close}
          items={items ?? NO_ITEMS}
          placeholder={placeholder}
          recentSearches={recentSearches}
          onSelect={onSelect}
          onNavigate={onNavigate}
          linkComponent={linkComponent}
          onQueryChange={onQueryChange}
          filter={filter}
          limit={limit}
          label={label}
          grouped={grouped}
          closeOnSelect={closeOnSelect}
          picked={picked}
          footer={footer}
          className={className}
        />
      )}
    </AnimatePresence>,
    document.body
  );
};

/** ioiti-ui: the palette while it is open (and while it leaves). */
function Palette({
  layerRef,
  close,
  items,
  placeholder,
  recentSearches,
  onSelect,
  onNavigate,
  linkComponent,
  onQueryChange,
  filter,
  limit,
  label,
  grouped,
  closeOnSelect,
  picked,
  footer,
  className,
}: PaletteProps) {
  // ioiti-ui: the application's link (LinkProvider) unless one is given.
  const LinkComponent = useLinkComponent(linkComponent);
  const navigateTo = useNavigateTo();
  const uniqueId = useId();
  const reduceMotion = useReducedMotionConfig();
  // ioiti-ui: leaving, it hears nothing more: Escape pressed again does not close it again.
  const present = useIsPresent();

  const [query, setQuery] = useState('');
  // ioiti-ui: the row chosen, by what it is, not where it is: it stays chosen as the entries change (found as they
  // are typed); gone, the first row is.
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ioiti-ui: as it opens, its field takes the focus, its caller is told that nothing is typed (the entries of a
  // search made before go), and the page under it holds still (as SettleModal's).
  const told = useRef(onQueryChange);
  useEffect(() => {
    told.current = onQueryChange;
  });
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
    told.current?.('');
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  // ioiti-ui: the entries every word typed finds, whatever its case and accents, the best first (lib/search.ts), the
  // first `limit`; the searches made before while nothing is typed; the entries under their categories when
  // grouped, each category where its first (best) entry comes.
  const index = useMemo(() => searchIndex(items), [items]);
  const words = useMemo(() => searchWords(query), [query]);
  const matching = useMemo(() => (filter && words.length > 0 ? rank(index, words) : items), [filter, index, words, items]);
  const shown = useMemo(() => matching.slice(0, limit), [matching, limit]);
  const more = matching.length - shown.length;
  const sections = useMemo<Section[]>(() => {
    const result: Section[] = [];
    if (query === '' && recentSearches.length > 0) {
      const searches = Array.from(new Set(recentSearches));
      result.push({ key: 'searches', heading: 'Recent searches', rows: searches.map((text): Row => ({ kind: 'search', key: `search:${text}`, text })) });
    }
    if (grouped) {
      const byCategory = new Map<string, Row[]>();
      for (const item of shown) {
        const rows = byCategory.get(item.category) ?? [];
        if (rows.length === 0) byCategory.set(item.category, rows);
        rows.push(entryRow(item));
      }
      for (const [category, rows] of byCategory) result.push({ key: `category:${category}`, heading: category, rows });
    } else if (shown.length > 0) {
      result.push({ key: 'entries', rows: shown.map(entryRow) });
    }
    return result;
  }, [query, recentSearches, grouped, shown]);
  const rows = useMemo(() => sections.flatMap((section) => section.rows), [sections]);
  const activeIndex = Math.max(0, rows.findIndex((row) => row.key === activeKey));
  const active: Row | undefined = rows[activeIndex];

  // ioiti-ui: an id for each row and heading, kept while the palette is open: never its place in the list (the same
  // place is another entry once the list changes), never its key (a category's words are no id).
  const ids = useRef(new Map<string, string>());
  const idFor = (key: string) => {
    let id = ids.current.get(key);
    if (id === undefined) {
      id = `${uniqueId}-${ids.current.size}`;
      ids.current.set(key, id);
    }
    return id;
  };
  const listId = `${uniqueId}-list`;

  // ioiti-ui: one highlight under the row chosen, measured (it glides there, and holds where the list scrolls), and
  // the list's own scroll following the row the keys choose, never the page's (no scrollIntoView).
  const [box, setBox] = useState<{ y: number; h: number } | null>(null);
  const follow = useRef(true);
  const byPointer = useRef(false);
  const shownKey = useRef<string | undefined>(undefined);
  const activeRowKey = active?.key;
  useLayoutEffect(() => {
    const element = activeRowKey === undefined ? null : document.getElementById(idFor(activeRowKey));
    const scroller = scrollRef.current;
    const list = listRef.current;
    const moved = activeRowKey !== shownKey.current;
    const keyed = follow.current || (moved && !byPointer.current);
    follow.current = false;
    byPointer.current = false;
    shownKey.current = activeRowKey;
    if (!element || !scroller || !list) {
      setBox((was) => (was === null ? was : null));
      return;
    }
    const y = element.offsetTop;
    const h = element.offsetHeight;
    setBox((was) => (was && was.y === y && was.h === h ? was : { y, h }));
    if (!keyed) return;
    const top = list.offsetTop + y;
    if (top < scroller.scrollTop) scroller.scrollTop = Math.max(0, top - 4);
    else if (top + h > scroller.scrollTop + scroller.clientHeight) scroller.scrollTop = top + h - scroller.clientHeight + 4;
  });

  // ioiti-ui: what it says to a screen reader once typing pauses: how many entries are found.
  const shownCount = rows.filter((row) => row.kind === 'entry').length;
  const message =
    query.trim() === ''
      ? ''
      : shownCount === 0
        ? 'No results'
        : `${shownCount === 1 ? '1 result' : `${shownCount} results`}${more > 0 ? `, ${more} more` : ''}`;
  const [said, setSaid] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSaid(message), 500);
    return () => clearTimeout(timer);
  }, [message]);

  const type = (text: string) => {
    setQuery(text);
    setActiveKey(null);
    follow.current = true;
    // ioiti-ui: told as it is typed (EasyUI's effect told it again at each render with a new function).
    onQueryChange?.(text);
  };

  const finish = () => {
    if (present) close();
  };

  // ioiti-ui: an entry that leads somewhere closes it, and so does another one, unless it stays open to choose
  // more; closed first, so that a dialog its action opens finds the focus where it was before the palette.
  const choose = (item: SpotlightSearchItem) => {
    if (closeOnSelect || item.href !== undefined) finish();
    item.action?.();
    onSelect?.(item);
    if (item.href !== undefined) (onNavigate ?? navigateTo)(item.href);
  };
  const chooseRow = (row: Row) => {
    // ioiti-ui: a search made before is typed again; an entry is chosen.
    if (row.kind === 'search') type(row.text);
    else choose(row.item);
  };
  const point = (row: Row) => (event: React.PointerEvent) => {
    // ioiti-ui: the pointer chooses where it moves (a finger scrolling the list does not), not where the list
    // scrolls under it (mouseenter did).
    if (event.pointerType === 'touch' || row.key === activeRowKey) return;
    byPointer.current = true;
    setActiveKey(row.key);
  };

  // ioiti-ui: Tab and Shift+Tab go round what the palette holds (its field, its footer's buttons): the focus stays in it.
  const cycle = (event: React.KeyboardEvent) => {
    event.preventDefault();
    const stops = dialogRef.current ? focusables(dialogRef.current) : [];
    if (stops.length === 0) return;
    const at = stops.indexOf(document.activeElement as HTMLElement);
    const next = event.shiftKey ? (at <= 0 ? stops.length - 1 : at - 1) : (at + 1) % stops.length;
    stops[next].focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // ioiti-ui: its keys are its own: none reaches a dialog under it (its Escape, its Tab) nor the application's
    // shortcuts; and a key that composes a character (an IME's Enter, its Escape) is the composition's.
    event.stopPropagation();
    if (!present || event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === 'Escape' || matchesStroke(event, CLOSE_KEYS)) {
      event.preventDefault();
      finish();
      return;
    }
    if (event.key === 'Tab') {
      cycle(event);
      return;
    }
    // ioiti-ui: the list's keys in its field only: Enter on a button of the footer is the button's.
    if (event.target !== inputRef.current || rows.length === 0) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      follow.current = true;
      setActiveKey(rows[(activeIndex + step + rows.length) % rows.length].key);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (active) chooseRow(active);
    }
  };

  // ioiti-ui: a press in the palette leaves the focus in its field (on an entry, a heading, its margins), but on a
  // control of its own: the keys go on working, and a search made before, chosen, is typed where the focus is.
  const keepFocus = (event: React.MouseEvent) => {
    if (!(event.target instanceof Element) || !event.target.closest('input, textarea, select, button, [contenteditable]')) {
      event.preventDefault();
    }
  };

  const pickedIds = useMemo(() => new Set(picked ?? []), [picked]);

  const renderRow = (row: Row) => {
    const isActive = row.key === activeRowKey;
    const rowClass = cn(
      'relative flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors text-sm',
      isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
    );

    if (row.kind === 'search') {
      return (
        <div
          key={row.key}
          id={idFor(row.key)}
          role="option"
          aria-selected={isActive}
          onClick={() => type(row.text)}
          onPointerMove={point(row)}
          className={rowClass}
        >
          <span className="flex min-w-0 items-center gap-3">
            <History aria-hidden className="size-4 shrink-0 text-text-muted" />
            <span className="truncate">{row.text}</span>
          </span>
        </div>
      );
    }

    const item = row.item;
    const isPicked = pickedIds.has(item.id);
    const content = (
      <>
        {/* ioiti-ui: its icon, its words, and its category where the entries are not grouped. */}
        <span className="flex min-w-0 items-center gap-3">
          {item.icon && (
            <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-lg border border-border bg-surface text-text-secondary [&>svg]:size-4">
              {item.icon}
            </span>
          )}
          <span className="min-w-0">
            {/* ioiti-ui: the words typed marked where they are found. */}
            <span className="block font-medium truncate">
              <Marked text={item.title} words={words} />
            </span>
            {item.description && (
              <span className="block truncate text-xs text-text-muted">
                <Marked text={item.description} words={words} />
              </span>
            )}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {/* ioiti-ui: keys as this computer writes them (`Kbd keys`), or each as given. */}
          {typeof item.shortcut === 'string' ? (
            <Kbd keys={item.shortcut} />
          ) : (
            item.shortcut &&
            item.shortcut.length > 0 && (
              <span className="inline-flex items-center gap-0.5">
                {item.shortcut.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </span>
            )
          )}
          {!grouped && <span className="text-[11px] text-text-muted">{item.category}</span>}
          {/* ioiti-ui: chosen already. */}
          {isPicked && <Check aria-hidden className="size-4 shrink-0 text-text-primary accent:text-brand" />}
        </span>
      </>
    );

    if (item.href !== undefined) {
      return (
        <LinkComponent
          key={row.key}
          id={idFor(row.key)}
          role="option"
          aria-selected={isActive}
          aria-checked={picked ? isPicked : undefined}
          href={item.href}
          tabIndex={-1}
          onClick={(event: React.MouseEvent) => {
            // A click with ⌘ or Ctrl opens it elsewhere and leaves the palette open.
            if (!isPlainClick(event)) return;
            finish();
            item.action?.();
            onSelect?.(item);
          }}
          onPointerMove={point(row)}
          className={rowClass}
        >
          {content}
        </LinkComponent>
      );
    }
    return (
      <div
        key={row.key}
        id={idFor(row.key)}
        role="option"
        aria-selected={isActive}
        aria-checked={picked ? isPicked : undefined}
        onClick={() => choose(item)}
        onPointerMove={point(row)}
        className={rowClass}
      >
        {content}
      </div>
    );
  };

  return (
    // ioiti-ui: kept above the page while a page changes, as every layer over it (over-page, motion.css).
    <div
      ref={layerRef}
      className={cn(
        'fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans select-none over-page',
        !present && 'pointer-events-none'
      )}
    >
      {/* Calm backdrop. ioiti-ui: lighter under the glass material, and the dialog glass (glass-float). */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        // ioiti-ui: the scrims' motion: easeFast arriving, easeExit leaving.
        exit={{ opacity: 0, transition: motionTransitions.easeExit }}
        transition={motionTransitions.easeFast}
        onClick={finish}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm glass:bg-[var(--glass-scrim)]"
      />

      {/* Ultra-minimal Spotlight Container */}
      <motion.div
        ref={dialogRef}
        role="dialog"
        // ioiti-ui: leaving, it is no longer a dialog that holds the page: the application's shortcuts are heard again.
        aria-modal={present ? 'true' : undefined}
        aria-label={label}
        onKeyDown={onKeyDown}
        onMouseDown={keepFocus}
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
          <Search aria-hidden className="w-4 h-4 text-text-subtle shrink-0" />
          {/* ioiti-ui: a combobox over a listbox, the entry shown named for screen readers. */}
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => type(event.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-[16px] text-text-primary placeholder-text-muted focus:outline-none"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active ? idFor(active.key) : undefined}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {/* ioiti-ui: Escape, drawn as every key is (Kbd), closes it when clicked too. */}
          <button
            type="button"
            tabIndex={-1}
            onClick={finish}
            aria-label="Close"
            className="shrink-0 cursor-pointer rounded transition-opacity hover:opacity-80"
          >
            <Kbd>Esc</Kbd>
          </button>
        </div>

        {/* Search Results List (ioiti-ui: what scrolls is a box of its own, its end not passing the scroll on to the page) */}
        <div ref={scrollRef} className="relative max-h-[340px] overflow-y-auto overscroll-contain">
          {/* ioiti-ui: options only, under their headings as groups; what is said of the list is outside it. */}
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={label}
            aria-multiselectable={picked ? true : undefined}
            className="relative p-1.5 space-y-0.5 empty:hidden"
          >
            {box && active && (
              // ioiti-ui: the moving highlight, in the accent's tint where the theme has one (accent:), springSnappy as
              // what moves within a layer (Combobox's), at once where motion is reduced (a height MotionConfig keeps).
              <motion.div
                aria-hidden
                initial={false}
                animate={{ y: box.y, height: box.h }}
                transition={reduceMotion ? { duration: 0 } : motionTransitions.springSnappy}
                className="pointer-events-none absolute inset-x-1.5 top-0 rounded-xl bg-surface-hover border border-border-hover accent:bg-brand-soft accent:border-brand/30"
              />
            )}
            {sections.map((section) => {
              if (section.heading === undefined) return <React.Fragment key={section.key}>{section.rows.map(renderRow)}</React.Fragment>;
              const headingId = idFor(`heading:${section.key}`);
              return (
                // ioiti-ui: a heading names its group; hidden itself, as the group says it.
                <div key={section.key} role="group" aria-labelledby={headingId} className="space-y-0.5">
                  <div id={headingId} aria-hidden className="px-3.5 pb-1 pt-2.5 text-[11px] font-medium text-text-muted">
                    {section.heading}
                  </div>
                  {section.rows.map(renderRow)}
                </div>
              );
            })}
          </div>
          {rows.length === 0 && query !== '' && (
            <div className="py-10 text-center text-xs text-text-muted">
              No results found for <span className="text-text-primary">"{query}"</span>
            </div>
          )}
          {more > 0 && (
            <p className="px-3.5 py-2 text-xs text-text-muted">
              {more} more: type to narrow them down.
            </p>
          )}
        </div>
        {footer && <div className="border-t border-border px-4 py-2.5 text-xs text-text-muted">{footer}</div>}
        {/* ioiti-ui: said once typing pauses, in the dialog (a screen reader may hear nothing outside it). */}
        <p role="status" className="sr-only">
          {said}
        </p>
      </motion.div>
    </div>
  );
}
