import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion, useReducedMotionConfig } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import { AXIS_COLOUR, GRID_COLOUR, MUTED_COLOUR, seriesColours } from '../lib/chart-colours.js';
import { detailsText } from '../lib/chart-details.js';
import { Tooltip, useChartFormat, useDismissOutside, useElementWidth } from '../lib/chart-primitives.js';
import { niceDomain, niceStep } from '../lib/chart-scale.js';
import { monotonePath } from '../lib/dashboard-chart-utils.js';
import { motionTransitions } from '../lib/motion-tokens.js';
import { cn } from '../lib/utils.js';
import { ChartLegend } from './ChartLegend.js';
import { useMessages } from './locale-context.js';
import { METER_COLOUR } from './meter-tones.js';
const valueOf = (point, key) => {
    const value = point[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
};
/** The points of a line, split where a value is missing. */
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
/** A band's outline over the places that have both its edges: the upper edge forward, the lower one back. */
function bandPaths(data, band, x, y) {
    const parts = [];
    let current = [];
    for (const point of data) {
        const low = valueOf(point, band.lower);
        const high = valueOf(point, band.upper);
        if (low !== null && high !== null)
            current.push([x(point.x), y(low), y(high)]);
        else if (current.length) {
            parts.push(current);
            current = [];
        }
    }
    if (current.length)
        parts.push(current);
    return parts.map((part) => {
        const upper = part.map(([px, , high]) => `${px.toFixed(2)} ${high.toFixed(2)}`);
        const lower = [...part].reverse().map(([px, low]) => `${px.toFixed(2)} ${low.toFixed(2)}`);
        return `M${upper.join('L')}L${lower.join('L')}Z`;
    });
}
/** Ticks inside a range of x, at a nice step: none beyond the data. */
function xTicks(min, max, count) {
    if (max === min)
        return [min];
    const step = niceStep((max - min) / count);
    const ticks = [];
    for (let tick = Math.ceil(min / step) * step; tick <= max + step / 1e6; tick += step)
        ticks.push(Number(tick.toFixed(10)));
    return ticks;
}
/** The index of the point nearest a place, in data sorted by x. */
function nearest(places, at) {
    let low = 0;
    let high = places.length - 1;
    while (low < high) {
        const middle = (low + high) >> 1;
        if (places[middle] < at)
            low = middle + 1;
        else
            high = middle;
    }
    return low > 0 && at - places[low - 1] < places[low] - at ? low - 1 : low;
}
/**
 * What was expected as ranges that widen, and what happened over them: the bands of a forecast or of a
 * simulation (where 90 % and 50 % of its paths went), its median dashed, the actual line drawn as far as it
 * goes. The x axis is a count or a measure, not a time (for values over time, `LineChart`). Its places are read
 * by pointer or keyboard, and given to screen readers as a table.
 */
export function FanChart({ data, bands, lines, references = [], markers = [], zero = false, height = 260, formatValue: givenFormatValue, formatTick: givenFormatTick, formatX: givenFormatX, formatXTick, xLabel, details, showLegend = true, animated = true, 'aria-label': name, className, }) {
    const reduce = useReducedMotionConfig();
    const draw = animated && !reduce;
    // Its numbers and words in the interface's locale and language, where the application gives none of its own.
    const chartFormat = useChartFormat();
    const formatValue = givenFormatValue ?? chartFormat.format;
    const formatTick = givenFormatTick ?? chartFormat.tick;
    const formatX = givenFormatX ?? chartFormat.format;
    const words = useMessages().chart;
    const [rootRef, width] = useElementWidth(640);
    const wrapRef = useRef(null);
    const [hidden, setHidden] = useState([]);
    const [active, setActive] = useState(null);
    useDismissOutside(wrapRef, active !== null, useCallback(() => setActive(null), []));
    const lineColours = seriesColours(lines.map((line) => line.color));
    const shownLines = lines.map((line, index) => ({ ...line, color: lineColours[index] })).filter((line) => !hidden.includes(line.key));
    const shownBands = bands.map((band) => ({ ...band, color: band.color ?? MUTED_COLOUR })).filter((band) => !hidden.includes(band.label));
    const places = data.map((point) => point.x);
    const n = data.length;
    if (n === 0)
        return _jsx("p", { className: "py-10 text-center text-sm text-muted-foreground", children: words.noData });
    const keys = [...shownLines.map((line) => line.key), ...shownBands.flatMap((band) => [band.lower, band.upper])];
    const values = keys.flatMap((key) => data.map((point) => valueOf(point, key))).filter((value) => value !== null);
    const limits = references.map((reference) => reference.value);
    const domain = niceDomain(Math.min(...values, ...limits), Math.max(...values, ...limits), 4, zero);
    const tickText = domain.ticks.map(formatTick);
    const xTickText = formatXTick ?? formatX;
    const M = {
        top: 14,
        right: 12,
        bottom: xLabel ? 40 : 24,
        left: Math.ceil(Math.max(...tickText.map((text) => text.length)) * 6.4) + 12,
    };
    const iw = Math.max(10, width - M.left - M.right);
    const ih = height - M.top - M.bottom;
    const xMin = places[0];
    const xMax = places[n - 1];
    const x = (value) => M.left + (xMax === xMin ? iw / 2 : ((value - xMin) / (xMax - xMin)) * iw);
    const y = (value) => M.top + ((domain.max - value) / (domain.max - domain.min)) * ih;
    const axis = xTicks(xMin, xMax, Math.max(2, Math.floor(iw / 80)));
    const drawn = shownLines.map((line) => {
        const points = data.map((point) => {
            const value = valueOf(point, line.key);
            return value === null ? null : [x(point.x), y(value)];
        });
        return { ...line, parts: segments(points) };
    });
    const detailsOf = (index) => details?.(data[index], index) ?? [];
    const pick = (event) => {
        const box = event.currentTarget.getBoundingClientRect();
        const at = xMin + ((event.clientX - box.left) / Math.max(1, box.width)) * (xMax - xMin);
        setActive(nearest(places, at));
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
    const legendItems = [
        ...lines.map((line, index) => ({ id: line.key, label: line.label, color: lineColours[index], shape: line.dashed ? 'dashed' : 'line' })),
        ...bands.map((band) => ({ id: band.label, label: band.label, color: band.color ?? MUTED_COLOUR, shape: 'square' })),
    ];
    const toggle = (index) => {
        const id = legendItems[index].id;
        setHidden((now) => (now.includes(id) ? now.filter((each) => each !== id) : legendItems.length - now.length > 1 ? [...now, id] : now));
    };
    const activeX = active === null ? 0 : x(places[active]);
    const activeValues = active === null
        ? []
        : keys.map((key) => valueOf(data[active], key)).filter((value) => value !== null);
    const activeTop = activeValues.length ? Math.min(...activeValues.map(y)) : M.top;
    const bandText = (point, band) => {
        const low = valueOf(point, band.lower);
        const high = valueOf(point, band.upper);
        return low === null || high === null ? '—' : words.bandRange({ low: formatValue(low), high: formatValue(high) });
    };
    return (_jsxs("div", { ref: rootRef, className: cn('w-full contain-inline-size', className), children: [_jsxs("div", { ref: wrapRef, className: "relative", style: { height }, children: [_jsxs("svg", { width: width, height: height, role: "img", "aria-label": name ?? words.fanChartName(lines.map((line) => line.label)), tabIndex: 0, onKeyDown: onKeyDown, onBlur: () => setActive(null), className: "block touch-pan-y overflow-visible rounded-lg", children: [domain.ticks.map((tick, index) => (_jsxs("g", { children: [_jsx("line", { x1: M.left, x2: width - M.right, y1: y(tick), y2: y(tick), stroke: tick === 0 ? AXIS_COLOUR : GRID_COLOUR }), _jsx("text", { x: M.left - 8, y: y(tick), textAnchor: "end", dominantBaseline: "middle", className: "fill-muted-foreground text-[11px] tabular-nums", children: tickText[index] })] }, tick))), axis.map((tick) => (_jsx("text", { x: x(tick), y: M.top + ih + 16, textAnchor: "middle", className: "fill-muted-foreground text-[11px] tabular-nums", children: xTickText(tick) }, tick))), xLabel && (_jsx("text", { x: M.left + iw / 2, y: height - 4, textAnchor: "middle", className: "fill-muted-foreground text-[11px]", children: xLabel })), shownBands.map((band) => bandPaths(data, band, x, y).map((d, index) => (_jsx(motion.path, { "data-band": band.label, d: d, fill: band.color, fillOpacity: 0.18, stroke: "none", initial: draw ? { opacity: 0 } : false, animate: { opacity: 1 }, transition: motionTransitions.easeSoft }, `${band.label}-${index}`)))), markers.map((marker) => {
                                const at = x(marker.x);
                                return (_jsxs("g", { children: [_jsx("line", { x1: at, x2: at, y1: M.top, y2: M.top + ih, stroke: AXIS_COLOUR, strokeDasharray: "3 3" }), _jsx("text", { x: at + 4, y: M.top + 2, dominantBaseline: "hanging", className: "fill-muted-foreground text-[11px]", children: marker.label })] }, `${marker.label}-${marker.x}`));
                            }), drawn.map((line) => line.parts.map((part, index) => part.length === 1 ? (_jsx("circle", { cx: part[0][0], cy: part[0][1], r: 2.5, fill: line.color }, `${line.key}-${index}`)) : (_jsx(motion.path, { "data-line": line.key, d: monotonePath(part), fill: "none", stroke: line.color, strokeWidth: line.dashed ? 1.5 : 2, strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: line.dashed ? '5 4' : undefined, 
                                // A dashed line fades in: drawing it in would undo its dashes.
                                initial: draw ? (line.dashed ? { opacity: 0 } : { pathLength: 0 }) : false, animate: line.dashed ? { opacity: 1 } : { pathLength: 1 }, transition: motionTransitions.easeSoft }, `${line.key}-${index}`)))), references.map((reference) => (_jsxs("g", { children: [_jsx("line", { x1: M.left, x2: width - M.right, y1: y(reference.value), y2: y(reference.value), stroke: METER_COLOUR[reference.tone ?? 'neutral'], strokeDasharray: "6 4", strokeWidth: 1.25 }), reference.label && (_jsx("text", { x: width - M.right, y: y(reference.value) - 4, textAnchor: "end", className: "fill-muted-foreground text-[11px]", children: reference.label }))] }, `${reference.value}-${reference.label ?? ''}`))), active !== null && (_jsxs("g", { children: [_jsx("line", { x1: activeX, x2: activeX, y1: M.top, y2: M.top + ih, stroke: AXIS_COLOUR }), shownLines.map((line) => {
                                        const value = valueOf(data[active], line.key);
                                        return value === null ? null : (_jsx("circle", { cx: activeX, cy: y(value), r: 3.5, fill: line.color, className: "stroke-surface", strokeWidth: 1.5 }, line.key));
                                    })] })), _jsx("rect", { x: M.left, y: M.top, width: iw, height: ih, fill: "transparent", onPointerMove: pick, onPointerDown: pick, onPointerLeave: (event) => event.pointerType === 'mouse' && setActive(null) })] }), _jsx(Tooltip, { pos: active === null ? null : { x: activeX, y: activeTop }, boundsWidth: width, children: active !== null && (_jsxs(_Fragment, { children: [_jsx("p", { className: "mb-1.5 font-medium tabular-nums text-foreground", children: formatX(places[active]) }), _jsxs("ul", { className: "space-y-1", children: [shownLines.map((line) => {
                                            const value = valueOf(data[active], line.key);
                                            return (_jsxs("li", { className: "flex items-center justify-between gap-4", children: [_jsxs("span", { className: "flex items-center gap-2 text-muted-foreground", children: [_jsx("span", { "aria-hidden": true, className: "inline-block size-2 rounded-full", style: { background: line.color } }), line.label] }), _jsx("span", { className: "tabular-nums text-foreground", children: value === null ? '—' : formatValue(value) })] }, line.key));
                                        }), shownBands.map((band) => (_jsxs("li", { className: "flex items-center justify-between gap-4", children: [_jsxs("span", { className: "flex items-center gap-2 text-muted-foreground", children: [_jsx("span", { "aria-hidden": true, className: "inline-block size-2 rounded-[3px] opacity-60", style: { background: band.color } }), band.label] }), _jsx("span", { className: "tabular-nums text-foreground", children: bandText(data[active], band) })] }, band.label)))] }), detailsOf(active).length > 0 && (_jsx("ul", { className: "mt-1.5 space-y-1 border-t border-border pt-1.5", children: detailsOf(active).map((detail) => (_jsxs("li", { className: "flex items-center justify-between gap-4", children: [_jsx("span", { className: "text-muted-foreground", children: detail.label }), _jsx("span", { className: "tabular-nums text-foreground", children: detail.value })] }, detail.label))) }))] })) })] }), showLegend && legendItems.length > 1 && (_jsx(ChartLegend, { label: words.seriesLegend, className: "mt-3", items: legendItems.map((item) => ({ label: item.label, color: item.color, shape: item.shape, shown: !hidden.includes(item.id) })), onToggle: toggle })), _jsx("div", { className: "sr-only", children: _jsxs("table", { children: [_jsx("caption", { children: name ?? words.tableCaption }), _jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: xLabel ?? words.placeColumn }), lines.map((line) => (_jsx("th", { scope: "col", children: line.label }, line.key))), bands.map((band) => (_jsx("th", { scope: "col", children: band.label }, band.label))), details && _jsx("th", { scope: "col", children: words.detailsColumn })] }) }), _jsx("tbody", { children: data.map((point, index) => (_jsxs("tr", { children: [_jsx("th", { scope: "row", children: formatX(point.x) }), lines.map((line) => {
                                        const value = valueOf(point, line.key);
                                        return _jsx("td", { children: value === null ? '—' : formatValue(value) }, line.key);
                                    }), bands.map((band) => (_jsx("td", { children: bandText(point, band) }, band.label))), details && _jsx("td", { children: detailsText(detailsOf(index)) })] }, point.x))) })] }) })] }));
}
