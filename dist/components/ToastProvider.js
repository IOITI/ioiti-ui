import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState } from 'react';
import { VelocityToast } from './ui/velocity-toast.js';
import { ToastContext } from './toast-context.js';
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
    const nextId = useRef(0);
    const show = useCallback((message) => {
        nextId.current += 1;
        const toast = { ...message, id: nextId.current };
        setQueue((waiting) => [...waiting, toast].slice(-MAX_WAITING));
    }, []);
    const current = queue[0];
    return (_jsxs(ToastContext.Provider, { value: show, children: [children, current && (_jsx(VelocityToast, { open: true, onDismiss: () => setQueue((waiting) => waiting.filter((toast) => toast.id !== current.id)), title: current.title, description: current.description, variant: current.variant ?? 'default', position: "bottom-center", wrapperClassName: wrapperClassName, duration: displayTime(current, queue.length - 1) }, current.id))] }));
}
