"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotionConfig } from "framer-motion";
import { clamp, cx, muted, Tooltip, 
// ioiti-ui: the numbers and percentages in the interface's locale.
useChartFormat, useDismissOutside, useElementWidth, } from "../../lib/chart-primitives.js";
import { buildFrame, valueAt, visibleExtent, } from "../../lib/dashboard-chart-utils.js";
import { AXIS_COLOUR, GRID_COLOUR } from "../../lib/chart-colours.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { PRESSABLE, TONE_MARK } from "../../lib/recipes.js";
// ioiti-ui: the words in the interface's language, and its formats.
import { useFormat, useMessages } from "../locale-context.js";
export { buildFrame, valueAt, visibleExtent } from "../../lib/dashboard-chart-utils.js";
const LIVE_M = { l: 46, t: 8, r: 12, b: 22 };
// ioiti-ui: lengths of time in words, minutes from two of them ("15 min", "7.5 min", "40 s"): the axis of a window of
// fifteen minutes read "−900s". In the interface's locale and language: its numbers (`number`), its units.
function spanText(seconds, units, number) {
    return seconds >= 120 ? `${number(Number((seconds / 60).toFixed(1)))} ${units.minutes}` : `${number(seconds)} ${units.seconds}`;
}
// ioiti-ui: in the interface's locale and language too, its seconds rounded by toFixed before its locale writes them
// to a tenth (`tenth`: Intl would round 29.65 up).
function agoText(seconds, units, tenth) {
    if (seconds < 60)
        return `${tenth(Number(seconds.toFixed(1)))} ${units.seconds}`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${units.minutes} ${String(Math.round(seconds % 60)).padStart(2, "0")} ${units.seconds}`;
}
export function LiveLineChart({ source, initial, intervalMs = 1000, windowSeconds = 60, height = 220, 
// ioiti-ui: the design's series colour, which the pages always gave it (EasyUI's was an indigo).
color = "var(--chart-series)", unit = "", formatValue: givenFormatValue, formatTick: givenFormatTick, formatChange, initialPoints, domain, showReadout = true, 
// ioiti-ui: its name as ARIA writes it, where EasyUI's said `ariaLabel`.
"aria-label": name, className = "", }) {
    const reduce = useReducedMotionConfig();
    // ioiti-ui: the numbers, percentages, units and words in the interface's locale and language, where the application
    // gives none of its own.
    const chartFormat = useChartFormat();
    const formatValue = givenFormatValue ?? chartFormat.format;
    const formatTick = givenFormatTick ?? chartFormat.tick;
    const pctText = chartFormat.percent;
    const { formatNumber } = useFormat();
    const messages = useMessages();
    const words = messages.chart;
    const span = (seconds) => spanText(seconds, messages.format, chartFormat.format);
    const uid = useId().replace(/:/g, "");
    const [rootRef, width] = useElementWidth(640);
    const wrapRef = useRef(null);
    const svgRef = useRef(null);
    const lineEl = useRef(null);
    const areaEl = useRef(null);
    const headEl = useRef(null);
    const haloEl = useRef(null);
    const crossLine = useRef(null);
    const crossDot = useRef(null);
    const tickEls = useRef([]);
    // ioiti-ui: the zero line, drawn while zero is in view (a profit on one side, a loss on the other).
    const zeroEl = useRef(null);
    const buf = useRef([]);
    const size = useRef({ w: width, h: height });
    const live = useRef({ delay: intervalMs, win: windowSeconds * 1000, domain, reduce: !!reduce, fmt: formatValue });
    const flags = useRef({ paused: false, hoverX: null, dirty: true });
    const fmtTick = useRef(formatTick);
    fmtTick.current = formatTick;
    const known = initialPoints?.length ? initialPoints.map((p) => p.v) : initial;
    const [latest, setLatest] = useState(known?.length ? known[known.length - 1] : null);
    const [first, setFirst] = useState(known?.length ? known[0] : null);
    const [manualPause, setManualPause] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [scrub, setScrub] = useState(null);
    const paused = manualPause || hovering;
    useDismissOutside(wrapRef, hovering, useCallback(() => {
        flags.current.hoverX = null;
        setHovering(false);
        setScrub(null);
    }, []));
    // keep the animation loop's view of props / state fresh without restarting it
    useEffect(() => {
        live.current = { delay: reduce ? 0 : intervalMs, win: windowSeconds * 1000, domain, reduce: !!reduce, fmt: formatValue };
        size.current = { w: width, h: height };
        flags.current.paused = paused;
        flags.current.dirty = true;
    }, [intervalMs, windowSeconds, domain, reduce, formatValue, width, height, paused]);
    const push = useCallback((value, time) => {
        if (!Number.isFinite(value))
            return;
        const b = buf.current;
        let t = time ?? Date.now();
        if (b.length && t <= b[b.length - 1].t)
            t = b[b.length - 1].t + 1;
        b.push({ t, v: value });
        if (b.length > 6000)
            b.splice(0, b.length - 6000);
        flags.current.dirty = true;
        setLatest(value);
        setFirst((f) => f ?? value);
    }, []);
    // seed history + subscribe to the feed
    useEffect(() => {
        if (initialPoints?.length) {
            buf.current = initialPoints.map((p) => ({ t: p.t, v: p.v }));
            flags.current.dirty = true;
        }
        else if (initial?.length) {
            const end = Date.now();
            buf.current = initial.map((v, i) => ({ t: end - (initial.length - 1 - i) * intervalMs, v }));
            flags.current.dirty = true;
        }
        const stop = source?.(push);
        return () => {
            if (typeof stop === "function")
                stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // the render loop: draws straight into the DOM (no React re-renders at 60 fps)
    useEffect(() => {
        let raf = 0;
        let last = 0;
        let dc = Date.now() - live.current.delay; // the moment currently on screen
        let visible = true;
        let lastLabels = 0;
        let lastScrub = "";
        const dom = { lo: 0, hi: 1, init: false };
        const geom = () => {
            const { w, h } = size.current;
            return { l: LIVE_M.l, t: LIVE_M.t, iw: Math.max(10, w - LIVE_M.l - LIVE_M.r), ih: Math.max(10, h - LIVE_M.t - LIVE_M.b) };
        };
        const draw = (dt, now) => {
            const b = buf.current;
            const { win, domain: fixed } = live.current;
            const g = geom();
            // ioiti-ui: a scale given (`domain`) is said from the first frame, the y labels with it: the chart waited for two
            // readings, an empty frame without a figure until then.
            if (b.length < 2 && fixed && !dom.init) {
                [dom.lo, dom.hi] = fixed;
                for (let i = 0; i < 3; i++) {
                    const el = tickEls.current[i];
                    if (el)
                        el.textContent = fmtTick.current(dom.hi - ((dom.hi - dom.lo) * i) / 2);
                }
            }
            if (b.length < 2 || !lineEl.current || !areaEl.current)
                return;
            // y-range eases toward what's on screen
            let lo, hi;
            if (fixed) {
                [lo, hi] = fixed;
                dom.lo = lo;
                dom.hi = hi;
                dom.init = true;
            }
            else {
                const ext = visibleExtent(b, dc, win);
                const pad = (ext.max - ext.min) * 0.16 || Math.max(1, Math.abs(ext.max) * 0.05);
                lo = ext.min - pad;
                hi = ext.max + pad;
                if (!dom.init) {
                    dom.lo = lo;
                    dom.hi = hi;
                    dom.init = true;
                }
                else {
                    const k = live.current.reduce ? 1 : 1 - Math.exp((-dt / 1000) * 5);
                    dom.lo += (lo - dom.lo) * k;
                    dom.hi += (hi - dom.hi) * k;
                }
            }
            const f = buildFrame(b, dc, win, dom, g);
            if (zeroEl.current) {
                const inView = dom.lo < 0 && dom.hi > 0;
                const zy = g.t + g.ih - ((0 - dom.lo) / (dom.hi - dom.lo || 1)) * g.ih;
                zeroEl.current.setAttribute("y1", String(zy));
                zeroEl.current.setAttribute("y2", String(zy));
                zeroEl.current.style.opacity = inView ? "1" : "0";
            }
            lineEl.current.setAttribute("d", f.line);
            areaEl.current.setAttribute("d", f.area);
            if (f.head && headEl.current && haloEl.current) {
                headEl.current.setAttribute("cx", String(f.head.x));
                headEl.current.setAttribute("cy", String(f.head.y));
                haloEl.current.setAttribute("cx", String(f.head.x));
                haloEl.current.setAttribute("cy", String(f.head.y));
            }
            // y-axis labels (updated ~5×/s so the numbers stay readable while the range eases)
            if (now - lastLabels > 200 || flags.current.dirty) {
                lastLabels = now;
                for (let i = 0; i < 3; i++) {
                    const el = tickEls.current[i];
                    if (el)
                        el.textContent = fmtTick.current(dom.hi - ((dom.hi - dom.lo) * i) / 2);
                }
            }
            // scrubbing (hover / touch): crosshair follows the pointer on the frozen frame
            const hx = flags.current.hoverX;
            if (hx !== null && crossLine.current && crossDot.current) {
                const x = clamp(hx, g.l, g.l + g.iw);
                const t = f.tStart + ((x - g.l) / g.iw) * win;
                const v = valueAt(b, t);
                if (v !== null) {
                    const y = g.t + g.ih - ((v - dom.lo) / (dom.hi - dom.lo || 1)) * g.ih;
                    crossLine.current.setAttribute("x1", String(x));
                    crossLine.current.setAttribute("x2", String(x));
                    crossDot.current.setAttribute("cx", String(x));
                    crossDot.current.setAttribute("cy", String(y));
                    const ago = Math.max(0, (dc - t) / 1000);
                    const key = `${Math.round(x)}|${v.toFixed(2)}|${ago.toFixed(1)}`;
                    if (key !== lastScrub) {
                        lastScrub = key;
                        setScrub({ x, y, v, ago });
                    }
                }
            }
        };
        let lastDrawn = 0;
        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            // ioiti-ui: a frame when the line has moved half a pixel, or something changed: a window of fifteen minutes
            // scrolls less than a pixel a second, and EasyUI's 60 frames a second kept a phone busy for nothing.
            const pace = live.current.win / Math.max(10, size.current.w - LIVE_M.l - LIVE_M.r) / 2;
            if (!flags.current.dirty && flags.current.hoverX === null && now - lastDrawn < pace)
                return;
            lastDrawn = now;
            // ioiti-ui: a step as long as the pace (EasyUI capped it at 100 ms, which a paced line could never catch up with).
            const dt = Math.min(now - last, Math.max(100, pace + 50));
            last = now;
            const b = buf.current;
            const { delay, win, reduce: rm } = live.current;
            const f = flags.current;
            if (rm) {
                if (!f.dirty)
                    return;
                if (!f.paused && b.length)
                    dc = b[b.length - 1].t;
            }
            else if (!f.paused) {
                const target = Date.now() - delay;
                // resume smoothly: run slightly faster until we've caught up with live
                dc += dt * (1 + clamp((target - dc) / 2000, 0, 1.5));
                if (dc > target)
                    dc = target;
                if (target - dc > win)
                    dc = target;
            }
            // forget what has scrolled far out of view
            const keep = dc - win - 5000;
            while (b.length > 2 && b[1].t < keep)
                b.shift();
            draw(dt, now);
            f.dirty = false;
        };
        const shouldRun = () => visible && !document.hidden;
        const start = () => {
            if (raf || !shouldRun())
                return;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };
        const sync = () => (shouldRun() ? start() : stop());
        // ioiti-ui: drawn all the time where there is no IntersectionObserver (the tests' jsdom).
        const io = typeof IntersectionObserver === "undefined"
            ? null
            : new IntersectionObserver(([e]) => {
                visible = e.isIntersecting;
                sync();
            });
        if (io && wrapRef.current)
            io.observe(wrapRef.current);
        document.addEventListener("visibilitychange", sync);
        start();
        return () => {
            stop();
            io?.disconnect();
            document.removeEventListener("visibilitychange", sync);
        };
    }, []);
    /* pointer: hovering pauses the stream and lets you scrub it */
    const pointer = (e) => {
        const box = svgRef.current?.getBoundingClientRect();
        if (!box)
            return;
        flags.current.hoverX = e.clientX - box.left;
        flags.current.paused = true;
        flags.current.dirty = true;
        setHovering(true);
    };
    const leave = (e) => {
        if (e.pointerType !== "mouse")
            return;
        flags.current.hoverX = null;
        flags.current.dirty = true;
        setHovering(false);
        setScrub(null);
    };
    const g = { l: LIVE_M.l, t: LIVE_M.t, iw: Math.max(10, width - LIVE_M.l - LIVE_M.r), ih: Math.max(10, height - LIVE_M.t - LIVE_M.b) };
    const delta = latest !== null && first !== null && first !== 0 ? ((latest - first) / Math.abs(first)) * 100 : null;
    const winS = windowSeconds;
    // ioiti-ui: the change since the window's start, in the caller's words.
    const windowStart = buf.current.length ? valueAt(buf.current, Date.now() - live.current.delay - windowSeconds * 1000) : null;
    const change = formatChange && latest !== null && windowStart !== null ? latest - windowStart : null;
    return (_jsxs("div", { ref: rootRef, className: cx("w-full contain-inline-size", className), children: [showReadout && (_jsxs("div", { className: "mb-3 flex flex-wrap items-end justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "text-[28px] font-semibold leading-none tracking-[-0.035em] tabular-nums text-foreground sm:text-[32px]", children: [latest === null ? "—" : formatValue(latest), unit && _jsx("span", { className: `ml-1.5 text-sm font-normal tracking-normal ${muted}`, children: unit })] }), formatChange ? (change !== null && (_jsxs("p", { className: `mt-1.5 text-xs tabular-nums ${muted}`, children: [_jsxs("span", { className: change > 0 ? "text-positive" : change < 0 ? "text-negative" : undefined, children: [change > 0 ? "▲" : change < 0 ? "▼" : "", " ", formatChange(change)] }), " ", words.liveWindow(span(winS))] }))) : (delta !== null && (_jsxs("p", { className: `mt-1.5 text-xs tabular-nums ${muted}`, children: [_jsxs("span", { className: delta >= 0 ? "text-positive" : "text-negative", children: [delta >= 0 ? "▲" : "▼", " ", pctText(Math.abs(delta))] }), " ", words.liveWindow(span(winS))] })))] }), _jsxs("button", { type: "button", onClick: () => setManualPause((p) => !p), "aria-pressed": manualPause, "aria-label": manualPause ? words.resumeLive : words.pauseLive, 
                        // ioiti-ui: the global focus ring (EasyUI's `focus` hid it behind its own).
                        className: `inline-flex h-8 items-center gap-2 rounded-full bg-foreground/5 pl-3 pr-3.5 text-sm font-medium text-text-secondary transition-[background-color,transform] duration-150 [@media(hover:hover)]:hover:bg-foreground/10 ${PRESSABLE}`, children: [_jsxs("span", { className: "relative flex size-2", children: [!paused && !reduce && _jsx("span", { className: "absolute inset-0 animate-ping rounded-full bg-positive/70" }), _jsx("span", { className: cx("relative size-2 rounded-full", paused ? TONE_MARK.warning : TONE_MARK.positive) })] }), paused ? words.paused : words.live] })] })), _jsxs("div", { ref: wrapRef, className: "relative", style: { height }, children: [_jsxs("svg", { ref: svgRef, width: width, height: height, role: "img", "aria-label": name ?? words.liveChartName({ span: span(winS), value: latest === null ? undefined : formatValue(latest), unit }), className: "block touch-pan-y overflow-visible", children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: `${uid}-a`, x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0", stopColor: color, stopOpacity: "0.26" }), _jsx("stop", { offset: "1", stopColor: color, stopOpacity: "0" })] }), _jsx("clipPath", { id: `${uid}-c`, children: _jsx("rect", { x: g.l, y: 0, width: g.iw + LIVE_M.r, height: height }) })] }), [0, 1, 2].map((i) => {
                                const gy = g.t + (g.ih / 2) * i;
                                return (_jsxs("g", { children: [_jsx("line", { x1: g.l, x2: width - LIVE_M.r, y1: gy, y2: gy, stroke: GRID_COLOUR }), _jsx("text", { ref: (el) => {
                                                tickEls.current[i] = el;
                                            }, x: g.l - 8, y: gy, textAnchor: "end", dominantBaseline: "middle", className: "fill-muted-foreground text-[11px] tabular-nums" })] }, i));
                            }), [0, 0.5, 1].map((p, i) => (_jsx("text", { x: g.l + g.iw * p, y: height - 6, textAnchor: i === 0 ? "start" : i === 2 ? "end" : "middle", className: "fill-muted-foreground text-[11px] tabular-nums", children: i === 2 ? words.now : words.beforeNow(span(Math.round(winS * (1 - p)))) }, i))), _jsx("line", { ref: zeroEl, x1: g.l, x2: width - LIVE_M.r, stroke: AXIS_COLOUR, strokeWidth: 1, style: { opacity: 0 } }), _jsxs("g", { clipPath: `url(#${uid}-c)`, children: [_jsx("path", { ref: areaEl, fill: `url(#${uid}-a)` }), _jsx("path", { ref: lineEl, fill: "none", stroke: color, strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" })] }), _jsx(motion.circle, { ref: haloEl, r: 4, fill: color, style: { transformBox: "fill-box", transformOrigin: "center", opacity: hovering ? 0 : 1 }, animate: paused || reduce ? { scale: 1, opacity: 0 } : { scale: [1, 3], opacity: [0.4, 0] }, transition: paused || reduce ? { duration: 0 } : { ...motionTransitions.easeSoft, repeat: Infinity, duration: 1.6 } }), _jsx("circle", { ref: headEl, r: 4, fill: color, className: "stroke-surface", strokeWidth: 2 }), _jsxs("g", { className: "transition-opacity", style: { opacity: hovering ? 1 : 0 }, pointerEvents: "none", children: [_jsx("line", { ref: crossLine, y1: g.t, y2: g.t + g.ih, strokeDasharray: "2 3", stroke: AXIS_COLOUR }), _jsx("circle", { ref: crossDot, r: 5, fill: color, className: "stroke-surface", strokeWidth: 2 })] }), _jsx("rect", { x: g.l, y: g.t, width: g.iw, height: g.ih, fill: "transparent", onPointerMove: pointer, onPointerDown: pointer, onPointerLeave: leave })] }), _jsx(Tooltip, { pos: scrub && hovering ? { x: scrub.x, y: scrub.y } : null, boundsWidth: width, children: scrub && (_jsxs(_Fragment, { children: [_jsxs("p", { className: "font-medium tabular-nums text-foreground", children: [formatValue(scrub.v), unit && _jsx("span", { className: "ml-1 font-normal text-muted-foreground", children: unit })] }), _jsx("p", { className: "mt-0.5 tabular-nums text-muted-foreground", children: scrub.ago < 0.5 ? words.now : messages.format.past(agoText(scrub.ago, messages.format, (n) => formatNumber(n, 1))) })] })) })] }), _jsx("p", { className: "sr-only", role: "status", "aria-live": "polite", children: paused ? words.livePausedStatus : "" })] }));
}
