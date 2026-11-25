'use client';
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useIsPresent, useReducedMotionConfig } from 'framer-motion';
import { AlertCircle, Check, ChevronLeft, ChevronRight, History, Loader2, Search } from 'lucide-react';
import { useControllableState } from '../../lib/controllable.js';
// ioiti-ui: the focus kept as every layer over the page keeps it (useFocusScope): its own trap is gone.
import { useFocusScope } from '../../lib/focus-scope.js';
import { matchesStroke, parseKeys } from '../../lib/keys.js';
import { isPlainClick } from '../../lib/links.js';
import { matchRanges, rank, searchIndex, searchWords } from '../../lib/search.js';
import { findEntry, forgetEntry, readRemembered, rememberEntry, rememberedKey, scopeTrail } from '../../lib/spotlight.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { DIALOG, PRESSABLE, SCRIM } from '../../lib/recipes.js';
import { Hint } from '../Hint.js';
import { useLinkComponent, useNavigateTo } from '../link-context.js';
// ioiti-ui: its words in the provider's language.
import { useMessages } from '../locale-context.js';
import { useShortcut } from '../shortcuts-context.js';
import { Kbd } from '../Kbd.js';
import { Skeleton } from './skeleton.js';
// ioiti-ui: stable fallbacks, so that what is worked out from them is not worked out again at each render.
const NO_ITEMS = [];
const NO_SEARCHES = [];
// ioiti-ui: ⌘K (Ctrl K elsewhere) pressed in the palette closes it; ⌘↵ opens the entry chosen elsewhere.
const CLOSE_KEYS = parseKeys('mod+k')[0];
const OPEN_KEYS = parseKeys('mod+enter')[0];
// ioiti-ui: where the query goes in the words that say nothing was found for it, drawn in the text's colour there.
const QUERY_MARK = '\u0000';
const entryRow = (item) => ({ kind: 'entry', key: `entry:${item.id}`, item });
/**
 * ioiti-ui: a text, the words typed marked in it where the search found them (`<mark>`): underlined, in the text's
 * own colour or the strongest (no tint, which a theme or a material would have to hold at 4.5:1 again).
 */
function Marked({ text, words }) {
    const ranges = words.length === 0 ? [] : matchRanges(text, words);
    if (ranges.length === 0)
        return _jsx(_Fragment, { children: text });
    const parts = [];
    let at = 0;
    for (const [start, end] of ranges) {
        if (start > at)
            parts.push(text.slice(at, start));
        parts.push(_jsx("mark", { className: "bg-transparent text-foreground underline decoration-muted-foreground underline-offset-[3px] accent:decoration-brand", children: text.slice(start, end) }, start));
        at = end;
    }
    if (at < text.length)
        parts.push(text.slice(at));
    return _jsx(_Fragment, { children: parts });
}
export const SpotlightSearch = ({ open, onOpenChange, onClose, items, placeholder: givenPlaceholder, recentSearches = NO_SEARCHES, remember, onSelect, enableGlobalShortcut = false, onNavigate, linkComponent, onQueryChange, filter = true, loading = false, error, onRetry, limit = 50, label: givenLabel, grouped = false, closeOnSelect = true, picked, footer, className, }) => {
    // ioiti-ui: its words in the provider's language, the ones given over them; ⌘K listed under the shortcuts' own
    // Navigation, the sidebar's ⌘B's, the same word in every language.
    const { search: messages, shortcuts } = useMessages();
    const placeholder = givenPlaceholder ?? messages.placeholder;
    const label = givenLabel ?? messages.label;
    // ioiti-ui: held by its caller or by itself, as every dialog (useControllableState).
    const [isOpen, setOpen] = useControllableState(open, false, onOpenChange);
    const close = () => {
        setOpen(false);
        onClose?.();
    };
    // ioiti-ui: ⌘K (Ctrl K elsewhere) is one of the application's shortcuts: listed by `?`, waiting while a dialog
    // is open (its own too: pressed in it, the palette closes itself). EasyUI's listened to the window, Ctrl on a Mac too.
    useShortcut('mod+k', () => setOpen(true), { enabled: enableGlobalShortcut, description: label, group: shortcuts.navigation });
    // ioiti-ui: in document.body, as every dialog: drawn where it is used (a top bar), it was held by whatever makes
    // that place a stacking context or the containing block of what is fixed (a blur, a filter, a transform): the
    // page was drawn over it, its scrim and its frame cut to the bar.
    if (typeof document === 'undefined')
        return null;
    return createPortal(_jsx(AnimatePresence, { children: isOpen && (_jsx(Palette, { close: close, items: items ?? NO_ITEMS, placeholder: placeholder, recentSearches: recentSearches, remember: remember, onSelect: onSelect, onNavigate: onNavigate, linkComponent: linkComponent, onQueryChange: onQueryChange, filter: filter, loading: loading, error: error, onRetry: onRetry, limit: limit, label: label, grouped: grouped, closeOnSelect: closeOnSelect, picked: picked, footer: footer, className: className }, "palette")) }), document.body);
};
/** ioiti-ui: the palette while it is open (and while it leaves). */
function Palette({ close, items, placeholder, recentSearches, remember, onSelect, onNavigate, linkComponent, onQueryChange, filter, loading, error, onRetry, limit, label, grouped, closeOnSelect, picked, footer, className, }) {
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const LinkComponent = useLinkComponent(linkComponent);
    const navigateTo = useNavigateTo();
    // ioiti-ui: its words in the provider's language, its counts too (`words` are those typed).
    const messages = useMessages().search;
    const uniqueId = useId();
    const reduceMotion = useReducedMotionConfig();
    // ioiti-ui: leaving, it hears nothing more: Escape pressed again does not close it again.
    const present = useIsPresent();
    const [query, setQuery] = useState('');
    // ioiti-ui: the lists of entries opened, from the top (an entry's `items`), each with what was typed above it
    // (typed again on going back); found again in the entries at each render, which a search may fill meanwhile.
    const [path, setPath] = useState([]);
    const trail = useMemo(() => scopeTrail(items, path.map((step) => step.id)), [items, path]);
    const scope = trail[trail.length - 1];
    const depth = trail.length;
    const level = scope?.items ?? items;
    // ioiti-ui: which way a list arrives: from the end going into one, from the start going back.
    const direction = useRef(0);
    // ioiti-ui: the row chosen, by what it is, not where it is: it stays chosen as the entries change (found as they
    // are typed); gone, the first row is.
    const [activeKey, setActiveKey] = useState(null);
    const inputRef = useRef(null);
    const dialogRef = useRef(null);
    const scrollRef = useRef(null);
    const listRef = useRef(null);
    // ioiti-ui: as it opens, its caller is told that nothing is typed (the entries of a search made before go), and the
    // page under it holds still (as Dialog's); its field takes the focus (useFocusScope, below).
    const told = useRef(onQueryChange);
    useEffect(() => {
        told.current = onQueryChange;
    });
    useEffect(() => {
        told.current?.('');
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = overflow;
        };
    }, []);
    // ioiti-ui: the entries chosen last (`remember`), read as it opens: one that leads somewhere as it was kept (it may
    // have been found by a search, or in a list, gone from the entries since), one that acts while it is among the
    // entries or their lists (what it does is theirs).
    const keptAt = remember ? rememberedKey(remember) : undefined;
    const [remembered, setRemembered] = useState(() => (keptAt ? readRemembered(keptAt) : []));
    const keepInMind = (item) => {
        if (keptAt)
            setRemembered(rememberEntry(keptAt, { id: item.id, title: item.title, category: item.category, href: item.href }));
    };
    const rememberedItems = useMemo(() => remembered.flatMap((entry) => {
        const current = findEntry(items, entry.id);
        if (current)
            return [current];
        return entry.href === undefined ? [] : [{ id: entry.id, title: entry.title, category: entry.category, href: entry.href }];
    }), [remembered, items]);
    // ioiti-ui: the entries every word typed finds, whatever its case and accents, the best first (lib/search.ts), the
    // first `limit`; the entries chosen last and the searches made before while nothing is typed; the entries under
    // their categories when grouped, each category where its first (best) entry comes. In a list, its entries only,
    // and nothing chosen or searched before (they are the palette's own).
    const index = useMemo(() => searchIndex(level), [level]);
    const words = useMemo(() => searchWords(query), [query]);
    const matching = useMemo(() => (filter && words.length > 0 ? rank(index, words) : level), [filter, index, words, level]);
    const shown = useMemo(() => matching.slice(0, limit), [matching, limit]);
    const more = matching.length - shown.length;
    const sections = useMemo(() => {
        const result = [];
        const top = query === '' && depth === 0;
        if (top && rememberedItems.length > 0) {
            result.push({ key: 'remembered', heading: messages.recent, rows: rememberedItems.map((item) => ({ kind: 'remembered', key: `remembered:${item.id}`, item })) });
        }
        if (top && recentSearches.length > 0) {
            const searches = Array.from(new Set(recentSearches));
            result.push({ key: 'searches', heading: messages.recentSearches, rows: searches.map((text) => ({ kind: 'search', key: `search:${text}`, text })) });
        }
        if (grouped) {
            const byCategory = new Map();
            for (const item of shown) {
                const rows = byCategory.get(item.category) ?? [];
                if (rows.length === 0)
                    byCategory.set(item.category, rows);
                rows.push(entryRow(item));
            }
            for (const [category, rows] of byCategory)
                result.push({ key: `category:${category}`, heading: category, rows });
        }
        else if (shown.length > 0) {
            result.push({ key: 'entries', rows: shown.map(entryRow) });
        }
        return result;
    }, [query, depth, rememberedItems, recentSearches, grouped, shown, messages]);
    const rows = useMemo(() => sections.flatMap((section) => section.rows), [sections]);
    const activeIndex = Math.max(0, rows.findIndex((row) => row.key === activeKey));
    const active = rows[activeIndex];
    // ioiti-ui: an id for each row and heading, kept while the palette is open: never its place in the list (the same
    // place is another entry once the list changes), never its key (a category's words are no id).
    const ids = useRef(new Map());
    const idFor = (key) => {
        let id = ids.current.get(key);
        if (id === undefined) {
            id = `${uniqueId}-${ids.current.size}`;
            ids.current.set(key, id);
        }
        return id;
    };
    const listId = `${uniqueId}-list`;
    const listOpensId = `${uniqueId}-opens`;
    // ioiti-ui: one highlight under the row chosen, measured (it glides there, and holds where the list scrolls), and
    // the list's own scroll following the row the keys choose, never the page's (no scrollIntoView).
    const [box, setBox] = useState(null);
    const follow = useRef(true);
    const byPointer = useRef(false);
    const shownKey = useRef(undefined);
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
        if (!keyed)
            return;
        const top = list.offsetTop + y;
        if (top < scroller.scrollTop)
            scroller.scrollTop = Math.max(0, top - 4);
        else if (top + h > scroller.scrollTop + scroller.clientHeight)
            scroller.scrollTop = top + h - scroller.clientHeight + 4;
    });
    // ioiti-ui: the entries could not be found (NotificationBell's words for it, and its Try again).
    const failed = error !== undefined && error !== null && error !== false && error !== '';
    const failedSaid = error === true ? messages.failed : error;
    // ioiti-ui: what it says to a screen reader once typing pauses: that the search failed, that it is searching,
    // how many entries are found.
    // In a list, its title first: what is listed changed, though nothing was typed.
    const shownCount = rows.filter((row) => row.kind === 'entry').length;
    const counted = messages.results({ count: shownCount, more });
    const message = failed
        ? typeof failedSaid === 'string'
            ? failedSaid
            : messages.failed
        : loading
            ? messages.searching
            : scope
                ? messages.inList({ list: scope.title, results: counted })
                : query.trim() === ''
                    ? ''
                    : counted;
    const [said, setSaid] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => setSaid(message), 500);
        return () => clearTimeout(timer);
    }, [message]);
    const type = (text) => {
        setQuery(text);
        setActiveKey(null);
        follow.current = true;
        // ioiti-ui: told as it is typed (EasyUI's effect told it again at each render with a new function), and where.
        onQueryChange?.(text, scope);
    };
    // ioiti-ui: an entry's list opened, nothing typed in it; and closed again, what was typed above it typed again,
    // the entry it was opened from chosen.
    const enter = (item) => {
        direction.current = 1;
        setPath([...path.slice(0, depth), { id: item.id, query }]);
        setQuery('');
        setActiveKey(null);
        follow.current = true;
        onQueryChange?.('', item);
    };
    const back = () => {
        const step = path[depth - 1];
        if (!step)
            return;
        direction.current = -1;
        setPath(path.slice(0, depth - 1));
        setQuery(step.query);
        setActiveKey(`entry:${step.id}`);
        follow.current = true;
        onQueryChange?.(step.query, trail[depth - 2]);
    };
    const opens = (item) => item.items !== undefined;
    const finish = () => {
        if (present)
            close();
    };
    // ioiti-ui: an entry that leads somewhere closes it, and so does another one, unless it stays open to choose
    // more; closed first, so that a dialog its action opens finds the focus where it was before the palette.
    const choose = (item) => {
        // ioiti-ui: an entry with a list opens it, and is neither followed nor told of.
        if (opens(item)) {
            enter(item);
            return;
        }
        keepInMind(item);
        if (closeOnSelect || item.href !== undefined)
            finish();
        item.action?.();
        onSelect?.(item);
        if (item.href !== undefined)
            (onNavigate ?? navigateTo)(item.href);
    };
    const chooseRow = (row) => {
        // ioiti-ui: a search made before is typed again; an entry is chosen.
        if (row.kind === 'search')
            type(row.text);
        else
            choose(row.item);
    };
    const point = (row) => (event) => {
        // ioiti-ui: the pointer chooses where it moves (a finger scrolling the list does not), not where the list
        // scrolls under it (mouseenter did).
        if (event.pointerType === 'touch' || row.key === activeRowKey)
            return;
        byPointer.current = true;
        setActiveKey(row.key);
    };
    // ioiti-ui: the focus as every layer over the page keeps it (useFocusScope), in place of its own trap: in its field as
    // it opens; kept in it by Tab and Shift+Tab, round its field and its own buttons (a press elsewhere than on a control
    // leaving it in the field: keepFocus, below); given back to what had it as it leaves, while it is in the palette (not
    // when what an entry did took it elsewhere), after the commit (an effect's cleanup: React gives the focus back to the
    // field in it during one). Escape goes back from a list, then closes it. The latest layer opened keeps both keys: a
    // dialog under it hears neither; leaving, it hears nothing more.
    useFocusScope(dialogRef, {
        active: present,
        initialFocus: () => inputRef.current,
        onEscape: (event) => {
            event.preventDefault();
            if (scope) {
                back();
                inputRef.current?.focus({ preventScroll: true });
            }
            else
                finish();
        },
    });
    const onKeyDown = (event) => {
        // ioiti-ui: Tab and Escape are its scope's (useFocusScope, which leaves the keys that compose a character to the
        // composition). Its other keys are its own: none reaches a dialog under it nor the application's shortcuts; and a
        // key that composes a character (an IME's Enter) is the composition's.
        if (event.key === 'Tab' || event.key === 'Escape')
            return;
        event.stopPropagation();
        if (!present || event.nativeEvent.isComposing || event.keyCode === 229)
            return;
        // ioiti-ui: ⌘K closes it from anywhere.
        if (matchesStroke(event, CLOSE_KEYS)) {
            event.preventDefault();
            finish();
            return;
        }
        // ioiti-ui: the list's keys in its field only: Enter on a button of the footer is the button's.
        if (event.target !== inputRef.current)
            return;
        // ioiti-ui: Backspace in the empty field goes back from a list, once (not again as it is held).
        if (event.key === 'Backspace' && scope && query === '') {
            event.preventDefault();
            if (!event.repeat)
                back();
            return;
        }
        if (rows.length === 0)
            return;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const step = event.key === 'ArrowDown' ? 1 : -1;
            follow.current = true;
            setActiveKey(rows[(activeIndex + step + rows.length) % rows.length].key);
        }
        else if (event.key === 'Enter') {
            event.preventDefault();
            if (!active)
                return;
            // ioiti-ui: ⌘↵ (Ctrl ↵ elsewhere) opens an entry that leads somewhere in another tab, as ⌘ and a click do: by
            // the address its link was drawn with (the router's base in it), the palette left open.
            if (active.kind !== 'search' && active.item.href !== undefined && !opens(active.item) && matchesStroke(event, OPEN_KEYS)) {
                const link = document.getElementById(idFor(active.key));
                window.open(link instanceof HTMLAnchorElement ? link.href : active.item.href, '_blank', 'noopener');
                keepInMind(active.item);
                return;
            }
            chooseRow(active);
        }
        else if (event.key === 'Delete' && event.shiftKey && query === '' && active?.kind === 'remembered' && keptAt) {
            // ioiti-ui: Shift+Delete forgets an entry chosen before, as a browser's address bar does, the next one chosen.
            event.preventDefault();
            setActiveKey((rows[activeIndex + 1] ?? rows[activeIndex - 1])?.key ?? null);
            setRemembered(forgetEntry(keptAt, active.item.id));
        }
    };
    // ioiti-ui: a press in the palette leaves the focus in its field (on an entry, a heading, its margins), but on a
    // control of its own: the keys go on working, and a search made before, chosen, is typed where the focus is.
    const keepFocus = (event) => {
        if (!(event.target instanceof Element) || !event.target.closest('input, textarea, select, button, [contenteditable]')) {
            event.preventDefault();
        }
    };
    const pickedIds = useMemo(() => new Set(picked ?? []), [picked]);
    // ioiti-ui: Try again searches again, the focus back in the field (the button goes once it is done).
    const retry = failed && onRetry && (_jsx("button", { type: "button", onClick: () => {
            onRetry();
            inputRef.current?.focus({ preventScroll: true });
        }, className: "shrink-0 cursor-pointer rounded-md px-1.5 py-0.5 text-sm font-medium text-foreground underline-offset-2 hover:underline", children: messages.tryAgain }));
    const renderRow = (row) => {
        const isActive = row.key === activeRowKey;
        const rowClass = cn('relative flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors text-sm', isActive ? 'text-foreground' : 'text-text-secondary hover:text-foreground');
        if (row.kind === 'search') {
            return (_jsx("div", { id: idFor(row.key), role: "option", "aria-selected": isActive, onClick: () => type(row.text), onPointerMove: point(row), className: rowClass, children: _jsxs("span", { className: "flex min-w-0 items-center gap-3", children: [_jsx(History, { "aria-hidden": true, className: "size-4 shrink-0 text-muted-foreground" }), _jsx("span", { className: "truncate", children: row.text })] }) }, row.key));
        }
        const item = row.item;
        const isPicked = pickedIds.has(item.id);
        const isList = opens(item);
        // ioiti-ui: one chosen before, kept without its icon, is drawn with a clock; its category said beside it.
        const icon = item.icon ?? (row.kind === 'remembered' ? _jsx(History, {}) : undefined);
        const content = (_jsxs(_Fragment, { children: [_jsxs("span", { className: "flex min-w-0 items-center gap-3", children: [icon && (_jsx("span", { "aria-hidden": true, className: "grid size-7 shrink-0 place-items-center rounded-lg border border-border bg-surface text-text-secondary [&>svg]:size-4", children: icon })), _jsxs("span", { className: "min-w-0", children: [_jsx("span", { className: "block font-medium truncate", children: _jsx(Marked, { text: item.title, words: words }) }), item.description && (_jsx("span", { className: "block truncate text-xs text-muted-foreground", children: _jsx(Marked, { text: item.description, words: words }) }))] })] }), _jsxs("span", { className: "flex shrink-0 items-center gap-2", children: [typeof item.shortcut === 'string' ? (_jsx(Kbd, { keys: item.shortcut })) : (item.shortcut &&
                            item.shortcut.length > 0 && (_jsx("span", { className: "inline-flex items-center gap-0.5", children: item.shortcut.map((key) => (_jsx(Kbd, { children: key }, key))) }))), (!grouped || row.kind === 'remembered') && _jsx("span", { className: "text-xs text-muted-foreground", children: item.category }), isPicked && _jsx(Check, { "aria-hidden": true, className: "size-4 shrink-0 text-foreground accent:text-brand" }), isList && _jsx(ChevronRight, { "aria-hidden": true, className: "size-4 shrink-0 text-muted-foreground" })] })] }));
        if (item.href !== undefined && !isList) {
            return (_jsx(LinkComponent, { id: idFor(row.key), role: "option", "aria-selected": isActive, "aria-checked": picked ? isPicked : undefined, "aria-keyshortcuts": row.kind === 'remembered' ? 'Shift+Delete' : undefined, href: item.href, tabIndex: -1, onClick: (event) => {
                    // A click with ⌘ or Ctrl opens it elsewhere and leaves the palette open. ioiti-ui: remembered all the same.
                    keepInMind(item);
                    if (!isPlainClick(event))
                        return;
                    finish();
                    item.action?.();
                    onSelect?.(item);
                }, onPointerMove: point(row), className: rowClass, children: content }, row.key));
        }
        return (_jsx("div", { id: idFor(row.key), role: "option", "aria-selected": isActive, "aria-checked": picked && !isList ? isPicked : undefined, "aria-keyshortcuts": row.kind === 'remembered' ? 'Shift+Delete' : undefined, "aria-describedby": isList ? listOpensId : undefined, onClick: () => choose(item), onPointerMove: point(row), className: rowClass, children: content }, row.key));
    };
    return (_jsxs("div", { className: cn('fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans select-none over-page', !present && 'pointer-events-none'), children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, 
                // ioiti-ui: the scrims' motion: easeFast arriving, easeExit leaving.
                exit: { opacity: 0, transition: motionTransitions.easeExit }, transition: motionTransitions.easeFast, onClick: finish, className: cn('fixed inset-0', SCRIM) }), _jsxs(motion.div, { ref: dialogRef, role: "dialog", "aria-modal": present ? 'true' : undefined, "aria-label": label, onKeyDown: onKeyDown, onMouseDown: keepFocus, initial: { opacity: 0, scale: 0.98, y: -6 }, animate: { opacity: 1, scale: 1, y: 0 }, 
                // ioiti-ui: it leaves quicker than it came (easeExit), as everything that floats.
                exit: { opacity: 0, scale: 0.98, y: -6, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, className: cn(DIALOG, 'relative w-full max-w-lg overflow-hidden z-10', className), children: [_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-border", children: [loading ? (_jsx(Loader2, { "aria-hidden": true, className: "size-4 text-muted-foreground shrink-0 animate-spin" })) : (_jsx(Search, { "aria-hidden": true, className: "size-4 text-muted-foreground shrink-0" })), scope && (_jsx(Hint, { className: "min-w-0 max-w-[45%] shrink-0", content: _jsxs("span", { className: "inline-flex items-center gap-1.5", children: [messages.back, " ", _jsx(Kbd, { keys: "backspace" })] }), children: _jsxs("button", { type: "button", onClick: () => {
                                        back();
                                        inputRef.current?.focus({ preventScroll: true });
                                    }, "aria-label": messages.backFrom(scope.title), className: cn('inline-flex min-w-0 max-w-full items-center gap-1 rounded-md border border-border bg-surface px-1.5 py-0.5 text-xs font-medium text-text-secondary transition-[color,background-color,scale] hover:bg-surface-hover hover:text-foreground', PRESSABLE), children: [_jsx(ChevronLeft, { "aria-hidden": true, className: "size-3.5 shrink-0" }), _jsx("span", { className: "truncate", children: scope.title })] }) })), _jsx("input", { ref: inputRef, value: query, onChange: (event) => type(event.target.value), placeholder: scope?.placeholder ?? placeholder, className: "min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-text-subtle focus:outline-none", "aria-label": scope ? messages.searchIn(scope.title) : messages.search, role: "combobox", "aria-expanded": "true", "aria-controls": listId, "aria-autocomplete": "list", "aria-activedescendant": active ? idFor(active.key) : undefined, autoComplete: "off", autoCapitalize: "off", autoCorrect: "off", spellCheck: false }), _jsx("button", { type: "button", tabIndex: -1, onClick: finish, "aria-label": messages.close, className: "shrink-0 cursor-pointer rounded-sm transition-opacity hover:opacity-80", children: _jsx(Kbd, { keys: "escape" }) })] }), failed && rows.length > 0 && (_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-border px-4 py-2 text-sm text-negative", children: [_jsx("span", { className: "min-w-0", children: failedSaid }), retry] })), _jsxs("div", { ref: scrollRef, className: "relative max-h-[340px] overflow-y-auto overscroll-contain", children: [_jsxs(motion.div, { ref: listRef, id: listId, role: "listbox", "aria-label": scope ? scope.title : label, "aria-multiselectable": picked ? true : undefined, initial: direction.current === 0 ? false : { opacity: 0, x: direction.current * 8 }, animate: { opacity: 1, x: 0 }, transition: motionTransitions.springSnappy, className: "relative p-1.5 space-y-0.5 empty:hidden", children: [box && active && (_jsx(motion.div, { "aria-hidden": true, initial: false, animate: { y: box.y, height: box.h }, transition: reduceMotion ? { duration: 0 } : motionTransitions.springSnappy, className: "pointer-events-none absolute inset-x-1.5 top-0 rounded-lg bg-surface-hover border border-border-hover accent:bg-brand-soft accent:border-brand/30" })), sections.map((section) => {
                                        if (section.heading === undefined)
                                            return _jsx(React.Fragment, { children: section.rows.map(renderRow) }, section.key);
                                        const headingId = idFor(`heading:${section.key}`);
                                        return (_jsxs("div", { role: "group", "aria-labelledby": headingId, className: "space-y-0.5", children: [_jsx("div", { id: headingId, "aria-hidden": true, className: "px-3.5 pb-1 pt-2.5 text-xs font-medium text-muted-foreground", children: section.heading }), section.rows.map(renderRow)] }, section.key));
                                    })] }, depth), rows.length === 0 &&
                                (failed ? (_jsxs("div", { className: "py-8 px-4 text-center", children: [_jsx(AlertCircle, { "aria-hidden": true, className: "mx-auto mb-2 size-6 text-negative" }), _jsx("p", { className: "text-sm text-negative", children: failedSaid }), retry && _jsx("div", { className: "mt-3 flex justify-center", children: retry })] })) : loading ? (_jsx("div", { "aria-hidden": true, className: "space-y-0.5 p-1.5", children: [0, 1, 2].map((row) => (_jsxs("div", { className: "flex items-center gap-3 px-3.5 py-2.5", children: [_jsx(Skeleton, { className: "size-7 shrink-0 rounded-lg" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { className: "h-3 w-3/5" }), _jsx(Skeleton, { className: "h-2.5 w-2/5" })] })] }, row))) })) : (query !== '' && (_jsx("div", { className: "py-10 text-center text-xs text-muted-foreground", children: messages.noResultsFor(QUERY_MARK).split(QUERY_MARK).map((part, index) => (_jsxs(React.Fragment, { children: [index > 0 && _jsx("span", { className: "text-foreground", children: query }), part] }, index))) })))), more > 0 && (_jsx("p", { className: "px-3.5 py-2 text-xs text-muted-foreground", children: messages.more(more) }))] }), footer && _jsx("div", { className: "border-t border-border px-4 py-2.5 text-xs text-muted-foreground", children: footer }), _jsx("span", { id: listOpensId, hidden: true, children: messages.opensList }), _jsx("p", { role: "status", className: "sr-only", children: said })] })] }));
}
