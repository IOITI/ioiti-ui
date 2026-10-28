import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState } from 'react';
import { cn } from '../lib/utils.js';
import { VelocityToast } from './ui/velocity-toast.js';
import { ToastContext, ToastInsetContext } from './toast-context.js';
/** Beyond this, the oldest waiting toasts are dropped: a burst must not take minutes to read out. */
const MAX_WAITING = 6;
function displayTime(toast, waiting) {
    if (toast.variant === 'error')
        return 8000;
    // Others are waiting behind it: move along faster.
    return waiting > 0 ? 2500 : 4000;
}
/**
 * Toasts are shown one at a time, each for its full time. Two things happening
 * at once (an action's result and the event it caused) are shown one after the
 * other rather than the second replacing the first.
 *
 * Bottom centre: where pages put no control. Bottom right is where the buttons
 * that save and the paging of tables are; top right, the date ranges and the
 * exports.
 */
export function ToastProvider({ wrapperClassName, children }) {
    const [queue, setQueue] = useState([]);
    // The toast shown, once dismissed: it leaves, its exit played, before the next one comes.
    const [leaving, setLeaving] = useState(null);
    const nextId = useRef(0);
    const show = useCallback((message) => {
        nextId.current += 1;
        const toast = { ...message, id: nextId.current };
        setQueue((waiting) => [...waiting, toast].slice(-MAX_WAITING));
    }, []);
    const current = queue[0];
    // Lifted above what sits at the bottom of the page, as long as it is there.
    const [insets, setInsets] = useState({});
    const setInset = useCallback((key, inset) => {
        setInsets((now) => (now[key] === inset ? now : { ...now, [key]: inset }));
    }, []);
    const lift = Math.max(0, ...Object.values(insets));
    return (_jsxs(ToastContext.Provider, { value: show, children: [_jsx(ToastInsetContext.Provider, { value: setInset, children: children }), current && (_jsx(VelocityToast, { open: leaving !== current.id, onDismiss: () => setLeaving(current.id), onExitComplete: () => {
                    setQueue((waiting) => waiting.filter((toast) => toast.id !== current.id));
                    setLeaving(null);
                }, title: current.title, description: current.description, variant: current.variant ?? 'default', position: "bottom-center", 
                // The frame stays above the page while a page changes, as every layer over it (over-page, motion.css).
                wrapperClassName: cn('over-page motion-safe:transition-[margin-bottom] motion-safe:duration-300 motion-safe:ease-soft', wrapperClassName), wrapperStyle: lift ? { marginBottom: lift } : undefined, duration: displayTime(current, queue.length - 1) }, current.id))] }));
}
