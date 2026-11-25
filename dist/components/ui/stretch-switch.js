'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useId, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
// ioiti-ui: held by its caller or by itself, as every control (useControllableState).
import { useControllableState } from '../../lib/controllable.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
// ioiti-ui: what a Field or a FormItem around it tells it (its id, what describes it, whether it is wrong).
import { invalidOf } from '../../lib/field-border.js';
import { joinIds, useFieldControl } from '../field-context.js';
// ioiti-ui: the `data-*` attributes it is given, on its outermost element.
import { dataAttributes } from '../../lib/data-attributes.js';
// ioiti-ui: deprecated (0.31.0) for the form's Switch, which takes the same props (SwitchProps): said once, in development.
import { deprecated } from '../../lib/deprecated.js';
const TRACK_WIDTH = 36; // px (w-9)
const THUMB_SIZE = 14; // px (h-3.5 w-3.5)
const TRACK_PADDING = 2; // px-0.5
// ioiti-ui: the track's 1 px border is inside its 36 px (border-box): left out, the thumb went 2 px too far when on,
// against the track's edge, where off it stood 3 px from it.
const TRACK_BORDER = 1;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - (TRACK_PADDING + TRACK_BORDER) * 2;
/**
 * StretchSwitch — Thumb stretches slightly while dragging/pressing,
 * then snaps naturally to its destination.
 *
 * Implementation: while pressing, the thumb is allowed to grow horizontally
 * (scaleX > 1) and slightly vertically (scaleY < 1) so it looks "stretched".
 * On release, the spring (springSnappy) handles the snap to the new x.
 *
 * ioiti-ui: the switch is named by its label and described by its description, so
 * that a screen reader says which setting it is and not only "switch, on".
 *
 * @deprecated Use `Switch`, the form's, which takes the same props and is drawn as the design's switch. Removed in 1.0.
 */
export const StretchSwitch = ({ checked, defaultChecked = false, disabled = false, onChange, label, description, className, id: givenId, name, value = 'on', required, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ref, ...rest }) => {
    // ioiti-ui: deprecated for the form's Switch, said once in development.
    deprecated('stretch-switch-component');
    const [current, setCurrent] = useControllableState(checked, defaultChecked, onChange);
    const id = useId();
    // ioiti-ui: named and described from outside too (`aria-*`, a Field or a FormItem around it), its id from a
    // FormItem, whose FormLabel then names it; it could take none of them.
    const control = useFieldControl({
        id: givenId,
        describedBy: joinIds(description ? `${id}-description` : null, describedBy),
        invalid: invalidOf(undefined, ariaInvalid),
    });
    const x = useMotionValue(current ? TRAVEL : 0);
    const [isPressed, setIsPressed] = useState(false);
    // Animate to the new x whenever current changes
    React.useEffect(() => {
        animate(x, current ? TRAVEL : 0, motionTransitions.springSnappy);
    }, [current, x]);
    // Stretch the thumb: while pressed, scaleX -> 1.18, scaleY -> 0.86 — looks stretched.
    const scaleX = useTransform(x, () => (isPressed ? 1.18 : 1));
    const scaleY = useTransform(x, () => (isPressed ? 0.86 : 1));
    const handleToggle = () => {
        if (disabled)
            return;
        setCurrent(!current);
    };
    return (_jsxs("div", { ...dataAttributes(rest), className: cn('flex items-center justify-between gap-4 select-none', 
        // ioiti-ui: disabled, its label and its control at half strength, its description whole: it says why (it was 2:1).
        disabled && 'cursor-not-allowed', className), children: [(label || description) && (_jsxs("div", { className: cn('text-left cursor-pointer', disabled && 'cursor-not-allowed'), onClick: (event) => {
                    // ioiti-ui: a label around the switch (a Field's) would pass this click on to it, turning it back.
                    event.preventDefault();
                    handleToggle();
                }, children: [label && (_jsx("div", { id: `${id}-label`, className: cn('text-sm font-medium text-foreground leading-tight', disabled && 'opacity-50'), children: label })), description && (_jsx("div", { id: `${id}-description`, className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: description }))] })), _jsx("button", { ref: ref, id: control.id, type: "button", role: "switch", "aria-checked": current, "aria-label": ariaLabel, "aria-labelledby": labelledBy ?? (label && !ariaLabel ? `${id}-label` : undefined), "aria-describedby": control.describedBy, "aria-invalid": control.invalid || undefined, "aria-required": required || undefined, disabled: disabled, onPointerDown: () => !disabled && setIsPressed(true), onPointerUp: () => setIsPressed(false), onPointerCancel: () => setIsPressed(false), onPointerLeave: () => setIsPressed(false), onClick: handleToggle, className: cn('relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus-ring', current
                    ? // ioiti-ui: on, in the accent under a theme that has one (accent:), its thumb on it.
                        'bg-primary border-primary accent:bg-brand accent:border-brand'
                    : 'bg-surface-raised border-border', disabled && 'cursor-not-allowed opacity-50'), style: { paddingInline: TRACK_PADDING }, children: _jsx(motion.span, { style: { x, scaleX, scaleY, width: THUMB_SIZE, height: THUMB_SIZE }, className: cn('pointer-events-none block my-auto rounded-full shadow-subtle origin-center', current ? 'bg-primary-foreground accent:bg-brand-foreground' : 'bg-muted-foreground') }) }), name && current ? _jsx("input", { type: "hidden", name: name, value: value, disabled: disabled }) : null] }));
};
