'use client';
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { useLinkComponent } from '../link-context.js';
// -----------------------------------------------------------------------------
// Motion
// -----------------------------------------------------------------------------
const springSnappy = {
    type: 'spring',
    stiffness: 400,
    damping: 25,
    mass: 0.5,
};
// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const SIZE_STYLES = {
    sm: {
        primary: 'gap-1.5 px-3.5 py-1.5 text-xs',
        chevron: 'px-2 py-1.5',
        radius: 'rounded-[8px]',
        menuText: 'text-xs',
    },
    md: {
        primary: 'gap-2 px-5 py-2.5 text-sm',
        chevron: 'px-2.5 py-2.5',
        radius: 'rounded-[8px]',
        menuText: 'text-sm',
    },
    lg: {
        primary: 'gap-2.5 px-7 py-3.5 text-base',
        chevron: 'px-3 py-3.5',
        radius: 'rounded-[10px]',
        menuText: 'text-sm',
    },
};
const TRANSITION = 'transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out ' +
    'active:translate-y-0 active:scale-[0.98]';
const VARIANT_STYLES = {
    primary: 
    // light: dark pill on a light canvas · dark: light pill on a dark canvas (mirrors your existing button)
    'bg-[#151515] text-[#F5F5F5] hover:bg-black ' +
        'dark:bg-[#F5F5F5] dark:text-[#050505] dark:hover:bg-white ' +
        'shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.25)] ' +
        'dark:shadow-[0_0_20px_-3px_rgba(255,255,255,0.15)] dark:hover:shadow-[0_0_28px_-4px_rgba(255,255,255,0.28)] ' +
        TRANSITION,
    secondary: 'border border-[#E3E3E8] bg-[#F4F4F9] text-[#151515] hover:border-[#D2D2D8] hover:bg-[#ECECF2] ' +
        'dark:border-border dark:bg-surface-raised dark:text-text-primary ' +
        'dark:hover:border-border-hover dark:hover:bg-surface-hover ' +
        'shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_16px_-8px_rgba(0,0,0,0.15)] ' +
        'dark:shadow-none dark:hover:shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)] ' +
        TRANSITION,
    danger: 'bg-[#DC2626] text-white hover:bg-[#E23F3F] ' +
        'dark:bg-[#DC2626]/90 dark:hover:bg-[#EF4444] ' +
        'shadow-[0_0_0_1px_rgba(220,38,38,0.15)] hover:shadow-[0_8px_20px_-6px_rgba(220,38,38,0.4)] ' +
        'dark:shadow-[0_0_18px_-4px_rgba(220,38,38,0.35)] dark:hover:shadow-[0_0_26px_-6px_rgba(220,38,38,0.5)] ' +
        TRANSITION,
    info: 'bg-[#3B82F6] text-white hover:bg-[#529BF8] ' +
        'dark:bg-[#3B82F6]/90 dark:hover:bg-[#60A5FA] ' +
        'shadow-[0_0_0_1px_rgba(59,130,246,0.15)] hover:shadow-[0_8px_20px_-6px_rgba(59,130,246,0.4)] ' +
        'dark:shadow-[0_0_18px_-4px_rgba(59,130,246,0.35)] dark:hover:shadow-[0_0_26px_-6px_rgba(59,130,246,0.5)] ' +
        TRANSITION,
};
// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
/**
 * SplitButton
 *
 * A primary action fused with a secondary chevron trigger.
 *
 * Features:
 * - Primary + dropdown action split
 * - Keyboard accessible menu navigation
 * - Outside-click dismissal
 * - Escape-to-close
 * - Home / End navigation
 * - Viewport-aware dropdown placement
 * - Reduced-motion support
 * - Disabled options
 * - Framer Motion transitions
 */
export function SplitButton({ label, onClick, href, linkComponent, icon, menuLabel, options, size = 'md', variant = 'primary', disabled = false, className, ...props }) {
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const LinkComponent = useLinkComponent(linkComponent);
    const reduceMotion = useReducedMotion();
    const menuName = menuLabel ?? `More ${label} options`;
    // ioiti-ui: the option the arrows are on is announced (aria-activedescendant): the menu has the focus, not it.
    const idPrefix = useId();
    const optionRefs = useRef([]);
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('bottom');
    const [activeIndex, setActiveIndex] = useState(0);
    const rootRef = useRef(null);
    const chevronRef = useRef(null);
    const menuRef = useRef(null);
    const sizeStyles = SIZE_STYLES[size];
    // ---------------------------------------------------------------------------
    // Derived state
    // ---------------------------------------------------------------------------
    const enabledIndices = options.reduce((indices, option, index) => {
        if (!option.disabled) {
            indices.push(index);
        }
        return indices;
    }, []);
    const menuTransition = reduceMotion
        ? { duration: 0 }
        : springSnappy;
    // ---------------------------------------------------------------------------
    // Menu helpers
    // ---------------------------------------------------------------------------
    const closeMenu = useCallback(() => {
        setOpen(false);
        chevronRef.current?.focus();
    }, []);
    const selectOption = useCallback((option) => {
        if (option.disabled) {
            return;
        }
        option.onSelect?.();
        // ioiti-ui: a link chosen from the keyboard is followed as a click would follow it.
        if (option.href) {
            optionRefs.current[options.indexOf(option)]?.click();
            setOpen(false);
            return;
        }
        closeMenu();
    }, [closeMenu, options]);
    // ---------------------------------------------------------------------------
    // Outside click
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!open) {
            return;
        }
        const handlePointerDown = (event) => {
            const target = event.target;
            if (!rootRef.current?.contains(target)) {
                setOpen(false);
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [open]);
    // ---------------------------------------------------------------------------
    // Viewport-aware placement
    // ---------------------------------------------------------------------------
    useLayoutEffect(() => {
        if (!open || !chevronRef.current) {
            return;
        }
        const triggerRect = chevronRef.current.getBoundingClientRect();
        // Approximate menu height:
        // option height + menu vertical padding.
        const estimatedMenuHeight = options.length * 36 + 16;
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;
        const shouldFlip = spaceBelow < estimatedMenuHeight &&
            spaceAbove > estimatedMenuHeight;
        setPlacement(shouldFlip ? 'top' : 'bottom');
    }, [open, options.length]);
    // ---------------------------------------------------------------------------
    // Reset active option when opening
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!open) {
            return;
        }
        setActiveIndex(enabledIndices[0] ?? 0);
    }, [open, enabledIndices]);
    // ---------------------------------------------------------------------------
    // Focus menu when opened
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!open) {
            return;
        }
        requestAnimationFrame(() => {
            menuRef.current?.focus();
        });
    }, [open]);
    // ---------------------------------------------------------------------------
    // Keyboard navigation
    // ---------------------------------------------------------------------------
    const handleMenuKeyDown = useCallback((event) => {
        if (!enabledIndices.length) {
            if (event.key === 'Escape' || event.key === 'Tab') {
                event.preventDefault();
                if (event.key === 'Escape') {
                    closeMenu();
                }
                else {
                    setOpen(false);
                }
            }
            return;
        }
        const currentPosition = enabledIndices.indexOf(activeIndex);
        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault();
                const nextPosition = currentPosition < 0
                    ? 0
                    : (currentPosition + 1) % enabledIndices.length;
                setActiveIndex(enabledIndices[nextPosition]);
                break;
            }
            case 'ArrowUp': {
                event.preventDefault();
                const previousPosition = currentPosition < 0
                    ? enabledIndices.length - 1
                    : (currentPosition - 1 + enabledIndices.length) %
                        enabledIndices.length;
                setActiveIndex(enabledIndices[previousPosition]);
                break;
            }
            case 'Home': {
                event.preventDefault();
                setActiveIndex(enabledIndices[0]);
                break;
            }
            case 'End': {
                event.preventDefault();
                setActiveIndex(enabledIndices[enabledIndices.length - 1]);
                break;
            }
            case 'Enter':
            case ' ': {
                event.preventDefault();
                const activeOption = options[activeIndex];
                if (activeOption) {
                    selectOption(activeOption);
                }
                break;
            }
            case 'Escape': {
                event.preventDefault();
                closeMenu();
                break;
            }
            case 'Tab': {
                setOpen(false);
                break;
            }
            default:
                break;
        }
    }, [
        activeIndex,
        closeMenu,
        enabledIndices,
        options,
        selectOption,
    ]);
    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return (_jsxs("div", { ref: rootRef, className: cn('relative inline-flex', className), children: [_jsxs("div", { className: cn('inline-flex overflow-hidden', sizeStyles.radius, disabled && 'pointer-events-none opacity-30'), children: [href && !disabled ? (_jsxs(LinkComponent, { href: href, className: cn('relative inline-flex items-center justify-center', 'select-none font-medium', 'cursor-pointer', 'focus-ring', 'transition-colors duration-200', sizeStyles.primary, VARIANT_STYLES[variant]), children: [icon, label] })) : (_jsxs("button", { type: "button", onClick: onClick, disabled: disabled, className: cn('relative inline-flex items-center justify-center', 'select-none font-medium', 'cursor-pointer', 'focus-ring', 'transition-colors duration-200', 'disabled:cursor-not-allowed', sizeStyles.primary, VARIANT_STYLES[variant]), ...props, children: [icon, label] })), _jsx("span", { "aria-hidden": "true", className: cn('my-1.5 w-px self-stretch', variant === 'primary'
                            ? 'bg-black/10'
                            : 'bg-border') }), _jsx("button", { ref: chevronRef, type: "button", "aria-haspopup": "menu", "aria-expanded": open, "aria-label": menuName, disabled: disabled, onClick: () => setOpen((previous) => !previous), className: cn('relative inline-flex items-center justify-center', 'select-none', 'cursor-pointer', 'focus-ring', 'transition-colors duration-200', 'disabled:cursor-not-allowed', sizeStyles.chevron, VARIANT_STYLES[variant]), children: _jsx(motion.span, { "aria-hidden": "true", animate: {
                                rotate: open ? 180 : 0,
                            }, transition: menuTransition, className: "flex items-center justify-center", children: _jsx(ChevronDown, { className: "h-4 w-4", strokeWidth: 2 }) }) })] }), _jsx(AnimatePresence, { children: open && (_jsx(motion.div, { ref: menuRef, role: "menu", "aria-label": menuName, "aria-activedescendant": options[activeIndex] && !options[activeIndex].disabled ? `${idPrefix}-${activeIndex}` : undefined, tabIndex: -1, onKeyDown: handleMenuKeyDown, initial: {
                        opacity: 0,
                        scale: 0.96,
                        y: placement === 'bottom' ? -4 : 4,
                    }, animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }, exit: {
                        opacity: 0,
                        scale: 0.97,
                        transition: reduceMotion
                            ? { duration: 0 }
                            : { duration: 0.12 },
                    }, transition: menuTransition, className: cn('absolute right-0 z-30', 'min-w-[10rem]', 'rounded-xl', 'border border-border', 'bg-surface-raised', 'p-1', 
                    // ioiti-ui: a lighter shadow in the light theme, EasyUI's kept for the dark one.
                    'shadow-[0_12px_30px_-10px_rgba(0,0,0,0.25)] dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)]', 'origin-top-right', placement === 'bottom'
                        ? 'top-[calc(100%+8px)]'
                        : 'bottom-[calc(100%+8px)]'), children: options.map((option, index) => {
                        const isActive = index === activeIndex && !option.disabled;
                        // ioiti-ui: an option that leads somewhere is a link; the others are buttons.
                        const Item = option.href && !option.disabled ? LinkComponent : 'button';
                        const itemProps = option.href && !option.disabled
                            ? { href: option.href, onClick: () => setOpen(false) }
                            : { type: 'button', disabled: option.disabled, onClick: () => selectOption(option) };
                        return (_jsxs(Item, { ref: (element) => {
                                optionRefs.current[index] = element;
                            }, id: `${idPrefix}-${index}`, role: "menuitem", tabIndex: -1, "aria-disabled": option.disabled || undefined, ...itemProps, onMouseEnter: () => {
                                if (!option.disabled) {
                                    setActiveIndex(index);
                                }
                            }, className: cn('flex w-full items-center gap-2', 'rounded-lg', 'px-3 py-2', 'text-left', 'font-medium', 'select-none', 'transition-colors duration-150', sizeStyles.menuText, option.disabled
                                ? [
                                    'cursor-not-allowed',
                                    'text-text-muted',
                                ]
                                : option.tone === 'danger'
                                    ? ['cursor-pointer', 'text-negative', 'hover:bg-surface-hover']
                                    : [
                                        'cursor-pointer',
                                        'text-text-secondary',
                                        'hover:bg-surface-hover',
                                        'hover:text-text-primary',
                                    ], isActive && [
                                'bg-surface-hover',
                                option.tone !== 'danger' && 'text-text-primary',
                            ]), children: [option.icon && (_jsx("span", { "aria-hidden": "true", className: cn('flex shrink-0 items-center justify-center', '[&_svg]:h-3.5', '[&_svg]:w-3.5'), children: option.icon })), _jsxs("span", { className: "min-w-0", children: [_jsx("span", { className: "block truncate", children: option.label }), option.description && (_jsx("span", { className: "block whitespace-normal text-[11px] font-normal text-text-muted", children: option.description }))] })] }, option.value));
                    }) })) })] }));
}
export default SplitButton;
