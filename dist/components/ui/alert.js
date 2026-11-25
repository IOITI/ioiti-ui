"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { CLOSE_MD, TONE_LINE, TONE_SOFT, TONE_TEXT } from "../../lib/recipes.js";
import { cn } from "../../lib/utils.js";
// ioiti-ui: its × button's name in the provider's language (`status`).
import { useMessages } from "../locale-context.js";
// ioiti-ui: the design's tones (recipes.ts): an alert's box is the tone's faint ground and line, its icon the tone.
const TONE = { neutral: "neutral", info: "info", success: "positive", warning: "warning", danger: "negative" };
const tone = (alert, Icon) => ({
    box: cn(TONE_SOFT[TONE[alert]], TONE_LINE[TONE[alert]]),
    icon: TONE_TEXT[TONE[alert]],
    Icon,
});
const tones = {
    neutral: tone("neutral", Info),
    info: tone("info", Info),
    success: tone("success", CircleCheck),
    warning: tone("warning", TriangleAlert),
    danger: tone("danger", CircleAlert),
};
export function Alert({ tone = "neutral", icon, dismissible, onDismiss, action, className, children, ...props }) {
    const [visible, setVisible] = React.useState(true);
    const t = tones[tone];
    const words = useMessages().status;
    return (_jsx(AnimatePresence, { initial: false, onExitComplete: onDismiss, children: visible && (_jsx(motion.div, { initial: false, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, 
            // ioiti-ui: it only leaves (initial={false}), with the design's exit, quicker than an entrance.
            transition: motionTransitions.easeExit, className: "overflow-hidden", children: _jsxs("div", { role: tone === "danger" || tone === "warning" ? "alert" : "status", className: cn("flex items-start gap-3 rounded-xl border p-4 text-sm", t.box, className), ...props, children: [icon !== false && (_jsx("span", { className: cn("mt-0.5 shrink-0 [&>svg]:size-4", t.icon), children: icon ?? _jsx(t.Icon, {}) })), _jsx("div", { className: "min-w-0 flex-1", children: children }), action && _jsx("div", { className: "-my-1 shrink-0", children: action }), dismissible && (_jsx("button", { type: "button", "aria-label": words.dismiss, onClick: () => setVisible(false), 
                        // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                        className: cn(CLOSE_MD, "-mr-1.5 -mt-1.5 outline-none"), children: _jsx(X, {}) }))] }) }, "alert")) }));
}
export function AlertTitle({ className, ...props }) {
    return _jsx("p", { className: cn("font-medium text-foreground text-balance", className), ...props });
}
// ioiti-ui: a div, not a p: a description may hold a list, paragraphs, a Disclosure (in a p, invalid HTML).
export function AlertDescription({ className, ...props }) {
    return _jsx("div", { className: cn("mt-0.5 text-muted-foreground text-pretty", className), ...props });
}
