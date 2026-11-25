"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { cn } from "../../lib/utils.js";
// ioiti-ui: what loads is named in the provider's language (`status`).
import { useMessages } from "../locale-context.js";
/** A quiet block with a slow light sweep. Size it with className. */
export function Skeleton({ className, ...props }) {
    return (_jsx("div", { "aria-hidden": true, className: cn("relative overflow-hidden rounded-md bg-muted", className), ...props, children: _jsx(motion.span
        // ioiti-ui: the sweep in the design's tokens (the surface's light, a hint of the text's in dark), its loop's own
        // time on the design's curve.
        , { 
            // ioiti-ui: the sweep in the design's tokens (the surface's light, a hint of the text's in dark), its loop's own
            // time on the design's curve.
            className: "absolute inset-0 bg-linear-to-r from-transparent via-surface/65 to-transparent dark:via-foreground/7", initial: { x: "-100%" }, animate: { x: "100%" }, transition: { ...motionTransitions.easeSoft, duration: 1.6, repeat: Infinity, repeatDelay: 0.2 } }) }));
}
const WIDTHS = ["100%", "94%", "98%", "88%"];
export function SkeletonText({ lines = 3, className, }) {
    return (_jsx("div", { "aria-hidden": true, className: cn("space-y-2.5", className), children: Array.from({ length: lines }, (_, i) => (_jsx(Skeleton, { className: "h-3.5", style: { width: i === lines - 1 && lines > 1 ? "62%" : WIDTHS[i % WIDTHS.length] } }, i))) }));
}
export function SkeletonAvatar({ size = 40, className }) {
    return _jsx(Skeleton, { className: cn("shrink-0 rounded-full", className), style: { width: size, height: size } });
}
/**
 * Swap a skeleton for real content. Content eases in (fade, rise, un-blur).
 * Make the skeleton roughly the same size as the content so nothing jumps.
 */
export function SkeletonReveal({ loading, skeleton, children, className, }) {
    const words = useMessages().status;
    return (_jsx("div", { className: className, children: _jsx(AnimatePresence, { mode: "wait", initial: false, children: loading ? (_jsx(motion.div, { role: "status", "aria-busy": "true", "aria-label": words.loadingName, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 }, children: skeleton }, "skeleton")) : (_jsx(motion.div, { initial: { opacity: 0, y: 6, filter: "blur(4px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" }, transition: motionTransitions.easeSoft, children: children }, "content")) }) }));
}
