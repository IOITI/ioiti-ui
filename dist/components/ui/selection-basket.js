'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Share2, Download, FolderInput, X } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, PRESSABLE, TONE_LINE, TONE_SOFT, TOAST } from '../../lib/recipes.js';
import { useLinkComponent } from '../link-context.js';
// ioiti-ui: its words in the provider's language (`table`), its count in its locale.
import { useFormat, useMessages } from '../locale-context.js';
import { DirectionalTooltip } from './directional-tooltip.js';
import { Hint } from '../Hint.js';
// ioiti-ui: their words the provider's language's.
const defaultActions = (words) => [
    { id: 'export', label: words.exportAction, icon: _jsx(Download, { className: "size-3.5" }) },
    { id: 'move', label: words.moveAction, icon: _jsx(FolderInput, { className: "size-3.5" }) },
    { id: 'share', label: words.shareAction, icon: _jsx(Share2, { className: "size-3.5" }) },
    { id: 'delete', label: words.deleteAction, icon: _jsx(Trash2, { className: "size-3.5" }), variant: 'danger' },
];
export const SelectionBasket = ({ selectedCount, totalCount, mode = 'fixed', actions: givenActions, onClearSelection, onSelectAll, allSelected, noun, linkComponent, className, }) => {
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const LinkComponent = useLinkComponent(linkComponent);
    // ioiti-ui: its words in the provider's language, its own props given over them; its count in its locale.
    const words = useMessages().table;
    const { formatNumber } = useFormat();
    const actions = givenActions ?? defaultActions(words);
    const isVisible = selectedCount > 0;
    const isAllSelected = allSelected ?? (totalCount !== undefined && selectedCount === totalCount && totalCount > 0);
    const wrapperClass = mode === 'fixed'
        ? 'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]'
        : mode === 'contained'
            ? 'absolute bottom-3 left-1/2 -translate-x-1/2 z-30 max-w-[95%]'
            : mode === 'sticky'
                ? 'sticky bottom-4 mx-auto w-fit max-w-full z-30'
                : // ioiti-ui: no wider than its container either, its bar scrolling inside (a phone).
                    'relative mt-4 mx-auto w-fit max-w-full z-20';
    // ioiti-ui: the design's tokens, its recipes (recipes.ts) for the bar, its tones and its close.
    return (_jsx(AnimatePresence, { children: isVisible && (_jsx("div", { className: cn('pointer-events-none font-sans select-none', wrapperClass), children: _jsxs(motion.div, { initial: { opacity: 0, y: 24, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, 
                // ioiti-ui: the motion of everything that floats, without the overshoot a gesture's return keeps.
                exit: { opacity: 0, y: 16, scale: 0.95, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, className: cn(
                // ioiti-ui: a bar that floats over the page, a toast's surface (TOAST), its own padding round its
                // buttons; glass under the glass material (glass-float).
                TOAST, 'pointer-events-auto flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 overflow-x-auto max-w-full', className), role: "toolbar", "aria-label": words.basketToolbar, children: [_jsxs("div", { className: "flex items-center gap-2 pl-3 pr-2 py-1 border-r border-border shrink-0", children: [_jsx("span", { className: "min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground accent:bg-brand accent:text-brand-foreground text-[11px] font-semibold font-mono tabular-nums flex items-center justify-center", children: formatNumber(selectedCount) }), _jsx("span", { className: "text-sm font-medium text-foreground whitespace-nowrap", children: noun ? words.basketSelectedNoun({ count: selectedCount, noun }) : words.basketSelected(selectedCount) }), onSelectAll && totalCount && (_jsx("button", { type: "button", onClick: onSelectAll, className: "text-xs font-mono text-muted-foreground hover:text-foreground transition-colors ml-1 underline underline-offset-2 cursor-pointer", children: isAllSelected ? words.basketSelectNone : words.basketSelectAll(totalCount) }))] }), _jsx("div", { className: "flex items-center gap-1.5 shrink-0 py-0.5", children: actions.map((action) => {
                            const isDanger = action.variant === 'danger';
                            const isPrimary = action.variant === 'primary';
                            // ioiti-ui: Button's looks: the negative tone soft at rest and filled under the pointer (not when it is
                            // disabled), ink, or a raised control.
                            const classes = cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-[color,background-color,border-color,opacity,scale] focus-ring whitespace-nowrap', PRESSABLE, isDanger
                                ? cn(TONE_SOFT.negative, 'border', TONE_LINE.negative, 'not-disabled:hover:bg-negative dark:not-disabled:hover:bg-negative not-disabled:hover:text-background')
                                : isPrimary
                                    ? 'bg-primary text-primary-foreground not-disabled:hover:opacity-90 accent:bg-brand accent:hover:bg-brand/90 accent:text-brand-foreground'
                                    : 'bg-surface hover:bg-surface-hover border border-border hover:border-border-hover text-text-secondary hover:text-foreground');
                            const content = (_jsxs(_Fragment, { children: [action.icon, _jsx("span", { children: action.label })] }));
                            // ioiti-ui: what leads to another page is a link (a click with ⌘ or Ctrl opens it in another tab).
                            const control = action.href !== undefined && !action.disabled ? (_jsx(LinkComponent, { href: action.href, onClick: action.onClick, className: classes, children: content })) : (_jsx("button", { type: "button", onClick: action.onClick, disabled: action.disabled, className: classes, children: content }));
                            if (!action.title)
                                return _jsx(React.Fragment, { children: control }, action.id);
                            // ioiti-ui: a disabled control takes neither focus nor pointer: a wrapper takes them for its tooltip.
                            return (_jsx(DirectionalTooltip, { content: action.title, side: "top", children: action.disabled ? (_jsx("span", { tabIndex: 0, className: "inline-flex rounded-lg [&>:disabled]:pointer-events-none", children: control })) : (control) }, action.id));
                        }) }), onClearSelection && (_jsx(Hint, { content: words.basketClear, children: _jsx("button", { type: "button", onClick: onClearSelection, className: cn(CLOSE_SM, 'ml-1 focus-ring'), "aria-label": words.basketClear, children: _jsx(X, {}) }) }))] }) })) }));
};
