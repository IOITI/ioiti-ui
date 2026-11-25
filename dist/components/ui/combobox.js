"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useAnchoredLayer } from "../../lib/anchor.js";
// ioiti-ui: held by its caller or by itself, as every control (useControllableState): its own copy is gone.
import { useControllableState } from "../../lib/controllable.js";
// ioiti-ui: a former name said once, in development (deprecated).
import { deprecated } from "../../lib/deprecated.js";
import { fieldBorder, invalidOf } from "../../lib/field-border.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { DISABLED, FLOATING, MENU_ROW } from "../../lib/recipes.js";
import { cn } from "../../lib/utils.js";
// ioiti-ui: its words in the provider's language (`select`).
import { useMessages } from "../locale-context.js";
// ioiti-ui: what a Field or a FormItem around it tells it (its id, its label, what describes it, whether it is wrong),
// its `data-*` attributes and its ref, as a native control takes them.
import { dataAttributes } from "../../lib/data-attributes.js";
import { useForwardedRef } from "../../lib/refs.js";
import { useFieldControl } from "../field-context.js";
// ioiti-ui: the design's spring for what moves within a layer (springSnappy), not one written here.
const spring = motionTransitions.springSnappy;
const filterOptions = (options, q) => q
    ? options.filter((o) => [o.label, o.description, ...(o.keywords ?? [])].some((s) => s?.toLowerCase().includes(q)))
    : options;
const firstEnabled = (items) => items.findIndex((o) => !o.disabled);
/** ioiti-ui: the words of the labels that name a control (a Field's htmlFor), its own left out of a label around it. */
function labelWordsOf(control) {
    const words = Array.from(control?.labels ?? [], (label) => Array.from(label.childNodes, (node) => (node.contains(control) ? "" : (node.textContent ?? ""))).join(" "))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    return words || undefined;
}
export function Combobox({ options, value, defaultValue = null, onChange, onValueChange, placeholder: givenPlaceholder, searchPlaceholder: givenSearchPlaceholder, emptyText: givenEmptyText, align = "start", disabled, className, "aria-label": ariaLabel, id, name: formName, "aria-labelledby": ownLabelledBy, "aria-describedby": ownDescribedBy, "aria-invalid": ariaInvalid, error, ref, ...rest }) {
    // ioiti-ui: named, described and marked by a Field or a FormItem around it too, its own props first: by its label's
    // words (aria-labelledby), which name its search and its list as well.
    const control = useFieldControl({
        id,
        labelledBy: ownLabelledBy,
        named: Boolean(ariaLabel),
        describedBy: ownDescribedBy,
        invalid: invalidOf(error, ariaInvalid),
    });
    const labelledBy = control.labelledBy;
    // ioiti-ui: its words in the provider's language, its own props given over them.
    const words = useMessages().select;
    const placeholder = givenPlaceholder ?? words.placeholder;
    const searchPlaceholder = givenSearchPlaceholder ?? words.search;
    const emptyText = givenEmptyText ?? words.noResults;
    // ioiti-ui: `onChange`, as every control; `onValueChange`, its former name, still told where it alone is given.
    if (onValueChange !== undefined)
        deprecated("combobox-on-value-change", "Combobox");
    const [selected, setSelected] = useControllableState(value, defaultValue, onChange ?? onValueChange);
    const [open, setOpen] = React.useState(false);
    // ioiti-ui: its trigger given to its caller's ref too.
    const [triggerRef, setTrigger] = useForwardedRef(ref);
    const layerRef = React.useRef(null);
    const listId = React.useId();
    const invalid = control.invalid;
    // ioiti-ui: a layer in document.body, placed beside its trigger and following it (useAnchoredLayer), its keys its
    // own: EasyUI's was placed by hand inside the combobox, cut by a parent that hides what overflows it.
    const layer = useAnchoredLayer({
        open,
        onClose: () => setOpen(false),
        triggerRef,
        layerRef,
        align,
        offset: 8,
        initialFocus: () => layerRef.current?.querySelector("input") ?? null,
    });
    // The list as wide as the trigger at least, read as it opens.
    const [width, setWidth] = React.useState();
    // ioiti-ui: and the words of its label (a Field's htmlFor), which name its search and its list too: read once drawn
    // (named as the search takes the focus), and again as it opens.
    const [labelWords, setLabelWords] = React.useState();
    React.useLayoutEffect(() => {
        setLabelWords(labelWordsOf(triggerRef.current));
        if (open)
            setWidth(triggerRef.current?.offsetWidth);
    }, [open]);
    // ioiti-ui: its search and its list named as the trigger is (by what it points to, its aria-label or its label's
    // words): they had a placeholder, and no name.
    const name = labelledBy ? { "aria-labelledby": labelledBy } : { "aria-label": ariaLabel ?? labelWords };
    const current = options.find((o) => o.value === selected);
    return (_jsxs("div", { ...dataAttributes(rest), className: cn("relative w-64", className), children: [_jsxs("button", { ref: setTrigger, id: control.id, type: "button", role: "combobox", "aria-expanded": open, "aria-haspopup": "listbox", "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": control.describedBy, "aria-invalid": invalid || undefined, "aria-controls": open ? listId : undefined, disabled: disabled, onClick: () => setOpen((o) => !o), onKeyDown: (e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                        e.preventDefault();
                        setOpen(true);
                    }
                    else
                        layer.onTriggerKeyDown(e);
                }, className: cn("flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg border bg-surface px-3.5 text-sm outline-none transition-colors", DISABLED, 
                // ioiti-ui: its border, or the error's (never both); open, the option under the pointer and the one chosen in
                // the accent, where the theme has one (accent:).
                fieldBorder(invalid), open &&
                    (invalid
                        ? "border-negative hover:border-negative"
                        : "border-muted-foreground hover:border-muted-foreground accent:border-brand accent:hover:border-brand")), children: [current?.icon && (_jsx("span", { className: "grid size-4 shrink-0 place-items-center text-muted-foreground [&>svg]:size-4", children: current.icon })), _jsx("span", { className: cn("flex-1 truncate text-left", current ? "text-foreground" : "text-text-subtle"), children: current?.label ?? placeholder }), _jsx(ChevronsUpDown, { className: "size-4 shrink-0 text-muted-foreground" })] }), formName && _jsx("input", { type: "hidden", name: formName, value: selected ?? "", disabled: disabled }), typeof document !== "undefined" &&
                createPortal(_jsx(AnimatePresence, { children: open && (_jsx(motion.div, { ref: layerRef, onKeyDown: layer.onLayerKeyDown, 
                        // A click on its empty space keeps the focus in it, and its keys (Escape) with it.
                        tabIndex: -1, initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, 
                        // ioiti-ui: the motion of everything that floats: springSnappy arriving, easeExit leaving.
                        exit: { opacity: 0, scale: 0.97, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, style: {
                            ...layer.style,
                            minWidth: width,
                            transformOrigin: `${layer.side === "top" ? "bottom" : "top"} ${align === "end" ? "right" : "left"}`,
                        }, className: cn(
                        // ioiti-ui: glass under the glass material (glass-float).
                        "z-50 min-w-[14rem] overflow-hidden", FLOATING), children: _jsx(Panel, { id: listId, name: name, options: options, selected: selected, searchPlaceholder: searchPlaceholder, emptyText: emptyText, onSelect: (v) => {
                                setSelected(v);
                                setOpen(false);
                                triggerRef.current?.focus();
                            } }) })) }), document.body)] }));
}
/* mounted only while open, so its state resets every time */
function Panel({ id, name, options, selected, searchPlaceholder, emptyText, onSelect, }) {
    const [query, setQuery] = React.useState("");
    const q = query.trim().toLowerCase();
    const items = React.useMemo(() => filterOptions(options, q), [options, q]);
    const [active, setActive] = React.useState(() => {
        const i = options.findIndex((o) => o.value === selected);
        return i >= 0 ? i : firstEnabled(options);
    });
    const [box, setBox] = React.useState(null);
    const inputRef = React.useRef(null);
    const scrollRef = React.useRef(null);
    const itemRefs = React.useRef([]);
    const byKeyboard = React.useRef(false);
    React.useEffect(() => {
        inputRef.current?.focus({ preventScroll: true });
    }, []);
    // one highlight that glides to the active row (measured, so it survives scrolling)
    React.useLayoutEffect(() => {
        const el = itemRefs.current[active];
        const scroller = scrollRef.current;
        if (!el || !scroller) {
            setBox(null);
            return;
        }
        setBox({ y: el.offsetTop, h: el.offsetHeight });
        if (byKeyboard.current) {
            byKeyboard.current = false;
            if (el.offsetTop < scroller.scrollTop)
                scroller.scrollTop = el.offsetTop - 4;
            else if (el.offsetTop + el.offsetHeight > scroller.scrollTop + scroller.clientHeight)
                scroller.scrollTop = el.offsetTop + el.offsetHeight - scroller.clientHeight + 4;
        }
    }, [active, items]);
    const move = (dir) => {
        if (!items.length)
            return;
        let i = active;
        for (let n = 0; n < items.length; n++) {
            i = (i + dir + items.length) % items.length;
            if (!items[i].disabled) {
                byKeyboard.current = true;
                setActive(i);
                return;
            }
        }
    };
    const onKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            move(1);
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            move(-1);
        }
        else if (e.key === "Home" || e.key === "End") {
            e.preventDefault();
            const list = e.key === "Home" ? items : [...items].reverse();
            const idx = firstEnabled(list);
            if (idx >= 0) {
                byKeyboard.current = true;
                setActive(e.key === "Home" ? idx : items.length - 1 - idx);
            }
        }
        else if (e.key === "Enter") {
            e.preventDefault();
            const o = items[active];
            if (o && !o.disabled)
                onSelect(o.value);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-border px-3", children: [_jsx(Search, { className: "size-4 shrink-0 text-muted-foreground" }), _jsx("input", { ref: inputRef, value: query, onChange: (e) => {
                            const v = e.target.value;
                            setQuery(v);
                            setActive(firstEnabled(filterOptions(options, v.trim().toLowerCase())));
                        }, onKeyDown: onKeyDown, placeholder: searchPlaceholder, role: "combobox", ...name, "aria-expanded": true, "aria-controls": id, "aria-autocomplete": "list", "aria-activedescendant": items[active] ? `${id}-${active}` : undefined, className: "h-10 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-text-subtle" })] }), _jsxs("div", { ref: scrollRef, className: "max-h-64 overflow-y-auto overscroll-contain", children: [_jsxs("div", { id: id, role: "listbox", ...name, className: cn("relative", items.length > 0 && "p-1"), children: [box && items.length > 0 && (_jsx(motion.div, { "aria-hidden": true, initial: false, animate: { y: box.y, height: box.h }, transition: spring, className: "pointer-events-none absolute inset-x-1 top-0 rounded-lg bg-surface-hover accent:bg-brand-soft" })), items.map((o, i) => (_jsxs("div", { id: `${id}-${i}`, ref: (el) => {
                                    itemRefs.current[i] = el;
                                }, role: "option", "aria-selected": o.value === selected, "aria-disabled": o.disabled || undefined, onMouseMove: () => !o.disabled && active !== i && setActive(i), onClick: () => !o.disabled && onSelect(o.value), className: cn(MENU_ROW, "relative", o.disabled && "cursor-not-allowed opacity-50"), children: [o.icon && (_jsx("span", { className: "relative grid size-4 shrink-0 place-items-center [&>svg]:size-4", children: o.icon })), _jsxs("span", { className: "relative min-w-0 flex-1", children: [_jsx("span", { className: "block truncate", children: _jsx(Highlight, { text: o.label, query: q }) }), o.description && (_jsx("span", { className: "block truncate text-xs text-muted-foreground", children: o.description }))] }), o.value === selected && (_jsx(motion.span, { initial: { scale: 0.4, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: spring, className: "relative accent:text-brand-text", children: _jsx(Check, { className: "size-4" }) }))] }, o.value)))] }), items.length === 0 && (_jsx(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "m-1 px-3 py-6 text-center text-sm text-muted-foreground", children: emptyText }))] })] }));
}
function Highlight({ text, query }) {
    const i = query ? text.toLowerCase().indexOf(query) : -1;
    if (i < 0)
        return _jsx(_Fragment, { children: text });
    return (_jsxs(_Fragment, { children: [text.slice(0, i), _jsx("span", { className: "text-foreground underline decoration-foreground/30 underline-offset-[3px]", children: text.slice(i, i + query.length) }), text.slice(i + query.length)] }));
}
