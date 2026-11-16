"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useRef, useState, } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Tooltip, clamp, cx, fullFmt, useDismissOutside, useElementWidth, } from "../../lib/chart-primitives.js";
const DAY_MS = 86_400_000;
const toDay = (d) => {
    if (d instanceof Date)
        return isNaN(+d) ? null : Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS);
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
    if (m)
        return Math.floor(Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY_MS);
    const p = new Date(d);
    return isNaN(+p) ? null : toDay(p);
};
const weekday = (day) => (((day + 4) % 7) + 7) % 7; // 0 = Sunday
// ioiti-ui: dates written in full ("Wed, 22 Oct 2026").
const dayFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const monthFmt = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LEVEL_MIX = [0, 28, 52, 76, 100];
const ALL_HOURS = Array.from({ length: 24 }, (_, hour) => hour);
export function ActivityHeatmap({ mode = "calendar", data = [], matrix, rowLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], hours: columnHours = ALL_HOURS, details, weeks = 53, endDate, startDate, weekStart = 0, 
// ioiti-ui: the design's series colour (EasyUI's was an emerald, too close to the gain scale).
color = "var(--chart-series)", diverging, unit = "contributions", format, summary: summaryText, emptyText, legend = ["Less", "More"], minCell = 11, animated = true, ariaLabel, className = "", }) {
    const reduce = useReducedMotion();
    const anim = animated && !reduce;
    const [rootRef, width] = useElementWidth(720);
    const [active, setActive] = useState(null);
    const wrapRef = useRef(null);
    useDismissOutside(wrapRef, active !== null, useCallback(() => setActive(null), []));
    const hours = mode === "hours";
    // ioiti-ui: as many rows as names in hours mode (EasyUI's were seven).
    const rows = hours ? rowLabels.length : 7;
    const narrow = width < 440;
    const LW = hours ? (narrow ? 30 : 36) : narrow ? 18 : 30;
    const TOP = 18;
    const gap = hours ? (narrow ? 2 : 3) : 3;
    const innerW = Math.max(40, width - LW);
    // columns that fit
    const cols = hours ? columnHours.length : clamp(Math.min(weeks, Math.floor((innerW + gap) / (minCell + gap))), 4, weeks);
    // ioiti-ui: an hour's cells 64 px wide at most: two hours with values drew two bars across the panel.
    const cw = Math.min(hours ? 64 : Infinity, (innerW - (cols - 1) * gap) / cols);
    const cell = hours ? cw : Math.min(cw, 16);
    const ch = hours ? clamp(cw, 10, 22) : cell;
    const cwEff = hours ? cw : cell;
    const write = useCallback((v) => (format ? format(v) : `${fullFmt.format(v)} ${unit}`), [format, unit]);
    // build cells
    const model = useMemo(() => {
        const out = [];
        let first = 0;
        let endDay = 0;
        if (hours) {
            const m = matrix ?? [];
            for (let r = 0; r < rows; r++)
                for (let c = 0; c < cols; c++) {
                    const raw = m[r]?.[c];
                    const has = raw !== null && raw !== undefined && Number.isFinite(Number(raw));
                    const v = has ? (diverging ? Number(raw) : Math.max(0, Number(raw))) : 0;
                    out.push({
                        c,
                        r,
                        v,
                        has,
                        detail: details?.[r]?.[c] ?? undefined,
                        title: `${rowLabels[r] ?? ""} · ${String(columnHours[c]).padStart(2, "0")}:00`,
                    });
                }
        }
        else {
            const map = new Map();
            const notes = new Map();
            let maxDay = -Infinity;
            for (const d of data) {
                const day = toDay(d.date);
                if (day === null)
                    continue;
                const value = Number.isFinite(d.value) ? (diverging ? d.value : Math.max(0, d.value)) : 0;
                map.set(day, (map.get(day) ?? 0) + value);
                if (d.detail)
                    notes.set(day, d.detail);
                maxDay = Math.max(maxDay, day);
            }
            endDay = (endDate ? toDay(endDate) : null) ?? (isFinite(maxDay) ? maxDay : toDay(new Date()));
            const startDay = startDate ? toDay(startDate) : null;
            const lastColStart = endDay - ((weekday(endDay) - weekStart + 7) % 7);
            first = lastColStart - (cols - 1) * 7;
            for (let c = 0; c < cols; c++)
                for (let r = 0; r < 7; r++) {
                    const day = first + c * 7 + r;
                    if (day > endDay || (startDay !== null && day < startDay))
                        continue;
                    out.push({ c, r, v: map.get(day) ?? 0, has: map.has(day), detail: notes.get(day), title: dayFmt.format(new Date(day * DAY_MS)) });
                }
        }
        // ioiti-ui: the steps are of size, gains and losses together, so that one shade is one size on either side.
        const nz = out.filter((x) => x.v !== 0).map((x) => Math.abs(x.v)).sort((a, b) => a - b);
        const q = (p) => nz[Math.min(nz.length - 1, Math.floor(p * nz.length))] ?? 0;
        const t1 = q(0.25), t2 = q(0.5), t3 = q(0.75);
        const level = (v) => {
            const size = Math.abs(v);
            return size <= 0 ? 0 : size <= t1 ? 1 : size <= t2 ? 2 : size <= t3 ? 3 : 4;
        };
        const total = out.reduce((s, x) => s + x.v, 0);
        const best = out.reduce((b, x) => (!b || x.v > b.v ? x : b), null);
        const worst = out.reduce((b, x) => (!b || x.v < b.v ? x : b), null);
        return { cells: out, level, total, best, worst, first, endDay, active: nz.length };
    }, [hours, rows, matrix, rowLabels, columnHours, details, data, endDate, startDate, weekStart, cols, diverging]);
    const byKey = useMemo(() => new Map(model.cells.map((x) => [`${x.c}:${x.r}`, x])), [model.cells]);
    const gx = (c) => LW + c * (cwEff + gap);
    const gy = (r) => TOP + r * (ch + gap);
    const svgH = TOP + rows * ch + (rows - 1) * gap + 2;
    // month / hour labels
    const topLabels = useMemo(() => {
        const out = [];
        if (hours) {
            // ioiti-ui: every hour when there is room for it (EasyUI labelled every third or sixth of 24).
            const pitch = cwEff + gap;
            const every = pitch >= 20 ? 1 : pitch >= 12 ? 3 : 6;
            for (let c = 0; c < cols; c += every)
                out.push({ c, text: String(columnHours[c]) });
        }
        else {
            let prev = -1;
            let lastC = -9;
            for (let c = 0; c < cols; c++) {
                const m = new Date((model.first + c * 7) * DAY_MS).getUTCMonth();
                if (m !== prev) {
                    if (prev !== -1 && c - lastC >= 3 && c <= cols - 2) {
                        out.push({ c, text: monthFmt.format(new Date((model.first + c * 7) * DAY_MS)) });
                        lastC = c;
                    }
                    else if (prev === -1 && cols > 6) {
                        out.push({ c, text: monthFmt.format(new Date((model.first + c * 7) * DAY_MS)) });
                        lastC = c;
                    }
                    else if (prev !== -1 && out.length === 1 && out[0].c === 0 && c <= cols - 2) {
                        // ioiti-ui: the first column's month gives way to the next one when that starts within three weeks
                        // (a period of 26 July to 23 October was labelled July, its August dropped).
                        out[0] = { c, text: monthFmt.format(new Date((model.first + c * 7) * DAY_MS)) };
                        lastC = c;
                    }
                    prev = m;
                }
            }
        }
        return out;
    }, [hours, cols, cwEff, gap, columnHours, model.first]);
    const rowNames = hours
        ? rowLabels.map((l, r) => ({ r, text: narrow ? l.slice(0, 1) : l })).filter((x) => !narrow || x.r % 2 === 0)
        : [1, 3, 5].map((k) => {
            const r = (k - weekStart + 7) % 7;
            return { r, text: narrow ? WEEKDAYS[k].slice(0, 1) : WEEKDAYS[k] };
        });
    const locate = (e) => {
        // ioiti-ui: the rect's own box starts where the cells do (EasyUI took the labels' room off it again: the cell
        // found was a column and a row off the one under the pointer).
        const box = e.currentTarget.getBoundingClientRect();
        const c = Math.floor((e.clientX - box.left) / (cwEff + gap));
        const r = Math.floor((e.clientY - box.top) / (ch + gap));
        if (c < 0 || r < 0 || c >= cols || r >= rows || !byKey.has(`${c}:${r}`))
            return setActive(null);
        setActive({ c, r });
    };
    // ioiti-ui: the keyboard starts on the first cell of the last column there is: a period that starts in the middle
    // of its only week has no Monday, and from a cell that is not drawn the keys led nowhere.
    const start = useMemo(() => {
        for (let r = 0; r < rows; r++)
            if (byKey.has(`${cols - 1}:${r}`))
                return { c: cols - 1, r };
        return { c: cols - 1, r: 0 };
    }, [byKey, cols, rows]);
    const onKey = (e) => {
        const dc = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        const dr = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
        if (e.key === "Escape")
            return setActive(null);
        if (!dc && !dr)
            return;
        e.preventDefault();
        setActive((a) => {
            const from = a ?? start;
            const next = { c: clamp(from.c + dc, 0, cols - 1), r: clamp(from.r + dr, 0, rows - 1) };
            return byKey.has(`${next.c}:${next.r}`) ? next : from;
        });
    };
    const cur = active ? byKey.get(`${active.c}:${active.r}`) : null;
    const total = model.total;
    const summary = summaryText ??
        (hours
            ? `${fullFmt.format(total)} ${unit} per week`
            : `${fullFmt.format(total)} ${unit} in the last ${cols >= 52 ? "year" : cols >= 8 ? `${Math.round(cols / 4.345)} months` : `${cols} weeks`}`);
    const lvlFill = (v, l) => l === 0
        ? {}
        : diverging
            ? { fill: (v > 0 ? diverging.positive : diverging.negative)[l - 1] }
            : { fill: `color-mix(in srgb, ${color} ${LEVEL_MIX[l]}%, transparent)` };
    // ioiti-ui: what a cell says, in its tooltip and to a screen reader.
    const said = (x) => (x.has ? [write(x.v), x.detail].filter(Boolean).join(", ") : emptyText ?? write(0));
    return (_jsxs("div", { ref: rootRef, className: cx("w-full contain-inline-size", className), children: [_jsx("style", { dangerouslySetInnerHTML: {
                    __html: "@keyframes cj-cell{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}" +
                        ".cj-cell{transform-box:fill-box;transform-origin:center;animation:cj-cell .55s cubic-bezier(.23,1,.32,1) both;animation-delay:var(--d,0s)}" +
                        "@media (prefers-reduced-motion: reduce){.cj-cell{animation:none}}",
                } }), _jsxs("div", { className: "mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1", children: [_jsx("p", { className: "text-[13px] font-medium tabular-nums text-neutral-900 dark:text-neutral-100", children: summary }), diverging ? ((model.best?.v ?? 0) > 0 || (model.worst?.v ?? 0) < 0 ? (_jsxs("p", { className: "text-[12px] text-muted-foreground", children: [model.best && model.best.v > 0 && (_jsxs(_Fragment, { children: ["Best ", model.best.title, " \u00B7 ", _jsx("span", { className: "whitespace-nowrap tabular-nums", children: write(model.best.v) })] })), model.best && model.best.v > 0 && model.worst && model.worst.v < 0 && " · ", model.worst && model.worst.v < 0 && (_jsxs(_Fragment, { children: ["worst ", model.worst.title, " \u00B7 ", _jsx("span", { className: "whitespace-nowrap tabular-nums", children: write(model.worst.v) })] }))] })) : null) : (model.best && model.best.v > 0 && (_jsxs("p", { className: "text-[12px] text-muted-foreground", children: ["Peak ", model.best.title, " \u00B7 ", _jsx("span", { className: "tabular-nums", children: fullFmt.format(model.best.v) })] })))] }), _jsxs("div", { ref: wrapRef, className: "relative", style: { height: svgH }, children: [_jsxs("svg", { width: width, height: svgH, role: "img", "aria-label": ariaLabel ?? `Activity heatmap. ${typeof summary === "string" ? summary : ""}`, tabIndex: 0, onKeyDown: onKey, onBlur: () => setActive(null), className: "block touch-pan-y overflow-visible rounded-md", children: [topLabels.map((l) => (_jsx("text", { x: gx(l.c), y: 11, className: "fill-neutral-500 text-[11px] dark:fill-neutral-400", children: l.text }, l.c))), rowNames.map((l) => (_jsx("text", { x: 0, y: gy(l.r) + ch / 2, dominantBaseline: "middle", className: "fill-neutral-500 text-[10.5px] dark:fill-neutral-400", children: l.text }, l.r))), hours && (_jsxs(_Fragment, { children: [_jsx(motion.rect, { x: LW - 2, width: cols * (cwEff + gap), height: ch + 4, rx: 5, className: "fill-black/[0.035] dark:fill-white/[0.04]", initial: false, animate: { y: gy(active?.r ?? 0) - 2, opacity: active ? 1 : 0 }, transition: reduce ? { duration: 0 } : { duration: 0.15 } }), _jsx(motion.rect, { y: TOP - 2, width: cwEff + 4, height: rows * (ch + gap), rx: 5, className: "fill-black/[0.035] dark:fill-white/[0.04]", initial: false, animate: { x: gx(active?.c ?? 0) - 2, opacity: active ? 1 : 0 }, transition: reduce ? { duration: 0 } : { duration: 0.15 } })] })), model.cells.map((x) => {
                                const l = model.level(x.v);
                                return (_jsx("rect", { x: gx(x.c), y: gy(x.r), width: cwEff, height: ch, rx: Math.min(3, cwEff / 4), className: cx(anim && "cj-cell", l === 0 && "fill-black/[0.05] dark:fill-white/[0.06]"), style: { ...lvlFill(x.v, l), ["--d"]: anim ? `${(x.c * 0.012 + x.r * 0.02).toFixed(3)}s` : undefined } }, `${x.c}:${x.r}`));
                            }), _jsx(motion.rect, { width: cwEff + 2, height: ch + 2, rx: Math.min(4, cwEff / 3), fill: "none", strokeWidth: 1.5, 
                                // ioiti-ui: in the accent, where the theme has one (accent:).
                                className: "stroke-neutral-900 dark:stroke-white accent:stroke-brand", initial: false, animate: { x: gx(active?.c ?? 0) - 1, y: gy(active?.r ?? 0) - 1, opacity: active ? 1 : 0 }, transition: reduce ? { duration: 0 } : { x: { duration: 0.12 }, y: { duration: 0.12 }, opacity: { duration: 0.12 } } }), _jsx("rect", { x: LW, y: TOP, width: cols * (cwEff + gap), height: rows * (ch + gap), fill: "transparent", onPointerMove: locate, onPointerDown: locate, onPointerLeave: (e) => e.pointerType === "mouse" && setActive(null) })] }), _jsx(Tooltip, { pos: active ? { x: gx(active.c) + cwEff / 2, y: gy(active.r) } : null, boundsWidth: width, children: cur && (_jsxs(_Fragment, { children: [_jsx("p", { className: "font-medium tabular-nums text-neutral-900 dark:text-neutral-100", children: cur.has ? (format ? write(cur.v) : _jsxs(_Fragment, { children: [fullFmt.format(cur.v), " ", _jsx("span", { className: "font-normal text-neutral-500", children: unit })] })) : emptyText ?? write(0) }), _jsx("p", { className: "mt-0.5 text-neutral-500 dark:text-neutral-400", children: cur.title }), cur.has && cur.detail && _jsx("p", { className: "mt-0.5 text-neutral-500 dark:text-neutral-400", children: cur.detail })] })) })] }), _jsx("p", { className: "sr-only", role: "status", "aria-live": "polite", children: cur ? `${cur.title}: ${said(cur)}` : "" }), _jsxs("div", { className: "mt-3 flex items-center justify-end gap-2 text-[11.5px] text-muted-foreground", children: [legend[0], _jsx("span", { className: "flex gap-[3px]", "aria-hidden": true, children: diverging ? (_jsxs(_Fragment, { children: [[...diverging.negative].reverse().map((fill, i) => (_jsx("span", { className: "h-[11px] w-[11px] rounded-[3px]", style: { background: fill } }, `n${i}`))), _jsx("span", { className: "h-[11px] w-[11px] rounded-[3px] bg-black/[0.05] dark:bg-white/[0.06]" }), diverging.positive.map((fill, i) => (_jsx("span", { className: "h-[11px] w-[11px] rounded-[3px]", style: { background: fill } }, `p${i}`)))] })) : (LEVEL_MIX.map((m, i) => (_jsx("span", { className: cx("h-[11px] w-[11px] rounded-[3px]", i === 0 && "bg-black/[0.05] dark:bg-white/[0.06]"), style: i === 0 ? undefined : { background: `color-mix(in srgb, ${color} ${m}%, transparent)` } }, i)))) }), legend[1]] })] }));
}
