import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useId, useRef } from 'react';
import { useControllableState } from '../lib/controllable.js';
import { dataAttributes } from '../lib/data-attributes.js';
import { invalidOf } from '../lib/field-border.js';
import { motionTransitions } from '../lib/motion-tokens.js';
import { DISABLED } from '../lib/recipes.js';
import { cn } from '../lib/utils.js';
import { useFieldControl } from './field-context.js';
// The control 32px (sm) or 40px (md) tall, as a button of its size: each segment that less the track's padding (2px)
// and its border (1px), above and below.
const SIZE = {
    sm: 'h-6.5 px-2.5 text-sm [&_svg]:size-3.5',
    md: 'h-8.5 px-3 text-sm [&_svg]:size-4',
};
/**
 * Two to five choices shown at once, one of them chosen, in one bar: the chosen one filled as a primary
 * button is (in the accent, where the look has one), the fill sliding to the next. The arrow keys move
 * and choose, as in a radio group. For a page's sections, `Tabs`; for a longer list, a `Select`.
 */
export function SegmentedControl({ options, value, defaultValue, onChange, label, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, id, name, size = 'md', fullWidth = false, role = 'radiogroup', className, ref, ...rest }) {
    const [chosen, choose] = useControllableState(value, defaultValue, onChange);
    const pill = useId();
    const ownName = ariaLabel ?? label;
    // Named, described and marked by a Field or a FormItem around it too, its own props first: by its label's words
    // (aria-labelledby: a label names no group), the label pointing to the group's id, so that it names no segment.
    const control = useFieldControl({
        id,
        fallbackId: pill,
        labelledBy,
        named: Boolean(ownName),
        describedBy,
        invalid: invalidOf(undefined, ariaInvalid),
    });
    const buttons = useRef([]);
    const enabled = options.map((option, index) => (option.disabled ? -1 : index)).filter((index) => index >= 0);
    const chosenIndex = options.findIndex((option) => option.value === chosen);
    // The one stop of the keyboard: the chosen segment, or the first that can be chosen.
    const stop = chosenIndex >= 0 && !options[chosenIndex].disabled ? chosenIndex : enabled[0];
    const tabs = role === 'tablist';
    const moveTo = (index) => {
        choose(options[index].value);
        buttons.current[index]?.focus();
    };
    const onKeyDown = (event, index) => {
        const at = enabled.indexOf(index);
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
        let next;
        if (step !== undefined)
            next = enabled[(at + step + enabled.length) % enabled.length];
        else if (event.key === 'Home')
            next = enabled[0];
        else if (event.key === 'End')
            next = enabled[enabled.length - 1];
        if (next === undefined)
            return;
        event.preventDefault();
        moveTo(next);
    };
    return (_jsxs("div", { ref: ref, ...dataAttributes(rest), role: role, id: control.id, "aria-label": ownName, "aria-labelledby": control.labelledBy, "aria-describedby": control.describedBy, "aria-invalid": control.invalid || undefined, "aria-orientation": tabs ? 'horizontal' : undefined, className: cn('items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5', fullWidth ? 'flex w-full' : 'inline-flex', className), children: [options.map((option, index) => {
                const on = index === chosenIndex;
                return (_jsxs("button", { ref: (element) => {
                        buttons.current[index] = element;
                    }, type: "button", role: tabs ? 'tab' : 'radio', "aria-checked": tabs ? undefined : on, "aria-selected": tabs ? on : undefined, "aria-controls": tabs ? option.panelId : undefined, tabIndex: index === stop ? 0 : -1, disabled: option.disabled, onClick: () => choose(option.value), onKeyDown: (event) => onKeyDown(event, index), className: cn(
                    // The text takes its colour as the fill slides under it, not before it arrives.
                    'relative inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors motion-safe:duration-300 motion-safe:ease-soft', DISABLED, SIZE[size], fullWidth && 'flex-1', on
                        ? 'text-primary-foreground accent:text-brand-fill-foreground'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-foreground'), children: [on && (_jsx(motion.span, { layoutId: pill, 
                            // Slides when the choice changes, only: a resize (the sheet it is in, dragged) moves it with
                            // its segment, where a spring had it trail behind.
                            layoutDependency: chosen, "aria-hidden": true, className: "absolute inset-0 rounded-md bg-primary shadow-subtle accent:bg-brand accent:bg-(image:--brand-fill)", transition: motionTransitions.springMorph })), _jsxs("span", { className: "relative inline-flex items-center gap-1.5", children: [option.icon, option.label] })] }, option.value));
            }), name && chosen !== undefined && _jsx("input", { type: "hidden", name: name, value: chosen })] }));
}
