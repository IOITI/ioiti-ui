'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useId, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
const sideTransform = {
    top: { x: 0, y: 8 },
    right: { x: -8, y: 0 },
    bottom: { x: 0, y: -8 },
    left: { x: 8, y: 0 },
};
const arrowStyles = {
    top: {
        position: 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-l-transparent border-r-transparent border-b-transparent',
        borderColorSide: 'borderTopColor',
    },
    right: {
        position: 'right-full top-1/2 -translate-y-1/2 translate-x-1/2 border-t-transparent border-b-transparent border-l-transparent',
        borderColorSide: 'borderRightColor',
    },
    bottom: {
        position: 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-l-transparent border-r-transparent border-t-transparent',
        borderColorSide: 'borderBottomColor',
    },
    left: {
        position: 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2 border-t-transparent border-b-transparent border-r-transparent',
        borderColorSide: 'borderLeftColor',
    },
};
/** ioiti-ui: room kept between a tooltip and the edges of the screen. */
const EDGE = 8;
/**
 * ioiti-ui: where the tooltip goes, on the screen: beside its trigger on its side, flipped to the other side when
 * there is no room, and kept inside the screen. Fixed coordinates, so that no scrolling or clipping parent
 * (a table) cuts it.
 */
function placement(trigger, box, side, align, offset) {
    const room = { top: trigger.top, bottom: window.innerHeight - trigger.bottom, left: trigger.left, right: window.innerWidth - trigger.right };
    const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
    const needed = side === 'top' || side === 'bottom' ? box.height + offset : box.width + offset;
    const chosen = room[side] < needed && room[opposite[side]] > room[side] ? opposite[side] : side;
    let left;
    let top;
    if (chosen === 'top' || chosen === 'bottom') {
        top = chosen === 'top' ? trigger.top - offset - box.height : trigger.bottom + offset;
        left =
            align === 'start' ? trigger.left : align === 'end' ? trigger.right - box.width : trigger.left + trigger.width / 2 - box.width / 2;
    }
    else {
        left = chosen === 'left' ? trigger.left - offset - box.width : trigger.right + offset;
        top =
            align === 'start' ? trigger.top : align === 'end' ? trigger.bottom - box.height : trigger.top + trigger.height / 2 - box.height / 2;
    }
    const clamp = (value, size, limit) => Math.min(Math.max(value, EDGE), Math.max(EDGE, limit - size - EDGE));
    const placed = { left: clamp(left, box.width, window.innerWidth), top: clamp(top, box.height, window.innerHeight) };
    // ioiti-ui: the arrow points at the trigger's middle, also when the tooltip was moved to stay on the screen.
    const vertical = chosen === 'top' || chosen === 'bottom';
    const middle = vertical ? trigger.left + trigger.width / 2 - placed.left : trigger.top + trigger.height / 2 - placed.top;
    const span = vertical ? box.width : box.height;
    return { ...placed, side: chosen, arrow: Math.min(Math.max(middle, EDGE), Math.max(EDGE, span - EDGE)) };
}
/**
 * DirectionalTooltip — Appears from the direction it originates.
 * The tooltip starts a small distance outside the trigger in its preferred
 * direction and springs inward, so the user perceives it as materializing
 * from the trigger toward the content.
 */
export const DirectionalTooltip = ({ children, content, side = 'top', align = 'center', delayDuration = 150, showArrow = true, offset = 8, className, wrapperClassName, forceOpen = false, }) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const boxRef = useRef(null);
    const timeoutRef = useRef(null);
    const [place, setPlace] = useState(null);
    const id = useId();
    const descriptionId = `${id}-description`;
    const handleOpen = () => {
        if (timeoutRef.current)
            window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setOpen(true), delayDuration);
    };
    const handleClose = () => {
        if (timeoutRef.current)
            window.clearTimeout(timeoutRef.current);
        setOpen(false);
    };
    // ioiti-ui: nothing to say, nothing shown: a field can stay wrapped while its hint comes and goes (rewrapped, it would lose the focus).
    const empty = content === null || content === undefined || content === false || content === '';
    const isOpen = (open || forceOpen) && !empty;
    // ioiti-ui: measured once drawn, then placed before it is painted (kept where it was while it fades out).
    useLayoutEffect(() => {
        if (!isOpen)
            return;
        const trigger = triggerRef.current;
        const box = boxRef.current;
        if (!trigger || !box)
            return;
        setPlace(placement(trigger.getBoundingClientRect(), { width: box.offsetWidth, height: box.offsetHeight }, side, align, offset));
    }, [isOpen, side, align, offset, content]);
    // ioiti-ui: a tap elsewhere, Escape, or the page scrolling hides it.
    useEffect(() => {
        if (!open)
            return;
        const outside = (event) => {
            if (!triggerRef.current?.contains(event.target))
                handleClose();
        };
        const escape = (event) => {
            if (event.key === 'Escape')
                handleClose();
        };
        document.addEventListener('pointerdown', outside);
        document.addEventListener('keydown', escape);
        window.addEventListener('scroll', handleClose, true);
        return () => {
            document.removeEventListener('pointerdown', outside);
            document.removeEventListener('keydown', escape);
            window.removeEventListener('scroll', handleClose, true);
        };
    }, [open]);
    useEffect(() => () => {
        if (timeoutRef.current)
            window.clearTimeout(timeoutRef.current);
    }, []);
    // Clone the trigger and wire ref + hover handlers
    const trigger = empty ? children : React.cloneElement(children, {
        ref: (node) => {
            triggerRef.current = node;
            // forward existing ref if any
            const existingRef = children.ref;
            if (typeof existingRef === 'function')
                existingRef(node);
            else if (existingRef && 'current' in existingRef) {
                existingRef.current = node;
            }
        },
        onMouseEnter: (e) => {
            handleOpen();
            children.props.onMouseEnter?.(e);
        },
        onMouseLeave: (e) => {
            handleClose();
            children.props.onMouseLeave?.(e);
        },
        onFocus: (e) => {
            handleOpen();
            children.props.onFocus?.(e);
        },
        onBlur: (e) => {
            handleClose();
            children.props.onBlur?.(e);
        },
        // ioiti-ui: a tap shows it, or hides it again: a phone has no hover.
        onPointerDown: (e) => {
            if (e.pointerType === 'touch') {
                if (timeoutRef.current)
                    window.clearTimeout(timeoutRef.current);
                setOpen((current) => !current);
            }
            children.props.onPointerDown?.(e);
        },
        // ioiti-ui: described for screen readers whether it shows or not (it shows after a delay).
        'aria-describedby': [children.props['aria-describedby'], descriptionId].filter(Boolean).join(' '),
    });
    const offsetT = sideTransform[place?.side ?? side];
    return (_jsxs("span", { className: cn('relative inline-flex', wrapperClassName), children: [trigger, !empty && (_jsx("span", { id: descriptionId, className: "sr-only", children: content })), typeof document !== 'undefined' &&
                createPortal(_jsx(AnimatePresence, { children: isOpen && (_jsxs(motion.div, { ref: boxRef, id: id, role: "tooltip", "aria-hidden": "true", initial: { opacity: 0, scale: 0.94, x: offsetT.x, y: offsetT.y }, animate: { opacity: 1, scale: 1, x: 0, y: 0 }, exit: { opacity: 0, scale: 0.96, x: offsetT.x * 0.5, y: offsetT.y * 0.5 }, transition: motionTransitions.springSnappy, 
                        // ioiti-ui: long hints wrap, within the screen; glass under the glass material (glass-float).
                        className: cn('fixed z-[60] w-max max-w-[min(20rem,calc(100vw-1rem))] whitespace-normal rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-elevated)] px-2.5 py-1.5 text-xs leading-relaxed pointer-events-none glass-float', className), style: place ? { left: place.left, top: place.top } : { left: -9999, top: -9999 }, children: [content, showArrow && (_jsx("span", { "aria-hidden": "true", className: cn('absolute w-2 h-2 border-4', arrowStyles[place?.side ?? side].position), style: {
                                    [arrowStyles[place?.side ?? side].borderColorSide]: 'var(--border)',
                                    ...(place ? (place.side === 'top' || place.side === 'bottom' ? { left: place.arrow } : { top: place.arrow }) : {}),
                                } }))] })) }), document.body)] }));
};
