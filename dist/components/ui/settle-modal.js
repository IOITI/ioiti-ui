'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_MD, DIALOG, SCRIM } from '../../lib/recipes.js';
// ioiti-ui: held by its caller or by itself, as every layer (useControllableState); a former name said once, in
// development (deprecated).
import { useControllableState } from '../../lib/controllable.js';
import { deprecated } from '../../lib/deprecated.js';
// ioiti-ui: the focus kept as every layer over the page keeps it; a dialog without a name said to its developer.
import { devWarn } from '../../lib/dev.js';
import { useFocusScope } from '../../lib/focus-scope.js';
// ioiti-ui: its close button named in the provider's language.
import { useMessages } from '../locale-context.js';
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
 * ioiti-ui: one calm entrance, the design's: the panel grows from what opened
 * it (0.96 to 1, 6 px of travel, springGentle), without EasyUI's overshoot
 * (0.94 -> 1.02 -> 1), and its content with it rather than a layer after it.
 * It leaves quicker than it came (easeExit).
 *
 * ioiti-ui: rendered in document.body, so that it takes nothing from the element
 * that opens it (a table cell passes its alignment and wrapping on to what is
 * inside it). Keyboard focus moves into the dialog when it opens, stays in it,
 * and goes back to where it was when it closes.
 */
export const SettleModal = ({ open: openProp, defaultOpen = false, onOpenChange, onClose: onClosed, title, description, children, footer, showCloseButton, hideCloseButton, closeOnBackdrop = true, size = 'md', className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, }) => {
    // ioiti-ui: open, held by the page or by the dialog (useControllableState); what closes it tells `onOpenChange` and
    // `onClose`. `showCloseButton`, as every layer names it; `hideCloseButton`, its former name the other way round, read
    // where it alone is given.
    const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
    const onClose = () => {
        setOpen(false);
        onClosed?.();
    };
    if (hideCloseButton !== undefined)
        deprecated('hide-close-button', 'SettleModal');
    const withCloseButton = showCloseButton ?? !hideCloseButton;
    const titleId = useId();
    const words = useMessages().dialog;
    const dialogRef = useRef(null);
    // ioiti-ui: the dialog grows from what opened it: the middle of the control the focus is on when it
    // opens (the effect below moves it into the dialog), as the panel's transform origin; from its centre
    // when nothing did.
    const panelRef = useRef(null);
    const [origin, setOrigin] = useState(undefined);
    useLayoutEffect(() => {
        if (!open)
            return;
        const opener = document.activeElement;
        const panel = panelRef.current;
        if (!panel || !(opener instanceof HTMLElement) || opener === document.body) {
            setOrigin(undefined);
            return;
        }
        // Its place on the screen, which a transform does not move (the layer is the whole window).
        const from = opener.getBoundingClientRect();
        setOrigin(`${from.left + from.width / 2 - panel.offsetLeft}px ${from.top + from.height / 2 - panel.offsetTop}px`);
    }, [open]);
    // Callers pass a new function at every render: read through a ref, so that
    // the effect below runs when the dialog opens and closes, not at each render.
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    });
    // ioiti-ui: the focus as every layer over the page keeps it (useFocusScope): moved in, kept in by Tab, given back to
    // what opened it, the latest layer opened keeping it (what floats beside a control in it keeps its own keys). It goes
    // to the dialog itself, not a control in it: Enter does nothing until the user has moved to the control they mean.
    useFocusScope(dialogRef, {
        active: open,
        initialFocus: () => dialogRef.current,
        onEscape: () => onCloseRef.current(),
    });
    useEffect(() => {
        if (!open)
            return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [open]);
    // ioiti-ui: a dialog without a name said to its developer, once (in development only).
    const unnamed = !title && !ariaLabel && !ariaLabelledBy;
    useEffect(() => {
        if (open && unnamed)
            devWarn('dialog-unnamed');
    }, [open, unnamed]);
    return createPortal(_jsx(AnimatePresence, { children: open && (_jsxs("div", { ref: dialogRef, tabIndex: -1, 
            // ioiti-ui: kept above the page while a page changes, as every layer over it (over-page, motion.css).
            className: "fixed inset-0 z-50 flex items-center justify-center p-4 text-left outline-none over-page", "aria-labelledby": ariaLabelledBy ?? (title ? titleId : undefined), "aria-label": ariaLabel, "aria-describedby": description ? `${titleId}-description` : undefined, role: "dialog", "aria-modal": "true", children: [_jsx(motion.div, { className: cn('absolute inset-0', SCRIM), initial: { opacity: 0 }, animate: { opacity: 1 }, 
                    // ioiti-ui: the scrims' motion: easeFast arriving, easeExit leaving.
                    exit: { opacity: 0, transition: motionTransitions.easeExit }, transition: motionTransitions.easeFast, onClick: () => closeOnBackdrop && onClose() }), _jsxs(motion.div, { ref: panelRef, initial: { opacity: 0, scale: 0.96, y: 6 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.98, transition: motionTransitions.easeExit }, transition: motionTransitions.springGentle, style: { transformOrigin: origin }, className: cn(
                    // ioiti-ui: no taller than the screen; what does not fit scrolls inside it (a phone, a long form).
                    DIALOG, 'relative w-full max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:p-8 focus:outline-none', sizeMap[size], className), children: [withCloseButton && (_jsx("button", { type: "button", "aria-label": words.close, onClick: onClose, className: cn(CLOSE_MD, 'absolute top-3 right-3 focus-ring'), children: _jsx(X, {}) })), _jsxs("div", { children: [title && (_jsx("h2", { id: titleId, className: "text-lg sm:text-xl font-semibold tracking-tight text-foreground text-balance pr-8", children: title })), description && (_jsx("p", { id: `${titleId}-description`, className: "text-sm text-muted-foreground mt-1.5 leading-relaxed text-pretty", children: description })), children && _jsx("div", { className: "mt-5", children: children }), footer && _jsx("div", { className: "mt-6 flex justify-end gap-2", children: footer })] })] })] })) }), document.body);
};
