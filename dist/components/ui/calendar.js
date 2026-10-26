"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils.js";
function useControllableState(value, defaultValue, onChange) {
    const [internal, setInternal] = React.useState(defaultValue);
    const controlled = value !== undefined;
    const current = controlled ? value : internal;
    const onChangeRef = React.useRef(onChange);
    React.useEffect(() => {
        onChangeRef.current = onChange;
    });
    const set = React.useCallback((next) => {
        if (!controlled)
            setInternal(next);
        onChangeRef.current?.(next);
    }, [controlled]);
    return [current, set];
}
const spring = { type: "spring", stiffness: 460, damping: 38, mass: 0.7 };
const slide = {
    enter: (d) => ({ x: d * 24, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d * -24, opacity: 0 }),
};
/* ── date helpers (no dependencies) ── */
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d, n) => {
    const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    return new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), last));
};
const isSameDay = (a, b) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const isSameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
const dayKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const EMPTY = { from: null, to: null };
const toRange = (v) => v === undefined ? undefined : v === null ? EMPTY : v instanceof Date ? { from: v, to: null } : v;
export function Calendar(props) {
    const { defaultMonth, minDate, maxDate, isDateDisabled, weekStartsOn = 0, locale, className } = props;
    const isRange = props.mode === "range";
    const uid = React.useId();
    const [selected, setSelected] = useControllableState(toRange(props.value), toRange(props.defaultValue) ?? EMPTY, (next) => {
        if (props.mode === "range")
            props.onChange?.(next);
        else
            props.onChange?.(next.from);
    });
    const { from, to } = selected;
    const today = React.useMemo(() => startOfDay(new Date()), []);
    const [view, setView] = React.useState(() => {
        const base = defaultMonth ?? from ?? today;
        return new Date(base.getFullYear(), base.getMonth(), 1);
    });
    const [dir, setDir] = React.useState(1);
    const [focus, setFocus] = React.useState(from ?? today);
    const [hover, setHover] = React.useState(null);
    const gridRef = React.useRef(null);
    const shouldFocus = React.useRef(false);
    const min = minDate ? startOfDay(minDate) : null;
    const max = maxDate ? startOfDay(maxDate) : null;
    const disabled = (d) => (!!min && d < min) || (!!max && d > max) || !!isDateDisabled?.(d);
    const y = view.getFullYear();
    const m = view.getMonth();
    const canPrev = !min || new Date(y, m, 0) >= min;
    const canNext = !max || new Date(y, m + 1, 1) <= max;
    const go = (target, direction) => {
        setDir(direction ?? (target > view ? 1 : -1));
        setView(new Date(target.getFullYear(), target.getMonth(), 1));
    };
    const monthFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }), [locale]);
    const dayFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "full" }), [locale]);
    const weekdays = React.useMemo(() => {
        const f = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
        // 1 Aug 2021 is a Sunday
        return Array.from({ length: 7 }, (_, i) => f.format(new Date(2021, 7, 1 + ((weekStartsOn + i) % 7))));
    }, [locale, weekStartsOn]);
    const dim = new Date(y, m + 1, 0).getDate();
    const offset = (new Date(y, m, 1).getDay() - weekStartsOn + 7) % 7;
    const cells = Array.from({ length: 42 }, (_, i) => {
        const n = i - offset + 1;
        return n < 1 || n > dim ? null : new Date(y, m, n);
    });
    const tabDate = isSameMonth(focus, view) ? focus : new Date(y, m, 1);
    const pick = (d) => {
        if (disabled(d))
            return;
        setFocus(d);
        if (!isRange)
            setSelected({ from: d, to: null });
        else if (!from || to || d < from)
            setSelected({ from: d, to: null });
        else
            setSelected({ from, to: d });
    };
    const rangeEnd = isRange && from ? (to ?? (hover && hover > from ? hover : null)) : null;
    const onKeyDown = (e) => {
        const el = e.target.closest("[data-date]");
        if (!el)
            return;
        const [yy, mm, dd] = el.dataset.date.split("-").map(Number);
        const cur = new Date(yy, mm - 1, dd);
        const col = (cur.getDay() - weekStartsOn + 7) % 7;
        let next = null;
        if (e.key === "ArrowLeft")
            next = addDays(cur, -1);
        else if (e.key === "ArrowRight")
            next = addDays(cur, 1);
        else if (e.key === "ArrowUp")
            next = addDays(cur, -7);
        else if (e.key === "ArrowDown")
            next = addDays(cur, 7);
        else if (e.key === "Home")
            next = addDays(cur, -col);
        else if (e.key === "End")
            next = addDays(cur, 6 - col);
        else if (e.key === "PageUp")
            next = addMonths(cur, e.shiftKey ? -12 : -1);
        else if (e.key === "PageDown")
            next = addMonths(cur, e.shiftKey ? 12 : 1);
        if (!next)
            return;
        e.preventDefault();
        if (min && next < min)
            next = min;
        if (max && next > max)
            next = max;
        shouldFocus.current = true;
        setFocus(next);
        if (!isSameMonth(next, view))
            go(next);
    };
    React.useEffect(() => {
        if (!shouldFocus.current)
            return;
        shouldFocus.current = false;
        gridRef.current?.querySelector(`[data-date="${dayKey(focus)}"]`)?.focus();
    }, [focus, view]);
    return (_jsxs("div", { className: cn("w-fit select-none p-3", className), children: [_jsxs("div", { className: "mb-2 flex h-8 items-center gap-1", children: [_jsx(NavButton, { label: "Previous month", disabled: !canPrev, onClick: () => go(addMonths(view, -1), -1), children: _jsx(ChevronLeft, { className: "size-4" }) }), _jsx("div", { className: "relative h-5 flex-1 overflow-hidden text-center text-sm font-medium text-neutral-900 dark:text-neutral-100", children: _jsx(AnimatePresence, { initial: false, custom: dir, children: _jsx(motion.span, { custom: dir, variants: slide, initial: "enter", animate: "center", exit: "exit", transition: spring, "aria-live": "polite", className: "absolute inset-0", children: monthFmt.format(view) }, y * 12 + m) }) }), _jsx(NavButton, { label: "Next month", disabled: !canNext, onClick: () => go(addMonths(view, 1), 1), children: _jsx(ChevronRight, { className: "size-4" }) })] }), _jsx("div", { className: "flex", "aria-hidden": true, children: weekdays.map((w, i) => (_jsx("div", { className: "grid h-8 w-9 place-items-center text-xs text-neutral-500", children: w }, i))) }), _jsx("div", { className: "-m-1 overflow-hidden p-1", children: _jsx("div", { ref: gridRef, role: "grid", "aria-label": monthFmt.format(view), onKeyDown: onKeyDown, onMouseLeave: () => setHover(null), className: "relative h-[216px]", children: _jsx(AnimatePresence, { initial: false, custom: dir, children: _jsx(motion.div, { custom: dir, variants: slide, initial: "enter", animate: "center", exit: "exit", transition: spring, className: "absolute inset-0", children: Array.from({ length: 6 }, (_, r) => (_jsx("div", { role: "row", className: "flex", children: cells.slice(r * 7, r * 7 + 7).map((d, col) => {
                                    if (!d)
                                        return _jsx("div", { role: "gridcell", className: "h-9 w-9" }, col);
                                    const isStart = isSameDay(d, from);
                                    const isEnd = !isStart && isRange && isSameDay(d, to);
                                    const picked = isStart || isEnd;
                                    const inBand = isRange && !!from && !!rangeEnd && !isSameDay(from, rangeEnd) && d >= from && d <= rangeEnd;
                                    const off = disabled(d);
                                    const isToday = isSameDay(d, today);
                                    return (_jsx("div", { role: "gridcell", "aria-selected": picked || inBand, className: cn("relative h-9 w-9", inBand && "bg-neutral-100 dark:bg-neutral-800/70", inBand && (isSameDay(d, from) || col === 0 || d.getDate() === 1) && "rounded-l-lg", inBand && (isSameDay(d, rangeEnd) || col === 6 || d.getDate() === dim) && "rounded-r-lg"), children: _jsxs("button", { type: "button", "data-date": dayKey(d), tabIndex: isSameDay(d, tabDate) ? 0 : -1, "aria-label": dayFmt.format(d), "aria-disabled": off || undefined, "aria-current": isToday ? "date" : undefined, onClick: () => pick(d), onMouseEnter: () => setHover(d), className: cn("group relative grid size-9 place-items-center rounded-lg text-sm tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400/60 dark:focus-visible:ring-neutral-600", picked ? "text-white dark:text-neutral-900" : "text-neutral-900 dark:text-neutral-100", !picked &&
                                                !off &&
                                                (inBand
                                                    ? "hover:bg-neutral-200/80 dark:hover:bg-neutral-700/60"
                                                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"), off && "cursor-not-allowed opacity-30"), children: [picked && (_jsx(motion.span, { layoutId: isRange ? `${uid}-${isStart ? "start" : "end"}` : `${uid}-sel`, transition: spring, className: "absolute inset-0 rounded-lg bg-neutral-900 dark:bg-white" })), _jsx("span", { className: "relative transition-transform duration-150 group-active:scale-90", children: d.getDate() }), isToday && !picked && (_jsx("span", { className: "absolute bottom-1 size-1 rounded-full bg-neutral-400 dark:bg-neutral-500" }))] }) }, col));
                                }) }, r))) }, y * 12 + m) }) }) })] }));
}
function NavButton({ label, disabled, onClick, children, }) {
    return (_jsx("button", { type: "button", "aria-label": label, disabled: disabled, onClick: onClick, className: "grid size-8 place-items-center rounded-lg text-neutral-500 outline-none transition hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400/60 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus-visible:ring-neutral-600", children: children }));
}
