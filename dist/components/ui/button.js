'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
const variantStyles = {
    default: 'bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-90 shadow-xs border border-transparent font-medium cursor-pointer',
    primary: 'bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-90 shadow-xs border border-transparent font-medium cursor-pointer',
    secondary: 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] cursor-pointer',
    outline: 'bg-transparent border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] cursor-pointer',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-transparent cursor-pointer',
    destructive: 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white cursor-pointer',
    success: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white cursor-pointer',
    link: 'bg-transparent text-[var(--text-primary)] underline-offset-4 hover:underline p-0 h-auto border-0 focus-ring shadow-none inline-flex cursor-pointer',
    gradient: 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] relative overflow-hidden cursor-pointer',
};
const sizeStyles = {
    sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
    md: 'h-10 px-4.5 text-sm rounded-lg gap-2',
    lg: 'h-12 px-6 text-base rounded-lg gap-2.5',
    icon: 'h-10 w-10 p-0 rounded-lg justify-center shrink-0',
};
/**
 * ioiti-ui: the classes of a button of this variant and size, for a link that looks like one
 * (`components/ButtonLink.tsx`): what leads to another page is a link.
 */
export function buttonClassName({ variant = 'primary', size = 'md', fullWidth = false, className, }) {
    return cn('relative inline-flex items-center justify-center font-medium select-none focus-ring transition-colors duration-150', variantStyles[variant], variant !== 'link' && sizeStyles[size], fullWidth && 'w-full', className);
}
export const Button = forwardRef(({ variant = 'primary', size = 'md', isLoading = false, loadingText, leftIcon, rightIcon, fullWidth = false, disabled, className, children, type = 'button', ...props }, ref) => {
    const isDisabled = disabled || isLoading;
    return (_jsxs(motion.button, { ref: ref, type: type, disabled: isDisabled, whileTap: isDisabled ? undefined : { scale: 0.97 }, transition: motionTransitions.springSnappy, "aria-busy": isLoading, className: buttonClassName({
            variant,
            size,
            fullWidth,
            className: cn(isDisabled && 'opacity-30 cursor-not-allowed pointer-events-none', className),
        }), ...props, children: [variant === 'gradient' && (_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none", "aria-hidden": "true" })), isLoading ? (_jsx(Loader2, { className: cn('animate-spin shrink-0', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4') })) : (leftIcon && _jsx("span", { className: "shrink-0", children: leftIcon })), isLoading && loadingText ? (_jsx("span", { children: loadingText })) : (children && _jsx("span", { children: children })), !isLoading && rightIcon && _jsx("span", { className: "shrink-0", children: rightIcon })] }));
});
Button.displayName = 'Button';
