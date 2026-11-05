import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { METER_FILL, METER_TRACK } from './meter-tones.js';
export function KpiTile({ label, value, hint, children, className }) {
    return (_jsxs("div", { className: cn('flex min-h-[7.5rem] min-w-0 flex-col rounded-2xl border border-border/70 bg-surface/50 p-4 sm:p-5 dark:bg-surface/25 glass-card', className), children: [_jsx("p", { className: "text-xs text-muted-foreground", children: label }), _jsx("p", { className: "mt-2 text-xl font-semibold tracking-tight sm:text-2xl", children: value }), hint && _jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: hint }), children && _jsx("div", { className: "mt-auto pt-3", children: children })] }));
}
/** A single ratio against a limit. */
export function Meter({ ratio, tone = 'neutral', label, scale }) {
    const clamped = Math.min(Math.max(ratio, 0), 1);
    return (_jsxs("div", { children: [_jsx("div", { role: "meter", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(clamped * 100), className: cn('h-1.5 w-full overflow-hidden rounded-full', METER_TRACK[tone]), children: _jsx("div", { className: cn('h-full rounded-full motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-soft', METER_FILL[tone]), style: { width: `${clamped * 100}%` } }) }), scale && (_jsxs("div", { "aria-hidden": true, className: "mt-1 flex justify-between text-xs tabular-nums text-muted-foreground", children: [_jsx("span", { children: scale[0] }), _jsx("span", { children: scale[1] })] }))] }));
}
// Written out whole for Tailwind to find them: two on a phone, the columns asked from a wide screen up.
const COLUMNS = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 xl:grid-cols-4',
    5: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
};
/** Tiles side by side: two on a phone, four (or the columns asked) from a wide screen (1280 px) up. */
export function KpiGrid({ columns = 4, className, children }) {
    return _jsx("div", { className: cn('grid gap-3 sm:gap-4', COLUMNS[columns], className), children: children });
}
