import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils.js';
function Row({ change, numeric }) {
    const added = change.before === undefined || change.before === null;
    const removed = change.after === undefined || change.after === null;
    return (_jsxs("li", { className: "flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2", children: [_jsx("span", { className: "min-w-0 text-text-secondary", children: change.label }), _jsxs("span", { className: cn('ml-auto inline-flex flex-wrap items-baseline justify-end gap-x-2', numeric && 'tabular-nums'), children: [added ? (_jsx("span", { className: "text-xs text-text-muted", children: "New" })) : (_jsxs("del", { className: "text-text-muted decoration-text-muted", children: [_jsx("span", { className: "sr-only", children: "from " }), change.before] })), _jsx(ArrowRight, { "aria-hidden": true, className: "size-3.5 shrink-0 self-center text-text-muted" }), removed ? (_jsx("span", { className: "text-text-muted", children: "Removed" })) : (_jsxs("ins", { className: "font-medium text-text-primary no-underline", children: [_jsx("span", { className: "sr-only", children: "to " }), change.after] }))] }), change.note && _jsx("p", { className: "w-full text-xs text-muted-foreground", children: change.note })] }));
}
/**
 * What changes, each from its value before to its value after: a configuration about to be applied, a
 * record edited, a run compared with the last. Screen readers hear "from … to …".
 */
export function ChangeList({ changes = [], groups, label, numeric = false, className }) {
    if (groups) {
        return (_jsx("div", { "aria-label": label, role: label ? 'group' : undefined, className: cn('flex flex-col gap-4 text-sm', className), children: groups.map((group, index) => (_jsxs("section", { children: [_jsx("h4", { className: "mb-1 text-xs font-medium text-text-secondary", children: group.title }), _jsx("ul", { className: "divide-y divide-border", children: group.changes.map((change, at) => (_jsx(Row, { change: change, numeric: numeric }, at))) })] }, index))) }));
    }
    return (_jsx("ul", { "aria-label": label, className: cn('divide-y divide-border text-sm', className), children: changes.map((change, index) => (_jsx(Row, { change: change, numeric: numeric }, index))) }));
}
