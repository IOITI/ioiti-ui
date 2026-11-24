"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useId, useRef, useState, } from "react";
import { animate, motion, useMotionValue, useReducedMotionConfig, useSpring, useTransform, } from "framer-motion";
import { clamp, cx, defaultFormat, useDismissOutside, useElementWidth, } from "../../lib/chart-primitives.js";
import { monotonePath, pctText } from "../../lib/dashboard-chart-utils.js";
import { AXIS_COLOUR } from "../../lib/chart-colours.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { SECTION, TONE_SOFT } from "../../lib/recipes.js";
// ioiti-ui: secondary text at 4.5:1 in both themes (neutral-500 is 4.0:1 on the dark card).
const MUTED = "text-muted-foreground";
// ioiti-ui: the scrubber follows the pointer as what floats moves (springSnappy).
const FOLLOW = motionTransitions.springSnappy;
export function StatCard({ label, value, trend, trendLabels, previous, delta, goodWhen = "up", period = "vs previous period", format = defaultFormat, toneOf, 
// ioiti-ui: the design's series colour, which the pages always gave it (EasyUI's was an indigo).
color = "var(--chart-series)", animated = true, className = "", }) {
    const reduce = useReducedMotionConfig();
    const anim = animated && !reduce;
    const uid = useId().replace(/:/g, "");
    const [boxRef, width] = useElementWidth(220);
    const svgRef = useRef(null);
    const cardRef = useRef(null);
    const [active, setActive] = useState(null);
    useDismissOutside(cardRef, active !== null, useCallback(() => setActive(null), []));
    const n = trend.length;
    const H = 52, padX = 0, padT = 8, padB = 6;
    const min = n ? Math.min(...trend) : 0;
    const span = (n ? Math.max(...trend) : 1) - min || 1;
    const stepX = n > 1 ? (width - padX * 2) / (n - 1) : 0;
    const pts = trend.map((v, i) => [padX + i * stepX, padT + (1 - (v - min) / span) * (H - padT - padB)]);
    const line = monotonePath(pts);
    const area = n > 1 ? `${line}L${pts[n - 1][0].toFixed(2)} ${H}L${pts[0][0].toFixed(2)} ${H}Z` : "";
    const pct = delta ??
        (previous !== undefined && previous !== 0
            ? ((value - previous) / Math.abs(previous)) * 100
            : n > 1 && trend[0] !== 0
                ? ((trend[n - 1] - trend[0]) / Math.abs(trend[0])) * 100
                : 0);
    const change = Math.round(pct * 10) / 10;
    // ioiti-ui: a change only when the caller gives what it is from: EasyUI worked one out from the line's two ends,
    // which means nothing for a profit (it changes sign).
    const hasDelta = delta !== undefined || previous !== undefined;
    const good = change === 0 ? null : goodWhen === "up" ? change > 0 : change < 0;
    /* number: counts up on mount, follows the scrubber afterwards */
    const fmt = useRef(format);
    fmt.current = format;
    const shown = useMotionValue(anim ? 0 : value);
    const text = useTransform(shown, (v) => fmt.current(v));
    const mounted = useRef(false);
    useEffect(() => {
        const target = active === null ? value : trend[active];
        const intro = !mounted.current;
        mounted.current = true;
        const c = animate(shown, target, reduce ? { duration: 0 } : intro ? { ...motionTransitions.easeSoft, duration: 1.1 } : motionTransitions.easeFast);
        return () => c.stop();
    }, [active, value, trend, shown, reduce]);
    /* scrub cursor */
    const curX = useSpring(0, FOLLOW);
    const curY = useSpring(0, FOLLOW);
    const seen = useRef(false);
    useEffect(() => {
        if (active === null || !pts[active]) {
            seen.current = false;
            return;
        }
        const [px, py] = pts[active];
        if (!seen.current) {
            curX.jump(px);
            curY.jump(py);
            seen.current = true;
        }
        else {
            curX.set(px);
            curY.set(py);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, width, curX, curY]);
    const move = (e) => {
        if (n < 2 || !svgRef.current)
            return;
        const box = svgRef.current.getBoundingClientRect();
        setActive(clamp(Math.round((e.clientX - box.left - padX) / stepX), 0, n - 1));
    };
    const onKey = (e) => {
        if (e.key === "ArrowRight")
            setActive((a) => clamp((a ?? n - 2) + 1, 0, n - 1));
        else if (e.key === "ArrowLeft")
            setActive((a) => clamp((a ?? n) - 1, 0, n - 1));
        else if (e.key === "Escape")
            setActive(null);
        else
            return;
        e.preventDefault();
    };
    const sub = active === null ? period : (trendLabels?.[active] ?? `Point ${active + 1}`);
    const tone = toneOf?.(active === null ? value : trend[active]);
    return (_jsxs("div", { ref: cardRef, tabIndex: 0, role: "group", "aria-label": hasDelta
            ? `${label}: ${format(value)}, ${change > 0 ? "up" : change < 0 ? "down" : "unchanged"} ${pctText(Math.abs(change))}`
            : `${label}: ${format(value)}`, onPointerMove: move, onPointerDown: move, onPointerLeave: (e) => e.pointerType === "mouse" && setActive(null), onKeyDown: onKey, onBlur: () => setActive(null), 
        // ioiti-ui: the look of the other tiles (KpiTile), which it sits among: their border, surface, padding
        // and type sizes, and the global focus ring (EasyUI's card was white, ringed and shadowed); glass under
        // the glass material, as they are.
        className: `group relative flex min-h-[7.5rem] min-w-0 select-none flex-col overflow-hidden ${SECTION} pt-4 text-text-secondary sm:pt-5 ${className}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-3 px-4 sm:px-5", children: [_jsx("p", { className: `truncate text-xs ${MUTED}`, children: label }), hasDelta && (_jsxs("span", { className: cx("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums", 
                        // ioiti-ui: the status colours of theme.css, 4.5:1 as text (emerald-600 on its pale pill was 3.6:1).
                        good === null && TONE_SOFT.neutral, good === true && TONE_SOFT.positive, good === false && TONE_SOFT.negative), children: [change !== 0 && (_jsx("svg", { viewBox: "0 0 10 10", className: cx("size-2", change < 0 && "rotate-180"), fill: "currentColor", "aria-hidden": true, children: _jsx("path", { d: "M5 1.5 9 7.5H1Z" }) })), pctText(Math.abs(change))] }))] }), _jsx("p", { className: cx("mt-2 px-4 text-xl font-semibold tracking-tight tabular-nums sm:px-5 sm:text-2xl", tone ?? "text-foreground"), children: _jsx(motion.span, { children: text }) }), _jsx("p", { className: `mt-1 truncate px-4 text-xs sm:px-5 ${MUTED}`, children: sub }), _jsx("div", { ref: boxRef, className: "mt-auto pt-3 contain-inline-size", style: { height: H + 12 }, children: n > 1 && (_jsxs("svg", { ref: svgRef, width: width, height: H, role: "img", "aria-label": `${label} trend from ${format(trend[0])} to ${format(trend[n - 1])}`, className: "block overflow-visible", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: `${uid}-g`, x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0", stopColor: color, stopOpacity: "0.28" }), _jsx("stop", { offset: "1", stopColor: color, stopOpacity: "0" })] }) }), _jsx(motion.path, { d: area, fill: `url(#${uid}-g)`, initial: anim ? { opacity: 0 } : false, animate: { opacity: 1 }, transition: { ...motionTransitions.easeSoft, duration: 0.8, delay: 0.5 } }), _jsx(motion.path, { d: line, fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", initial: anim ? { pathLength: 0 } : false, animate: { pathLength: 1 }, transition: { ...motionTransitions.easeSoft, duration: 1.1, delay: 0.15 } }), _jsxs("g", { className: "transition-opacity", style: { opacity: active === null ? 1 : 0 }, children: [anim && (_jsx(motion.circle, { cx: pts[n - 1][0], cy: pts[n - 1][1], r: 3.5, fill: color, style: { transformBox: "fill-box", transformOrigin: "center" }, animate: { scale: [1, 2.8], opacity: [0.4, 0] }, transition: { ...motionTransitions.easeSoft, repeat: Infinity, duration: 1.8 } })), _jsx("circle", { cx: pts[n - 1][0], cy: pts[n - 1][1], r: 3.5, fill: color })] }), _jsxs(motion.g, { initial: false, animate: { opacity: active === null ? 0 : 1 }, transition: motionTransitions.easeFast, children: [_jsx(motion.line, { y1: 0, y2: H, x1: curX, x2: curX, stroke: AXIS_COLOUR, strokeDasharray: "2 3" }), _jsx(motion.circle, { cx: curX, cy: curY, r: 4.5, fill: color, className: "stroke-surface", strokeWidth: 2 })] })] })) }), _jsx("p", { className: "sr-only", role: "status", "aria-live": "polite", children: active !== null ? `${trendLabels?.[active] ?? `Point ${active + 1}`}: ${format(trend[active])}` : "" })] }));
}
export function StatGrid({ children, className = "" }) {
    return (_jsx("div", { className: `grid gap-3 sm:gap-4 ${className}`, style: { gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))" }, children: children }));
}
