'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Check, X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, PRESSABLE, TOAST, TONE_TEXT } from '../../lib/recipes.js';
import { useLinkComponent } from '../link-context.js';
// ioiti-ui: its close button named in the provider's language.
import { useMessages } from '../locale-context.js';
import { ToastRegionContext } from '../toast-context.js';
const positionClasses = {
    'top-left': 'top-5 left-5 items-start',
    'top-center': 'top-5 left-1/2 -translate-x-1/2 items-center',
    'top-right': 'top-5 right-5 items-end',
    'bottom-left': 'bottom-5 left-5 items-start',
    'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-5 right-5 items-end',
};
// ioiti-ui: the action's look, UndoToast's Undo: a small button raised on the toast.
const ACTION_CLASS = 'inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-surface-raised text-sm font-medium text-foreground transition-[color,background-color,border-color,scale] hover:bg-surface-hover hover:border-border-hover focus-ring';
// ioiti-ui: drawn by its tone (StatusTone), `danger` where EasyUI's variant said `error`.
const toneIcon = (tone, custom) => {
    if (custom)
        return custom;
    switch (tone) {
        case 'success':
            return _jsx(Check, { className: cn('size-4', TONE_TEXT.positive) });
        case 'warning':
            return _jsx(AlertTriangle, { className: cn('size-4', TONE_TEXT.warning) });
        case 'danger':
            return _jsx(AlertCircle, { className: cn('size-4', TONE_TEXT.negative) });
        case 'info':
            return _jsx(Info, { className: cn('size-4', TONE_TEXT.info) });
        default:
            return _jsx(Info, { className: "size-4 text-muted-foreground" });
    }
};
/**
 * Toast — Enters with velocity and settles; the progress bar
 * responds naturally (animates from 100 -> 0 with a slight ease-in so the
 * last 10% feels like the toast is "deciding" to close).
 *
 * On hover the progress pauses; on leave it resumes with no jump. The
 * container slides in with a slightly higher initial velocity (initial y
 * offset 18px) that settles through a snappy spring, giving the toast a
 * feeling of motion.
 *
 * ioiti-ui: EasyUI's VelocityToast, named after its role.
 */
export const Toast = ({ open, onDismiss, title, description, duration = 4000, 
// ioiti-ui: its tone, `neutral` by default, where EasyUI's took a `variant`.
tone = 'neutral', position = 'bottom-center', showProgress = true, icon, className, wrapperClassName, wrapperStyle, onExitComplete, action, linkComponent, }) => {
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const LinkComponent = useLinkComponent(linkComponent);
    const words = useMessages().toast;
    // ioiti-ui: shown a render after its frame, the live region its words are said in (below).
    const [isVisible, setIsVisible] = useState(false);
    const inRegion = React.useContext(ToastRegionContext);
    // ioiti-ui: the time stops under the pointer (EasyUI's) and while the keyboard is in the toast, the time to reach
    // its action or Close for who cannot point at it.
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPaused = isHovered || isFocused;
    // Progress driven by a framer-motion motion value so we can drive it from
    // a single tween that is responsive to hover (paused) and dismissal.
    const progressMV = useMotionValue(100);
    const progressWidth = useTransform(progressMV, (v) => `${v}%`);
    const remainingRef = useRef(duration);
    const startRef = useRef(0);
    const rafRef = useRef(null);
    useEffect(() => {
        if (!open) {
            setIsVisible(false);
            return;
        }
        setIsVisible(true);
        progressMV.set(100);
        remainingRef.current = duration;
        startRef.current = performance.now();
    }, [open, duration, progressMV]);
    // Animate progress from 100 -> 0 over `remaining` ms. When isPaused we
    // simply skip the tween (progressMV holds its current value).
    useEffect(() => {
        if (!isVisible || !showProgress)
            return;
        if (isPaused) {
            // freeze the time origin so resume picks up where we left off
            startRef.current = performance.now() - (duration - remainingRef.current);
            return;
        }
        startRef.current = performance.now() - (duration - remainingRef.current);
        const tick = () => {
            const elapsed = performance.now() - startRef.current;
            const remaining = Math.max(0, duration - elapsed);
            remainingRef.current = remaining;
            // Map remaining (duration -> 0) to (100 -> 0) with a slight ease-in
            // (pow 1.05) so the last 10% feels like the toast is "deciding" to close.
            const linear = remaining / duration;
            const eased = Math.pow(linear, 1.05);
            progressMV.set(eased * 100);
            if (remaining <= 0) {
                setIsVisible(false);
                onDismiss?.();
                return;
            }
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current)
                cancelAnimationFrame(rafRef.current);
        };
    }, [isVisible, isPaused, duration, progressMV, showProgress, onDismiss]);
    const handleDismiss = useCallback(() => {
        setIsVisible(false);
        onDismiss?.();
    }, [onDismiss]);
    // Whether the toast enters from above or below depends on the position
    const isTop = position.startsWith('top');
    return (_jsx("div", { className: cn(
        // ioiti-ui: above the sheets, the dialogs and the drawer (z-50), put in document.body after the page it is
        // in: on their layer, their scrim covered it, its action out of reach. Under the hints (z-[60]).
        'fixed z-[55] pointer-events-none flex flex-col', positionClasses[position], wrapperClassName), style: wrapperStyle, 
        // ioiti-ui: its frame is the live region, there before its words: they are put in it a render after it, and are
        // said then (a region drawn with its words, as the toast was, is missed by some screen readers). Politely, or at
        // once for what went wrong (alert). In ToastProvider's regions, there from the start, it is none of its own.
        role: inRegion ? undefined : tone === 'danger' ? 'alert' : 'status', children: _jsx(AnimatePresence, { onExitComplete: onExitComplete, children: isVisible && (_jsxs(motion.div
            // Entry: starts further out for a higher perceived velocity, then settles
            , { 
                // Entry: starts further out for a higher perceived velocity, then settles
                initial: { opacity: 0, y: isTop ? -22 : 22, scale: 0.94 }, animate: { opacity: 1, y: 0, scale: 1 }, 
                // ioiti-ui: it leaves quicker than it came (easeExit), as everything that floats.
                exit: { opacity: 0, scale: 0.96, y: isTop ? -12 : 12, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), onFocus: () => setIsFocused(true), onBlur: (event) => {
                    if (!event.currentTarget.contains(event.relatedTarget))
                        setIsFocused(false);
                }, className: cn(
                // ioiti-ui: a toast's surface (recipes.ts), as UndoToast's; glass under the glass material (glass-float).
                TOAST, 'pointer-events-auto relative overflow-hidden p-4 min-w-[280px] sm:min-w-[340px] max-w-md font-sans select-none', className), children: [_jsxs("div", { className: "flex items-center justify-between gap-3 relative z-10", children: [_jsx("div", { className: "size-8 rounded-lg bg-surface-raised border border-border flex items-center justify-center shrink-0", children: toneIcon(tone, icon) }), _jsxs("div", { className: "flex-1 min-w-0 pr-1", children: [_jsx("p", { className: "text-sm font-medium text-foreground line-clamp-2 break-words text-balance", children: title }), description && (_jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 break-words mt-0.5 text-pretty", children: description }))] }), action &&
                                (action.href !== undefined ? (_jsx(LinkComponent, { href: action.href, onClick: () => {
                                        action.onClick?.();
                                        handleDismiss();
                                    }, className: cn(ACTION_CLASS, 'motion-safe:active:scale-[0.97]'), children: action.label })) : (_jsx("button", { type: "button", onClick: () => {
                                        action.onClick?.();
                                        handleDismiss();
                                    }, className: cn(ACTION_CLASS, PRESSABLE), children: action.label }))), _jsx("button", { type: "button", onClick: handleDismiss, className: cn(CLOSE_SM, 'focus-ring'), "aria-label": words.close, children: _jsx(X, {}) })] }), showProgress && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-[2px] bg-border overflow-hidden", children: _jsx(motion.div, { className: "h-full bg-foreground accent:bg-brand", style: { width: progressWidth } }) }))] })) }) }));
};
