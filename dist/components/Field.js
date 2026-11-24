import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useMemo } from 'react';
import { cn } from '../lib/utils.js';
import { FieldContext, joinIds, markControl, useFieldContext } from './field-context.js';
/** The label: small, in the primary text and semibold, so that it stands out of a form; its description stays muted. */
const LABEL = 'text-xs font-semibold text-foreground';
/**
 * A control under its label, the label small and semibold; what it is for, and what is wrong, under it, muted, out
 * of the label (which names the control by itself): they describe it, and an error marks it invalid. The package's
 * controls read them wherever they are in it (in a Hint, beside a button); one from elsewhere, which cannot, is
 * given them as props when it is the Field's child.
 */
export function Field({ label, description, error, htmlFor, className, children }) {
    const id = useId();
    const outer = useFieldContext();
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;
    const described = Boolean(description);
    const wrong = Boolean(error);
    // In a FormItem, one control: the item's id, its description and its message, and what the item's parts say.
    const field = useMemo(() => ({
        ...outer,
        id: htmlFor ?? outer?.id,
        describedBy: joinIds(outer?.describedBy, described ? descriptionId : null, wrong ? errorId : null),
        invalid: wrong || Boolean(outer?.invalid),
    }), [outer, htmlFor, described, descriptionId, wrong, errorId]);
    const control = markControl(children, field);
    return (_jsx(FieldContext.Provider, { value: field, children: _jsxs("div", { className: cn('flex flex-col gap-1', className), children: [htmlFor ? (_jsxs(_Fragment, { children: [_jsx("label", { htmlFor: htmlFor, className: LABEL, children: label }), control] })) : (_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: LABEL, children: label }), control] })), description && (_jsx("span", { id: descriptionId, className: "text-xs text-muted-foreground", children: description })), error && (_jsx("span", { id: errorId, className: "text-xs text-negative", children: error }))] }) }));
}
