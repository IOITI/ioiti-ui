"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { useAnchoredLayer } from "../../lib/anchor.js";
import { fieldBorder, invalidOf } from "../../lib/field-border.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { DISABLED, FLOATING } from "../../lib/recipes.js";
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
const fmt = (d, locale) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d);
/* ───────────── shell: trigger + animated popover ───────────── */
function PickerShell({ text, placeholder, align = "start", side: preferredSide = "auto", disabled, className, field, children, }) {
    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef(null);
    const layerRef = React.useRef(null);
    const timer = React.useRef(undefined);
    const invalid = invalidOf(field.error, field["aria-invalid"]);
    // ioiti-ui: a layer in document.body, placed beside its trigger and following it (useAnchoredLayer), its keys its
    // own, the focus in it on the day to choose: EasyUI's was placed by hand inside the picker, which a Field's label
    // around it then held, a click on the calendar's empty space opening or closing it again.
    const layer = useAnchoredLayer({
        open,
        onClose: () => setOpen(false),
        triggerRef,
        layerRef,
        side: preferredSide === "top" ? "top" : "bottom",
        align,
        offset: 8,
        initialFocus: () => layerRef.current?.querySelector('[data-date][tabindex="0"]') ?? null,
    });
    // brief beat so the selection pill lands before the popover closes
    const close = React.useCallback(() => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
            const a = document.activeElement;
            setOpen(false);
            // only hand focus back if it hasn't moved elsewhere in the meantime
            if (!a || a === document.body || layerRef.current?.contains(a))
                triggerRef.current?.focus();
        }, 160);
    }, []);
    React.useEffect(() => () => window.clearTimeout(timer.current), []);
    return (_jsxs("div", { className: cn("relative inline-block w-64 max-w-full", className), children: [_jsxs("button", { ref: triggerRef, id: field.id, type: "button", disabled: disabled, "aria-haspopup": "dialog", "aria-expanded": open, "aria-label": field["aria-label"], "aria-labelledby": field["aria-labelledby"], "aria-describedby": field["aria-describedby"], "aria-invalid": invalid || undefined, onClick: () => setOpen((o) => !o), onKeyDown: layer.onTriggerKeyDown, className: cn(
                // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                "flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg border bg-surface px-3.5 text-sm outline-none transition-colors", DISABLED, 
                // ioiti-ui: its border, or the error's (never both); open, in the accent where the theme has one (accent:).
                fieldBorder(invalid), open &&
                    (invalid
                        ? "border-negative hover:border-negative"
                        : "border-muted-foreground hover:border-muted-foreground accent:border-brand accent:hover:border-brand")), children: [_jsx(CalendarDays, { className: "size-4 shrink-0 text-muted-foreground" }), _jsx("span", { className: cn("truncate", text ? "text-foreground" : "text-text-subtle"), children: text ?? placeholder })] }), typeof document !== "undefined" &&
                createPortal(_jsx(AnimatePresence, { children: open && (_jsx(motion.div, { ref: layerRef, role: "dialog", "aria-label": "Choose date", onKeyDown: layer.onLayerKeyDown, 
                        // A click on its empty space keeps the focus in it, and its keys (Escape) with it.
                        tabIndex: -1, initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, 
                        // ioiti-ui: the motion of everything that floats: springSnappy arriving, easeExit leaving.
                        exit: { opacity: 0, scale: 0.97, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, style: {
                            ...layer.style,
                            transformOrigin: `${layer.side === "top" ? "bottom" : "top"} ${align === "end" ? "right" : "left"}`,
                        }, className: cn(
                        // ioiti-ui: glass under the glass material (glass-float).
                        "z-50 w-max max-w-[calc(100vw-2rem)] overflow-auto", FLOATING), children: children({ close }) })) }), document.body)] }));
}
export function DatePicker({ value, defaultValue = null, onChange, placeholder = "Pick a date", align, side, disabled, className, id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error, ...calendar }) {
    const field = { id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error };
    const [date, setDate] = useControllableState(value, defaultValue, onChange);
    return (_jsx(PickerShell, { text: date ? fmt(date, calendar.locale) : null, placeholder: placeholder, align: align, side: side, disabled: disabled, className: className, field: field, children: ({ close }) => (_jsx(Calendar, { mode: "single", value: date, onChange: (d) => {
                setDate(d);
                close();
            }, ...calendar })) }));
}
export function DateRangePicker({ value, defaultValue = { from: null, to: null }, onChange, placeholder = "Pick a range", align, side, disabled, className, id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error, ...calendar }) {
    const field = { id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error };
    const [range, setRange] = useControllableState(value, defaultValue, onChange);
    const text = range.from
        ? `${fmt(range.from, calendar.locale)} – ${range.to ? fmt(range.to, calendar.locale) : "…"}`
        : null;
    return (_jsx(PickerShell, { text: text, placeholder: placeholder, align: align, side: side, disabled: disabled, className: cn("w-72", className), field: field, children: ({ close }) => (_jsx(Calendar, { mode: "range", value: range, onChange: (r) => {
                setRange(r);
                if (r.from && r.to)
                    close();
            }, ...calendar })) }));
}
