import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { keyLabels } from '../lib/keys.js';
import { cn } from '../lib/utils.js';
const CAP = 'inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-surface px-1 font-sans text-[11px] font-medium leading-none text-text-secondary shadow-[inset_0_-1px_0_var(--border)]';
/** A key to press, or the keys of a shortcut, as this computer writes them. */
export function Kbd({ keys, children, className }) {
    if (keys === undefined)
        return _jsx("kbd", { className: cn(CAP, className), children: children });
    const strokes = keyLabels(keys);
    return (_jsx("kbd", { className: cn('inline-flex items-center gap-1 align-middle font-sans', className), children: strokes.map((stroke, index) => (_jsxs("span", { className: "inline-flex items-center gap-0.5", children: [index > 0 && (_jsxs("span", { className: "mr-0.5 text-[11px] text-text-muted", children: [_jsx("span", { "aria-hidden": true, children: "\u00B7" }), _jsx("span", { className: "sr-only", children: "then" })] })), stroke.map((label, at) => (_jsx("kbd", { className: CAP, children: label.spoken ? (_jsxs(_Fragment, { children: [_jsx("span", { "aria-hidden": true, children: label.shown }), _jsx("span", { className: "sr-only", children: label.spoken })] })) : (label.shown) }, at)))] }, index))) }));
}
