import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Check, Loader2, Pencil, X } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { dataAttributes } from '../lib/data-attributes.js';
import { fieldBorder, invalidOf } from '../lib/field-border.js';
import { PRESSABLE } from '../lib/recipes.js';
import { assignRef } from '../lib/refs.js';
import { cn } from '../lib/utils.js';
import { joinIds, useFieldControl, useLabelWords } from './field-context.js';
import { Hint } from './Hint.js';
import { useMessages } from './locale-context.js';
import { ErrorText } from './messages.js';
/**
 * A value edited where it is shown: a name, a title. It reads as text; a click or Enter turns it into a
 * field, Enter saves and Escape gives up. A save that takes its time shows it; one that fails says why and
 * keeps the field. As Elastic UI's inline edit does. Its words are the provider's language's.
 */
export function InlineEdit({ value, onSave, label: givenLabel, placeholder: givenPlaceholder, variant = 'text', as: Tag = variant === 'title' ? 'h2' : 'span', validate, readOnly = false, className, id, name, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ref, ...rest }) {
    const words = useMessages().field;
    const placeholder = givenPlaceholder ?? words.addValue;
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const errorId = useId();
    const ownId = useId();
    const reading = useRef(null);
    const field = useRef(null);
    const wasEditing = useRef(false);
    // What the value is: its own words, else those of what names it (a Field's label, a FormItem's), which describes it
    // and marks it too. Its control, the button then the field, takes the id their label points to.
    const ownLabel = givenLabel ?? ariaLabel;
    const control = useFieldControl({
        id,
        fallbackId: ownId,
        labelledBy,
        named: Boolean(ownLabel),
        describedBy,
        invalid: invalidOf(undefined, ariaInvalid),
    });
    const labelWords = useLabelWords(control.labelledBy);
    const label = ownLabel ?? labelWords;
    const data = dataAttributes(rest);
    // Its control given to its caller's ref too: the button, then the field.
    const setReading = useCallback((element) => {
        reading.current = element;
        assignRef(ref, element);
    }, [ref]);
    const setField = useCallback((element) => {
        field.current = element;
        assignRef(ref, element);
    }, [ref]);
    // The value saved, sent with the form around it under its `name`.
    const sent = name ? _jsx("input", { type: "hidden", name: name, value: value }) : null;
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
            setError(words.saveFailed);
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
        return (_jsxs(Tag, { ...data, className: cn('min-w-0', size, className), children: [_jsx("button", { ref: setReading, id: control.id, type: "button", disabled: readOnly, onClick: start, "aria-labelledby": `${ownId}-name`, "aria-describedby": control.describedBy, "aria-invalid": control.invalid || undefined, className: cn('group -mx-1.5 inline-flex max-w-full items-center gap-1.5 rounded-md px-1.5 py-0.5 text-left transition-colors', !readOnly && 'cursor-pointer hover:bg-surface-hover', readOnly && 'cursor-default'), children: _jsxs("span", { id: `${ownId}-name`, className: "contents", children: [_jsx("span", { className: cn('truncate', value ? 'text-foreground' : 'text-text-subtle'), children: value || placeholder }), !readOnly && (_jsxs(_Fragment, { children: [_jsx(Pencil, { "aria-hidden": true, className: "size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" }), label && _jsxs("span", { className: "sr-only", children: [", ", words.edit(label)] })] }))] }) }), sent] }));
    }
    return (_jsxs("div", { ...data, className: cn('flex min-w-0 flex-col gap-1', className), children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("input", { ref: setField, id: control.id, type: "text", "aria-label": ownLabel, "aria-labelledby": control.labelledBy, "aria-invalid": error || control.invalid ? true : undefined, "aria-describedby": joinIds(control.describedBy, error ? errorId : null), value: draft, readOnly: saving, placeholder: placeholder, onChange: (event) => setDraft(event.target.value), onKeyDown: onKeyDown, className: cn('h-10 min-w-0 flex-1 rounded-lg border bg-surface px-3.5 text-foreground transition-colors placeholder:text-text-subtle focus:outline-none', fieldBorder(error || control.invalid), size) }), _jsx(Hint, { content: words.save, children: _jsx("button", { type: "button", "aria-label": words.save, onClick: () => void save(), className: cn('grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition enabled:hover:bg-surface-hover enabled:hover:text-foreground [&>svg]:size-4', PRESSABLE), children: saving ? _jsx(Loader2, { "aria-hidden": true, className: "motion-safe:animate-spin" }) : _jsx(Check, { "aria-hidden": true }) }) }), _jsx(Hint, { content: words.cancel, children: _jsx("button", { type: "button", "aria-label": words.cancel, disabled: saving, onClick: cancel, className: cn('grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition enabled:hover:bg-surface-hover enabled:hover:text-foreground [&>svg]:size-4', PRESSABLE), children: _jsx(X, { "aria-hidden": true }) }) })] }), error && (_jsx("span", { id: errorId, children: _jsx(ErrorText, { className: "text-xs", children: error }) })), sent] }));
}
