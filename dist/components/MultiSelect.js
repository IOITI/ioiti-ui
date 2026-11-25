import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnchoredLayer } from '../lib/anchor.js';
import { useControllableState } from '../lib/controllable.js';
import { dataAttributes } from '../lib/data-attributes.js';
import { fieldBorder, invalidOf } from '../lib/field-border.js';
import { motionTransitions } from '../lib/motion-tokens.js';
import { CLOSE_SM, FLOATING, MENU_ROW } from '../lib/recipes.js';
import { useForwardedRef } from '../lib/refs.js';
import { cn } from '../lib/utils.js';
import { useFieldControl } from './field-context.js';
import { Hint } from './Hint.js';
import { useFormat, useMessages } from './locale-context.js';
import { Badge } from './ui/badge.js';
/**
 * Several values from a list, each a chip in the field: customers, tags, countries. Typing filters the
 * list; the arrows move in it and Enter ticks or unticks; Backspace in an empty field removes the last
 * chip. With `onCreateOption`, what is typed becomes a value of its own (a tag). As Elastic UI's combo box. Its words
 * are the provider's language's, its own props given over them.
 */
export function MultiSelect({ options, value, defaultValue = [], onChange, label, id, name, placeholder, onCreateOption, maxChips, max, disabled = false, error = false, emptyText, className, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ref, ...rest }) {
    const words = useMessages().select;
    const { formatNumber } = useFormat();
    const ownName = ariaLabel ?? label;
    const listId = useId();
    const ownId = useId();
    // Named, described and marked by a Field or a FormItem around it too, its own props first: by its label's words
    // (aria-labelledby), since a label around it would name the first chip's button, and pass that button its clicks.
    const control = useFieldControl({
        id,
        fallbackId: ownId,
        labelledBy,
        named: Boolean(ownName),
        describedBy,
        invalid: invalidOf(error, ariaInvalid),
    });
    const invalid = control.invalid;
    const [chosen, setChosen] = useControllableState(value, defaultValue, onChange);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [active, setActive] = useState(0);
    const fieldRef = useRef(null);
    const [inputRef, setInput] = useForwardedRef(ref);
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
    // As many as it takes: what is not chosen yet waits for one to be removed.
    const full = max !== undefined && chosen.length >= max;
    const blocked = (row) => !!row.option.disabled || (full && (row.create || !chosen.includes(row.option.value)));
    const at = Math.min(active, Math.max(rows.length - 1, 0));
    // The option the arrows are on stays in sight.
    useEffect(() => {
        if (!open)
            return;
        document.getElementById(`${listId}-${at}`)?.scrollIntoView?.({ block: 'nearest' });
    }, [open, at, listId]);
    const toggle = (row) => {
        if (blocked(row))
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
    // Its list named as its field is.
    const named = control.labelledBy ? { 'aria-labelledby': control.labelledBy } : { 'aria-label': ownName };
    return (_jsxs("div", { ...dataAttributes(rest), className: cn('relative w-full', className), children: [_jsxs("div", { ref: fieldRef, onClick: () => inputRef.current?.focus(), 
                // The look of the form's Input, chips inside it.
                className: cn(
                // Its text 14px in (px-3.5), as the Input's: the frame's 8px and the input's 6px.
                'relative flex min-h-10 w-full cursor-text flex-wrap items-center gap-1 rounded-lg border bg-surface pl-2 py-1 text-base sm:text-sm transition-colors', 
                // Room for the arrow that says it opens a list, and the clear button before it, both keeping to the first
                // line's end however many lines the chips take.
                chosen.length > 0 && !disabled ? 'pr-16' : 'pr-8', fieldBorder(invalid, 'focus-within'), disabled && 'cursor-not-allowed opacity-50'), children: [shown.map((each) => (_jsx(Badge, { variant: "outline", onRemove: disabled ? undefined : () => setChosen(chosen.filter((value) => value !== each)), removeLabel: words.removeChoice(labelOf(each)), removeFocusable: false, children: labelOf(each) }, each))), hidden.length > 0 && (_jsx(Hint, { content: words.hiddenChoices(hidden.map(labelOf)), wrap: true, children: _jsx(Badge, { variant: "soft", children: `+${formatNumber(hidden.length)}` }) })), _jsx("input", { ref: setInput, id: control.id ?? ownId, type: "text", role: "combobox", "aria-label": ownName, "aria-labelledby": control.labelledBy, "aria-expanded": open, "aria-controls": listId, "aria-autocomplete": "list", "aria-activedescendant": open && rows.length ? `${listId}-${at}` : undefined, "aria-invalid": invalid || undefined, "aria-describedby": control.describedBy, autoComplete: "off", disabled: disabled, value: text, placeholder: chosen.length ? '' : (placeholder ?? words.choosePlaceholder), onChange: (event) => {
                            setText(event.target.value);
                            setActive(0);
                            setOpen(true);
                        }, onFocus: () => setOpen(true), onClick: () => setOpen(true), onKeyDown: onKeyDown, className: "h-7 min-w-24 flex-1 bg-transparent px-1.5 text-base sm:text-sm text-foreground placeholder:text-text-subtle focus:outline-none disabled:cursor-not-allowed" }), _jsx(ChevronsUpDown, { "aria-hidden": true, className: "pointer-events-none absolute right-2.5 top-3 size-4 shrink-0 text-muted-foreground" }), chosen.length > 0 && !disabled && (_jsx("span", { className: "absolute right-7 top-2", children: _jsx(Hint, { content: words.clear, children: _jsx("button", { type: "button", "aria-label": words.clear, onClick: (event) => {
                                    event.stopPropagation();
                                    setChosen([]);
                                    inputRef.current?.focus();
                                }, className: CLOSE_SM, children: _jsx(X, {}) }) }) }))] }), name && chosen.map((each) => _jsx("input", { type: "hidden", name: name, value: each, disabled: disabled }, each)), typeof document !== 'undefined' &&
                createPortal(_jsx(AnimatePresence, { children: open && (_jsxs(motion.div, { ref: layerRef, style: { ...layer.style, width }, initial: { opacity: 0, y: layer.side === 'top' ? 4 : -4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, className: cn('z-50 overflow-auto p-1', FLOATING), children: [full && max !== undefined && (_jsx("p", { role: "status", className: "px-2.5 pb-1 pt-1.5 text-xs text-muted-foreground", children: words.atMost(max) })), _jsxs("ul", { id: listId, role: "listbox", "aria-multiselectable": "true", ...named, className: "text-sm", children: [rows.length === 0 && _jsx("li", { className: "px-2.5 py-2 text-xs text-muted-foreground", children: emptyText ?? words.nothingMatches }), groups.map((group) => (_jsxs("li", { role: "presentation", children: [group && _jsx("div", { className: "px-2.5 pb-1 pt-2 text-xs font-medium text-text-secondary", children: group }), _jsx("ul", { role: "group", "aria-label": group || undefined, children: rows.map((row, index) => {
                                                    if ((row.create ? '' : (row.option.group ?? '')) !== group)
                                                        return null;
                                                    const ticked = !row.create && chosen.includes(row.option.value);
                                                    return (_jsxs("li", { id: `${listId}-${index}`, role: "option", "aria-selected": ticked, "aria-disabled": blocked(row) || undefined, 
                                                        // The focus stays in the field.
                                                        onPointerDown: (event) => event.preventDefault(), onClick: () => toggle(row), onPointerMove: () => setActive(index), className: cn(MENU_ROW, index === at && 'bg-surface-hover accent:bg-brand-soft accent:text-brand-text', blocked(row) && 'cursor-not-allowed opacity-50'), children: [_jsx("span", { className: "grid size-4 shrink-0 place-items-center [&>svg]:size-4", children: row.create ? _jsx(Plus, { "aria-hidden": true }) : ticked ? _jsx(Check, { "aria-hidden": true }) : null }), _jsxs("span", { className: "flex min-w-0 flex-col", children: [_jsx("span", { className: "truncate", children: row.create ? words.create(row.option.label) : row.option.label }), row.option.description && _jsx("span", { className: "text-xs text-muted-foreground", children: row.option.description })] })] }, `${row.create ? '+' : ''}${row.option.value}`));
                                                }) })] }, group || '·')))] })] })) }), document.body)] }));
}
