'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, AlertCircle, Info, Trash2, Undo2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
export const UndoToast = ({ open = true, title = 'Project archived', description = 'Changes will be permanent in a few seconds', undoLabel = 'Undo', restoredMessage = 'Restored successfully', duration = 5000, variant = 'default', position = 'bottom-center', onUndo, onDismiss, showProgress = true, icon, className, wrapperClassName, }) => {
    const [isVisible, setIsVisible] = useState(open);
    const [isRestored, setIsRestored] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(100);
    const remainingTimeRef = useRef(duration);
    const requestRef = useRef(null);
    // ioiti-ui: the caller's callback through a ref: a new one at each render of the caller restarted the countdown.
    const onDismissRef = useRef(onDismiss);
    onDismissRef.current = onDismiss;
    useEffect(() => {
        setIsVisible(open);
        if (open) {
            setIsRestored(false);
            setProgress(100);
            remainingTimeRef.current = duration;
        }
    }, [open, duration]);
    const handleDismiss = useCallback(() => {
        setIsVisible(false);
        onDismissRef.current?.();
    }, []);
    const handleUndoClick = () => {
        if (isRestored)
            return;
        setIsRestored(true);
        if (requestRef.current)
            cancelAnimationFrame(requestRef.current);
        onUndo?.();
        setTimeout(() => {
            handleDismiss();
        }, 1400);
    };
    // ioiti-ui: the time left is kept at each frame, so that a pause takes up where it stopped, and the bar shows what
    // is left of the whole (EasyUI's went back to full after a pause, its time being the rest).
    useEffect(() => {
        if (!isVisible || isRestored || duration <= 0 || isPaused)
            return;
        const localStartTime = Date.now();
        const left = remainingTimeRef.current;
        const animate = () => {
            const elapsed = Date.now() - localStartTime;
            remainingTimeRef.current = Math.max(0, left - elapsed);
            setProgress((remainingTimeRef.current / duration) * 100);
            if (remainingTimeRef.current <= 0) {
                handleDismiss();
            }
            else {
                requestRef.current = requestAnimationFrame(animate);
            }
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current)
                cancelAnimationFrame(requestRef.current);
        };
    }, [isVisible, isPaused, isRestored, duration, handleDismiss]);
    const positionClasses = {
        'top-left': 'top-5 left-5 items-start',
        'top-center': 'top-5 left-1/2 -translate-x-1/2 items-center',
        'top-right': 'top-5 right-5 items-end',
        'bottom-left': 'bottom-5 left-5 items-start',
        'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2 items-center',
        'bottom-right': 'bottom-5 right-5 items-end',
    };
    const getVariantIcon = () => {
        if (icon)
            return icon;
        switch (variant) {
            case 'success':
                return _jsx(Check, { className: "w-4 h-4 text-emerald-700 dark:text-emerald-400" });
            case 'warning':
                return _jsx(AlertTriangle, { className: "w-4 h-4 text-amber-700 dark:text-amber-400" });
            case 'error':
                return _jsx(AlertCircle, { className: "w-4 h-4 text-rose-700 dark:text-rose-400" });
            case 'info':
                return _jsx(Info, { className: "w-4 h-4 text-sky-700 dark:text-sky-400" });
            default:
                return _jsx(Trash2, { className: "w-4 h-4 text-neutral-500 dark:text-[#A1A1A1]" });
        }
    };
    return (_jsx("div", { className: cn('fixed z-50 pointer-events-none flex flex-col', positionClasses[position], wrapperClassName), children: _jsx(AnimatePresence, { children: isVisible && (_jsxs(motion.div, { layout: true, initial: { opacity: 0, y: position.startsWith('top') ? -16 : 16, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, scale: 0.94, y: position.startsWith('top') ? -10 : 10 }, transition: motionTransitions.springSnappy, onMouseEnter: () => setIsPaused(true), onMouseLeave: () => setIsPaused(false), 
                // ioiti-ui: paused while the keyboard is in it too, as under the pointer.
                onFocus: () => setIsPaused(true), onBlur: (event) => {
                    if (!event.currentTarget.contains(event.relatedTarget))
                        setIsPaused(false);
                }, 
                // ioiti-ui: each colour has a light value in front of EasyUI's own, kept behind `dark:`.
                className: cn('pointer-events-auto relative overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-[0_12px_32px_rgba(0,0,0,0.14)] p-3.5 sm:p-4 min-w-[280px] sm:min-w-[340px] max-w-md font-sans select-none dark:border-[#1F1F1F] dark:bg-[#0E0E0E] dark:text-[#FAFAFA] dark:shadow-[0_12px_32px_rgba(0,0,0,0.6)]', className), role: "status", "aria-live": "polite", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 relative z-10", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 dark:bg-[#141414] dark:border-[#1F1F1F]", children: isRestored ? (_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: motionTransitions.springSnappy, children: _jsx(Check, { className: "w-4 h-4 text-emerald-700 dark:text-emerald-400" }) })) : (getVariantIcon()) }), _jsxs("div", { className: "flex-1 min-w-0 pr-1", children: [_jsx("p", { className: "text-xs font-semibold text-neutral-900 truncate dark:text-[#FAFAFA]", children: isRestored ? restoredMessage : title }), description && !isRestored && (_jsx("p", { className: "text-[11px] text-neutral-600 truncate mt-0.5 dark:text-[#A1A1A1]", children: description }))] }), _jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [!isRestored && (_jsxs("button", { type: "button", onClick: handleUndoClick, className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-white border border-neutral-200 hover:border-neutral-400 text-xs font-medium text-neutral-900 transition-colors focus-ring cursor-pointer dark:bg-[#141414] dark:hover:bg-[#0E0E0E] dark:border-[#1F1F1F] dark:hover:border-[#4A4A4A] dark:text-[#FAFAFA]", children: [_jsx(Undo2, { className: "w-3 h-3 text-neutral-500 dark:text-[#A1A1A1]" }), _jsx("span", { children: undoLabel })] })), _jsx("button", { type: "button", onClick: handleDismiss, className: "p-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-ring cursor-pointer dark:text-[#6B6B6B] dark:hover:text-[#FAFAFA] dark:hover:bg-[#141414]", "aria-label": "Close notification", children: _jsx(X, { className: "w-3.5 h-3.5" }) })] })] }), showProgress && !isRestored && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-100 dark:bg-[#050505]", children: _jsx("div", { className: "h-full bg-neutral-900 transition-all dark:bg-[#FAFAFA]", style: { width: `${progress}%`, transition: isPaused ? 'none' : 'width 50ms linear' } }) }))] })) }) }));
};
