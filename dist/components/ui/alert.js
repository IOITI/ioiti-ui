"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "../../lib/utils.js";
const tones = {
    neutral: {
        box: "border-neutral-200 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-900/60",
        icon: "text-neutral-500 dark:text-neutral-400",
        Icon: Info,
    },
    info: {
        box: "border-sky-200 bg-sky-50/70 dark:border-sky-500/30 dark:bg-sky-500/12",
        icon: "text-sky-600 dark:text-sky-400",
        Icon: Info,
    },
    success: {
        box: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-500/12",
        icon: "text-emerald-600 dark:text-emerald-400",
        Icon: CircleCheck,
    },
    warning: {
        box: "border-amber-200 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-500/12",
        icon: "text-amber-600 dark:text-amber-400",
        Icon: TriangleAlert,
    },
    danger: {
        box: "border-red-200 bg-red-50/70 dark:border-red-500/30 dark:bg-red-500/12",
        icon: "text-red-600 dark:text-red-400",
        Icon: CircleAlert,
    },
};
export function Alert({ tone = "neutral", icon, dismissible, onDismiss, action, className, children, ...props }) {
    const [visible, setVisible] = React.useState(true);
    const t = tones[tone];
    return (_jsx(AnimatePresence, { initial: false, onExitComplete: onDismiss, children: visible && (_jsx(motion.div, { initial: false, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] }, className: "overflow-hidden", children: _jsxs("div", { role: tone === "danger" || tone === "warning" ? "alert" : "status", className: cn("flex items-start gap-3 rounded-xl border p-4 text-sm", t.box, className), ...props, children: [icon !== false && (_jsx("span", { className: cn("mt-0.5 shrink-0 [&>svg]:size-4", t.icon), children: icon ?? _jsx(t.Icon, {}) })), _jsx("div", { className: "min-w-0 flex-1", children: children }), action && _jsx("div", { className: "-my-1 shrink-0", children: action }), dismissible && (_jsx("button", { type: "button", "aria-label": "Dismiss", onClick: () => setVisible(false), className: "-mr-1 -mt-1 grid size-7 shrink-0 place-items-center rounded-lg text-neutral-400 outline-none transition hover:bg-black/5 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400/50 active:scale-95 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-neutral-600/60", children: _jsx(X, { className: "size-4" }) }))] }) }, "alert")) }));
}
export function AlertTitle({ className, ...props }) {
    return _jsx("p", { className: cn("font-medium text-neutral-900 dark:text-neutral-100", className), ...props });
}
export function AlertDescription({ className, ...props }) {
    return _jsx("p", { className: cn("mt-0.5 text-neutral-600 dark:text-neutral-400", className), ...props });
}
