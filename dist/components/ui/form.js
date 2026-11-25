'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { forwardRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle, Eye, EyeOff } from 'lucide-react';
// ioiti-ui: a choice and a switch held by their caller or by themselves, as every control (useControllableState).
import { useControllableState } from '../../lib/controllable.js';
import { fieldBorder, invalidOf } from '../../lib/field-border.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { DISABLED } from '../../lib/recipes.js';
// ioiti-ui: the units inside a field, measured as they change.
import { useUnitPadding } from '../../lib/unit-padding.js';
// ioiti-ui: what a FormItem (or a Field) tells the control in it: its id, what describes it, whether it is wrong.
import { besideId, FieldContext, joinIds, markControl, useFieldContext, useFieldControl, useFieldPart, useFieldPartId, useFormItemField, } from '../field-context.js';
// ioiti-ui: the password toggle's words in the provider's language (`field`).
import { useMessages } from '../locale-context.js';
// ioiti-ui: the `data-*` attributes a control is given, on its outermost element, as an element takes them.
import { dataAttributes } from '../../lib/data-attributes.js';
export const Form = forwardRef(({ className, onSubmit, ...props }, ref) => (_jsx("form", { ref: ref, onSubmit: onSubmit, className: cn('space-y-4 w-full', className), noValidate: true, ...props })));
Form.displayName = 'Form';
// ioiti-ui: the item links its parts, which EasyUI's left apart: its label names its control (one id for it, the id
// of a Field around it if any), its description and its message describe it, and a message under it (or its `error`)
// marks it invalid. Its `error` is no longer an attribute of the `div`.
export const FormItem = forwardRef(({ className, error, ...props }, ref) => {
    const field = useFormItemField(error);
    return (_jsx(FieldContext.Provider, { value: field, children: _jsx("div", { ref: ref, className: cn('space-y-1.5 w-full', className), ...props }) }));
});
FormItem.displayName = 'FormItem';
export const FormLabel = forwardRef(({ className, required, children, htmlFor, id, ...props }, ref) => {
    // ioiti-ui: it names its FormItem's control by the id the control is drawn with, its own or the item's, unless
    // given `htmlFor` (EasyUI's named nothing without it); no `for` while no control says it is there, so that a label
    // around a control of its own still names that one.
    const field = useFieldContext();
    // ioiti-ui: its id (its own in a FormItem, unless given one) names, by `aria-labelledby`, a control a label cannot
    // name: a group of radios, a slider.
    const ownId = useFieldPartId('label', id);
    return (_jsxs("label", { ref: ref, id: ownId, htmlFor: htmlFor ?? field?.controlId, className: cn('block text-xs font-semibold text-foreground select-none', className), ...props, children: [children, required && _jsx("span", { className: "text-negative ml-1", "aria-hidden": "true", children: "*" })] }));
});
FormLabel.displayName = 'FormLabel';
export const FormControl = forwardRef(({ className, children, ...props }, ref) => {
    // ioiti-ui: its control, one from elsewhere too (which cannot read its FormItem), is given the item's id where it
    // has none, what describes it (`aria-describedby`) and `aria-invalid`; the package's read them from the item as
    // well, each id once. A `div` that only holds the control is given nothing: what it holds reads the item.
    const field = useFieldContext();
    useFieldPart('held', besideId(children, field));
    return (_jsx("div", { ref: ref, className: cn('relative', className), ...props, children: markControl(children, field, { beside: true }) }));
});
FormControl.displayName = 'FormControl';
export const FormDescription = forwardRef(({ className, id, ...props }, ref) => {
    // ioiti-ui: its id (its own in a FormItem, unless given one) describes its FormItem's control.
    const ownId = useFieldPartId('description', id);
    return (_jsx("p", { ref: ref, id: ownId, className: cn('text-xs text-muted-foreground leading-relaxed', className), ...props }));
});
FormDescription.displayName = 'FormDescription';
export const FormMessage = forwardRef(({ className, error, children, id, ...props }, ref) => {
    const message = error || children;
    // ioiti-ui: while it says something, its id (its own in a FormItem, unless given one) describes its FormItem's
    // control, which it marks invalid; once it is gone, neither.
    const ownId = useFieldPartId('message', id, Boolean(message));
    return (_jsx(AnimatePresence, { children: message ? (_jsx(motion.div, { initial: { opacity: 0, y: -4, height: 0 }, animate: { opacity: 1, y: 0, height: 'auto' }, exit: { opacity: 0, y: -4, height: 0 }, transition: motionTransitions.springSnappy, className: "overflow-hidden", children: _jsxs("p", { ref: ref, id: ownId, role: "alert", className: cn('text-xs text-negative flex items-center gap-1.5 pt-0.5 font-medium', className), ...props, children: [_jsx(AlertCircle, { className: "size-3 shrink-0" }), _jsx("span", { children: message })] }) })) : null }));
});
FormMessage.displayName = 'FormMessage';
export const Input = forwardRef(({ className, type = 'text', leftIcon, rightIcon, error, showPasswordToggle = false, disabled, prefix, suffix, style, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    // ioiti-ui: the toggle's name in the provider's language.
    const words = useMessages().field;
    // ioiti-ui: in error by its own prop, or marked invalid (a Field around it); its id, its description and its
    // error from a FormItem or a Field around it too.
    const control = useFieldControl({
        id: props.id,
        describedBy: props['aria-describedby'],
        invalid: invalidOf(error, props['aria-invalid']),
    });
    const invalid = control.invalid;
    const computedType = isPassword && showPassword ? 'text' : type;
    // ioiti-ui: the units inside the field, measured (again whenever their size changes: 16px on a phone, 14px from
    // 640px), the text keeping clear of them; each describes the field.
    const unitId = React.useId();
    const before = React.useRef(null);
    const after = React.useRef(null);
    const pad = useUnitPadding(before, after, [prefix, suffix]);
    const describedBy = joinIds(control.describedBy, prefix ? `${unitId}-prefix` : null, suffix ? `${unitId}-suffix` : null);
    return (_jsxs("div", { className: "relative w-full flex items-center", children: [leftIcon && (_jsx("div", { className: "absolute left-3 text-muted-foreground pointer-events-none flex items-center justify-center", children: leftIcon })), prefix && (_jsx("span", { ref: before, id: `${unitId}-prefix`, "aria-hidden": true, className: "absolute left-0 flex h-full items-center pl-3.5 pr-1.5 text-base sm:text-sm text-muted-foreground pointer-events-none", children: prefix })), _jsx("input", { ref: ref, type: computedType, disabled: disabled, className: cn('w-full h-10 px-3.5 text-base sm:text-sm text-foreground placeholder:text-text-subtle bg-surface rounded-lg border transition-colors duration-150', 
                // ioiti-ui: its border, or the error's (never both: the error's lost to the dark ones); in focus, in
                // the accent under a theme that has one (accent:).
                fieldBorder(invalid), 'focus:outline-none focus-ring', leftIcon && 'pl-9', (rightIcon || (isPassword && showPasswordToggle)) && 'pr-9', DISABLED, className), ...props, id: control.id, "aria-invalid": invalid || undefined, "aria-describedby": describedBy, style: { ...(prefix && pad.left ? { paddingLeft: pad.left } : {}), ...(suffix && pad.right ? { paddingRight: pad.right } : {}), ...style } }), suffix && (_jsx("span", { ref: after, id: `${unitId}-suffix`, "aria-hidden": true, className: "absolute right-0 flex h-full items-center pl-1.5 pr-3.5 text-base sm:text-sm text-muted-foreground pointer-events-none", children: suffix })), isPassword && showPasswordToggle ? (_jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), tabIndex: -1, "aria-label": showPassword ? words.hidePassword : words.showPassword, className: "absolute right-3 text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md cursor-pointer", children: showPassword ? (_jsx(EyeOff, { className: "size-4" })) : (_jsx(Eye, { className: "size-4" })) })) : (rightIcon && (_jsx("div", { className: "absolute right-3 text-muted-foreground pointer-events-none flex items-center justify-center", children: rightIcon })))] }));
});
Input.displayName = 'Input';
export const Textarea = forwardRef(({ className, error, disabled, ...props }, ref) => {
    // ioiti-ui: its id, its description and its error from a FormItem or a Field around it too, as the Input's.
    const control = useFieldControl({
        id: props.id,
        describedBy: props['aria-describedby'],
        invalid: invalidOf(error, props['aria-invalid']),
    });
    const invalid = control.invalid;
    return (_jsx("textarea", { ref: ref, disabled: disabled, className: cn('w-full min-h-[90px] px-3.5 py-3 text-base sm:text-sm text-foreground placeholder:text-text-subtle bg-surface rounded-lg border transition-colors duration-150 resize-y', 
        // ioiti-ui: its border, or the error's, as the Input's.
        fieldBorder(invalid), 'focus:outline-none focus-ring leading-relaxed', DISABLED, className), ...props, id: control.id, "aria-invalid": invalid || undefined, "aria-describedby": control.describedBy }));
});
Textarea.displayName = 'Textarea';
export const Select = forwardRef(({ className, options = [], children, error, disabled, ...props }, ref) => {
    // ioiti-ui: its id, its description and its error from a FormItem or a Field around it too, as the Input's.
    const control = useFieldControl({
        id: props.id,
        describedBy: props['aria-describedby'],
        invalid: invalidOf(error, props['aria-invalid']),
    });
    const invalid = control.invalid;
    return (_jsxs("div", { className: "relative w-full flex items-center", children: [_jsx("select", { ref: ref, disabled: disabled, className: cn('w-full h-10 pl-3.5 pr-8 text-base sm:text-sm text-foreground bg-surface rounded-lg border appearance-none transition-colors duration-150 cursor-pointer', 
                // ioiti-ui: its border, or the error's, as the Input's.
                fieldBorder(invalid), 'focus:outline-none focus-ring', DISABLED, className), ...props, id: control.id, "aria-invalid": invalid || undefined, "aria-describedby": control.describedBy, children: options.length > 0
                    ? options.map((opt) => (_jsx("option", { value: opt.value, disabled: opt.disabled, className: "bg-surface text-foreground", children: opt.label }, opt.value)))
                    : children }), _jsx("div", { className: "absolute right-3 text-muted-foreground pointer-events-none flex items-center justify-center", children: _jsx(ChevronDown, { className: "size-4" }) })] }));
});
Select.displayName = 'Select';
export const RadioGroup = ({ name, value, defaultValue, options = [], onChange, className, children, id, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ref, ...rest }) => {
    const [current, handleSelect] = useControllableState(value, defaultValue || '', onChange);
    // ioiti-ui: named, described and marked by a Field or a FormItem around it too: by its label's words
    // (aria-labelledby: a label names no group), the label pointing to the group's id, so that it names no radio of it.
    const groupId = useId();
    const control = useFieldControl({
        id,
        fallbackId: groupId,
        labelledBy,
        named: Boolean(ariaLabel),
        describedBy,
        invalid: invalidOf(undefined, ariaInvalid),
    });
    return (_jsx("div", { ref: ref, role: "radiogroup", id: control.id, "aria-label": ariaLabel, "aria-labelledby": control.labelledBy, "aria-describedby": control.describedBy, "aria-invalid": control.invalid || undefined, ...dataAttributes(rest), className: cn('space-y-2', className), children: options.length > 0
            ? options.map((opt) => (_jsx(RadioGroupItem, { name: name, value: opt.value, checked: current === opt.value, disabled: opt.disabled, onChange: () => handleSelect(opt.value), label: opt.label, description: opt.description }, opt.value)))
            : children }));
};
export const RadioGroupItem = ({ name, value, checked = false, disabled = false, onChange, label, description, className, }) => {
    const id = useId();
    return (_jsxs("div", { className: cn('flex items-start gap-2.5 select-none', disabled && 'opacity-50 cursor-not-allowed', className), children: [_jsxs("div", { className: "relative flex items-center justify-center mt-0.5", children: [_jsx("input", { id: id, type: "radio", name: name, value: value, checked: checked, disabled: disabled, onChange: onChange, 
                        // ioiti-ui: the input lies over the circle, transparent, and takes its clicks and the design's focus ring,
                        // as the checkbox's: EasyUI's was `sr-only`, which hid the ring, so a keyboard saw no focus at all.
                        className: "peer absolute inset-0 m-0 appearance-none rounded-full bg-transparent cursor-pointer disabled:cursor-not-allowed" }), _jsx("div", { "aria-hidden": true, className: cn('size-4 rounded-full border flex items-center justify-center transition-colors duration-150 cursor-pointer pointer-events-none', checked
                            ? 'border-foreground bg-surface accent:border-brand'
                            : 'border-border bg-surface hover:border-border-hover', disabled && 'cursor-not-allowed'), children: checked && (_jsx(motion.div, { layoutId: `radio-dot-${name}`, className: "size-2 rounded-full bg-foreground accent:bg-brand", transition: motionTransitions.springSnappy })) })] }), (label || description) && (_jsxs("label", { htmlFor: id, className: "cursor-pointer text-left", children: [label && (_jsx("div", { className: "text-sm font-medium text-foreground leading-tight", children: label })), description && (_jsx("div", { className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: description }))] }))] }));
};
export const Switch = ({ checked, defaultChecked = false, disabled = false, onChange, label, description, className, id: givenId, name, value = 'on', required, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ref, ...rest }) => {
    const [current, setCurrent] = useControllableState(checked, defaultChecked, onChange);
    // ioiti-ui: named by its label and described by its description, as StretchSwitch: a screen reader said only
    // "switch, on".
    const id = useId();
    // ioiti-ui: named and described from outside too (`aria-*`, a Field or a FormItem around it), its id from a
    // FormItem, whose FormLabel then names it; it could take none of them.
    const control = useFieldControl({
        id: givenId,
        describedBy: joinIds(description ? `${id}-description` : null, describedBy),
        invalid: invalidOf(undefined, ariaInvalid),
    });
    const handleToggle = () => {
        if (disabled)
            return;
        setCurrent(!current);
    };
    return (_jsxs("div", { ...dataAttributes(rest), className: cn('flex items-center justify-between gap-4 select-none', disabled && 'cursor-not-allowed', className), children: [(label || description) && (_jsxs("div", { className: "text-left cursor-pointer", onClick: (event) => {
                    // ioiti-ui: a label around the switch (a Field's) would pass this click on to it, turning it back.
                    event.preventDefault();
                    handleToggle();
                }, children: [label && (_jsx("div", { id: `${id}-label`, className: cn('text-sm font-medium text-foreground leading-tight', disabled && 'opacity-50'), children: label })), description && (_jsx("div", { id: `${id}-description`, className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: description }))] })), _jsx("button", { ref: ref, id: control.id, type: "button", role: "switch", "aria-checked": current, "aria-label": ariaLabel, "aria-labelledby": labelledBy ?? (label && !ariaLabel ? `${id}-label` : undefined), "aria-describedby": control.describedBy, "aria-invalid": control.invalid || undefined, "aria-required": required || undefined, disabled: disabled, onClick: handleToggle, className: cn('relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus-ring', current
                    ? 'bg-primary border-primary accent:bg-brand accent:border-brand'
                    : 'bg-surface border-border', disabled && 'cursor-not-allowed opacity-50'), children: _jsx(motion.span
                // ioiti-ui: 2 px from either end of the track's 34 px inside its border (it stopped 4 px short when on).
                , { 
                    // ioiti-ui: 2 px from either end of the track's 34 px inside its border (it stopped 4 px short when on).
                    animate: { x: current ? 18 : 2 }, transition: motionTransitions.springSnappy, className: cn('pointer-events-none block size-3.5 my-auto top-0 bottom-0 rounded-full shadow-subtle', current ? 'bg-primary-foreground accent:bg-brand-foreground' : 'bg-muted-foreground') }) }), name && current ? _jsx("input", { type: "hidden", name: name, value: value, disabled: disabled }) : null] }));
};
