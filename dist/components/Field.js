import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { cloneElement, isValidElement, useId } from 'react';
import { cn } from '../lib/utils.js';
/** The label: small, in the primary text and semibold, so that it stands out of a form; its description stays muted. */
const LABEL = 'text-xs font-semibold text-text-primary';
/** The control, described by the ids given, after any description of its own. */
function described(control, ids) {
    if (!isValidElement(control))
        return control;
    const own = control.props['aria-describedby'];
    return cloneElement(control, { 'aria-describedby': own ? `${own} ${ids}` : ids });
}
/** A control under its label, the label small and semibold; what it is for, and what is wrong, under it, muted. */
export function Field({ label, description, error, htmlFor, className, children }) {
    const id = useId();
    const said = error ? _jsx("span", { className: "text-xs text-negative", children: error }) : null;
    if (description) {
        // Out of the label, which names the control by itself: the description and the error describe it.
        const descriptionId = `${id}-description`;
        const errorId = `${id}-error`;
        const control = described(children, error ? `${descriptionId} ${errorId}` : descriptionId);
        const under = (_jsxs(_Fragment, { children: [_jsx("span", { id: descriptionId, className: "text-xs text-muted-foreground", children: description }), error && (_jsx("span", { id: errorId, className: "text-xs text-negative", children: error }))] }));
        return (_jsxs("div", { className: cn('flex flex-col gap-1', className), children: [htmlFor ? (_jsxs(_Fragment, { children: [_jsx("label", { htmlFor: htmlFor, className: LABEL, children: label }), control] })) : (_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: LABEL, children: label }), control] })), under] }));
    }
    if (htmlFor) {
        return (_jsxs("div", { className: cn('flex flex-col gap-1', className), children: [_jsx("label", { htmlFor: htmlFor, className: LABEL, children: label }), children, said] }));
    }
    return (_jsxs("label", { className: cn('flex flex-col gap-1', className), children: [_jsx("span", { className: LABEL, children: label }), children, said] }));
}
