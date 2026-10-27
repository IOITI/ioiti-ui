import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion, useReducedMotionConfig } from 'framer-motion';
import { useCallback, useId, useRef, useState } from 'react';
import { GRID_COLOUR, AXIS_COLOUR, seriesColours } from '../lib/chart-colours.js';
import { Tooltip, defaultFormat, defaultTick, useDismissOutside, useElementWidth } from '../lib/chart-primitives.js';
import { formatTimeTick, niceDomain, timeTicks } from '../lib/chart-scale.js';
import { monotonePath } from '../lib/dashboard-chart-utils.js';
import { motionTransitions } from '../lib/motion-tokens.js';
import { cn } from '../lib/utils.js';
import { ChartLegend } from './ChartLegend.js';
import { METER_COLOUR } from './meter-tones.js';
const toTime = (t) => (typeof t === 'number' ? t : new Date(t).getTime());
const valueOf = (point, key) => {
    const value = point[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
};
/** The line's points, split where a value is missing: a gap is not a line through nothing. */
function segments(points) {
    const out = [];
    let current = [];
    for (const point of points) {
        if (point)
            current.push([point[0], point[1]]);
        else if (current.length) {
            out.push(current);
            current = [];
        }
    }
    if (current.length)
        out.push(current);
    return out;
}
/** The index of the point nearest a moment, in data sorted by time. */
function nearest(times, t) {
    let low = 0;
    let high = times.length - 1;
    while (low < high) {
        const middle = (low + high) >> 1;
        if (times[middle] < t)
            low = middle + 1;
        else
            high = middle;
    }
    return low > 0 && t - times[low - 1] < times[low] - t ? low - 1 : low;
}
/**
 * Values over time, up to four series compared, in the design's colours: a balance, runs side by side, a
 * delay against its limit. Its points are read by pointer or keyboard, and given to screen readers as a
 * table. For a value as it arrives, `LiveLineChart`; for categories, `BarChart`.
 */
export function LineChart({ data, series, area = false, references = [], markers = [], zero = false, height = 240, timeZone = 'UTC', formatValue = defaultFormat, formatTick = defaultTick, formatTime, showLegend = true, animated = true, ariaLabel, className, }) {
    const reduce = useReducedMotionConfig();
    const draw = animated && !reduce;
    const gradient = useId();
    const [rootRef, width] = useElementWidth(640);
    const wrapRef = useRef(null);
    const [hidden, setHidden] = useState([]);
    const [active, setActive] = useState(null);
    useDismissOutside(wrapRef, active !== null, useCallback(() => setActive(null), []));
    const colours = seriesColours(series.map((each) => each.color));
    const visible = series.map((each, index) => ({ ...each, color: colours[index] })).filter((each) => !hidden.includes(each.key));
    const times = data.map((point) => toTime(point.t));
    const n = data.length;
    if (n === 0)
        return _jsx("p", { className: "py-10 text-center text-[13px] text-muted-foreground", children: "No data" });
    const values = visible.flatMap((each) => data.map((point) => valueOf(point, each.key))).filter((value) => value !== null);
    const limits = references.map((reference) => reference.value);
    const domain = niceDomain(Math.min(...values, ...limits), Math.max(...values, ...limits), 4, zero);
    const tickText = domain.ticks.map(formatTick);
    const M = { top: 14, right: 12, bottom: 24, left: Math.ceil(Math.max(...tickText.map((text) => text.length)) * 6.4) + 12 };
    const iw = Math.max(10, width - M.left - M.right);
    const ih = height - M.top - M.bottom;
    const tMin = times[0];
    const tMax = times[n - 1];
    const x = (t) => M.left + (tMax === tMin ? iw / 2 : ((t - tMin) / (tMax - tMin)) * iw);
    const y = (value) => M.top + ((domain.max - value) / (domain.max - domain.min)) * ih;
    const base = y(domain.min <= 0 && domain.max >= 0 ? 0 : domain.min);
    const axis = timeTicks(tMin, tMax, Math.max(2, Math.floor(iw / 90)), timeZone);
    const daily = axis.unit === 'day' || axis.unit === 'month';
    const timeText = formatTime ??
        ((t) => new Intl.DateTimeFormat('en-GB', {
            timeZone,
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            ...(daily ? {} : { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }),
        }).format(new Date(t)));
    const lines = visible.map((each) => {
        const parts = segments(data.map((point, index) => {
            const value = valueOf(point, each.key);
            return value === null ? null : [x(times[index]), y(value)];
        }));
        return { ...each, parts };
    });
    const pick = (event) => {
        const box = event.currentTarget.getBoundingClientRect();
        const t = tMin + ((event.clientX - box.left) / Math.max(1, box.width)) * (tMax - tMin);
        setActive(nearest(times, t));
    };
    const onKeyDown = (event) => {
        const page = Math.max(1, Math.round(n / 10));
        const move = {
            ArrowRight: (at) => Math.min(n - 1, (at ?? -1) + 1),
            ArrowLeft: (at) => Math.max(0, (at ?? n) - 1),
            PageUp: (at) => Math.min(n - 1, (at ?? -1) + page),
            PageDown: (at) => Math.max(0, (at ?? n) - page),
            Home: () => 0,
            End: () => n - 1,
            Escape: () => null,
        };
        const go = move[event.key];
        if (!go)
            return;
        event.preventDefault();
        setActive(go);
    };
    const toggle = (index) => {
        const key = series[index].key;
        setHidden((now) => (now.includes(key) ? now.filter((each) => each !== key) : visible.length > 1 ? [...now, key] : now));
    };
    const activeX = active === null ? 0 : x(times[active]);
    const activeTop = active === null
        ? 0
        : Math.min(...visible.map((each) => valueOf(data[active], each.key)).filter((value) => value !== null).map(y), base);
    return (_jsxs("div", { ref: rootRef, className: cn('w-full', className), children: [_jsxs("div", { ref: wrapRef, className: "relative", style: { height }, children: [_jsxs("svg", { width: width, height: height, role: "img", "aria-label": ariaLabel ?? `Line chart of ${series.map((each) => each.label).join(', ')}`, tabIndex: 0, onKeyDown: onKeyDown, onBlur: () => setActive(null), className: "block touch-pan-y overflow-visible rounded-lg", children: [area && lines.length === 1 && (_jsx("defs", { children: _jsxs("linearGradient", { id: gradient, x1: "0", x2: "0", y1: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: lines[0].color, stopOpacity: 0.2 }), _jsx("stop", { offset: "100%", stopColor: lines[0].color, stopOpacity: 0 })] }) })), domain.ticks.map((tick, index) => (_jsxs("g", { children: [_jsx("line", { x1: M.left, x2: width - M.right, y1: y(tick), y2: y(tick), stroke: tick === 0 ? AXIS_COLOUR : GRID_COLOUR }), _jsx("text", { x: M.left - 8, y: y(tick), textAnchor: "end", dominantBaseline: "middle", className: "fill-muted-foreground text-[11px] tabular-nums", children: tickText[index] })] }, tick))), axis.ticks.map((tick) => (_jsx("text", { x: x(tick), y: height - 6, textAnchor: "middle", className: "fill-muted-foreground text-[11px] tabular-nums", children: formatTimeTick(tick, axis.unit, timeZone) }, tick))), markers.map((marker) => {
                                const at = x(toTime(marker.t));
                                return (_jsxs("g", { children: [_jsx("line", { x1: at, x2: at, y1: M.top, y2: M.top + ih, stroke: AXIS_COLOUR, strokeDasharray: "3 3" }), _jsx("text", { x: at + 4, y: M.top + 2, dominantBaseline: "hanging", className: "fill-muted-foreground text-[10px]", children: marker.label })] }, `${marker.label}-${toTime(marker.t)}`));
                            }), lines.map((line) => line.parts.map((part, index) => {
                                const d = monotonePath(part);
                                const fill = area && lines.length === 1
                                    ? `${d}L${part[part.length - 1][0].toFixed(2)} ${base.toFixed(2)}L${part[0][0].toFixed(2)} ${base.toFixed(2)}Z`
                                    : null;
                                return (_jsxs("g", { children: [fill && (_jsx(motion.path, { d: fill, fill: `url(#${gradient})`, initial: draw ? { opacity: 0 } : false, animate: { opacity: 1 }, transition: motionTransitions.easeSoft })), part.length === 1 ? (_jsx("circle", { cx: part[0][0], cy: part[0][1], r: 2, fill: line.color })) : (_jsx(motion.path, { d: d, fill: "none", stroke: line.color, strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: line.dashed ? '5 4' : undefined, 
                                            // A dashed line fades in: drawing it in would undo its dashes.
                                            initial: draw ? (line.dashed ? { opacity: 0 } : { pathLength: 0 }) : false, animate: line.dashed ? { opacity: 1 } : { pathLength: 1 }, transition: motionTransitions.easeSoft }))] }, `${line.key}-${index}`));
                            })), references.map((reference) => (_jsxs("g", { children: [_jsx("line", { x1: M.left, x2: width - M.right, y1: y(reference.value), y2: y(reference.value), stroke: METER_COLOUR[reference.tone ?? 'neutral'], strokeDasharray: "6 4", strokeWidth: 1.25 }), reference.label && (_jsx("text", { x: width - M.right, y: y(reference.value) - 4, textAnchor: "end", className: "fill-muted-foreground text-[10px]", children: reference.label }))] }, `${reference.value}-${reference.label ?? ''}`))), active !== null && (_jsxs("g", { children: [_jsx("line", { x1: activeX, x2: activeX, y1: M.top, y2: M.top + ih, stroke: AXIS_COLOUR }), visible.map((each) => {
                                        const value = valueOf(data[active], each.key);
                                        return value === null ? null : (_jsx("circle", { cx: activeX, cy: y(value), r: 3.5, fill: each.color, className: "stroke-surface", strokeWidth: 1.5 }, each.key));
                                    })] })), _jsx("rect", { x: M.left, y: M.top, width: iw, height: ih, fill: "transparent", onPointerMove: pick, onPointerDown: pick, onPointerLeave: (event) => event.pointerType === 'mouse' && setActive(null) })] }), _jsx(Tooltip, { pos: active === null ? null : { x: activeX, y: activeTop }, boundsWidth: width, children: active !== null && (_jsxs(_Fragment, { children: [_jsx("p", { className: "mb-1.5 font-medium text-foreground", children: timeText(times[active]) }), _jsx("ul", { className: "space-y-1", children: visible.map((each) => {
                                        const value = valueOf(data[active], each.key);
                                        return (_jsxs("li", { className: "flex items-center justify-between gap-4", children: [_jsxs("span", { className: "flex items-center gap-2 text-muted-foreground", children: [_jsx("span", { "aria-hidden": true, className: "inline-block size-2 rounded-full", style: { background: each.color } }), each.label] }), _jsx("span", { className: "tabular-nums text-foreground", children: value === null ? '—' : formatValue(value) })] }, each.key));
                                    }) })] })) })] }), showLegend && series.length > 1 && (_jsx(ChartLegend, { label: "Series", className: "mt-3", items: series.map((each, index) => ({
                    label: each.label,
                    color: colours[index],
                    shape: each.dashed ? 'dashed' : 'line',
                    shown: !hidden.includes(each.key),
                })), onToggle: toggle })), _jsxs("table", { className: "sr-only", children: [_jsx("caption", { children: ariaLabel ?? 'Chart data' }), _jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: "Time" }), series.map((each) => (_jsx("th", { scope: "col", children: each.label }, each.key)))] }) }), _jsx("tbody", { children: data.map((point, index) => (_jsxs("tr", { children: [_jsx("th", { scope: "row", children: timeText(times[index]) }), series.map((each) => {
                                    const value = valueOf(point, each.key);
                                    return _jsx("td", { children: value === null ? '—' : formatValue(value) }, each.key);
                                })] }, times[index]))) })] })] }));
}
