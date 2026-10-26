'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { isPlainClick } from '../../lib/links.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { useLinkComponent, useNavigateTo } from '../link-context.js';
/** ioiti-ui: every word typed is somewhere in the entry: "ema us100" finds "EMA cross on US100". */
function matches(item, words) {
    const text = [item.title, item.category, item.description ?? '', ...(item.keywords ?? [])].join(' ').toLowerCase();
    return words.every((word) => text.includes(word));
}
export const SpotlightSearch = ({ open, onOpenChange, onClose, items: customItems, placeholder = 'Search…', onSelect, enableGlobalShortcut = false, onNavigate, linkComponent, onQueryChange, limit = 50, label = 'Spotlight Search', className, }) => {
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const LinkComponent = useLinkComponent(linkComponent);
    const navigateTo = useNavigateTo();
    const uniqueId = React.useId();
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    // ioiti-ui: what had the focus before, given it back on closing.
    const returnFocus = useRef(null);
    const handleClose = useCallback(() => {
        if (isControlled) {
            onOpenChange?.(false);
            onClose?.();
        }
        else {
            setInternalOpen(false);
            onOpenChange?.(false);
            onClose?.();
        }
    }, [isControlled, onOpenChange, onClose]);
    const handleOpen = useCallback(() => {
        if (isControlled) {
            onOpenChange?.(true);
        }
        else {
            setInternalOpen(true);
            onOpenChange?.(true);
        }
        setQuery('');
        setSelectedIndex(0);
    }, [isControlled, onOpenChange]);
    // Global shortcut (only active when enableGlobalShortcut is true and not externally controlled)
    useEffect(() => {
        if (!enableGlobalShortcut)
            return;
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (isOpen) {
                    handleClose();
                }
                else {
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
    const items = useMemo(() => customItems ?? [], [customItems]);
    const matching = useMemo(() => {
        const words = query.toLowerCase().split(/\s+/).filter(Boolean);
        return words.length === 0 ? items : items.filter((item) => matches(item, words));
    }, [items, query]);
    const filteredItems = matching.slice(0, limit);
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);
    const choose = (item) => {
        item.action?.();
        onSelect?.(item);
        if (item.href !== undefined)
            (onNavigate ?? navigateTo)(item.href);
        handleClose();
    };
    const handleInputKeyDown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            handleClose();
            return;
        }
        if (filteredItems.length === 0)
            return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            const current = filteredItems[selectedIndex];
            if (current)
                choose(current);
        }
    };
    const listId = `${uniqueId}-list`;
    const optionId = (index) => `${uniqueId}-option-${index}`;
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans select-none", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 }, onClick: handleClose, className: "fixed inset-0 bg-black/60 backdrop-blur-sm" }), _jsxs(motion.div, { role: "dialog", "aria-modal": "true", "aria-label": label, initial: { opacity: 0, scale: 0.98, y: -6 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.98, y: -6 }, transition: motionTransitions.springSnappy, className: cn('relative w-full max-w-lg rounded-2xl border border-border bg-surface-raised shadow-elevated overflow-hidden z-10', className), children: [_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-border", children: [_jsx(Search, { className: "w-4 h-4 text-text-subtle shrink-0" }), _jsx("input", { ref: inputRef, value: query, onChange: (e) => setQuery(e.target.value), onKeyDown: handleInputKeyDown, placeholder: placeholder, className: "flex-1 bg-transparent text-[16px] text-text-primary placeholder-text-muted focus:outline-none", "aria-label": "Search", role: "combobox", "aria-expanded": "true", "aria-controls": listId, "aria-autocomplete": "list", "aria-activedescendant": filteredItems[selectedIndex] ? optionId(selectedIndex) : undefined }), _jsx("kbd", { onClick: handleClose, className: "inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-surface border border-border rounded cursor-pointer hover:text-text-primary transition-colors shrink-0", children: "ESC" })] }), _jsxs("div", { id: listId, role: "listbox", "aria-label": label, className: "max-h-[340px] overflow-y-auto p-1.5 space-y-0.5", children: [filteredItems.length > 0 ? (filteredItems.map((item, index) => {
                                    const isSelected = index === selectedIndex;
                                    const content = (_jsxs(_Fragment, { children: [isSelected && (_jsx(motion.div, { layoutId: `spotlight-active-${uniqueId}`, transition: motionTransitions.springGentle, className: "absolute inset-0 rounded-xl bg-surface-hover border border-border-hover z-0" })), _jsxs("span", { className: "relative z-10 min-w-0", children: [_jsx("span", { className: "block font-medium truncate", children: item.title }), item.description && _jsx("span", { className: "block truncate text-xs text-text-muted", children: item.description })] }), _jsx("span", { className: "relative z-10 shrink-0 text-[11px] text-text-muted", children: item.category })] }));
                                    const rowClass = cn('relative flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors text-sm', isSelected ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary');
                                    return item.href !== undefined ? (_jsx(LinkComponent, { id: optionId(index), role: "option", "aria-selected": isSelected, href: item.href, tabIndex: -1, onClick: (e) => {
                                            // A click with ⌘ or Ctrl opens it elsewhere and leaves the palette open.
                                            if (!isPlainClick(e))
                                                return;
                                            item.action?.();
                                            onSelect?.(item);
                                            handleClose();
                                        }, onMouseEnter: () => setSelectedIndex(index), className: rowClass, children: content }, item.id)) : (_jsx("div", { id: optionId(index), role: "option", "aria-selected": isSelected, onClick: () => choose(item), onMouseEnter: () => setSelectedIndex(index), className: rowClass, children: content }, item.id));
                                })) : (_jsxs("div", { className: "py-10 text-center text-xs text-text-muted", children: ["No results found for ", _jsxs("span", { className: "text-text-primary", children: ["\"", query, "\""] })] })), matching.length > filteredItems.length && (_jsxs("p", { className: "px-3.5 py-2 text-xs text-text-muted", children: [matching.length - filteredItems.length, " more: type to narrow them down."] }))] })] })] })) }));
};
