"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotionConfig, useTransform, } from "framer-motion";
import { Dot, clamp, cx, defaultFormat, focus, muted, useDismissOutside, useElementWidth, } from "../../lib/chart-primitives.js";
// ioiti-ui: the design's colours for things compared, and its grey for the rest.
import { MUTED_COLOUR, seriesColours } from "../../lib/chart-colours.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
const pt = (cxp, cyp, r, a) => ({ x: cxp + r * Math.sin(a), y: cyp - r * Math.cos(a) });
function arcPath(cxp, cyp, r, a0, a1) {
    const p0 = pt(cxp, cyp, r, a0);
    const p1 = pt(cxp, cyp, r, a1);
    return `M${p0.x.toFixed(2)} ${p0.y.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
}
// ioiti-ui: named for what it is (the package exports an AnimatedNumber of its own); it counts up as what
// arrives does (easeSoft), at once where motion is reduced.
function CentreTotal({ value, format, fromZero }) {
    const reduce = useReducedMotionConfig();
    const mv = useMotionValue(fromZero && !reduce ? 0 : value);
    const fmt = useRef(format);
    fmt.current = format;
    const text = useTransform(mv, (v) => fmt.current(v));
    useEffect(() => {
        const c = animate(mv, value, reduce ? { duration: 0 } : motionTransitions.easeSoft);
        return () => c.stop();
    }, [value, mv, reduce]);
    return _jsx(motion.span, { children: text });
}
function Arc({ centre, r, a0, a1, color, width, dim, animated, reduce, delay, label, onEnter, onLeave, onClick, }) {
    const s = useMotionValue(a0);
    const e = useMotionValue(animated ? a0 : a1);
    const w = useMotionValue(width);
    const first = useRef(true);
    const d = useTransform([s, e], ([x, y]) => arcPath(centre.x, centre.y, r, x, Math.max(y, x + 0.0004)));
    // ioiti-ui: the arcs sweep in as what arrives does, then move without overshoot (springGentle); at once
    // where motion is reduced, which MotionConfig does not do for a value animated by hand.
    useEffect(() => {
        const intro = first.current && animated;
        const change = reduce ? { duration: 0 } : motionTransitions.springGentle;
        const c1 = animate(s, a0, intro ? { duration: 0 } : change);
        const c2 = animate(e, a1, intro ? { ...motionTransitions.easeSoft, delay } : change);
        first.current = false;
        return () => {
            c1.stop();
            c2.stop();
        };
    }, [a0, a1, animated, reduce, delay, s, e]);
    useEffect(() => {
        const c = animate(w, width, reduce ? { duration: 0 } : motionTransitions.springSnappy);
        return () => c.stop();
    }, [width, w, reduce]);
    return (_jsxs("g", { className: "transition-opacity", style: { opacity: dim ? 0.35 : 1 }, children: [_jsx(motion.path, { d: d, fill: "none", stroke: color, strokeWidth: w, strokeLinecap: "round" }), _jsx(motion.path, { d: d, fill: "none", stroke: "transparent", strokeWidth: 30, strokeLinecap: "round", pointerEvents: "stroke", style: { cursor: "pointer" }, onPointerEnter: onEnter, onPointerLeave: onLeave, onClick: onClick, "aria-label": label })] }));
}
export function DonutChart({ data, variant = "donut", size = 240, thickness = 16, centerLabel = "Total", otherLabel = "Other", formatValue = defaultFormat, showLegend = true, animated = true, ariaLabel, className = "", }) {
    // ioiti-ui: reduced as the system asks or IoitiProvider's reducedMotion says.
    const reduce = useReducedMotionConfig() ?? false;
    const anim = animated && !reduce;
    const [rootRef, rootW] = useElementWidth(560);
    const [hidden, setHidden] = useState([]);
    const [active, setActive] = useState(null);
    const wrapRef = useRef(null);
    useDismissOutside(wrapRef, active !== null, useCallback(() => setActive(null), []));
    const semi = variant === "semi";
    const side = showLegend && rootW >= 520;
    const D = Math.round(Math.max(120, Math.min(size, side ? rootW * 0.42 : rootW)));
    const grow = thickness + 6;
    const r = D / 2 - grow / 2 - 1;
    const cy = semi ? r + grow / 2 + 1 : D / 2;
    const H = semi ? Math.round(r + grow + 3) : D;
    const centre = { x: D / 2, y: cy };
    // ioiti-ui: four segments in the compare colours, the rest one segment in the design's grey.
    const grouped = data.length > 4 && data.slice(4).some((d) => !d.color);
    const shown = grouped
        ? [...data.slice(0, 4), { label: otherLabel, value: data.slice(4).reduce((s, d) => s + Math.max(0, d.value), 0), color: MUTED_COLOUR }]
        : data;
    const colors = seriesColours(shown.map((d) => d.color));
    const items = shown.map((d, i) => ({ ...d, i, color: colors[i], off: hidden.includes(i) }));
    const total = items.reduce((s, x) => s + (x.off ? 0 : Math.max(0, x.value)), 0);
    const S = semi ? -Math.PI / 2 : 0;
    const A = semi ? Math.PI : Math.PI * 2;
    const pad = 3.5 / r + thickness / 2 / r; // arc gap + round cap
    let acc = 0;
    const segs = items.map((it) => {
        const f = it.off || total === 0 ? 0 : Math.max(0, it.value) / total;
        const a0 = S + acc * A;
        acc += f;
        const a1 = S + acc * A;
        const room = a1 - a0 - 2 * pad;
        const mid = (a0 + a1) / 2;
        return { ...it, f, a0: room > 0 ? a0 + pad : mid, a1: room > 0 ? a1 - pad : mid };
    });
    const toggle = (i) => setHidden((h) => (h.includes(i) ? h.filter((x) => x !== i) : items.length - h.length > 1 ? [...h, i] : h));
    const act = active !== null ? segs[active] : null;
    const valueSize = clamp(D * 0.15, 22, 38);
    const allTotal = data.reduce((s, d) => s + Math.max(0, d.value), 0);
    if (!data.length)
        return _jsx("p", { className: `py-10 text-center text-[13px] ${muted}`, children: "No data" });
    return (_jsxs("div", { ref: rootRef, className: cx("w-full", side ? "flex items-center gap-8" : "flex flex-col items-center gap-5", className), children: [_jsxs("div", { ref: wrapRef, className: "relative shrink-0", style: { width: D, height: H }, children: [_jsxs("svg", { width: D, height: H, role: "img", "aria-label": ariaLabel ?? `${semi ? "Gauge" : "Donut"} chart. Total ${formatValue(total)}`, className: "block overflow-visible", children: [_jsx("path", { d: semi ? arcPath(centre.x, centre.y, r, S + pad, S + A - pad) : arcPath(centre.x, centre.y, r, 0, Math.PI * 1.9999), fill: "none", strokeWidth: thickness, strokeLinecap: "round", className: "stroke-black/[0.05] dark:stroke-white/[0.06]" }), segs.map((sg, i) => (_jsx(Arc, { centre: centre, r: r, a0: sg.a0, a1: sg.a1, color: sg.color, width: sg.off ? 0 : active === i ? thickness + 4 : thickness, dim: active !== null && active !== i, animated: anim, reduce: reduce, delay: Math.min(0.06 + i * 0.06, 0.3), label: `${sg.label}: ${formatValue(sg.value)}`, onEnter: () => setActive(i), onLeave: () => setActive(null), onClick: () => setActive((a) => (a === i ? null : i)) }, i)))] }), _jsx("div", { className: cx("pointer-events-none absolute inset-x-0 flex flex-col items-center text-center", semi ? "bottom-0 justify-end" : "inset-y-0 justify-center"), children: _jsx(AnimatePresence, { mode: "wait", initial: false, children: _jsxs(motion.div, { className: "max-w-[70%]", initial: { opacity: 0, y: reduce ? 0 : 4 }, animate: { opacity: 1, y: 0 }, 
                                // ioiti-ui: in as what arrives, out quicker (easeFast, easeExit).
                                exit: { opacity: 0, y: reduce ? 0 : -4, transition: motionTransitions.easeExit }, transition: motionTransitions.easeFast, children: [_jsx("p", { className: `truncate text-[12px] ${muted}`, children: act ? act.label : centerLabel }), _jsx("p", { className: "font-semibold leading-tight tracking-[-0.03em] tabular-nums text-foreground", style: { fontSize: valueSize }, children: act ? formatValue(act.value) : _jsx(CentreTotal, { value: total, format: formatValue, fromZero: anim }) }), act && _jsxs("p", { className: `text-[12px] tabular-nums ${muted}`, children: [Math.round(act.f * 100), "%"] })] }, active ?? "total") }) })] }), showLegend && (_jsx("ul", { className: cx("w-full", side ? "max-w-[280px] flex-1" : "max-w-sm"), "aria-label": "Legend", children: segs.map((sg, i) => (_jsx("li", { children: _jsxs("button", { type: "button", "aria-pressed": !sg.off, onClick: () => toggle(i), onPointerEnter: (e) => e.pointerType === "mouse" && setActive(i), onPointerLeave: (e) => e.pointerType === "mouse" && setActive(null), onFocus: () => setActive(i), onBlur: () => setActive(null), className: `flex h-11 w-full items-center gap-3 rounded-xl px-2.5 text-left text-[13px] transition-[background-color,opacity] duration-150 [-webkit-tap-highlight-color:transparent] sm:h-10 [@media(hover:hover)]:hover:bg-black/[0.04] dark:[@media(hover:hover)]:hover:bg-white/[0.05] ${focus}`, children: [_jsx("span", { className: cx("inline-flex", sg.off && "opacity-40"), children: _jsx(Dot, { color: sg.color }) }), _jsx("span", { className: cx("min-w-0 flex-1 truncate", sg.off ? "text-text-muted line-through" : "text-text-secondary"), children: sg.label }), _jsx("span", { className: cx("tabular-nums", sg.off ? "text-text-muted" : "text-foreground"), children: formatValue(sg.value) }), _jsx("span", { className: `w-9 text-right text-[12px] tabular-nums ${muted}`, children: sg.off ? "—" : `${Math.round(sg.f * 100)}%` })] }) }, i))) })), _jsxs("table", { className: "sr-only", children: [_jsx("caption", { children: ariaLabel ?? "Chart data" }), _jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: "Segment" }), _jsx("th", { scope: "col", children: "Value" }), _jsx("th", { scope: "col", children: "Share" })] }) }), _jsx("tbody", { children: data.map((d, i) => (_jsxs("tr", { children: [_jsx("th", { scope: "row", children: d.label }), _jsx("td", { children: formatValue(d.value) }), _jsx("td", { children: allTotal > 0 ? `${Math.round((Math.max(0, d.value) / allTotal) * 100)}%` : "—" })] }, i))) })] })] }));
}
