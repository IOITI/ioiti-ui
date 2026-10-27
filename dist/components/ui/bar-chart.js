"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState, } from "react";
import { motion, useReducedMotionConfig } from "framer-motion";
import { Dot, Tooltip, clamp, cx, defaultFormat, defaultTick, muted, useDismissOutside, useElementWidth, } from "../../lib/chart-primitives.js";
// ioiti-ui: the design's colours for series, gains and losses, its grid and axis; an axis that goes below zero.
import { AXIS_COLOUR, GRID_COLOUR, NEGATIVE_COLOUR, POSITIVE_COLOUR, seriesColours } from "../../lib/chart-colours.js";
import { niceDomain } from "../../lib/chart-scale.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { ChartLegend } from "../ChartLegend.js";
// ioiti-ui: a bar rounded at its far end, its top above zero, its bottom below: the same commands either
// way (and with no rounding), so any two bars still morph into each other.
function barPath(x, y, w, h, rTop, rBottom) {
    const t = Math.max(0, Math.min(rTop, w / 2, h));
    const b = Math.max(0, Math.min(rBottom, w / 2, h - t));
    return (`M${x} ${y + h - b}V${y + t}Q${x} ${y} ${x + t} ${y}H${x + w - t}Q${x + w} ${y} ${x + w} ${y + t}` +
        `V${y + h - b}Q${x + w} ${y + h} ${x + w - b} ${y + h}H${x + b}Q${x} ${y + h} ${x} ${y + h - b}Z`);
}
// ioiti-ui: bars grow in as what arrives does (easeSoft), one category a moment after the other, the
// stagger capped; a change of the data or of the variant then moves them without overshoot.
const STAGGER = 0.03;
const STAGGER_CAP = 0.3;
export function BarChart({ data, series, variant = "grouped", tone = "series", height = 260, formatValue = defaultFormat, formatTick = defaultTick, showLegend = true, animated = true, ariaLabel, className = "", }) {
    // ioiti-ui: reduced as the system asks or IoitiProvider's reducedMotion says.
    const reduce = useReducedMotionConfig();
    const anim = animated && !reduce;
    const [rootRef, width] = useElementWidth(640);
    const [hidden, setHidden] = useState([]);
    const [active, setActive] = useState(null);
    const [entered, setEntered] = useState(!anim);
    const wrapRef = useRef(null);
    useEffect(() => {
        if (!anim)
            return;
        const t = setTimeout(() => setEntered(true), ((motionTransitions.easeSoft.duration ?? 0.32) + STAGGER_CAP + 0.1) * 1000);
        return () => clearTimeout(t);
    }, [anim]);
    useDismissOutside(wrapRef, active !== null, useCallback(() => setActive(null), []));
    const colors = seriesColours(series.map((s) => s.color));
    const visible = series.map((s, i) => ({ ...s, color: colors[i], i })).filter((s) => !hidden.includes(s.key));
    const stacked = variant === "stacked";
    const n = data.length;
    // ioiti-ui: a value keeps its sign: a loss is drawn below zero.
    const val = (d, k) => {
        const v = d[k];
        return typeof v === "number" && isFinite(v) ? v : 0;
    };
    // ioiti-ui: stacked by sign: gains piled up from zero, losses down from it.
    const sums = (d) => visible.reduce((s, x) => {
        const v = val(d, x.key);
        return v >= 0 ? { up: s.up + v, down: s.down } : { up: s.up, down: s.down + v };
    }, { up: 0, down: 0 });
    const extent = data.map((d) => {
        if (stacked)
            return sums(d);
        const values = visible.map((x) => val(d, x.key));
        return { up: Math.max(0, ...values), down: Math.min(0, ...values) };
    });
    const domain = niceDomain(Math.min(0, ...extent.map((e) => e.down)), Math.max(0, ...extent.map((e) => e.up)), 4);
    const ticks = domain.ticks;
    const tickText = ticks.map(formatTick);
    const M = { top: 8, right: 6, bottom: 26, left: Math.ceil(Math.max(...tickText.map((s) => s.length)) * 6.4) + 10 };
    const iw = Math.max(10, width - M.left - M.right);
    const ih = height - M.top - M.bottom;
    const y = (v) => M.top + ((domain.max - v) / (domain.max - domain.min)) * ih;
    const zero = y(0);
    const stepX = iw / Math.max(1, n);
    const k = Math.max(1, visible.length);
    const gapIn = 3;
    const barW = stacked ? clamp(stepX * 0.62, 4, 46) : clamp((stepX * 0.74 - gapIn * (k - 1)) / k, 3, 34);
    const groupW = stacked ? barW : barW * k + gapIn * (k - 1);
    const labelEvery = Math.max(1, Math.ceil((Math.max(...data.map((d) => d.label.length), 1) * 6.4 + 14) / stepX));
    const radius = Math.min(6, barW / 2);
    const fillOf = (si, v) => (tone === "sign" ? (v >= 0 ? POSITIVE_COLOUR : NEGATIVE_COLOUR) : colors[si]);
    // Geometry of every bar (hidden series collapse onto their group's centre, on the zero line)
    const groupTop = (i) => Math.min(y(extent[i].up), zero);
    const bars = data.map((d, i) => {
        const centre = M.left + stepX * i + stepX / 2;
        let up = 0;
        let down = 0;
        const topSeries = [...visible].reverse().find((x) => val(d, x.key) > 0);
        const bottomSeries = [...visible].reverse().find((x) => val(d, x.key) < 0);
        return series.map((s, si) => {
            const vi = visible.findIndex((x) => x.key === s.key);
            const v = val(d, s.key);
            if (vi < 0)
                return { s, si, v, d: barPath(centre, zero, 0, 0, 0, 0), opacity: 0 };
            if (stacked) {
                if (v >= 0) {
                    const y1 = y(up + v);
                    const h = Math.max(0, y(up) - y1 - (up > 0 && v > 0 ? 1.5 : 0));
                    up += v;
                    return { s, si, v, d: barPath(centre - barW / 2, y1, barW, h, topSeries?.key === s.key ? radius : 0, 0), opacity: 1 };
                }
                const y0 = y(down) + (down < 0 ? 1.5 : 0);
                const h = Math.max(0, y(down + v) - y0);
                down += v;
                return { s, si, v, d: barPath(centre - barW / 2, y0, barW, h, 0, bottomSeries?.key === s.key ? radius : 0), opacity: 1 };
            }
            const bx = centre - groupW / 2 + vi * (barW + gapIn);
            const h = Math.abs(y(v) - zero);
            return v >= 0
                ? { s, si, v, d: barPath(bx, zero - h, barW, h, radius, 0), opacity: 1 }
                : { s, si, v, d: barPath(bx, zero, barW, h, 0, radius), opacity: 1 };
        });
    });
    const move = (e) => {
        const box = e.currentTarget.getBoundingClientRect();
        setActive(clamp(Math.floor((e.clientX - box.left) / stepX), 0, n - 1));
    };
    const onKey = (e) => {
        if (e.key === "ArrowRight")
            setActive((a) => clamp((a ?? -1) + 1, 0, n - 1));
        else if (e.key === "ArrowLeft")
            setActive((a) => clamp((a ?? n) - 1, 0, n - 1));
        else if (e.key === "Home")
            setActive(0);
        else if (e.key === "End")
            setActive(n - 1);
        else if (e.key === "Escape")
            setActive(null);
        else
            return;
        e.preventDefault();
    };
    const toggle = (key) => setHidden((h) => (h.includes(key) ? h.filter((x) => x !== key) : visible.length > 1 ? [...h, key] : h));
    if (!n)
        return _jsx("p", { className: `py-10 text-center text-[13px] ${muted}`, children: "No data" });
    const tr = (i, si) => reduce
        ? { duration: 0 }
        : entered
            ? motionTransitions.springGentle
            : { ...motionTransitions.easeSoft, delay: Math.min(i * STAGGER + si * STAGGER * 0.6, STAGGER_CAP) };
    return (_jsxs("div", { ref: rootRef, className: cx("w-full", className), children: [_jsxs("div", { ref: wrapRef, className: "relative", style: { height }, children: [_jsxs("svg", { width: width, height: height, role: "img", "aria-label": ariaLabel ?? `Bar chart of ${series.map((s) => s.label).join(", ")} across ${n} categories`, tabIndex: 0, onKeyDown: onKey, onBlur: () => setActive(null), 
                        // ioiti-ui: the focus is the global ring (design.css).
                        className: "block touch-pan-y overflow-visible rounded-lg", children: [ticks.map((tick, t) => {
                                const gy = y(tick);
                                return (_jsxs("g", { children: [_jsx("line", { x1: M.left, x2: width - M.right, y1: gy, y2: gy, stroke: tick === 0 ? AXIS_COLOUR : GRID_COLOUR }), _jsx(motion.text, { x: M.left - 8, y: gy, textAnchor: "end", dominantBaseline: "middle", className: "fill-muted-foreground text-[11px] tabular-nums", initial: anim ? { opacity: 0 } : false, animate: { opacity: 1 }, transition: motionTransitions.easeSoft, children: tickText[t] }, tickText[t])] }, t));
                            }), _jsx(motion.rect, { y: M.top, height: ih, width: stepX, rx: 8, className: "fill-black/[0.04] dark:fill-white/[0.05]", initial: false, animate: { x: M.left + stepX * (active ?? 0), opacity: active === null ? 0 : 1 }, transition: reduce ? { duration: 0 } : { x: motionTransitions.springSnappy, opacity: motionTransitions.easeFast } }), bars.map((group, i) => (_jsx("g", { className: "transition-opacity", style: { opacity: active === null || active === i ? 1 : 0.38 }, children: group.map(({ s, si, v, d, opacity }) => (_jsx(motion.path, { fill: fillOf(si, v), initial: anim ? { d: barPath(M.left + stepX * i + stepX / 2 - barW / 2, zero, barW, 0, 0, 0), opacity: 0 } : false, animate: { d, opacity }, transition: tr(i, si) }, s.key))) }, i))), data.map((d, i) => i % labelEvery === 0 ? (_jsx("text", { x: M.left + stepX * i + stepX / 2, y: height - 8, textAnchor: "middle", className: cx("text-[11px]", active === i ? "fill-foreground" : "fill-muted-foreground"), children: d.label }, i)) : null), _jsx("rect", { x: M.left, y: M.top, width: iw, height: ih, fill: "transparent", onPointerMove: move, onPointerDown: move, onPointerLeave: (e) => e.pointerType === "mouse" && setActive(null) })] }), _jsx(Tooltip, { pos: active === null ? null : { x: M.left + stepX * (active + 0.5), y: groupTop(active) }, boundsWidth: width, children: active !== null && (_jsxs(_Fragment, { children: [_jsx("p", { className: "mb-1.5 font-medium text-foreground", children: data[active].label }), _jsx("ul", { className: "space-y-1", children: visible.map((s) => (_jsxs("li", { className: "flex items-center justify-between gap-4", children: [_jsxs("span", { className: "flex items-center gap-2 text-muted-foreground", children: [_jsx(Dot, { color: fillOf(s.i, val(data[active], s.key)) }), s.label] }), _jsx("span", { className: "tabular-nums text-foreground", children: formatValue(val(data[active], s.key)) })] }, s.key))) }), stacked && visible.length > 1 && (_jsxs("p", { className: "mt-1.5 flex justify-between gap-4 border-t border-border pt-1.5", children: [_jsx("span", { className: "text-muted-foreground", children: "Total" }), _jsx("span", { className: "tabular-nums text-foreground", children: formatValue(visible.reduce((s, x) => s + val(data[active], x.key), 0)) })] }))] })) })] }), showLegend && series.length > 1 && (_jsx(ChartLegend, { label: "Series", className: "mt-3", items: series.map((s, i) => ({ label: s.label, color: colors[i], shown: !hidden.includes(s.key) })), onToggle: (i) => toggle(series[i].key) })), _jsxs("table", { className: "sr-only", children: [_jsx("caption", { children: ariaLabel ?? "Chart data" }), _jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: "Category" }), series.map((s) => (_jsx("th", { scope: "col", children: s.label }, s.key)))] }) }), _jsx("tbody", { children: data.map((d, i) => (_jsxs("tr", { children: [_jsx("th", { scope: "row", children: d.label }), series.map((s) => (_jsx("td", { children: formatValue(val(d, s.key)) }, s.key)))] }, i))) })] })] }));
}
