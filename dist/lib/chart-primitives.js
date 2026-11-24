"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useLayoutEffect, useRef, useState, } from "react";
import { motion, useReducedMotionConfig, useSpring } from "framer-motion";
// ioiti-ui: the interface's locale (IoitiProvider's), which a chart writes its numbers in.
import { useLocale } from "../components/locale-context.js";
import { pctText, shareText, withTrueMinus } from "./dashboard-chart-utils.js";
import { DEFAULT_LOCALE } from "./locale.js";
import { motionTransitions } from "./motion-tokens.js";
import { TOOLTIP } from "./recipes.js";
/* -------------------------------------------------------------------------- */
/*  Shared chart primitives                                                    */
/*                                                                             */
/*  Used by BarChart, DonutChart and ActivityHeatmap. Kept in src/lib so the   */
/*  registry generator ships it as a shared `registry:lib` dependency.         */
/* -------------------------------------------------------------------------- */
export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
export const cx = (...a) => a.filter(Boolean).join(" ");
const chartFormats = new Map();
/** ioiti-ui: the charts' formats in a locale, made once for it; British English's by default. */
export function chartFormatFor(locale = DEFAULT_LOCALE) {
    const known = chartFormats.get(locale);
    if (known)
        return known;
    const full = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
    const compact = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
    const made = {
        format: (n) => withTrueMinus(full, n),
        tick: (n) => withTrueMinus(compact, n),
        percent: (points) => pctText(points, locale),
        share: (fraction) => shareText(fraction, locale),
    };
    chartFormats.set(locale, made);
    return made;
}
/** ioiti-ui: the charts' formats in the interface's locale: IoitiProvider's, British English's outside one. */
export function useChartFormat() {
    return chartFormatFor(useLocale().locale);
}
// ioiti-ui: British English's, for what writes a chart's number outside a component (a chart takes useChartFormat's).
export const fullFmt = new Intl.NumberFormat(DEFAULT_LOCALE, { maximumFractionDigits: 1 });
export const defaultFormat = (n) => chartFormatFor().format(n);
export const defaultTick = (n) => chartFormatFor().tick(n);
// ioiti-ui: the design's muted text, 4.5:1 on every surface of every look (neutral-500 was 3.6:1 on the dark card).
export const muted = "text-muted-foreground";
// ioiti-ui: the focus is the global ring of design.css, the same everywhere: no ring of a chart's own.
export const focus = "outline-none";
// ioiti-ui: what follows the pointer moves as what floats does (springSnappy).
const FOLLOW = motionTransitions.springSnappy;
// "Nice" step so that step × 4 covers `raw × 4`
export function niceStep(raw) {
    if (!(raw > 0) || !isFinite(raw))
        return 1;
    const exp = Math.floor(Math.log10(raw));
    const base = raw / 10 ** exp;
    const nice = base <= 1 ? 1 : base <= 2 ? 2 : base <= 2.5 ? 2.5 : base <= 5 ? 5 : 10;
    return nice * 10 ** exp;
}
/**
 * Container width via ResizeObserver (initial value keeps SSR output sensible)
 *
 * ioiti-ui: the box measured takes its width from its container alone (`contain-inline-size`, which every
 * chart here gives it), never from what is drawn in it at the width measured before. In a column as wide as
 * its content (a grid's single column, on a phone), a chart first drawn 640 px wide held the column open at
 * 640 px, was measured so, and stayed wider than the screen.
 */
export function useElementWidth(initial) {
    const ref = useRef(null);
    const [width, setWidth] = useState(initial);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        const update = () => setWidth(Math.round(el.clientWidth) || initial);
        update();
        // ioiti-ui: measured once where there is no ResizeObserver (the tests' jsdom).
        if (typeof ResizeObserver === "undefined")
            return;
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [initial]);
    return [ref, width];
}
/** Clear a hover/tap selection when the user taps outside the chart (touch) */
export function useDismissOutside(ref, open, close) {
    useEffect(() => {
        if (!open)
            return;
        const down = (e) => {
            if (!ref.current?.contains(e.target))
                close();
        };
        document.addEventListener("pointerdown", down);
        return () => document.removeEventListener("pointerdown", down);
    }, [ref, open, close]);
}
/* ---------------------------------- Tooltip -------------------------------- */
export function Tooltip({ pos, boundsWidth, children, }) {
    const ref = useRef(null);
    const seen = useRef(false);
    const x = useSpring(0, FOLLOW);
    const y = useSpring(0, FOLLOW);
    // ioiti-ui: where motion is reduced (the system, or IoitiProvider's reducedMotion), it jumps to the pointer.
    const reduce = useReducedMotionConfig();
    useLayoutEffect(() => {
        if (!pos) {
            seen.current = false;
            return;
        }
        const w = ref.current?.offsetWidth ?? 130;
        const h = ref.current?.offsetHeight ?? 60;
        const tx = clamp(pos.x - w / 2, 0, Math.max(0, boundsWidth - w));
        let ty = pos.y - h - 12;
        if (ty < 0)
            ty = pos.y + 18;
        if (!seen.current || reduce) {
            x.jump(tx);
            y.jump(ty);
            seen.current = true;
        }
        else {
            x.set(tx);
            y.set(ty);
        }
    }, [pos, boundsWidth, x, y, reduce]);
    return (_jsx(motion.div, { ref: ref, "aria-hidden": true, 
        // ioiti-ui: glass under the glass material (glass-float).
        className: `pointer-events-none absolute left-0 top-0 z-20 min-w-[112px] px-3 py-2 text-xs tabular-nums ${TOOLTIP}`, style: { x, y }, initial: false, animate: { opacity: pos ? 1 : 0 }, 
        // ioiti-ui: it fades in as what floats arrives, and out quicker (easeFast, easeExit).
        transition: pos ? motionTransitions.easeFast : motionTransitions.easeExit, children: children }));
}
export function Dot({ color }) {
    return _jsx("span", { className: "inline-block size-2 shrink-0 rounded-full", style: { background: color }, "aria-hidden": true });
}
export function SegmentedControl({ value, onChange, options, label, }) {
    const id = useId();
    return (_jsx("div", { role: "radiogroup", "aria-label": label, className: "relative inline-flex shrink-0 rounded-full bg-surface-raised p-0.5", children: options.map((o) => {
            const on = o.value === value;
            return (_jsxs("button", { type: "button", role: "radio", "aria-checked": on, onClick: () => onChange(o.value), className: `relative z-10 h-8 cursor-pointer rounded-full px-3.5 text-sm font-medium transition-colors duration-150 [-webkit-tap-highlight-color:transparent] sm:px-3 ${focus} ${on ? "text-foreground" : "text-muted-foreground"}`, children: [on && (_jsx(motion.span, { layoutId: id, className: "absolute inset-0 -z-10 rounded-full bg-surface shadow-subtle", transition: motionTransitions.springMorph })), o.label] }, o.value));
        }) }));
}
