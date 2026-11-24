'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, AlertCircle, Info, Trash2, Undo2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, PRESSABLE, TOAST, TONE_TEXT } from '../../lib/recipes.js';
// ioiti-ui: its words in the provider's language; a toast without a title said to its developer.
import { devWarn } from '../../lib/dev.js';
import { useMessages } from '../locale-context.js';
// ioiti-ui: the action beside a toast's words, the same as VelocityToast's: a small button raised on the toast.
const TOAST_ACTION_CLASS = 'inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-surface-raised text-sm font-medium text-foreground transition-[color,background-color,border-color,scale] hover:bg-surface-hover hover:border-border-hover focus-ring';
export const UndoToast = ({ open = true, title: givenTitle, description: givenDescription, undoLabel: givenUndoLabel, restoredMessage: givenRestoredMessage, duration = 5000, variant = 'default', position = 'bottom-center', onUndo, onDismiss, showProgress = true, icon, className, wrapperClassName, }) => {
    // ioiti-ui: its words in the provider's language, the ones given over them. A title the application gives: "Done"
    // names nothing that was done (EasyUI's "Project archived" was one application's word).
    const words = useMessages().toast;
    const title = givenTitle ?? words.undoTitle;
    const description = givenDescription ?? words.undoDescription;
    const undoLabel = givenUndoLabel ?? words.undo;
    const restoredMessage = givenRestoredMessage ?? words.restored;
    const untitled = givenTitle === undefined;
    useEffect(() => {
        if (open && untitled)
            devWarn('undo-toast-untitled');
    }, [open, untitled]);
    // ioiti-ui: shown a render after its frame, the live region its words are said in (below).
    const [isVisible, setIsVisible] = useState(false);
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
            // ioiti-ui: nothing stops it as it opens. A pause from its last time outlived it (its Close or Undo pressed with
            // the mouse took the focus, and was gone with the toast before the focus could leave it): its bar stood still,
            // and it stayed open.
            setIsPaused(false);
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
                return _jsx(Check, { className: cn('size-4', TONE_TEXT.positive) });
            case 'warning':
                return _jsx(AlertTriangle, { className: cn('size-4', TONE_TEXT.warning) });
            case 'error':
                return _jsx(AlertCircle, { className: cn('size-4', TONE_TEXT.negative) });
            case 'info':
                return _jsx(Info, { className: cn('size-4', TONE_TEXT.info) });
            default:
                return _jsx(Trash2, { className: "size-4 text-muted-foreground" });
        }
    };
    return (_jsx("div", { className: cn(
        // ioiti-ui: above the sheets, the dialogs and the drawer (z-50), put in document.body after the page it is
        // in: on their layer, their scrim covered it, its action out of reach. Under the hints (z-[60]).
        'fixed z-[55] pointer-events-none flex flex-col', positionClasses[position], wrapperClassName), 
        // ioiti-ui: its frame is the live region, there before its words: they are put in it a render after it, and are
        // said then (a region drawn with its words, as the toast was, is missed by some screen readers). Politely, or at
        // once for what went wrong (alert).
        role: variant === 'error' ? 'alert' : 'status', children: _jsx(AnimatePresence, { children: isVisible && (_jsxs(motion.div, { layout: true, initial: { opacity: 0, y: position.startsWith('top') ? -16 : 16, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, 
                // ioiti-ui: it leaves quicker than it came (easeExit), as everything that floats.
                exit: { opacity: 0, scale: 0.94, y: position.startsWith('top') ? -10 : 10, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, 
                // ioiti-ui: the time runs on under the pointer (EasyUI's stopped there); it stops only while the keyboard
                // is in it, the time to reach Undo for who cannot see the bar or point at it. A pointer moves the focus in
                // only by pressing Undo or Close, which end it.
                onFocus: () => setIsPaused(true), onBlur: (event) => {
                    if (!event.currentTarget.contains(event.relatedTarget))
                        setIsPaused(false);
                }, 
                // ioiti-ui: a toast's surface (recipes.ts), as VelocityToast's; glass under the glass material (glass-float).
                className: cn(TOAST, 'pointer-events-auto relative overflow-hidden p-4 min-w-[280px] sm:min-w-[340px] max-w-md font-sans select-none', className), children: [_jsxs("div", { className: "flex items-center justify-between gap-3 relative z-10", children: [_jsx("div", { className: "size-8 rounded-lg bg-surface-raised border border-border flex items-center justify-center shrink-0", children: isRestored ? (_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: motionTransitions.springSnappy, children: _jsx(Check, { className: cn('size-4', TONE_TEXT.positive) }) })) : (getVariantIcon()) }), _jsxs("div", { className: "flex-1 min-w-0 pr-1", children: [_jsx("p", { className: "text-sm font-medium text-foreground line-clamp-2 break-words text-balance", children: isRestored ? restoredMessage : title }), description && !isRestored && (_jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 break-words mt-0.5 text-pretty", children: description }))] }), _jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [!isRestored && (_jsxs("button", { type: "button", onClick: handleUndoClick, className: cn(TOAST_ACTION_CLASS, PRESSABLE), children: [_jsx(Undo2, { className: "size-3.5 text-muted-foreground" }), _jsx("span", { children: undoLabel })] })), _jsx("button", { type: "button", onClick: handleDismiss, className: cn(CLOSE_SM, 'focus-ring'), "aria-label": words.close, children: _jsx(X, {}) })] })] }), showProgress && !isRestored && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-[2px] bg-border", children: _jsx("div", { className: "h-full bg-foreground accent:bg-brand", style: { width: `${progress}%` } }) }))] })) }) }));
};
