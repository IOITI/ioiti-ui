import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
const EDGE = 8;
const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const clamp = (value, low, high) => Math.min(Math.max(value, low), Math.max(low, high));
/** Where a box goes beside a rectangle: on its side where there is room, on the other where there is more. */
export function placeBeside(anchor, box, side = 'bottom', align = 'start', offset = 6, view = { width: window.innerWidth, height: window.innerHeight }) {
    const room = {
        top: anchor.top - EDGE,
        bottom: view.height - anchor.bottom - EDGE,
        left: anchor.left - EDGE,
        right: view.width - anchor.right - EDGE,
    };
    const vertical = side === 'top' || side === 'bottom';
    const needed = (vertical ? box.height : box.width) + offset;
    const chosen = room[side] >= needed || room[OPPOSITE[side]] <= room[side] ? side : OPPOSITE[side];
    if (chosen === 'top' || chosen === 'bottom') {
        const height = Math.min(box.height, room[chosen] - offset);
        const left = align === 'start' ? anchor.left : align === 'end' ? anchor.right - box.width : anchor.left + anchor.width / 2 - box.width / 2;
        return {
            side: chosen,
            top: chosen === 'bottom' ? anchor.bottom + offset : anchor.top - offset - height,
            left: clamp(left, EDGE, view.width - box.width - EDGE),
            maxHeight: Math.max(room[chosen] - offset, 0),
        };
    }
    const top = align === 'start' ? anchor.top : align === 'end' ? anchor.bottom - box.height : anchor.top + anchor.height / 2 - box.height / 2;
    return {
        side: chosen,
        top: clamp(top, EDGE, view.height - box.height - EDGE),
        left: chosen === 'right' ? anchor.right + offset : anchor.left - offset - box.width,
        maxHeight: Math.max(view.height - EDGE * 2, 0),
    };
}
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
/** The controls the keyboard reaches in an element, in order. */
export function focusables(root) {
    return Array.from(root.querySelectorAll(FOCUSABLE)).filter((element) => element.tabIndex >= 0);
}
/**
 * Places a layer beside its trigger (or a point) and keeps it there, and gives it its keys: Escape closes
 * it, a Tab past its ends closes it and goes back to the trigger, a press elsewhere closes it. Returns the
 * layer's style (hidden until placed) and the handlers for the layer's and the trigger's keys.
 */
export function useAnchoredLayer({ open, onClose, triggerRef, layerRef, point, side = 'bottom', align = 'start', offset = 6, focus = 'move', initialFocus, }) {
    const [place, setPlace] = useState(null);
    const onCloseRef = useRef(onClose);
    const initialFocusRef = useRef(initialFocus);
    useEffect(() => {
        onCloseRef.current = onClose;
        initialFocusRef.current = initialFocus;
    });
    const anchorRect = useCallback(() => {
        if (point)
            return { top: point.y, bottom: point.y, left: point.x, right: point.x, width: 0, height: 0 };
        return triggerRef.current?.getBoundingClientRect() ?? null;
    }, [point, triggerRef]);
    const measure = useCallback(() => {
        const anchor = anchorRect();
        const layer = layerRef.current;
        if (!anchor || !layer)
            return;
        setPlace(placeBeside(anchor, { width: layer.offsetWidth, height: layer.scrollHeight }, side, align, offset));
    }, [anchorRect, layerRef, side, align, offset]);
    // Placed before the browser paints it, once it is drawn to be measured. Closed, it keeps its place:
    // it leaves from where it was.
    useLayoutEffect(() => {
        if (open)
            measure();
    }, [open, measure]);
    // The focus goes in once it is placed.
    const placed = place !== null;
    useEffect(() => {
        if (!open || !placed || focus !== 'move' || !layerRef.current)
            return;
        const target = initialFocusRef.current?.() ?? focusables(layerRef.current)[0] ?? layerRef.current;
        target.focus();
    }, [open, placed, focus, layerRef]);
    useEffect(() => {
        if (!open)
            return;
        const inside = (target) => target instanceof Node && (!!layerRef.current?.contains(target) || !!triggerRef.current?.contains(target));
        const pointerDown = (event) => {
            if (!inside(event.target))
                onCloseRef.current('outside');
        };
        // It follows: a scroll (not its own) or a new size moves it, never closes it.
        const scroll = (event) => {
            if (!(event.target instanceof Node && layerRef.current?.contains(event.target)))
                measure();
        };
        document.addEventListener('pointerdown', pointerDown);
        window.addEventListener('scroll', scroll, true);
        window.addEventListener('resize', measure);
        return () => {
            document.removeEventListener('pointerdown', pointerDown);
            window.removeEventListener('scroll', scroll, true);
            window.removeEventListener('resize', measure);
        };
    }, [open, measure, layerRef, triggerRef]);
    const close = (reason) => {
        onCloseRef.current(reason);
        if (focus === 'move')
            triggerRef.current?.focus();
    };
    /** On the layer: Escape closes it; a Tab past its ends goes back to the trigger. Neither reaches what is around it. */
    const onLayerKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            close('escape');
            return;
        }
        if (event.key !== 'Tab' || !layerRef.current)
            return;
        // Its own: a dialog's trap around it would pull the focus back into the dialog.
        event.stopPropagation();
        const stops = focusables(layerRef.current);
        const leaving = stops.length === 0 ||
            (event.shiftKey ? document.activeElement === stops[0] : document.activeElement === stops[stops.length - 1]);
        if (leaving) {
            event.preventDefault();
            close('tab');
        }
    };
    /** On the trigger, while the layer is open: Escape closes the layer, not what is around it. */
    const onTriggerKeyDown = (event) => {
        if (!open || event.key !== 'Escape')
            return;
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current('escape');
    };
    const style = place
        ? { position: 'fixed', top: place.top, left: place.left, maxHeight: place.maxHeight }
        : { position: 'fixed', top: -9999, left: -9999, visibility: 'hidden' };
    return { style, side: place?.side ?? side, placed, measure, onLayerKeyDown, onTriggerKeyDown };
}
