'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-[110rem]',
};
/**
 * SettleModal — Content has a tiny scale + settle instead of a generic fade.
 *
 * The panel scales from 0.94 -> 1.02 -> 1.0 (with a slight y travel), then the
 * inner content crossfades in with a tiny 0.96 -> 1.0 scale-up, so the
 * perceived motion is "settle" rather than "fade in".
 *
 * ioiti-ui: rendered in document.body, so that it takes nothing from the element
 * that opens it (a table cell passes its alignment and wrapping on to what is
 * inside it). Keyboard focus moves into the dialog when it opens, stays in it,
 * and goes back to where it was when it closes.
 */
export const SettleModal = ({ open, onClose, title, description, children, footer, hideCloseButton = false, closeOnBackdrop = true, size = 'md', className, }) => {
    const titleId = useId();
    const dialogRef = useRef(null);
    // Callers pass a new function at every render: read through a ref, so that
    // the effect below runs when the dialog opens and closes, not at each render.
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    });
    useEffect(() => {
        if (!open)
            return;
        const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        // The dialog itself, not a control in it: Enter does nothing until the
        // user has moved to the control they mean.
        dialogRef.current?.focus();
        const onKey = (e) => {
            if (e.key === 'Escape') {
                onCloseRef.current();
                return;
            }
            const dialog = dialogRef.current;
            if (e.key !== 'Tab' || !dialog)
                return;
            const focusable = Array.from(dialog.querySelectorAll(FOCUSABLE)).filter((element) => element.tabIndex >= 0);
            if (focusable.length === 0) {
                e.preventDefault();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;
            const outside = !dialog.contains(active) || active === dialog;
            if (e.shiftKey && (outside || active === first)) {
                e.preventDefault();
                last.focus();
            }
            else if (!e.shiftKey && (outside || active === last)) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
            if (opener?.isConnected)
                opener.focus();
        };
    }, [open]);
    return createPortal(_jsx(AnimatePresence, { children: open && (_jsxs("div", { ref: dialogRef, tabIndex: -1, className: "fixed inset-0 z-50 flex items-center justify-center p-4 text-left outline-none", "aria-labelledby": title ? titleId : undefined, role: "dialog", "aria-modal": "true", children: [_jsx(motion.div, { className: "absolute inset-0 bg-black/50 backdrop-blur-md", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: motionTransitions.easeSoft, onClick: () => closeOnBackdrop && onClose() }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.94, y: 8 }, animate: {
                        opacity: 1,
                        scale: [0.94, 1.02, 1],
                        y: 0,
                    }, exit: { opacity: 0, scale: 0.96, y: 4 }, transition: {
                        duration: 0.42,
                        ease: [0.16, 1, 0.3, 1],
                    }, className: cn(
                    // ioiti-ui: no taller than the screen; what does not fit scrolls inside it (a phone, a long form).
                    'relative w-full max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-elevated)] p-6 sm:p-8 focus:outline-none', sizeMap[size], className), children: [!hideCloseButton && (_jsx("button", { type: "button", "aria-label": "Close", onClick: onClose, className: "absolute top-3.5 right-3.5 p-1.5 rounded-md text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors focus-ring cursor-pointer", children: _jsx(X, { className: "w-3.5 h-3.5" }) })), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.98, y: 4 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.99, y: 2 }, transition: {
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.05,
                            }, children: [title && (_jsx("h2", { id: titleId, className: "text-lg sm:text-xl font-semibold tracking-tight text-[var(--text-primary)] pr-8", children: title })), description && (_jsx("p", { className: "text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed", children: description })), children && _jsx("div", { className: "mt-5", children: children }), footer && _jsx("div", { className: "mt-6 flex justify-end gap-2", children: footer })] })] })] })) }), document.body);
};
