'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { fieldBorder } from '../../lib/field-border.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { DISABLED, FLOATING, MENU_ROW } from '../../lib/recipes.js';
/**
 * SpringSelect — The dropdown menu follows the trigger with a tiny spring.
 * On open, the menu slides down with a slight overshoot; the chevron rotates
 * a hair past 180° before settling. Closing is a smooth ease-back.
 *
 * ioiti-ui: the menu settles without overshoot (springSnappy) and the chevron turns to 180° exactly, as every
 * chevron of the design does.
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
    return (_jsxs("div", { ref: rootRef, className: cn('relative w-full', className), id: rootId, children: [label && (_jsx("label", { htmlFor: `${rootId}-trigger`, className: "block text-xs font-semibold text-foreground mb-1.5 select-none", children: label })), _jsxs("button", { ref: triggerRef, id: `${rootId}-trigger`, type: "button", disabled: disabled, "aria-haspopup": "listbox", "aria-expanded": open, onClick: () => !disabled && setOpen((o) => !o), onKeyDown: handleTriggerKey, className: cn('relative w-full h-10 px-3.5 pr-9 text-base sm:text-sm rounded-lg border outline-none text-left flex items-center justify-between transition-colors duration-150 focus-ring cursor-pointer', 'bg-surface', fieldBorder(error), 
                // ioiti-ui: open, the option under the pointer and the one chosen in the accent, where the theme has one (accent:).
                open &&
                    (error
                        ? 'border-negative hover:border-negative'
                        : 'border-muted-foreground hover:border-muted-foreground accent:border-brand accent:hover:border-brand'), DISABLED, currentOption ? 'text-foreground' : 'text-text-subtle'), children: [_jsx("span", { className: "truncate", children: currentOption?.label ?? placeholder }), _jsx("span", { className: "absolute right-3 flex text-muted-foreground", children: _jsx(ChevronDown, { className: cn('size-4 motion-safe:transition-transform duration-200 ease-fast', open && 'rotate-180') }) })] }), _jsx(AnimatePresence, { children: open && (_jsx(motion.ul, { role: "listbox", tabIndex: -1, onKeyDown: handleListKey, initial: { opacity: 0, y: -6, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, 
                    // ioiti-ui: it leaves quicker than it came (easeExit), as everything that floats.
                    exit: { opacity: 0, y: -4, scale: 0.98, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, 
                    // The container itself rides the spring: a tiny upward slide that
                    // "settles" with the snappy spring, plus a slight overshoot via the
                    // scale: 0.98 -> 1 motion.
                    // ioiti-ui: glass under the glass material (glass-float).
                    className: cn('absolute z-50 left-0 right-0 mt-1.5 max-h-60 overflow-auto py-1 focus:outline-none', FLOATING), children: options.map((opt, idx) => {
                        const selected = opt.value === current;
                        return (_jsxs("li", { role: "option", "aria-selected": selected, "aria-disabled": opt.disabled, onMouseEnter: () => setActiveIndex(idx), onClick: () => handleSelect(opt, idx), className: cn(MENU_ROW, 'relative mx-1 justify-between', selected && 'accent:text-brand-text', opt.disabled && 'opacity-50 cursor-not-allowed', activeIndex === idx && !opt.disabled && 'bg-surface-hover accent:bg-brand-soft'), children: [_jsxs("span", { className: "flex flex-col", children: [_jsx("span", { className: "leading-tight", children: opt.label }), opt.description && (_jsx("span", { className: "text-xs text-muted-foreground mt-0.5", children: opt.description }))] }), selected && _jsx(Check, { className: "size-4 text-foreground accent:text-brand-text shrink-0" })] }, opt.value));
                    }) })) }), error && (_jsx(motion.p, { initial: { opacity: 0, y: -2 }, animate: { opacity: 1, y: 0 }, transition: motionTransitions.springSnappy, className: "text-xs text-negative font-medium mt-1.5", role: "alert", children: error }))] }));
};
