"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils.js";
const spring = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 };
const fill = { duration: 0.35, ease: [0.32, 0.72, 0, 1] };
export function Stepper({ steps, current, onStepChange, orientation = "horizontal", className }) {
    const uid = React.useId();
    const vertical = orientation === "vertical";
    const last = steps.length - 1;
    // don't replay the check-draw for steps that are already done on first paint
    const ready = React.useRef(false);
    React.useEffect(() => {
        ready.current = true;
    }, []);
    return (_jsx("ol", { "aria-label": "Progress", className: cn(vertical ? "flex flex-col" : "flex w-full items-center", className), children: steps.map((step, i) => {
            const state = i < current ? "complete" : i === current ? "current" : "upcoming";
            const clickable = !!onStepChange && state === "complete";
            const indicator = (_jsxs("span", { className: cn("relative grid size-7 shrink-0 place-items-center rounded-full border text-xs font-medium tabular-nums transition-colors duration-300", 
                // ioiti-ui: steps done, the current one and the line between them in the accent, where the theme has one (accent:).
                state === "complete" &&
                    "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 accent:border-brand accent:bg-brand accent:text-brand-foreground", state === "current" && "border-neutral-900 text-neutral-900 dark:border-white dark:text-white accent:border-brand accent:text-brand-text", state === "upcoming" && "border-neutral-200 text-neutral-400 dark:border-neutral-800 dark:text-neutral-500"), children: [state === "current" && (_jsx(motion.span, { layoutId: `${uid}-ring`, transition: spring, className: "absolute -inset-[5px] rounded-full border border-neutral-300 dark:border-neutral-700 accent:border-brand/40" })), state === "complete" ? (_jsx("svg", { viewBox: "0 0 24 24", className: "size-3.5", fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, children: _jsx(motion.path, { d: "M5 12.5l4.5 4.5L19 7.5", initial: ready.current ? { pathLength: 0 } : false, animate: { pathLength: 1 }, transition: { duration: 0.3, delay: 0.08, ease: "easeOut" } }) })) : (i + 1)] }));
            const label = (_jsxs("span", { className: cn("flex min-w-0 flex-col text-left", !vertical && state !== "current" && "hidden sm:flex"), children: [_jsxs("span", { className: cn("truncate text-sm transition-colors duration-300", state === "upcoming" ? "text-neutral-400 dark:text-neutral-500" : "font-medium text-neutral-900 dark:text-neutral-100"), children: [step.title, state === "complete" && _jsx("span", { className: "sr-only", children: " (completed)" })] }), step.description && (_jsx("span", { className: "truncate text-xs text-neutral-400 dark:text-neutral-500", children: step.description }))] }));
            const row = clickable ? (_jsxs("button", { type: "button", onClick: () => onStepChange(i), className: cn("flex gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/50 dark:focus-visible:ring-neutral-600/60", vertical ? "items-start" : "items-center"), children: [indicator, label] })) : (_jsxs("div", { className: cn("flex gap-3", vertical ? "items-start" : "items-center"), children: [indicator, label] }));
            return (_jsxs("li", { "aria-current": state === "current" ? "step" : undefined, className: cn(vertical ? "relative pb-7 last:pb-0" : "flex items-center", !vertical && i < last && "flex-1"), children: [row, i < last && (_jsx("span", { "aria-hidden": true, className: cn("overflow-hidden bg-neutral-200 dark:bg-neutral-800", vertical ? "absolute bottom-1 left-[13.5px] top-[34px] w-px" : "relative mx-3 h-px flex-1"), children: _jsx(motion.span, { initial: false, animate: vertical ? { scaleY: i < current ? 1 : 0 } : { scaleX: i < current ? 1 : 0 }, transition: fill, className: cn("absolute inset-0 bg-neutral-900 dark:bg-white accent:bg-brand", vertical ? "origin-top" : "origin-left") }) }))] }, i));
        }) }));
}
/* ───────────── panels: slide in the direction you're travelling ───────────── */
const slide = {
    enter: (d) => ({ x: d * 24, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d * -24, opacity: 0 }),
};
export function StepPanels({ current, children, className, }) {
    const panels = React.Children.toArray(children);
    const prev = React.useRef(current);
    const dir = current >= prev.current ? 1 : -1;
    React.useEffect(() => {
        prev.current = current;
    }, [current]);
    return (_jsx("div", { className: className, children: _jsx(AnimatePresence, { mode: "wait", initial: false, custom: dir, children: _jsx(motion.div, { custom: dir, variants: slide, initial: "enter", animate: "center", exit: "exit", transition: { duration: 0.18, ease: [0.32, 0.72, 0, 1] }, children: panels[current] }, current) }) }));
}
