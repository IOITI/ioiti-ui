import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
const GRID_COLUMNS = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' };
/**
 * Terms and their details, a `<dl>`: what a record is, a summary, figures side by side. The terms in the
 * secondary text, their details in the primary one.
 */
export function DescriptionList({ items, layout = 'rows', columns = 2, termWidth = '12rem', divided = false, boxed = false, compressed = false, numeric = false, className, }) {
    const size = compressed ? 'text-xs' : 'text-sm';
    const details = cn('text-text-primary', numeric && 'tabular-nums');
    if (layout === 'inline') {
        return (_jsx("dl", { className: cn('flex flex-wrap gap-x-4 gap-y-1', size, className), children: items.map((item, index) => (_jsxs("div", { className: "inline-flex gap-1.5", children: [_jsx("dt", { className: "text-text-secondary", children: item.term }), _jsx("dd", { className: details, children: item.details })] }, index))) }));
    }
    if (layout === 'grid') {
        return (_jsx("dl", { className: cn('grid grid-cols-1 gap-x-6', GRID_COLUMNS[columns], compressed ? 'gap-y-2' : 'gap-y-3', boxed && 'rounded-xl border border-border p-4', size, className), children: items.map((item, index) => (_jsxs("div", { className: "min-w-0", children: [_jsx("dt", { className: "text-xs text-text-secondary", children: item.term }), _jsx("dd", { className: cn('mt-0.5 font-medium', details), children: item.details })] }, index))) }));
    }
    const pad = compressed ? 'py-1.5' : 'py-2.5';
    return (_jsx("dl", { className: cn('flex flex-col', (boxed || divided || layout === 'columns') && 'divide-y divide-border', boxed && 'rounded-xl border border-border px-4', size, className), children: items.map((item, index) => layout === 'columns' ? (_jsxs("div", { className: cn('grid gap-x-4 gap-y-0.5 sm:grid-cols-[var(--term)_minmax(0,1fr)]', pad), style: { '--term': termWidth }, children: [_jsx("dt", { className: "text-text-secondary", children: item.term }), _jsx("dd", { className: cn('min-w-0 break-words', details), children: item.details })] }, index)) : (_jsxs("div", { className: cn('flex items-baseline justify-between gap-3', boxed || divided ? pad : compressed ? 'py-0.5' : 'py-1'), children: [_jsx("dt", { className: "text-text-secondary", children: item.term }), _jsx("dd", { className: cn('min-w-0 text-right', details), children: item.details })] }, index))) }));
}
