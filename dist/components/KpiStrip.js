import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { cn } from '../lib/utils.js';
import { KpiChange } from './KpiChange.js';
import { SECTION } from '../lib/recipes.js';
// Written out whole for Tailwind to find them: two on a phone, three on a tablet, the columns asked from a laptop up.
const COLUMNS = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
};
/**
 * Secondary figures in one panel, divided by hairlines: fewer columns on a narrower screen, the hairlines
 * between them however they wrap (each figure draws its left and top ones, the frame cuts those at its
 * edge).
 */
export function KpiStrip({ items, title, period, columns, className }) {
    const periodId = useId();
    const shown = columns ?? Math.min(Math.max(items.length, 2), 6);
    return (_jsxs("section", { className: cn(SECTION, 'min-w-0 text-foreground glass-edge', className), children: [(title || period) && (_jsxs("header", { className: "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border/70 px-5 py-3", children: [title && _jsx("h2", { className: "text-sm font-semibold", children: title }), period && (_jsx("p", { id: periodId, className: "text-xs text-muted-foreground", children: period }))] })), _jsx("div", { className: "overflow-hidden rounded-[inherit]", children: _jsx("dl", { "aria-describedby": period ? periodId : undefined, className: cn('-mt-px -ml-px grid', COLUMNS[shown]), children: items.map((item) => (_jsxs("div", { className: "min-w-0 border-t border-l border-border/70 px-5 py-4", children: [_jsx("dt", { className: "truncate text-xs text-muted-foreground", children: item.label }), _jsx("dd", { className: "mt-1.5 text-lg font-semibold tracking-tight", children: item.value }), (item.change !== undefined || item.hint) && (_jsxs("dd", { className: "mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground", children: [item.change !== undefined && _jsx(KpiChange, { change: item.change, goodWhen: item.goodWhen, format: item.changeFormat }), item.hint && _jsx("span", { children: item.hint })] }))] }, item.label))) }) })] }));
}
