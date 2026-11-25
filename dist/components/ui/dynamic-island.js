'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ioiti-ui: EasyUI's island reduced to its two first states, collapsed and expanded, with the caller's content in both.
// Its profile and share states, avatar, greeting and social links are gone. The pill stays in the flow of the top
// bar it sits in, and the opened island grows from it below (shared layoutId), so the bar keeps its height.
import React, { useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotionConfig } from 'framer-motion';
import { X } from 'lucide-react';
// ioiti-ui: held by its caller or by itself, as every state (useControllableState).
import { useControllableState } from '../../lib/controllable.js';
// ioiti-ui: EasyUI's names kept until 1.0, drawing this one (renamed).
import { renamed } from '../../lib/renamed.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, FLOATING } from '../../lib/recipes.js';
import { cn } from '../../lib/utils.js';
// ioiti-ui: what it says to a screen reader in the provider's language.
import { useMessages } from '../locale-context.js';
/**
 * ioiti-ui: a dialog over the page (the confirmation of a Close opened from the island) takes its own clicks and its
 * Escape, which starts in it: it holds the focus while it is open.
 */
function inDialog(target) {
    return target instanceof Element && target.closest('[aria-modal="true"]') !== null;
}
export const StatusIsland = ({ compact, children, label, defaultState = 'collapsed', state: controlledState, onStateChange, className, }) => {
    const [currentState, handleStateChange] = useControllableState(controlledState, defaultState, onStateChange);
    const rawId = useId();
    const instanceId = `dyn-island-${rawId.replace(/[:]/g, '')}`;
    const containerRef = useRef(null);
    const pillRef = useRef(null);
    const closeRef = useRef(null);
    const shouldReduceMotion = useReducedMotionConfig();
    const words = useMessages().toast;
    // ioiti-ui: the keyboard follows the island: into it when it opens, back to the pill when it closes.
    const opened = useRef(false);
    useEffect(() => {
        if (currentState === 'expanded') {
            opened.current = true;
            closeRef.current?.focus();
        }
        else if (opened.current) {
            opened.current = false;
            pillRef.current?.focus();
        }
    }, [currentState]);
    // Close when clicking outside or pressing Escape
    useEffect(() => {
        if (currentState === 'collapsed')
            return;
        const handlePointerDown = (event) => {
            if (inDialog(event.target))
                return;
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                handleStateChange('collapsed');
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !inDialog(event.target)) {
                handleStateChange('collapsed');
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentState, handleStateChange]);
    // ioiti-ui: the design's motion: the island grows from the pill as what floats in (springSnappy, no overshoot),
    // its content fades in quickly (easeFast).
    const springTransition = shouldReduceMotion ? { duration: 0 } : motionTransitions.springSnappy;
    const contentTransition = shouldReduceMotion ? { duration: 0 } : motionTransitions.easeFast;
    // ioiti-ui: glass under the glass material (glass-float): the pill and the open island are siblings, neither
    // holding a fixed child. The pill is a control in the bar, lifted a hair; the open island floats (FLOATING).
    const pillSurface = 'border border-border bg-surface text-foreground shadow-subtle transition-[color,background-color,scale] glass-float';
    const expanded = currentState === 'expanded';
    return (_jsxs("div", { ref: containerRef, className: cn('relative inline-flex items-center justify-center', className), children: [_jsxs(motion.button, { ref: pillRef, type: "button", layoutId: expanded ? undefined : instanceId, transition: springTransition, onClick: () => handleStateChange('expanded'), "aria-expanded": expanded, "aria-controls": expanded ? `${instanceId}-panel` : undefined, className: cn(pillSurface, 'inline-flex h-8 items-center gap-2 rounded-full px-3 text-sm font-medium cursor-pointer motion-safe:active:scale-[0.97] hover:bg-surface-hover', expanded && 'invisible'), children: [_jsx("span", { className: "sr-only", children: words.islandName(label) }), ' ', compact] }), _jsx(AnimatePresence, { initial: false, children: expanded && (_jsx(motion.div, { id: `${instanceId}-panel`, role: "region", "aria-label": label, layoutId: instanceId, transition: springTransition, className: cn(FLOATING, 
                    // From the pill's left edge, over the page rather than the menu beside it; on a phone across the screen
                    // under the top bar.
                    'fixed inset-x-4 top-16 z-40 overflow-hidden sm:absolute sm:inset-x-auto sm:left-0 sm:top-0 sm:w-[22rem]'), children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: contentTransition, className: "relative p-4", children: [_jsx("button", { ref: closeRef, type: "button", onClick: () => handleStateChange('collapsed'), "aria-label": words.closeIsland(label), className: cn(CLOSE_SM, 'absolute right-3 top-3'), children: _jsx(X, {}) }), children] }) }, "island-expanded")) })] }));
};
// ioiti-ui: EasyUI's names, until 1.0: the former name draws the island, and says once, in development, that it is
// deprecated (renamed).
/** @deprecated Use `StatusIsland`. Removed in 1.0. */
export const DynamicIsland = renamed(StatusIsland, 'DynamicIsland');
