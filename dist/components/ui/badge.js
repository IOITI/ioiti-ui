"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils.js";
const spring = { type: "spring", stiffness: 520, damping: 36, mass: 0.6 };
const styles = {
    soft: {
        neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
        danger: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    },
    solid: {
        // ioiti-ui: the emphasis, in the accent where the theme has one (accent:); the tones keep their colours.
        neutral: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 accent:bg-brand accent:text-brand-foreground",
        success: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950",
        warning: "bg-amber-500 text-amber-950",
        danger: "bg-red-600 text-white dark:bg-red-500 dark:text-red-950",
    },
    outline: {
        neutral: "border-neutral-200 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300",
        success: "border-emerald-200 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-400",
        warning: "border-amber-200 text-amber-700 dark:border-amber-500/30 dark:text-amber-400",
        danger: "border-red-200 text-red-700 dark:border-red-500/30 dark:text-red-400",
    },
};
const dots = {
    neutral: "bg-neutral-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
};
export function Badge({ variant = "soft", tone = "neutral", dot, pulse, onRemove, className, children, ...props }) {
    // strings & numbers roll when they change (counts, status labels)
    const roll = typeof children === "string" || typeof children === "number";
    return (_jsxs(motion.span, { style: { fontFamily: "var(--font-sans, 'Geist', sans-serif)", ...props.style }, className: cn("font-sans relative inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full border border-transparent px-2.5 text-xs font-medium", styles[variant][tone], onRemove && "pr-1.5", className), ...props, children: [dot && (_jsxs("span", { className: "relative flex size-1.5 shrink-0", children: [pulse && (_jsx("span", { className: cn("absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none", variant === "solid" ? "bg-current" : dots[tone]) })), _jsx("span", { className: cn("relative size-1.5 rounded-full", variant === "solid" ? "bg-current" : dots[tone]) })] })), roll ? (_jsx("span", { className: "relative inline-flex overflow-hidden py-px", children: _jsx(AnimatePresence, { mode: "popLayout", initial: false, children: _jsx(motion.span, { initial: { y: "70%", opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: "-70%", opacity: 0 }, transition: spring, className: "inline-block tabular-nums", children: children }, String(children)) }) })) : (children), onRemove && (_jsx("button", { type: "button", "aria-label": "Remove", onClick: onRemove, className: "grid size-4 place-items-center rounded-full opacity-60 outline-none transition hover:bg-black/10 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current dark:hover:bg-white/15", children: _jsx(X, { className: "size-3" }) }))] }));
}
