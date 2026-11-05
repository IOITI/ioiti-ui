import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { formatNumber } from '../lib/format.js';
import { cn } from '../lib/utils.js';
import { useLinkComponent } from './link-context.js';
import { METER_FILL, METER_TRACK } from './meter-tones.js';
/**
 * How far a piece of work has come: a file imported, a run computed. For a ratio against a limit (a quota
 * used), `Meter`.
 */
export function ProgressBar({ label, value, max = 100, valueText, tone = 'neutral', size = 'md', className }) {
    const id = useId();
    const known = value !== undefined && Number.isFinite(value);
    const ratio = known ? Math.min(Math.max(value / max, 0), 1) : 0;
    const said = known ? (valueText ?? `${Math.round(ratio * 100)}%`) : valueText;
    return (_jsxs("div", { className: cn('flex flex-col gap-1.5', className), children: [_jsxs("div", { className: "flex items-baseline justify-between gap-3 text-xs", children: [_jsx("span", { id: id, className: "text-text-secondary", children: label }), said && (_jsx("span", { "aria-hidden": true, className: "tabular-nums text-muted-foreground", children: said }))] }), _jsx("div", { role: "progressbar", "aria-labelledby": id, "aria-valuemin": known ? 0 : undefined, "aria-valuemax": known ? max : undefined, "aria-valuenow": known ? value : undefined, "aria-valuetext": said, className: cn('w-full overflow-hidden rounded-full', size === 'sm' ? 'h-1' : 'h-1.5', METER_TRACK[tone]), children: known ? (_jsx("div", { className: cn('h-full rounded-full motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-soft', METER_FILL[tone]), style: { width: `${ratio * 100}%` } })) : (_jsx("div", { className: cn('h-full w-full rounded-full opacity-60 animate-pulse', METER_FILL[tone]) })) })] }));
}
/**
 * Things ranked by a figure, each a row of its label, a bar and the figure: the reasons orders were
 * returned, the pages most visited. For values over categories read against an axis, `BarChart`.
 */
export function BarList({ items, label, max, format = (value) => formatNumber(value), className }) {
    const Link = useLinkComponent();
    const full = max ?? Math.max(1, ...items.map((item) => item.value));
    return (_jsx("ul", { "aria-label": label, className: cn('flex flex-col gap-2.5', className), children: items.map((item, index) => {
            const ratio = Math.min(Math.max(item.value / full, 0), 1);
            return (_jsxs("li", { className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 text-sm", children: [_jsx("span", { className: "truncate text-text-secondary", children: item.href ? (_jsx(Link, { href: item.href, className: "hover:text-text-primary hover:underline accent:text-brand-text", children: item.label })) : (item.label) }), _jsx("span", { className: "text-right tabular-nums text-text-primary", children: format(item.value) }), _jsx("span", { "aria-hidden": true, className: cn('col-span-2 h-1.5 overflow-hidden rounded-full', METER_TRACK[item.tone ?? 'neutral']), children: _jsx("span", { className: cn('block h-full rounded-full motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-soft', METER_FILL[item.tone ?? 'neutral']), style: { width: `${ratio * 100}%` } }) })] }, index));
        }) }));
}
