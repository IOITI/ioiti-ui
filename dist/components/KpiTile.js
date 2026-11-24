import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { cn } from '../lib/utils.js';
import { KpiChange } from './KpiChange.js';
import { METER_FILL, METER_TRACK } from './meter-tones.js';
import { SECTION_FRAME } from '../lib/recipes.js';
// Under the content (the tile isolates it): 5 %, its text still at 4.5:1 on every surface of every look.
const TONE_TINT = { warning: 'bg-warning/5', negative: 'bg-negative/5' };
const TONE_BORDER = { warning: 'border-warning/40', negative: 'border-negative/40' };
const TONE_TEXT = { warning: 'text-warning', negative: 'text-negative' };
export function KpiTile({ label, value, hint, change, goodWhen, changeFormat, lead = false, tone, toneLabel, children, className }) {
    return (_jsxs("div", { className: cn(SECTION_FRAME, 'relative isolate flex min-h-[7.5rem] min-w-0 flex-col p-4 sm:p-5 glass-tile glass-edge', lead && 'col-span-2 sm:flex-row sm:items-end sm:gap-6', 
        // A tile that needs attention has no glow under glass: its tint and the glow together took its text under 4.5:1.
        tone && cn(TONE_BORDER[tone], '[--glass-tile-glow:transparent]'), className), children: [tone && _jsx("div", { "aria-hidden": true, className: cn('pointer-events-none absolute inset-0 -z-10 rounded-[inherit]', TONE_TINT[tone]) }), _jsxs("div", { className: cn('min-w-0', lead && 'sm:flex-1'), children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-x-2 gap-y-1", children: [_jsx("p", { className: "min-w-0 text-xs text-muted-foreground", children: label }), tone && (_jsxs("p", { className: cn('inline-flex shrink-0 items-center gap-1.5 text-xs font-medium', TONE_TEXT[tone]), children: [_jsx("span", { "aria-hidden": true, className: "size-1.5 rounded-full bg-current" }), toneLabel] }))] }), _jsx("p", { className: cn('mt-2 text-xl font-semibold tracking-tight sm:text-2xl', lead && 'sm:text-3xl'), children: value }), change === undefined ? (hint && _jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: hint })) : (_jsxs("p", { className: "mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground", children: [_jsx(KpiChange, { change: change, goodWhen: goodWhen, format: changeFormat }), hint && _jsx("span", { children: hint })] }))] }), children && _jsx("div", { className: cn('mt-auto pt-3', lead && 'sm:mt-0 sm:min-w-0 sm:flex-1 sm:pt-0'), children: children })] }));
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
/**
 * Tiles side by side: two on a phone, four (or the columns asked) from a wide screen (1280 px) up. A lead
 * tile takes two of them, a whole row on a phone. Under glass, each of four tiles in a row has its glow
 * from another corner (glass.css).
 */
export function KpiGrid({ columns = 4, period, className, children }) {
    const periodId = useId();
    const grid = (_jsx("div", { role: period ? 'group' : undefined, "aria-describedby": period ? periodId : undefined, className: cn('grid gap-3 sm:gap-4', COLUMNS[columns], className), children: children }));
    if (!period)
        return grid;
    return (_jsxs("div", { className: "flex min-w-0 flex-col gap-2", children: [_jsx("p", { id: periodId, className: "text-xs text-muted-foreground", children: period }), grid] }));
}
