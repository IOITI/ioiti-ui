import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, X } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnchoredLayer } from '../lib/anchor.js';
import { useControllableState } from '../lib/controllable.js';
import { motionTransitions } from '../lib/motion-tokens.js';
import { cn } from '../lib/utils.js';
import { Hint } from './Hint.js';
import { Badge } from './ui/badge.js';
/**
 * Several values from a list, each a chip in the field: customers, tags, countries. Typing filters the
 * list; the arrows move in it and Enter ticks or unticks; Backspace in an empty field removes the last
 * chip. With `onCreateOption`, what is typed becomes a value of its own (a tag). As Elastic UI's combo box.
 */
export function MultiSelect({ options, value, defaultValue = [], onChange, label, id, placeholder = 'Choose…', onCreateOption, maxChips, disabled = false, error = false, emptyText = 'Nothing matches', className, }) {
    const [chosen, setChosen] = useControllableState(value, defaultValue, onChange);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [active, setActive] = useState(0);
    const listId = useId();
    const ownId = useId();
    const fieldRef = useRef(null);
    const inputRef = useRef(null);
    const layerRef = useRef(null);
    const layer = useAnchoredLayer({ open, onClose: () => setOpen(false), triggerRef: fieldRef, layerRef, focus: 'keep', offset: 4 });
    // The list as wide as the field, read as it opens.
    const [width, setWidth] = useState();
    useLayoutEffect(() => {
        if (open)
            setWidth(fieldRef.current?.offsetWidth);
    }, [open]);
    const query = text.trim().toLowerCase();
    const matches = options.filter((option) => !query || option.label.toLowerCase().includes(query) || option.description?.toLowerCase().includes(query));
    const exact = options.some((option) => option.label.toLowerCase() === query);
    const rows = [
        ...matches.map((option) => ({ option })),
        ...(onCreateOption && query && !exact ? [{ option: { value: text.trim(), label: text.trim() }, create: true }] : []),
    ];
    const groups = Array.from(new Set(rows.map((row) => (row.create ? '' : (row.option.group ?? '')))));
    const labelOf = (each) => options.find((option) => option.value === each)?.label ?? each;
    const at = Math.min(active, Math.max(rows.length - 1, 0));
    // The option the arrows are on stays in sight.
    useEffect(() => {
        if (!open)
            return;
        document.getElementById(`${listId}-${at}`)?.scrollIntoView?.({ block: 'nearest' });
    }, [open, at, listId]);
    const toggle = (row) => {
        if (row.option.disabled)
            return;
        if (row.create) {
            const made = onCreateOption?.(row.option.label);
            const madeValue = typeof made === 'string' ? made : (made?.value ?? row.option.value);
            if (!chosen.includes(madeValue))
                setChosen([...chosen, madeValue]);
            setText('');
            return;
        }
        const each = row.option.value;
        setChosen(chosen.includes(each) ? chosen.filter((value) => value !== each) : [...chosen, each]);
    };
    const onKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (!open)
                setOpen(true);
            else
                setActive((at + 1) % Math.max(rows.length, 1));
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open)
                setOpen(true);
            else
                setActive((at - 1 + rows.length) % Math.max(rows.length, 1));
        }
        else if (event.key === 'Enter') {
            if (!open || rows.length === 0)
                return;
            event.preventDefault();
            toggle(rows[at]);
        }
        else if (event.key === 'Escape') {
            if (open)
                layer.onTriggerKeyDown(event);
            else if (text) {
                event.stopPropagation();
                setText('');
            }
        }
        else if (event.key === 'Backspace' && text === '' && chosen.length > 0) {
            setChosen(chosen.slice(0, -1));
        }
        else if (event.key === 'Tab') {
            setOpen(false);
        }
    };
    const shown = maxChips === undefined ? chosen : chosen.slice(0, maxChips);
    const hidden = chosen.slice(shown.length);
    return (_jsxs("div", { className: cn('relative w-full', className), children: [_jsxs("div", { ref: fieldRef, onClick: () => inputRef.current?.focus(), 
                // The look of the form's Input, chips inside it.
                className: cn('relative flex min-h-10 w-full cursor-text flex-wrap items-center gap-1 rounded-lg border bg-white px-1.5 py-1 text-xs transition-colors dark:bg-[#141414]', 
                // Room for the clear button, which keeps to the first line's end however many lines the chips take.
                chosen.length > 0 && !disabled && 'pr-9', 'border-neutral-300 hover:border-neutral-500 dark:border-[#1F1F1F] dark:hover:border-[#4A4A4A]', 'focus-within:border-neutral-500 dark:focus-within:border-[#4A4A4A] accent:focus-within:border-brand', error && 'border-negative/60 focus-within:border-negative', disabled && 'cursor-not-allowed opacity-30'), children: [shown.map((each) => (_jsx(Badge, { variant: "outline", onRemove: disabled ? undefined : () => setChosen(chosen.filter((value) => value !== each)), removeLabel: `Remove ${labelOf(each)}`, removeFocusable: false, children: labelOf(each) }, each))), hidden.length > 0 && (_jsx(Hint, { content: hidden.map(labelOf).join(', '), wrap: true, children: _jsx(Badge, { variant: "soft", children: `+${hidden.length}` }) })), _jsx("input", { ref: inputRef, id: id ?? ownId, type: "text", role: "combobox", "aria-label": label, "aria-expanded": open, "aria-controls": listId, "aria-autocomplete": "list", "aria-activedescendant": open && rows.length ? `${listId}-${at}` : undefined, "aria-invalid": error || undefined, autoComplete: "off", disabled: disabled, value: text, placeholder: chosen.length ? '' : placeholder, onChange: (event) => {
                            setText(event.target.value);
                            setActive(0);
                            setOpen(true);
                        }, onFocus: () => setOpen(true), onClick: () => setOpen(true), onKeyDown: onKeyDown, className: "h-7 min-w-24 flex-1 bg-transparent px-1.5 text-xs text-neutral-900 placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed dark:text-[#FAFAFA]" }), chosen.length > 0 && !disabled && (_jsx("span", { className: "absolute right-1 top-1.5", children: _jsx(Hint, { content: "Clear", children: _jsx("button", { type: "button", "aria-label": "Clear", onClick: (event) => {
                                    event.stopPropagation();
                                    setChosen([]);
                                    inputRef.current?.focus();
                                }, className: "grid size-7 shrink-0 place-items-center rounded-md text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary [&>svg]:size-3.5", children: _jsx(X, {}) }) }) }))] }), typeof document !== 'undefined' &&
                createPortal(_jsx(AnimatePresence, { children: open && (_jsx(motion.div, { ref: layerRef, style: { ...layer.style, width }, initial: { opacity: 0, y: layer.side === 'top' ? 4 : -4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, className: "z-50 overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg glass-float", children: _jsxs("ul", { id: listId, role: "listbox", "aria-multiselectable": "true", "aria-label": label, className: "text-sm", children: [rows.length === 0 && _jsx("li", { className: "px-2.5 py-2 text-xs text-muted-foreground", children: emptyText }), groups.map((group) => (_jsxs("li", { role: "presentation", children: [group && _jsx("div", { className: "px-2.5 pb-1 pt-2 text-xs font-medium text-text-muted", children: group }), _jsx("ul", { role: "group", "aria-label": group || undefined, children: rows.map((row, index) => {
                                                if ((row.create ? '' : (row.option.group ?? '')) !== group)
                                                    return null;
                                                const ticked = !row.create && chosen.includes(row.option.value);
                                                return (_jsxs("li", { id: `${listId}-${index}`, role: "option", "aria-selected": ticked, "aria-disabled": row.option.disabled || undefined, 
                                                    // The focus stays in the field.
                                                    onPointerDown: (event) => event.preventDefault(), onClick: () => toggle(row), onPointerMove: () => setActive(index), className: cn('flex cursor-default select-none items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-text-primary', index === at && 'bg-surface-hover accent:bg-brand-soft accent:text-brand-text', row.option.disabled && 'cursor-not-allowed opacity-50'), children: [_jsx("span", { className: "grid size-4 shrink-0 place-items-center [&>svg]:size-3.5", children: row.create ? _jsx(Plus, { "aria-hidden": true }) : ticked ? _jsx(Check, { "aria-hidden": true }) : null }), _jsxs("span", { className: "flex min-w-0 flex-col", children: [_jsx("span", { className: "truncate", children: row.create ? `Add “${row.option.label}”` : row.option.label }), row.option.description && _jsx("span", { className: "text-xs text-muted-foreground", children: row.option.description })] })] }, `${row.create ? '+' : ''}${row.option.value}`));
                                            }) })] }, group || '·')))] }) })) }), document.body)] }));
}
