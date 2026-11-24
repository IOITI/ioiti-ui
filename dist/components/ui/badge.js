"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { TONE_LINE, TONE_MARK, TONE_SOFT, TONE_SOLID, TONE_TEXT } from "../../lib/recipes.js";
// ioiti-ui: what floats in takes the design's spring (EasyUI's was 520/36/0.6).
const spring = motionTransitions.springSnappy;
// ioiti-ui: the design's tones (recipes.ts), the same as every other component's: danger is the negative red, not a
// palette's step, and each word keeps 4.5:1 on every surface.
const TONE = { neutral: "neutral", success: "positive", warning: "warning", danger: "negative" };
const styles = {
    soft: {
        neutral: TONE_SOFT.neutral,
        success: TONE_SOFT.positive,
        warning: TONE_SOFT.warning,
        danger: TONE_SOFT.negative,
    },
    solid: {
        // ioiti-ui: the emphasis, in the accent where the theme has one (accent:); the tones keep their colours.
        neutral: `${TONE_SOLID.neutral} accent:bg-brand accent:text-brand-foreground`,
        success: TONE_SOLID.positive,
        warning: TONE_SOLID.warning,
        danger: TONE_SOLID.negative,
    },
    outline: {
        neutral: `${TONE_LINE.neutral} text-text-secondary`,
        success: `${TONE_LINE.positive} ${TONE_TEXT.positive}`,
        warning: `${TONE_LINE.warning} ${TONE_TEXT.warning}`,
        danger: `${TONE_LINE.negative} ${TONE_TEXT.negative}`,
    },
};
const dots = {
    neutral: TONE_MARK[TONE.neutral],
    success: TONE_MARK[TONE.success],
    warning: TONE_MARK[TONE.warning],
    danger: TONE_MARK[TONE.danger],
};
export function Badge({ variant = "soft", tone = "neutral", dot, pulse, onRemove, removeLabel = "Remove", removeFocusable = true, className, children, ...props }) {
    // strings & numbers roll when they change (counts, status labels)
    const roll = typeof children === "string" || typeof children === "number";
    return (_jsxs(motion.span, { style: props.style, className: cn("font-sans relative inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full border border-transparent px-2.5 text-xs font-medium", styles[variant][tone], onRemove && "pr-1.5", className), ...props, children: [dot && (_jsxs("span", { className: "relative flex size-1.5 shrink-0", children: [pulse && (_jsx("span", { className: cn("absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none", variant === "solid" ? "bg-current" : dots[tone]) })), _jsx("span", { className: cn("relative size-1.5 rounded-full", variant === "solid" ? "bg-current" : dots[tone]) })] })), roll ? (_jsx("span", { className: "relative inline-flex overflow-hidden py-px", children: _jsx(AnimatePresence, { mode: "popLayout", initial: false, children: _jsx(motion.span, { initial: { y: "70%", opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: "-70%", opacity: 0 }, transition: spring, className: "inline-block tabular-nums", children: children }, String(children)) }) })) : (children), onRemove && (_jsx("button", { type: "button", "aria-label": removeLabel, tabIndex: removeFocusable ? undefined : -1, onClick: onRemove, 
                // ioiti-ui: no ring of its own (the global one), and a target of 24 px around its 16.
                className: "relative grid size-4 cursor-pointer place-items-center rounded-full opacity-60 transition after:absolute after:-inset-1 after:content-[''] hover:bg-current/10 hover:opacity-100", children: _jsx(X, { className: "size-3" }) }))] }));
}
