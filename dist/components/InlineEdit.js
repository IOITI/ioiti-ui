import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Check, Loader2, Pencil, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../lib/utils.js';
import { Hint } from './Hint.js';
import { ErrorText } from './messages.js';
/**
 * A value edited where it is shown: a name, a title. It reads as text; a click or Enter turns it into a
 * field, Enter saves and Escape gives up. A save that takes its time shows it; one that fails says why and
 * keeps the field. As Elastic UI's inline edit does.
 */
export function InlineEdit({ value, onSave, label, placeholder = 'Add a value', variant = 'text', as: Tag = variant === 'title' ? 'h2' : 'span', validate, readOnly = false, className, }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const errorId = useId();
    const reading = useRef(null);
    const field = useRef(null);
    const wasEditing = useRef(false);
    // Into the field when it opens; back on the value when it closes.
    useEffect(() => {
        if (editing) {
            field.current?.focus();
            field.current?.select();
        }
        else if (wasEditing.current)
            reading.current?.focus();
        wasEditing.current = editing;
    }, [editing]);
    const title = variant === 'title';
    const size = title ? 'text-lg font-semibold tracking-tight' : 'text-sm';
    const start = () => {
        if (readOnly)
            return;
        setDraft(value);
        setError(null);
        setEditing(true);
    };
    const cancel = () => {
        setEditing(false);
        setError(null);
    };
    const save = async () => {
        if (saving)
            return;
        const wrong = validate?.(draft);
        if (wrong) {
            setError(wrong);
            return;
        }
        if (draft === value) {
            cancel();
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const answer = await onSave(draft);
            if (typeof answer === 'string')
                setError(answer);
            else if (answer !== false)
                setEditing(false);
        }
        catch {
            setError("Couldn't save. Try again.");
        }
        finally {
            setSaving(false);
        }
    };
    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            void save();
        }
        else if (event.key === 'Escape') {
            // Its own: not a dialog's or a sheet's around it.
            event.preventDefault();
            event.stopPropagation();
            cancel();
        }
    };
    if (!editing) {
        return (_jsx(Tag, { className: cn('min-w-0', size, className), children: _jsxs("button", { ref: reading, type: "button", disabled: readOnly, onClick: start, className: cn('group -mx-1.5 inline-flex max-w-full items-center gap-1.5 rounded-md px-1.5 py-0.5 text-left transition-colors', !readOnly && 'hover:bg-surface-hover', readOnly && 'cursor-default'), children: [_jsx("span", { className: cn('truncate', value ? 'text-text-primary' : 'text-muted-foreground'), children: value || placeholder }), !readOnly && (_jsxs(_Fragment, { children: [_jsx(Pencil, { "aria-hidden": true, className: "size-3.5 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" }), _jsxs("span", { className: "sr-only", children: [", edit the ", label.toLowerCase()] })] }))] }) }));
    }
    return (_jsxs("div", { className: cn('flex min-w-0 flex-col gap-1', className), children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("input", { ref: field, type: "text", "aria-label": label, "aria-invalid": error ? true : undefined, "aria-describedby": error ? errorId : undefined, value: draft, readOnly: saving, placeholder: placeholder, onChange: (event) => setDraft(event.target.value), onKeyDown: onKeyDown, className: cn('h-9 min-w-0 flex-1 rounded-md border bg-white px-2 text-text-primary focus:outline-none dark:bg-[#141414]', 'border-neutral-300 focus:border-neutral-500 dark:border-[#1F1F1F] dark:focus:border-[#4A4A4A] accent:focus:border-brand', error && 'border-negative/60 focus:border-negative', size) }), _jsx(Hint, { content: "Save", children: _jsx("button", { type: "button", "aria-label": "Save", onClick: () => void save(), className: "grid size-8 shrink-0 place-items-center rounded-md text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary [&>svg]:size-4", children: saving ? _jsx(Loader2, { "aria-hidden": true, className: "motion-safe:animate-spin" }) : _jsx(Check, { "aria-hidden": true }) }) }), _jsx(Hint, { content: "Cancel", children: _jsx("button", { type: "button", "aria-label": "Cancel", disabled: saving, onClick: cancel, className: "grid size-8 shrink-0 place-items-center rounded-md text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary disabled:opacity-40 [&>svg]:size-4", children: _jsx(X, { "aria-hidden": true }) }) })] }), error && (_jsx("span", { id: errorId, children: _jsx(ErrorText, { className: "text-xs", children: error }) }))] }));
}
