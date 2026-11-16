import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { useControllableState } from '../lib/controllable.js';
import { formatNumber } from '../lib/format.js';
import { cn } from '../lib/utils.js';
import { METER_FILL } from './meter-tones.js';
import { NumberInput } from './NumberInput.js';
// The browser's own range input, its track hidden (the slider draws its own under it), its thumb drawn
// here in both engines: a disc in the page's colour, ringed in the text's (the accent's, where the look has one).
const THUMB = '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm active:[&::-webkit-slider-thumb]:cursor-grabbing accent:[&::-webkit-slider-thumb]:border-brand ' +
    '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:bg-background accent:[&::-moz-range-thumb]:border-brand';
const RANGE = cn('absolute inset-x-0 top-1/2 h-5 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed', '[&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent', THUMB);
function tickList(ticks, min, max, step) {
    if (!ticks)
        return [];
    if (ticks === true) {
        const count = Math.floor((max - min) / step);
        return count > 40 ? [] : Array.from({ length: count + 1 }, (_, index) => ({ value: min + index * step }));
    }
    return ticks.map((tick) => (typeof tick === 'number' ? { value: tick } : tick));
}
/** The track: its bands, its fill from `from` to `to` (in percent), its ticks under it. */
function Track({ from, to, levels, ticks, min, max, children, }) {
    const at = (value) => ((value - min) / (max - min || 1)) * 100;
    const labelled = ticks.some((tick) => tick.label !== undefined);
    return (_jsxs("div", { className: cn('relative', labelled ? 'pb-5' : ticks.length ? 'pb-2' : ''), children: [_jsxs("div", { className: "relative h-5", children: [_jsxs("div", { className: "absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-foreground/10", children: [levels.map((level, index) => (_jsx("span", { "aria-hidden": true, className: cn('absolute inset-y-0 opacity-30', METER_FILL[level.tone]), style: { left: `${at(level.from)}%`, width: `${at(level.to) - at(level.from)}%` } }, index))), _jsx("span", { "aria-hidden": true, className: "absolute inset-y-0 rounded-full bg-foreground/70 accent:bg-brand", style: { left: `${from}%`, width: `${Math.max(to - from, 0)}%` } })] }), children] }), ticks.map((tick) => (_jsxs("span", { "aria-hidden": true, className: "absolute top-5 -translate-x-1/2 text-center", style: { left: `${at(tick.value)}%` }, children: [_jsx("span", { className: "mx-auto block h-1 w-px bg-border-hover" }), tick.label !== undefined && _jsx("span", { className: "mt-0.5 block whitespace-nowrap text-[11px] text-muted-foreground", children: tick.label })] }, tick.value)))] }));
}
function Header({ id, label, said }) {
    return (_jsxs("div", { className: "mb-1 flex items-baseline justify-between gap-3 text-xs", children: [_jsx("span", { id: id, className: "text-text-secondary", children: label }), _jsx("span", { "aria-hidden": true, className: "tabular-nums text-text-primary", children: said })] }));
}
/**
 * A value chosen along a scale: a risk, a share, a delay. The browser's own range input, its keyboard and
 * its screen reader's support with it (the arrows, Page Up and Down, Home and End), its value in words.
 * Its scale may show ticks and bands in a tone; a field beside it types the value.
 */
export function Slider({ label, ariaLabel, value, defaultValue, onChange, min = 0, max = 100, step = 1, format = (number) => formatNumber(number, step < 1 ? String(step).split('.')[1]?.length ?? 0 : 0), ticks, levels = [], showInput = false, disabled = false, className, }) {
    const [current, setCurrent] = useControllableState(value, defaultValue ?? min, onChange);
    const id = useId();
    const at = ((current - min) / (max - min || 1)) * 100;
    return (_jsxs("div", { className: cn('flex w-full items-end gap-4', className), children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx(Header, { id: id, label: label, said: format(current) }), _jsx(Track, { from: 0, to: at, levels: levels, ticks: tickList(ticks, min, max, step), min: min, max: max, children: _jsx("input", { type: "range", min: min, max: max, step: step, value: current, disabled: disabled, "aria-labelledby": ariaLabel ? undefined : id, "aria-label": ariaLabel, "aria-valuetext": format(current), onChange: (event) => setCurrent(Number(event.target.value)), className: RANGE }) })] }), showInput && (_jsx("div", { className: "w-28 shrink-0", children: _jsx(NumberInput, { label: typeof label === 'string' ? label : ariaLabel, value: current, onChange: (typed) => typed !== null && setCurrent(Math.min(max, Math.max(min, typed))), min: min, max: max, step: step, steppers: false, disabled: disabled }) }))] }));
}
/** Two values along a scale, a range between them: a price from and to, the hours a task may run. */
export function RangeSlider({ label, ariaLabel, value, defaultValue, onChange, min = 0, max = 100, step = 1, format = (number) => formatNumber(number, step < 1 ? String(step).split('.')[1]?.length ?? 0 : 0), ticks, levels = [], disabled = false, className, }) {
    const [current, setCurrent] = useControllableState(value, defaultValue ?? [min, max], onChange);
    const id = useId();
    const [low, high] = current;
    const at = (number) => ((number - min) / (max - min || 1)) * 100;
    const name = ariaLabel ?? (typeof label === 'string' ? label : 'Range');
    return (_jsxs("div", { className: cn('w-full', className), children: [_jsx(Header, { id: id, label: label, said: `${format(low)} – ${format(high)}` }), _jsxs(Track, { from: at(low), to: at(high), levels: levels, ticks: tickList(ticks, min, max, step), min: min, max: max, children: [_jsx("input", { type: "range", min: min, max: max, step: step, value: low, disabled: disabled, "aria-label": `${name}, from`, "aria-valuetext": format(low), onChange: (event) => setCurrent([Math.min(Number(event.target.value), high), high]), 
                        // At the top of the scale, the lower thumb is the one that can still move: it is above the other.
                        className: cn(RANGE, 'pointer-events-none', low >= max - step ? 'z-20' : 'z-10') }), _jsx("input", { type: "range", min: min, max: max, step: step, value: high, disabled: disabled, "aria-label": `${name}, to`, "aria-valuetext": format(high), onChange: (event) => setCurrent([low, Math.max(Number(event.target.value), low)]), className: cn(RANGE, 'pointer-events-none z-10') })] })] }));
}
