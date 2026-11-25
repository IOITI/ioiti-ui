'use client';
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback, useEffect, useId, useRef, useState, } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotionConfig } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useAnchoredLayer } from '../../lib/anchor.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { FLOATING, MENU_ROW, TONE_SOLID } from '../../lib/recipes.js';
import { cn } from '../../lib/utils.js';
import { useLinkComponent } from '../link-context.js';
// ioiti-ui: its words in the provider's language (`field`).
import { useMessages } from '../locale-context.js';
// -----------------------------------------------------------------------------
// Motion
// -----------------------------------------------------------------------------
// ioiti-ui: the motion of everything that floats, the design's own spring (EasyUI's here overshot).
const springSnappy = motionTransitions.springSnappy;
// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const SIZE_STYLES = {
    // ioiti-ui: Button's sizes (32, 40 and 48 px tall, its radius: md for sm, lg above).
    sm: {
        primary: 'h-8 gap-1.5 px-3 text-sm',
        chevron: 'h-8 px-2',
        radius: 'rounded-md',
        menuText: 'text-sm',
    },
    md: {
        primary: 'h-10 gap-2 px-4.5 text-sm',
        chevron: 'h-10 px-2.5',
        radius: 'rounded-lg',
        menuText: 'text-sm',
    },
    lg: {
        primary: 'h-12 gap-2.5 px-6 text-base',
        chevron: 'h-12 px-3',
        radius: 'rounded-lg',
        menuText: 'text-sm',
    },
};
// ioiti-ui: Button's look in its tokens (the hair of a filled one, the accent's glow as Button's), and its press.
// Disabled, the group is at half its strength (the divider too), not each button again.
const TRANSITION = 'transition-[color,background-color,border-color,opacity,scale] duration-200 ease-fast cursor-pointer motion-safe:active:scale-[0.97]';
const VARIANT_STYLES = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-subtle ' +
        // ioiti-ui: the accent's fill and glow, under a theme that has one (accent:), as Button's.
        'accent:bg-brand accent:text-brand-foreground accent:hover:bg-brand/90 ' +
        'accent:shadow-[0_4px_14px_-6px_var(--brand-glow)] accent:hover:shadow-[0_8px_20px_-6px_var(--brand-glow)] ' +
        TRANSITION,
    secondary: 'border border-border bg-surface text-foreground hover:border-border-hover hover:bg-surface-hover ' +
        TRANSITION,
    // ioiti-ui: the tones filled (recipes.ts), as a destructive action is.
    danger: `${TONE_SOLID.negative} hover:opacity-90 shadow-subtle ${TRANSITION}`,
    info: `${TONE_SOLID.info} hover:opacity-90 shadow-subtle ${TRANSITION}`,
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
    const reduceMotion = useReducedMotionConfig();
    // ioiti-ui: named in the provider's language, a function of the label (EasyUI's English was written here), its own
    // prop given over it.
    const words = useMessages().field;
    const menuName = menuLabel ?? words.moreOptions(label);
    // ioiti-ui: the option the arrows are on is announced (aria-activedescendant): the menu has the focus, not it.
    const idPrefix = useId();
    const optionRefs = useRef([]);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const chevronRef = useRef(null);
    const menuRef = useRef(null);
    // ioiti-ui: the menu is an anchored layer (src/lib/anchor.ts): drawn in document.body, out of every parent that
    // would cut it (a table's row, a panel that scrolls), beside the chevron where the window has room, following it as
    // the page scrolls; a press elsewhere closes it, Escape and a Tab out of it give the focus back to the chevron. It
    // was absolute in the button, on an estimate of its height, cut by a parent's overflow.
    const layer = useAnchoredLayer({
        open,
        onClose: () => setOpen(false),
        triggerRef: chevronRef,
        layerRef: menuRef,
        side: 'bottom',
        align: 'end',
        // The menu holds the focus; the arrows move the option it points to (aria-activedescendant).
        initialFocus: () => menuRef.current,
    });
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
    // Reset active option when opening
    // ---------------------------------------------------------------------------
    // ioiti-ui: on the first option it can choose as it opens, only then. It hung on `enabledIndices`, an array made
    // again at each render: every arrow's move was undone at once, and Enter chose the first option whatever was shown.
    const firstEnabled = enabledIndices[0] ?? 0;
    useEffect(() => {
        if (!open) {
            return;
        }
        setActiveIndex(firstEnabled);
    }, [open, firstEnabled]);
    // ---------------------------------------------------------------------------
    // Keyboard navigation
    // ---------------------------------------------------------------------------
    const handleMenuKeyDown = useCallback((event) => {
        // ioiti-ui: Escape and Tab are the layer's (anchor.ts): neither reaches a dialog around it.
        if (event.key === 'Escape' || event.key === 'Tab') {
            layer.onLayerKeyDown(event);
            return;
        }
        if (!enabledIndices.length) {
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
            default:
                break;
        }
    }, [
        activeIndex,
        closeMenu,
        enabledIndices,
        layer,
        options,
        selectOption,
    ]);
    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return (_jsxs("div", { className: cn('relative inline-flex', className), children: [_jsxs("div", { className: cn('inline-flex overflow-hidden', sizeStyles.radius, disabled && 'pointer-events-none opacity-50'), children: [href && !disabled ? (_jsxs(LinkComponent, { href: href, className: cn('relative inline-flex items-center justify-center', 'select-none font-medium', 'focus-ring', sizeStyles.primary, VARIANT_STYLES[variant]), children: [icon, label] })) : (_jsxs("button", { type: "button", onClick: onClick, disabled: disabled, className: cn('relative inline-flex items-center justify-center', 'select-none font-medium', 'focus-ring', sizeStyles.primary, VARIANT_STYLES[variant]), ...props, children: [icon, label] })), _jsx("span", { "aria-hidden": "true", className: cn('my-1.5 w-px self-stretch', variant === 'primary'
                            ? 'bg-current/10'
                            : 'bg-border') }), _jsx("button", { ref: chevronRef, type: "button", "aria-haspopup": "menu", "aria-expanded": open, "aria-label": menuName, disabled: disabled, onClick: () => setOpen((previous) => !previous), onKeyDown: layer.onTriggerKeyDown, className: cn('relative inline-flex items-center justify-center', 'select-none', 'focus-ring', sizeStyles.chevron, VARIANT_STYLES[variant]), children: _jsx(motion.span, { "aria-hidden": "true", animate: {
                                rotate: open ? 180 : 0,
                            }, transition: menuTransition, className: "flex items-center justify-center", children: _jsx(ChevronDown, { className: "size-4" }) }) })] }), typeof document !== 'undefined' && createPortal(_jsx(AnimatePresence, { children: open && (_jsx(motion.div, { ref: menuRef, style: layer.style, role: "menu", "aria-label": menuName, "aria-activedescendant": options[activeIndex] && !options[activeIndex].disabled ? `${idPrefix}-${activeIndex}` : undefined, tabIndex: -1, onKeyDown: handleMenuKeyDown, initial: {
                        opacity: 0,
                        scale: 0.96,
                        y: layer.side === 'top' ? 4 : -4,
                    }, animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }, exit: {
                        opacity: 0,
                        scale: 0.97,
                        // ioiti-ui: it leaves quicker than it came (easeExit), as everything that floats.
                        transition: reduceMotion
                            ? { duration: 0 }
                            : motionTransitions.easeExit,
                    }, transition: menuTransition, className: cn(
                    // ioiti-ui: what floats beside its trigger (recipes.ts), glass under the glass material (glass-float).
                    FLOATING, 'z-50 min-w-48 max-w-xs overflow-auto p-1 outline-none', layer.side === 'top' ? 'origin-bottom-right' : 'origin-top-right'), children: options.map((option, index) => {
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
                            }, className: cn(
                            // ioiti-ui: a menu's row (recipes.ts), as DropdownMenu's.
                            MENU_ROW, 'w-full text-left', sizeStyles.menuText, 'aria-disabled:cursor-not-allowed aria-disabled:opacity-50', !option.disabled && 'hover:bg-surface-hover', option.tone === 'danger' && 'text-negative', isActive && 'bg-surface-hover'), children: [option.icon && (_jsx("span", { "aria-hidden": "true", className: "flex shrink-0 items-center justify-center [&_svg]:size-4", children: option.icon })), _jsxs("span", { className: "min-w-0", children: [_jsx("span", { className: "block truncate", children: option.label }), option.description && (_jsx("span", { className: "block whitespace-normal text-xs text-muted-foreground", children: option.description }))] })] }, option.value));
                    }) })) }), document.body)] }));
}
export default SplitButton;
