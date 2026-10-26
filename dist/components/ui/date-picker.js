"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Calendar } from "./calendar.js";
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
function usePopover({ open, onClose, rootRef, height = 340, side: preferredSide = "auto", }) {
    const [side, setSide] = React.useState("bottom");
    React.useLayoutEffect(() => {
        if (!open || !rootRef.current)
            return;
        if (preferredSide && preferredSide !== "auto") {
            setSide(preferredSide);
            return;
        }
        // Always open downward on mobile viewports (< 640px)
        const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
        if (isMobile) {
            setSide("bottom");
            return;
        }
        const rect = rootRef.current.getBoundingClientRect();
        const below = window.innerHeight - rect.bottom;
        // On desktop, only flip upward if space below is tight AND there is sufficient space above
        setSide(below < height && rect.top >= height ? "top" : "bottom");
    }, [open, height, rootRef, preferredSide]);
    React.useEffect(() => {
        if (!open)
            return;
        const onDown = (e) => {
            if (!rootRef.current?.contains(e.target))
                onClose("outside");
        };
        const onKey = (e) => {
            if (e.key === "Escape")
                onClose("escape");
        };
        document.addEventListener("pointerdown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, onClose, rootRef]);
    return side;
}
const popoverMotion = (side, align = "start") => ({
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.97, transition: { duration: 0.1 } },
    transition: { type: "spring", stiffness: 520, damping: 38, mass: 0.7 },
    style: {
        transformOrigin: `${side === "top" ? "bottom" : "top"} ${align === "end" ? "right" : "left"}`,
    },
});
const fmt = (d, locale) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d);
/* ───────────── shell: trigger + animated popover ───────────── */
function PickerShell({ text, placeholder, align = "start", side: preferredSide = "auto", disabled, className, children, }) {
    const [open, setOpen] = React.useState(false);
    const rootRef = React.useRef(null);
    const triggerRef = React.useRef(null);
    const timer = React.useRef(undefined);
    const side = usePopover({
        open,
        rootRef,
        height: 340,
        side: preferredSide,
        onClose: (reason) => {
            setOpen(false);
            if (reason === "escape")
                triggerRef.current?.focus();
        },
    });
    // brief beat so the selection pill lands before the popover closes
    const close = React.useCallback(() => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
            const a = document.activeElement;
            setOpen(false);
            // only hand focus back if it hasn't moved elsewhere in the meantime
            if (!a || a === document.body || rootRef.current?.contains(a))
                triggerRef.current?.focus();
        }, 160);
    }, []);
    React.useEffect(() => () => window.clearTimeout(timer.current), []);
    return (_jsxs("div", { ref: rootRef, className: cn("relative inline-block w-64 max-w-full", className), children: [_jsxs("button", { ref: triggerRef, type: "button", disabled: disabled, "aria-haspopup": "dialog", "aria-expanded": open, onClick: () => setOpen((o) => !o), className: cn("flex h-10 w-full items-center gap-2.5 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none transition-colors hover:border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-400/40 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:focus-visible:ring-neutral-600/50", open && "border-neutral-400 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-600"), children: [_jsx(CalendarDays, { className: "size-4 shrink-0 text-neutral-500 dark:text-neutral-400" }), _jsx("span", { className: cn("truncate", text ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500"), children: text ?? placeholder })] }), _jsx(AnimatePresence, { children: open && (_jsx(motion.div, { role: "dialog", "aria-label": "Choose date", ...popoverMotion(side, align), className: cn("absolute z-50 w-max max-w-[calc(100vw-2rem)] rounded-xl border border-neutral-200 bg-white shadow-lg shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black/40", side === "top" ? "bottom-full mb-2" : "top-full mt-2", align === "end" ? "right-0" : "left-0"), children: children({ close }) })) })] }));
}
export function DatePicker({ value, defaultValue = null, onChange, placeholder = "Pick a date", align, side, disabled, className, ...calendar }) {
    const [date, setDate] = useControllableState(value, defaultValue, onChange);
    return (_jsx(PickerShell, { text: date ? fmt(date, calendar.locale) : null, placeholder: placeholder, align: align, side: side, disabled: disabled, className: className, children: ({ close }) => (_jsx(Calendar, { mode: "single", value: date, onChange: (d) => {
                setDate(d);
                close();
            }, ...calendar })) }));
}
export function DateRangePicker({ value, defaultValue = { from: null, to: null }, onChange, placeholder = "Pick a range", align, side, disabled, className, ...calendar }) {
    const [range, setRange] = useControllableState(value, defaultValue, onChange);
    const text = range.from
        ? `${fmt(range.from, calendar.locale)} – ${range.to ? fmt(range.to, calendar.locale) : "…"}`
        : null;
    return (_jsx(PickerShell, { text: text, placeholder: placeholder, align: align, side: side, disabled: disabled, className: cn("w-72", className), children: ({ close }) => (_jsx(Calendar, { mode: "range", value: range, onChange: (r) => {
                setRange(r);
                if (r.from && r.to)
                    close();
            }, ...calendar })) }));
}
