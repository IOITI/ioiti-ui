"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { useAnchoredLayer } from "../../lib/anchor.js";
// ioiti-ui: held by its caller or by itself, as every control (useControllableState): its own copy is gone.
import { useControllableState } from "../../lib/controllable.js";
import { fieldBorder, invalidOf } from "../../lib/field-border.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { DISABLED, FLOATING } from "../../lib/recipes.js";
import { cn } from "../../lib/utils.js";
import { Calendar } from "./calendar.js";
import { useLocale, useMessages } from "../locale-context.js";
// ioiti-ui: what a Field or a FormItem around it tells it (its id, what describes it, whether it is wrong), its `data-*`
// attributes, its ref and its value sent with a form (a day as `yyyy-mm-dd`), as a native field takes them.
import { splitDataAttributes } from "../../lib/data-attributes.js";
import { toIsoDay } from "../../lib/format.js";
import { useForwardedRef } from "../../lib/refs.js";
import { useFieldControl } from "../field-context.js";
// ioiti-ui: in the locale given, the provider's by default (EasyUI's was the browser's).
const fmt = (d, locale) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d);
/* ───────────── shell: trigger + animated popover ───────────── */
function PickerShell({ text, placeholder, align = "start", side: preferredSide = "auto", disabled, className, field, data, sent, children, }) {
    const [open, setOpen] = React.useState(false);
    // ioiti-ui: the provider's words (IoitiProvider).
    const words = useMessages().date;
    // ioiti-ui: its trigger given to its caller's ref too.
    const [triggerRef, setTrigger] = useForwardedRef(field.ref);
    const layerRef = React.useRef(null);
    const timer = React.useRef(undefined);
    // ioiti-ui: described and marked by a Field or a FormItem around it too, its own props first, its id the one their
    // label points to: a label names a button by itself (not `aria-labelledby`, whose name would lack the day it shows).
    const control = useFieldControl({
        id: field.id,
        describedBy: field["aria-describedby"],
        invalid: invalidOf(field.error, field["aria-invalid"]),
    });
    const invalid = control.invalid;
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
    return (_jsxs("div", { ...data, className: cn("relative inline-block w-64 max-w-full", className), children: [_jsxs("button", { ref: setTrigger, id: control.id, type: "button", disabled: disabled, "aria-haspopup": "dialog", "aria-expanded": open, "aria-label": field["aria-label"], "aria-labelledby": field["aria-labelledby"], "aria-describedby": control.describedBy, "aria-invalid": invalid || undefined, onClick: () => setOpen((o) => !o), onKeyDown: layer.onTriggerKeyDown, className: cn(
                // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                "flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg border bg-surface px-3.5 text-sm outline-none transition-colors", DISABLED, 
                // ioiti-ui: its border, or the error's (never both); open, in the accent where the theme has one (accent:).
                fieldBorder(invalid), open &&
                    (invalid
                        ? "border-negative hover:border-negative"
                        : "border-muted-foreground hover:border-muted-foreground accent:border-brand accent:hover:border-brand")), children: [_jsx(CalendarDays, { className: "size-4 shrink-0 text-muted-foreground" }), _jsx("span", { className: cn("truncate", text ? "text-foreground" : "text-text-subtle"), children: text ?? placeholder })] }), sent?.values.map((each, index) => (_jsx("input", { type: "hidden", name: sent.name, value: each, disabled: disabled }, index))), typeof document !== "undefined" &&
                createPortal(_jsx(AnimatePresence, { children: open && (_jsx(motion.div, { ref: layerRef, role: "dialog", "aria-label": words.pickerDialog, onKeyDown: layer.onLayerKeyDown, 
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
export function DatePicker({ value, defaultValue = null, onChange, placeholder, align, side, disabled, className, id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error, name, ref, ...others }) {
    // ioiti-ui: its `data-*` attributes apart from its calendar's options.
    const [data, calendar] = splitDataAttributes(others);
    const field = { id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error, ref };
    const [date, setDate] = useControllableState(value, defaultValue, onChange);
    // ioiti-ui: the provider's locale and words where the props give none.
    const preferred = useLocale();
    const words = useMessages().date;
    const locale = calendar.locale ?? preferred.locale;
    return (_jsx(PickerShell, { text: date ? fmt(date, locale) : null, placeholder: placeholder ?? words.datePlaceholder, align: align, side: side, disabled: disabled, className: className, field: field, data: data, sent: name ? { name, values: [date ? toIsoDay(date) : ""] } : undefined, children: ({ close }) => (_jsx(Calendar, { mode: "single", value: date, onChange: (d) => {
                setDate(d);
                close();
            }, ...calendar })) }));
}
export function DateRangePicker({ value, defaultValue = { from: null, to: null }, onChange, placeholder, align, side, disabled, className, id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error, name, ref, ...others }) {
    // ioiti-ui: its `data-*` attributes apart from its calendar's options.
    const [data, calendar] = splitDataAttributes(others);
    const field = { id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error, ref };
    const [range, setRange] = useControllableState(value, defaultValue, onChange);
    // ioiti-ui: the provider's locale and words where the props give none; the range written as its language writes one.
    const preferred = useLocale();
    const words = useMessages().date;
    const locale = calendar.locale ?? preferred.locale;
    const text = range.from
        ? words.range({ from: fmt(range.from, locale), to: range.to ? fmt(range.to, locale) : undefined })
        : null;
    return (_jsx(PickerShell, { text: text, placeholder: placeholder ?? words.rangePlaceholder, align: align, side: side, disabled: disabled, className: cn("w-72", className), field: field, data: data, sent: name
            ? { name, values: [range.from ? toIsoDay(range.from) : "", range.to ? toIsoDay(range.to) : ""] }
            : undefined, children: ({ close }) => (_jsx(Calendar, { mode: "range", value: range, onChange: (r) => {
                setRange(r);
                if (r.from && r.to)
                    close();
            }, ...calendar })) }));
}
