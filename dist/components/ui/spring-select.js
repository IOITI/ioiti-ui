'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
/**
 * SpringSelect — The dropdown menu follows the trigger with a tiny spring.
 * On open, the menu slides down with a slight overshoot; the chevron rotates
 * a hair past 180° before settling. Closing is a smooth ease-back.
 */
export const SpringSelect = ({ options, value, defaultValue, placeholder = 'Select…', onChange, label, disabled = false, error, className, }) => {
    const generatedId = useId();
    const rootId = `spring-select-${generatedId}`;
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [activeIndex, setActiveIndex] = useState(-1);
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const isControlled = value !== undefined;
    const current = isControlled ? value : internalValue;
    const currentOption = options.find((o) => o.value === current);
    useEffect(() => {
        if (!open)
            return;
        const onDocClick = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);
    const handleSelect = (opt, idx) => {
        if (opt.disabled)
            return;
        if (!isControlled)
            setInternalValue(opt.value);
        onChange?.(opt.value);
        setOpen(false);
        setActiveIndex(idx);
        triggerRef.current?.focus();
    };
    const handleTriggerKey = (e) => {
        if (disabled)
            return;
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
            setActiveIndex((i) => (i < 0 ? options.findIndex((o) => o.value === current) : i));
        }
    };
    const handleListKey = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(options.length - 1, i + 1));
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(0, i - 1));
        }
        else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            handleSelect(options[activeIndex], activeIndex);
        }
    };
    return (_jsxs("div", { ref: rootRef, className: cn('relative w-full', className), id: rootId, children: [label && (_jsx("label", { htmlFor: `${rootId}-trigger`, className: "block text-xs font-medium text-[var(--text-primary)] tracking-tight mb-1.5 select-none", children: label })), _jsxs("button", { ref: triggerRef, id: `${rootId}-trigger`, type: "button", disabled: disabled, "aria-haspopup": "listbox", "aria-expanded": open, onClick: () => !disabled && setOpen((o) => !o), onKeyDown: handleTriggerKey, className: cn('relative w-full h-10 px-3.5 pr-9 text-xs rounded-lg border outline-none text-left flex items-center justify-between transition-colors duration-150 focus-ring', 'bg-[var(--surface-raised)]', open
                    ? // ioiti-ui: open, the option under the pointer and the one chosen in the accent, where the theme has one (accent:).
                        'border-[var(--border-hover)] accent:border-brand'
                    : error
                        ? 'border-rose-500/50 hover:border-rose-500/70'
                        : 'border-[var(--border)] hover:border-[var(--border-hover)]', disabled && 'opacity-30 cursor-not-allowed', currentOption ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'), children: [_jsx("span", { className: "truncate", children: currentOption?.label ?? placeholder }), _jsx(motion.div, { animate: {
                            rotate: open ? 192 : 0, // 192° gives a tiny past-180° before settle
                        }, transition: motionTransitions.springSnappy, className: "absolute right-3 text-[var(--text-secondary)]", children: _jsx(ChevronDown, { className: "w-3.5 h-3.5" }) })] }), _jsx(AnimatePresence, { children: open && (_jsx(motion.ul, { role: "listbox", tabIndex: -1, onKeyDown: handleListKey, initial: { opacity: 0, y: -6, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -4, scale: 0.98 }, transition: motionTransitions.springSnappy, 
                    // The container itself rides the spring: a tiny upward slide that
                    // "settles" with the snappy spring, plus a slight overshoot via the
                    // scale: 0.98 -> 1 motion.
                    // ioiti-ui: glass under the glass material (glass-float).
                    className: "absolute z-50 left-0 right-0 mt-1.5 max-h-60 overflow-auto py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-elevated)] focus:outline-none glass-float", children: options.map((opt, idx) => {
                        const selected = opt.value === current;
                        return (_jsxs("li", { role: "option", "aria-selected": selected, "aria-disabled": opt.disabled, onMouseEnter: () => setActiveIndex(idx), onClick: () => handleSelect(opt, idx), className: cn('relative px-3 py-2 mx-1 rounded-md text-xs cursor-pointer flex items-center justify-between gap-2', selected ? 'text-[var(--text-primary)] accent:text-brand-text' : 'text-[var(--text-secondary)]', opt.disabled && 'opacity-30 cursor-not-allowed', activeIndex === idx && !opt.disabled && 'bg-[var(--surface-raised)] accent:bg-brand-soft'), children: [_jsxs("span", { className: "flex flex-col", children: [_jsx("span", { className: "leading-tight", children: opt.label }), opt.description && (_jsx("span", { className: "text-[10px] text-[var(--text-muted)] mt-0.5", children: opt.description }))] }), selected && _jsx(Check, { className: "w-3.5 h-3.5 text-[var(--text-primary)] accent:text-brand-text shrink-0" })] }, opt.value));
                    }) })) }), error && (_jsx(motion.p, { initial: { opacity: 0, y: -2 }, animate: { opacity: 1, y: 0 }, transition: motionTransitions.springSnappy, className: "text-[11px] text-rose-700 dark:text-rose-400 font-medium mt-1.5", role: "alert", children: error }))] }));
};
