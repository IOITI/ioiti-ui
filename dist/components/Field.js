import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { cloneElement, isValidElement, useId } from 'react';
import { cn } from '../lib/utils.js';
/** The label: small, in the primary text and semibold, so that it stands out of a form; its description stays muted. */
const LABEL = 'text-xs font-semibold text-text-primary';
/**
 * The control, described by the ids given (after any description of its own), and marked invalid while there is an
 * error: `aria-invalid`, which any element takes, and which the package's fields draw as their `error`.
 */
function marked(control, ids, invalid) {
    if (!isValidElement(control))
        return control;
    const own = control.props['aria-describedby'];
    return cloneElement(control, {
        ...(ids ? { 'aria-describedby': own ? `${own} ${ids}` : ids } : {}),
        ...(invalid ? { 'aria-invalid': true } : {}),
    });
}
/**
 * A control under its label, the label small and semibold; what it is for, and what is wrong, under it, muted, out
 * of the label (which names the control by itself): they describe it, and an error marks it invalid.
 */
export function Field({ label, description, error, htmlFor, className, children }) {
    const id = useId();
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;
    const ids = [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
    const control = marked(children, ids, Boolean(error));
    return (_jsxs("div", { className: cn('flex flex-col gap-1', className), children: [htmlFor ? (_jsxs(_Fragment, { children: [_jsx("label", { htmlFor: htmlFor, className: LABEL, children: label }), control] })) : (_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: LABEL, children: label }), control] })), description && (_jsx("span", { id: descriptionId, className: "text-xs text-muted-foreground", children: description })), error && (_jsx("span", { id: errorId, className: "text-xs text-negative", children: error }))] }));
}
