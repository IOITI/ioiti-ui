import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
import { cloneElement, useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnchoredLayer } from '../lib/anchor.js';
import { useControllableState } from '../lib/controllable.js';
import { motionTransitions } from '../lib/motion-tokens.js';
import { assignRef } from '../lib/refs.js';
import { cn } from '../lib/utils.js';
/** The direction it comes from: a few pixels from its trigger's side. */
const FROM = { bottom: { y: -4 }, top: { y: 4 }, left: { x: 4 }, right: { x: -4 } };
/**
 * A panel that opens beside a button: filters, a few settings, a form of one field. In `document.body`, out
 * of every parent that would cut it, beside its button where the window has room; the focus goes into it,
 * and Escape, a Tab past its ends or a press elsewhere closes it and gives the focus back. Not modal: the
 * page stays in use. For a list of actions, `DropdownMenu`; for what asks for a decision, `SettleModal`.
 */
export function Popover({ trigger, children, label, open, defaultOpen = false, onOpenChange, side = 'bottom', align = 'start', width = 'auto', className, }) {
    const [shown, setShown] = useControllableState(open, defaultOpen, onOpenChange);
    const id = useId();
    const triggerRef = useRef(null);
    const layerRef = useRef(null);
    const close = () => setShown(false);
    const layer = useAnchoredLayer({ open: shown, onClose: close, triggerRef, layerRef, side, align });
    // As wide as its trigger, read as it opens.
    const [triggerWidth, setTriggerWidth] = useState();
    useLayoutEffect(() => {
        if (shown && width === 'trigger')
            setTriggerWidth(triggerRef.current?.offsetWidth);
    }, [shown, width]);
    const props = trigger.props;
    const ownRef = props.ref;
    // Its own ref keeps the trigger too.
    const setRef = useCallback((element) => {
        triggerRef.current = element;
        assignRef(ownRef, element);
    }, [ownRef]);
    // A ref callback, which React calls once the trigger is drawn, not while it draws it.
    // oxlint-disable-next-line react/refs
    const opener = cloneElement(trigger, {
        ref: setRef,
        'aria-expanded': shown,
        'aria-haspopup': 'dialog',
        'aria-controls': shown ? id : undefined,
        onClick: (event) => {
            props.onClick?.(event);
            if (!event.defaultPrevented)
                setShown(!shown);
        },
        onKeyDown: (event) => {
            props.onKeyDown?.(event);
            layer.onTriggerKeyDown(event);
        },
        // A hint on its trigger says what it opens: silent while it is open (LookPicker's way).
        ...('hint' in props && shown ? { hint: '' } : {}),
    });
    const widthStyle = width === 'trigger' ? { width: triggerWidth } : typeof width === 'number' ? { width } : { minWidth: 192 };
    const from = FROM[layer.side];
    return (_jsxs(_Fragment, { children: [opener, typeof document !== 'undefined' &&
                createPortal(_jsx(AnimatePresence, { children: shown && (_jsx(motion.div, { ref: layerRef, 
                        // Moved as the page scrolls, it takes what animates its layout in it (a SegmentedControl's
                        // fill) along at once: measured from it, not from the window, where it trailed after it. A
                        // root goes to its own new place at once.
                        layout: true, layoutRoot: true, id: id, role: "dialog", "aria-label": label, tabIndex: -1, onKeyDown: layer.onLayerKeyDown, style: { ...layer.style, ...widthStyle }, initial: { opacity: 0, scale: 0.97, ...from }, animate: { opacity: 1, scale: 1, x: 0, y: 0 }, exit: { opacity: 0, scale: 0.98, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, className: cn('z-50 overflow-auto rounded-xl border border-border bg-surface p-3 text-sm text-text-primary shadow-lg outline-none glass-float', className), children: typeof children === 'function' ? children(close) : children })) }), document.body)] }));
}
