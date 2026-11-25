"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo, useRef, useState, } from "react";
import { motion, useReducedMotionConfig } from "framer-motion";
import { Tooltip, clamp, cx, useDismissOutside, useElementWidth, } from "../../lib/chart-primitives.js";
// ioiti-ui: its former name said once in development.
import { deprecated } from "../../lib/deprecated.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { useLocale, useMessages } from "../locale-context.js";
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
const LEVEL_MIX = [0, 28, 52, 76, 100];
const ALL_HOURS = Array.from({ length: 24 }, (_, hour) => hour);
// ioiti-ui: hours mode's rows, Monday first (the data's layout), by Date#getDay's numbers.
const MONDAY_FIRST = [1, 2, 3, 4, 5, 6, 0];
/**
 * ioiti-ui: what the grid writes, in a locale and its clock (EasyUI's English, as en-GB and en-US write it): dates in
 * full ("Wed, 22 Oct 2026"), months, the days of the week (by Date#getDay's numbers), hours, and numbers to a tenth with
 * a true minus, as the package's formats write them (Intl writes a hyphen).
 */
function namesOf(locale, hourCycle) {
    const dayFmt = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
    const monthFmt = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
    const shortFmt = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
    const narrowFmt = new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" });
    const hourFmt = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hourCycle, timeZone: "UTC" });
    const numberFmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
    // 3 Jan 2021 was a Sunday.
    const week = Array.from({ length: 7 }, (_, d) => new Date(Date.UTC(2021, 0, 3 + d)));
    return {
        day: (day) => dayFmt.format(new Date(day * DAY_MS)),
        month: (day) => monthFmt.format(new Date(day * DAY_MS)),
        short: week.map((d) => shortFmt.format(d)),
        narrow: week.map((d) => narrowFmt.format(d)),
        hour: (hour) => hourFmt.format(Date.UTC(2021, 0, 3, hour)),
        number: (value) => numberFmt
            .formatToParts(value)
            .map((part) => (part.type === "minusSign" ? "−" : part.value))
            .join(""),
    };
}
/** ioiti-ui: a value as it is written, to a tenth (half away from zero, as Intl rounds): the count its unit agrees with. */
const asWritten = (value) => (Math.sign(value) * Math.round(Math.abs(value) * 10)) / 10;
export function ActivityHeatmap({ mode = "calendar", data = [], matrix, rowLabels: rowLabelsGiven, hours: columnHours = ALL_HOURS, details, weeks = 53, endDate, startDate, weekStart: weekStartGiven, 
// ioiti-ui: the design's series colour (EasyUI's was an emerald, too close to the gain scale).
color = "var(--chart-series)", diverging, unit, format, summary: summaryText, emptyText, legend, minCell = 11, animated = true, "aria-label": givenName, ariaLabel, className = "", }) {
    // ioiti-ui: its former name read as today's, said once in development.
    if (ariaLabel !== undefined)
        deprecated("aria-label-camel", "ActivityHeatmap");
    const name = givenName ?? ariaLabel;
    const reduce = useReducedMotionConfig();
    const anim = animated && !reduce;
    // ioiti-ui: the provider's locale, first day of the week, clock and words (IoitiProvider) where the props give none.
    const { locale, weekStartsOn, hourCycle } = useLocale();
    const words = useMessages().heatmap;
    const names = useMemo(() => namesOf(locale, hourCycle), [locale, hourCycle]);
    const weekStart = weekStartGiven ?? weekStartsOn;
    const rowLabels = useMemo(() => rowLabelsGiven ?? MONDAY_FIRST.map((d) => names.short[d]), [rowLabelsGiven, names]);
    const [less, more] = legend ?? [words.less, words.more];
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
    // ioiti-ui: the application's unit as it gives it, or the provider's word, which agrees with the count.
    const unitOf = useCallback((v) => unit ?? words.unit(asWritten(v)), [unit, words]);
    const write = useCallback((v) => (format ? format(v) : `${names.number(v)} ${unitOf(v)}`), [format, names, unitOf]);
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
                        // ioiti-ui: the hour in the locale's clock.
                        title: words.hourCell({ day: rowLabels[r] ?? "", hour: names.hour(columnHours[c]) }),
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
                    out.push({ c, r, v: map.get(day) ?? 0, has: map.has(day), detail: notes.get(day), title: names.day(day) });
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
    }, [hours, rows, matrix, rowLabels, columnHours, details, data, endDate, startDate, weekStart, cols, diverging, names, words]);
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
                out.push({ c, text: names.number(columnHours[c]) });
        }
        else {
            let prev = -1;
            let lastC = -9;
            for (let c = 0; c < cols; c++) {
                const m = new Date((model.first + c * 7) * DAY_MS).getUTCMonth();
                if (m !== prev) {
                    if (prev !== -1 && c - lastC >= 3 && c <= cols - 2) {
                        out.push({ c, text: names.month(model.first + c * 7) });
                        lastC = c;
                    }
                    else if (prev === -1 && cols > 6) {
                        out.push({ c, text: names.month(model.first + c * 7) });
                        lastC = c;
                    }
                    else if (prev !== -1 && out.length === 1 && out[0].c === 0 && c <= cols - 2) {
                        // ioiti-ui: the first column's month gives way to the next one when that starts within three weeks
                        // (a period of 26 July to 23 October was labelled July, its August dropped).
                        out[0] = { c, text: names.month(model.first + c * 7) };
                        lastC = c;
                    }
                    prev = m;
                }
            }
        }
        return out;
    }, [hours, cols, cwEff, gap, columnHours, model.first, names]);
    // ioiti-ui: the days as the locale names them, narrow under 440 px (its own narrow names, not a first letter: French
    // writes "lun." and "L"); Monday, Wednesday and Friday in calendar mode, on their rows from the first day of the week.
    const rowNames = hours
        ? rowLabels
            .map((l, r) => ({ r, text: !narrow ? l : rowLabelsGiven ? l.slice(0, 1) : names.narrow[MONDAY_FIRST[r]] }))
            .filter((x) => !narrow || x.r % 2 === 0)
        : [1, 3, 5].map((k) => {
            const r = (k - weekStart + 7) % 7;
            return { r, text: narrow ? names.narrow[k] : names.short[k] };
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
    // ioiti-ui: in the provider's words, its unit agreeing with the total.
    const totalSaid = { total: names.number(total), unit: unitOf(total) };
    // ioiti-ui: the cells said above the grid: the largest value (a gain on a signed scale) and the largest loss.
    const best = model.best && model.best.v > 0 ? model.best : null;
    const worst = model.worst && model.worst.v < 0 ? model.worst : null;
    const summary = summaryText ??
        (hours
            ? words.summaryPerWeek(totalSaid)
            : cols >= 52
                ? words.summaryLastYear(totalSaid)
                : cols >= 8
                    ? words.summaryLastMonths({ ...totalSaid, months: Math.round(cols / 4.345) })
                    : words.summaryLastWeeks({ ...totalSaid, weeks: cols }));
    const lvlFill = (v, l) => l === 0
        ? {}
        : diverging
            ? { fill: (v > 0 ? diverging.positive : diverging.negative)[l - 1] }
            : { fill: `color-mix(in srgb, ${color} ${LEVEL_MIX[l]}%, transparent)` };
    // ioiti-ui: what a cell says, in its tooltip and to a screen reader.
    const said = (x) => (x.has ? [write(x.v), x.detail].filter(Boolean).join(", ") : emptyText ?? write(0));
    return (_jsxs("div", { ref: rootRef, className: cx("w-full contain-inline-size", className), children: [_jsx("style", { dangerouslySetInnerHTML: {
                    __html: "@keyframes cj-cell{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}" +
                        ".cj-cell{transform-box:fill-box;transform-origin:center;animation:cj-cell .55s var(--ease-soft) both;animation-delay:var(--d,0s)}" +
                        "@media (prefers-reduced-motion: reduce){.cj-cell{animation:none}}",
                } }), _jsxs("div", { className: "mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1", children: [_jsx("p", { className: "text-sm font-medium tabular-nums text-foreground", children: summary }), diverging ? (best || worst ? (_jsxs("p", { className: "text-xs text-muted-foreground", children: [best && (_jsx(Valued, { say: (value) => words.best({ title: best.title, value }), value: write(best.v), className: "whitespace-nowrap tabular-nums" })), best && worst && " · ", worst && (_jsx(Valued, { say: (value) => words.worst({ title: worst.title, value }), value: write(worst.v), className: "whitespace-nowrap tabular-nums" }))] })) : null) : (best && (_jsx("p", { className: "text-xs text-muted-foreground", children: _jsx(Valued, { say: (value) => words.peak({ title: best.title, value }), value: names.number(best.v), className: "tabular-nums" }) })))] }), _jsxs("div", { ref: wrapRef, className: "relative", style: { height: svgH }, children: [_jsxs("svg", { width: width, height: svgH, role: "img", "aria-label": name ?? words.label(typeof summary === "string" ? summary : ""), tabIndex: 0, onKeyDown: onKey, onBlur: () => setActive(null), className: "block touch-pan-y overflow-visible rounded-md", children: [topLabels.map((l) => (_jsx("text", { x: gx(l.c), y: 11, className: "fill-muted-foreground text-[11px]", children: l.text }, l.c))), rowNames.map((l) => (_jsx("text", { x: 0, y: gy(l.r) + ch / 2, dominantBaseline: "middle", className: "fill-muted-foreground text-[11px]", children: l.text }, l.r))), hours && (_jsxs(_Fragment, { children: [_jsx(motion.rect, { x: LW - 2, width: cols * (cwEff + gap), height: ch + 4, rx: 5, className: "fill-surface-hover", initial: false, animate: { y: gy(active?.r ?? 0) - 2, opacity: active ? 1 : 0 }, transition: reduce ? { duration: 0 } : motionTransitions.easeFast }), _jsx(motion.rect, { y: TOP - 2, width: cwEff + 4, height: rows * (ch + gap), rx: 5, className: "fill-surface-hover", initial: false, animate: { x: gx(active?.c ?? 0) - 2, opacity: active ? 1 : 0 }, transition: reduce ? { duration: 0 } : motionTransitions.easeFast })] })), model.cells.map((x) => {
                                const l = model.level(x.v);
                                return (_jsx("rect", { x: gx(x.c), y: gy(x.r), width: cwEff, height: ch, rx: Math.min(3, cwEff / 4), className: cx(anim && "cj-cell", l === 0 && "fill-foreground/5"), style: { ...lvlFill(x.v, l), ["--d"]: anim ? `${(x.c * 0.012 + x.r * 0.02).toFixed(3)}s` : undefined } }, `${x.c}:${x.r}`));
                            }), _jsx(motion.rect, { width: cwEff + 2, height: ch + 2, rx: Math.min(4, cwEff / 3), fill: "none", strokeWidth: 1.5, 
                                // ioiti-ui: in the accent, where the theme has one (accent:).
                                className: "stroke-foreground accent:stroke-brand", initial: false, animate: { x: gx(active?.c ?? 0) - 1, y: gy(active?.r ?? 0) - 1, opacity: active ? 1 : 0 }, transition: reduce ? { duration: 0 } : motionTransitions.easeFast }), _jsx("rect", { x: LW, y: TOP, width: cols * (cwEff + gap), height: rows * (ch + gap), fill: "transparent", onPointerMove: locate, onPointerDown: locate, onPointerLeave: (e) => e.pointerType === "mouse" && setActive(null) })] }), _jsx(Tooltip, { pos: active ? { x: gx(active.c) + cwEff / 2, y: gy(active.r) } : null, boundsWidth: width, children: cur && (_jsxs(_Fragment, { children: [_jsx("p", { className: "font-medium tabular-nums text-foreground", children: cur.has ? (format ? write(cur.v) : _jsxs(_Fragment, { children: [names.number(cur.v), " ", _jsx("span", { className: "font-normal text-muted-foreground", children: unitOf(cur.v) })] })) : emptyText ?? write(0) }), _jsx("p", { className: "mt-0.5 text-muted-foreground", children: cur.title }), cur.has && cur.detail && _jsx("p", { className: "mt-0.5 text-muted-foreground", children: cur.detail })] })) })] }), _jsx("p", { className: "sr-only", role: "status", "aria-live": "polite", children: cur ? words.status({ title: cur.title, value: said(cur) }) : "" }), _jsxs("div", { className: "mt-3 flex items-center justify-end gap-2 text-xs text-muted-foreground", children: [less, _jsx("span", { className: "flex gap-[3px]", "aria-hidden": true, children: diverging ? (_jsxs(_Fragment, { children: [[...diverging.negative].reverse().map((fill, i) => (_jsx("span", { className: "size-[11px] rounded-[3px]", style: { background: fill } }, `n${i}`))), _jsx("span", { className: "size-[11px] rounded-[3px] bg-foreground/5" }), diverging.positive.map((fill, i) => (_jsx("span", { className: "size-[11px] rounded-[3px]", style: { background: fill } }, `p${i}`)))] })) : (LEVEL_MIX.map((m, i) => (_jsx("span", { className: cx("size-[11px] rounded-[3px]", i === 0 && "bg-foreground/5"), style: i === 0 ? undefined : { background: `color-mix(in srgb, ${color} ${m}%, transparent)` } }, i)))) }), more] })] }));
}
// ioiti-ui: where a word puts the value it is given, found again in what it says.
const MARK = "\u0000";
/**
 * ioiti-ui: a word that says a value ("Best Thu, 22 Oct 2026 · €120.00"), the value in a span of its own wherever its
 * language puts it.
 */
function Valued({ say, value, className }) {
    const [before, ...after] = say(MARK).split(MARK);
    return (_jsxs(_Fragment, { children: [before, after.length > 0 && _jsx("span", { className: className, children: value }), after.join(value)] }));
}
