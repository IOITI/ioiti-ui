'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { forwardRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
export const Form = forwardRef(({ className, onSubmit, ...props }, ref) => (_jsx("form", { ref: ref, onSubmit: onSubmit, className: cn('space-y-4 w-full', className), noValidate: true, ...props })));
Form.displayName = 'Form';
export const FormItem = forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn('space-y-1.5 w-full', className), ...props })));
FormItem.displayName = 'FormItem';
export const FormLabel = forwardRef(({ className, required, children, ...props }, ref) => (_jsxs("label", { ref: ref, className: cn('block text-xs font-medium text-neutral-900 dark:text-[#FAFAFA] select-none tracking-tight', className), ...props, children: [children, required && _jsx("span", { className: "text-red-700 dark:text-[#FF7A7A] ml-1", "aria-hidden": "true", children: "*" })] })));
FormLabel.displayName = 'FormLabel';
export const FormControl = forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn('relative', className), ...props })));
FormControl.displayName = 'FormControl';
export const FormDescription = forwardRef(({ className, ...props }, ref) => (_jsx("p", { ref: ref, className: cn('text-xs text-muted-foreground leading-relaxed', className), ...props })));
FormDescription.displayName = 'FormDescription';
export const FormMessage = forwardRef(({ className, error, children, ...props }, ref) => {
    const message = error || children;
    return (_jsx(AnimatePresence, { children: message ? (_jsx(motion.div, { initial: { opacity: 0, y: -4, height: 0 }, animate: { opacity: 1, y: 0, height: 'auto' }, exit: { opacity: 0, y: -4, height: 0 }, transition: motionTransitions.springSnappy, className: "overflow-hidden", children: _jsxs("p", { ref: ref, role: "alert", className: cn('text-xs text-red-700 dark:text-[#FF7A7A] flex items-center gap-1.5 pt-0.5 font-medium', className), ...props, children: [_jsx(AlertCircle, { className: "w-3 h-3 shrink-0" }), _jsx("span", { children: message })] }) })) : null }));
});
FormMessage.displayName = 'FormMessage';
export const Input = forwardRef(({ className, type = 'text', leftIcon, rightIcon, error, showPasswordToggle = false, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const computedType = isPassword && showPassword ? 'text' : type;
    return (_jsxs("div", { className: "relative w-full flex items-center", children: [leftIcon && (_jsx("div", { className: "absolute left-3 text-neutral-500 dark:text-[#525252] pointer-events-none flex items-center justify-center", children: leftIcon })), _jsx("input", { ref: ref, type: computedType, disabled: disabled, className: cn('w-full h-10 px-3.5 text-xs text-neutral-900 dark:text-[#FAFAFA] placeholder:text-muted-foreground bg-white dark:bg-[#141414] rounded-lg border transition-all duration-150', 'border-neutral-300 dark:border-[#1F1F1F] hover:border-neutral-500 dark:hover:border-[#4A4A4A]', 'focus:bg-white dark:focus:bg-[#141414] focus:border-neutral-500 dark:focus:border-[#4A4A4A] focus:outline-none focus-ring', leftIcon && 'pl-9', (rightIcon || (isPassword && showPasswordToggle)) && 'pr-9', error && 'border-rose-500/50 focus:border-rose-500', disabled && 'opacity-30 cursor-not-allowed bg-neutral-100 dark:bg-[#0E0E0E]', className), ...props }), isPassword && showPasswordToggle ? (_jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), tabIndex: -1, "aria-label": showPassword ? 'Hide password' : 'Show password', className: "absolute right-3 text-neutral-500 dark:text-[#525252] hover:text-neutral-900 dark:hover:text-[#FAFAFA] transition-colors focus-ring rounded cursor-pointer", children: showPassword ? (_jsx(EyeOff, { className: "w-3.5 h-3.5" })) : (_jsx(Eye, { className: "w-3.5 h-3.5" })) })) : (rightIcon && (_jsx("div", { className: "absolute right-3 text-neutral-500 dark:text-[#525252] pointer-events-none flex items-center justify-center", children: rightIcon })))] }));
});
Input.displayName = 'Input';
export const Textarea = forwardRef(({ className, error, disabled, ...props }, ref) => {
    return (_jsx("textarea", { ref: ref, disabled: disabled, className: cn('w-full min-h-[90px] p-3 text-xs text-neutral-900 dark:text-[#FAFAFA] placeholder:text-muted-foreground bg-white dark:bg-[#141414] rounded-lg border transition-all duration-150 resize-y', 'border-neutral-300 dark:border-[#1F1F1F] hover:border-neutral-500 dark:hover:border-[#4A4A4A]', 'focus:bg-white dark:focus:bg-[#141414] focus:border-neutral-500 dark:focus:border-[#4A4A4A] focus:outline-none focus-ring leading-relaxed', error && 'border-rose-500/50 focus:border-rose-500', disabled && 'opacity-30 cursor-not-allowed bg-neutral-100 dark:bg-[#0E0E0E]', className), ...props }));
});
Textarea.displayName = 'Textarea';
export const Select = forwardRef(({ className, options = [], children, error, disabled, ...props }, ref) => {
    return (_jsxs("div", { className: "relative w-full flex items-center", children: [_jsx("select", { ref: ref, disabled: disabled, className: cn('w-full h-10 pl-3.5 pr-8 text-xs text-neutral-900 dark:text-[#FAFAFA] bg-white dark:bg-[#141414] rounded-lg border appearance-none transition-all duration-150 cursor-pointer', 'border-neutral-300 dark:border-[#1F1F1F] hover:border-neutral-500 dark:hover:border-[#4A4A4A]', 'focus:bg-white dark:focus:bg-[#141414] focus:border-neutral-500 dark:focus:border-[#4A4A4A] focus:outline-none focus-ring', error && 'border-rose-500/50 focus:border-rose-500', disabled && 'opacity-30 cursor-not-allowed bg-neutral-100 dark:bg-[#0E0E0E]', className), ...props, children: options.length > 0
                    ? options.map((opt) => (_jsx("option", { value: opt.value, disabled: opt.disabled, className: "bg-white dark:bg-[#141414] text-neutral-900 dark:text-[#FAFAFA]", children: opt.label }, opt.value)))
                    : children }), _jsx("div", { className: "absolute right-3 text-neutral-500 dark:text-[#525252] pointer-events-none flex items-center justify-center", children: _jsx(ChevronDown, { className: "w-3.5 h-3.5" }) })] }));
});
Select.displayName = 'Select';
export const Checkbox = forwardRef(({ className, label, description, checked, defaultChecked, disabled, id, onChange, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false);
    const isControlled = checked !== undefined;
    const currentChecked = isControlled ? checked : isChecked;
    const handleChange = (e) => {
        if (!isControlled) {
            setIsChecked(e.target.checked);
        }
        if (onChange) {
            onChange(e);
        }
    };
    return (_jsxs("div", { className: cn('flex items-start gap-2.5 select-none', disabled && 'opacity-30 cursor-not-allowed', className), children: [_jsxs("div", { className: "relative flex items-center justify-center mt-0.5", children: [_jsx("input", { ref: ref, id: inputId, type: "checkbox", checked: currentChecked, disabled: disabled, onChange: handleChange, className: "peer sr-only", ...props }), _jsx("div", { onClick: (e) => {
                            if (!disabled) {
                                const input = document.getElementById(inputId);
                                if (input)
                                    input.click();
                            }
                            e.preventDefault();
                        }, className: cn('w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all duration-150 cursor-pointer focus-ring', currentChecked
                            ? 'bg-neutral-900 dark:bg-[#FAFAFA] border-neutral-900 dark:border-[#FAFAFA] text-white dark:text-[#050505]'
                            : 'bg-white dark:bg-[#141414] border-neutral-300 dark:border-[#1F1F1F] hover:border-neutral-500 dark:hover:border-[#4A4A4A]', disabled && 'cursor-not-allowed'), children: currentChecked && (_jsx(motion.div, { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0, opacity: 0 }, transition: motionTransitions.springSnappy, children: _jsx(Check, { className: "w-3 h-3 stroke-[3]" }) })) })] }), (label || description) && (_jsxs("label", { htmlFor: inputId, className: "cursor-pointer text-left", children: [label && (_jsx("div", { className: "text-xs font-medium text-neutral-900 dark:text-[#FAFAFA] leading-tight", children: label })), description && (_jsx("div", { className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: description }))] }))] }));
});
Checkbox.displayName = 'Checkbox';
export const RadioGroup = ({ name, value, defaultValue, options = [], onChange, className, children, }) => {
    const [selectedValue, setSelectedValue] = React.useState(defaultValue || '');
    const isControlled = value !== undefined;
    const current = isControlled ? value : selectedValue;
    const handleSelect = (val) => {
        if (!isControlled) {
            setSelectedValue(val);
        }
        if (onChange) {
            onChange(val);
        }
    };
    return (_jsx("div", { role: "radiogroup", className: cn('space-y-2', className), children: options.length > 0
            ? options.map((opt) => (_jsx(RadioGroupItem, { name: name, value: opt.value, checked: current === opt.value, disabled: opt.disabled, onChange: () => handleSelect(opt.value), label: opt.label, description: opt.description }, opt.value)))
            : children }));
};
export const RadioGroupItem = ({ name, value, checked = false, disabled = false, onChange, label, description, className, }) => {
    const id = useId();
    return (_jsxs("div", { className: cn('flex items-start gap-2.5 select-none', disabled && 'opacity-30 cursor-not-allowed', className), children: [_jsxs("div", { className: "relative flex items-center justify-center mt-0.5", children: [_jsx("input", { id: id, type: "radio", name: name, value: value, checked: checked, disabled: disabled, onChange: onChange, className: "peer sr-only" }), _jsx("div", { onClick: () => {
                            if (!disabled && onChange)
                                onChange();
                        }, className: cn('w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-150 cursor-pointer focus-ring', checked
                            ? 'border-neutral-900 dark:border-[#FAFAFA] bg-white dark:bg-[#141414]'
                            : 'border-neutral-300 dark:border-[#1F1F1F] bg-white dark:bg-[#141414] hover:border-neutral-500 dark:hover:border-[#4A4A4A]', disabled && 'cursor-not-allowed'), children: checked && (_jsx(motion.div, { layoutId: `radio-dot-${name}`, className: "w-2 h-2 rounded-full bg-neutral-900 dark:bg-[#FAFAFA]", transition: motionTransitions.springSnappy })) })] }), (label || description) && (_jsxs("label", { htmlFor: id, className: "cursor-pointer text-left", children: [label && (_jsx("div", { className: "text-xs font-medium text-neutral-900 dark:text-[#FAFAFA] leading-tight", children: label })), description && (_jsx("div", { className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: description }))] }))] }));
};
export const Switch = ({ checked, defaultChecked = false, disabled = false, onChange, label, description, className, }) => {
    const [isOn, setIsOn] = React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const current = isControlled ? checked : isOn;
    const handleToggle = () => {
        if (disabled)
            return;
        const next = !current;
        if (!isControlled) {
            setIsOn(next);
        }
        if (onChange) {
            onChange(next);
        }
    };
    return (_jsxs("div", { className: cn('flex items-center justify-between gap-4 select-none', disabled && 'opacity-30 cursor-not-allowed', className), children: [(label || description) && (_jsxs("div", { className: "text-left cursor-pointer", onClick: handleToggle, children: [label && (_jsx("div", { className: "text-xs font-medium text-neutral-900 dark:text-[#FAFAFA] leading-tight", children: label })), description && (_jsx("div", { className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: description }))] })), _jsx("button", { type: "button", role: "switch", "aria-checked": current, disabled: disabled, onClick: handleToggle, className: cn('relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus-ring', current
                    ? 'bg-neutral-900 dark:bg-[#FAFAFA] border-neutral-900 dark:border-[#FAFAFA]'
                    : 'bg-white dark:bg-[#141414] border-neutral-300 dark:border-[#1F1F1F]', disabled && 'cursor-not-allowed'), children: _jsx(motion.span, { animate: { x: current ? 16 : 2 }, transition: motionTransitions.springSnappy, className: cn('pointer-events-none block h-3.5 w-3.5 my-auto top-0 bottom-0 rounded-full shadow-xs', current ? 'bg-white dark:bg-[#050505]' : 'bg-neutral-500 dark:bg-[#6B6B6B]') }) })] }));
};
