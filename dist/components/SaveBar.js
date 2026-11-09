import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useEffect, useId, useLayoutEffect, useRef } from 'react';
import { announce } from '../lib/announce.js';
import { motionTransitions } from '../lib/motion-tokens.js';
import { cn } from '../lib/utils.js';
import { ToastInsetContext } from './toast-context.js';
import { Button } from './ui/button.js';
/**
 * The bar of unsaved changes, at the bottom of the page while there are any: what there is to save, and
 * Discard and Save. It stays in sight as the page scrolls, the toasts rising above it; a screen reader
 * hears it once when it comes. With `RouterLeaveGuard`, leaving the page asks first. As Elastic UI's
 * bottom bar does.
 */
export function SaveBar({ open, message = 'Unsaved changes', onSave, onDiscard, saving = false, saveDisabled = false, error, saveLabel = 'Save', discardLabel = 'Discard', children, label = 'Unsaved changes', className, }) {
    const key = useId();
    const bar = useRef(null);
    const lift = useContext(ToastInsetContext);
    // The toasts clear it while it is there.
    useLayoutEffect(() => {
        if (!lift)
            return;
        lift(key, open ? (bar.current?.offsetHeight ?? 56) + 16 : 0);
        return () => lift(key, 0);
    }, [lift, key, open]);
    // Said once as it comes, not again at each change counted.
    const said = typeof message === 'string' ? message : label;
    const saidRef = useRef(said);
    useEffect(() => {
        saidRef.current = said;
    });
    useEffect(() => {
        if (open)
            announce(saidRef.current);
    }, [open]);
    return (_jsx(AnimatePresence, { children: open && (_jsxs(motion.div, { ref: bar, role: "region", "aria-label": label, initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 16, transition: motionTransitions.easeExit }, transition: motionTransitions.springSheet, className: cn('sticky bottom-4 z-30 mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-surface px-4 py-3 shadow-lg glass-float', className), children: [_jsxs("div", { className: "min-w-0 flex-1 text-sm", children: [_jsx("p", { className: "font-medium text-text-primary", children: message }), error && (_jsx("p", { role: "alert", className: "text-xs text-negative", children: error }))] }), _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [children, onDiscard && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onDiscard, disabled: saving, children: discardLabel })), _jsx(Button, { size: "sm", onClick: onSave, isLoading: saving, loadingText: "Saving", disabled: saveDisabled, children: saveLabel })] })] })) }));
}
