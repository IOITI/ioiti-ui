import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/** A control under its label, the label in small secondary text. */
export function Field({ label, error, htmlFor, className, children }) {
    const said = error ? _jsx("span", { className: "text-xs text-negative", children: error }) : null;
    if (htmlFor) {
        return (_jsxs("div", { className: cn('flex flex-col gap-1', className), children: [_jsx("label", { htmlFor: htmlFor, className: "text-xs text-text-secondary", children: label }), children, said] }));
    }
    return (_jsxs("label", { className: cn('flex flex-col gap-1', className), children: [_jsx("span", { className: "text-xs text-text-secondary", children: label }), children, said] }));
}
