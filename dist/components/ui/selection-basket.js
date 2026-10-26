'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Share2, Download, FolderInput, X } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { useLinkComponent } from '../link-context.js';
import { DirectionalTooltip } from './directional-tooltip.js';
const defaultActions = [
    { id: 'export', label: 'Export', icon: _jsx(Download, { className: "w-3.5 h-3.5" }) },
    { id: 'move', label: 'Move to Folder', icon: _jsx(FolderInput, { className: "w-3.5 h-3.5" }) },
    { id: 'share', label: 'Share', icon: _jsx(Share2, { className: "w-3.5 h-3.5" }) },
    { id: 'delete', label: 'Delete', icon: _jsx(Trash2, { className: "w-3.5 h-3.5" }), variant: 'danger' },
];
export const SelectionBasket = ({ selectedCount, totalCount, mode = 'fixed', actions = defaultActions, onClearSelection, onSelectAll, allSelected, noun = ['item', 'items'], linkComponent, className, }) => {
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const LinkComponent = useLinkComponent(linkComponent);
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
    // ioiti-ui: each colour has a light value in front of EasyUI's own, kept behind `dark:`.
    return (_jsx(AnimatePresence, { children: isVisible && (_jsx("div", { className: cn('pointer-events-none font-sans select-none', wrapperClass), children: _jsxs(motion.div, { initial: { opacity: 0, y: 24, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 16, scale: 0.95, transition: { duration: 0.15 } }, transition: motionTransitions.springResponsive, className: cn('pointer-events-auto flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-x-auto max-w-full dark:border-[#1F1F1F] dark:bg-[#0E0E0E]/95 dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]', className), role: "toolbar", "aria-label": "Bulk actions toolbar", children: [_jsxs("div", { className: "flex items-center gap-2 pl-3 pr-2 py-1 border-r border-neutral-200 dark:border-[#1F1F1F] shrink-0", children: [_jsx("span", { className: "min-w-5 h-5 px-1 rounded-full bg-neutral-900 text-white dark:bg-[#FAFAFA] dark:text-[#050505] text-[11px] font-bold font-mono flex items-center justify-center", children: selectedCount }), _jsx("span", { className: "text-xs font-medium text-neutral-900 dark:text-[#FAFAFA] whitespace-nowrap", children: selectedCount === 1 ? `${noun[0]} selected` : `${noun[1]} selected` }), onSelectAll && totalCount && (_jsx("button", { type: "button", onClick: onSelectAll, className: "text-[11px] font-mono text-muted-foreground hover:text-neutral-900 dark:hover:text-white transition-colors ml-1 underline underline-offset-2 cursor-pointer", children: isAllSelected ? 'Select none' : `All (${totalCount})` }))] }), _jsx("div", { className: "flex items-center gap-1.5 shrink-0 py-0.5", children: actions.map((action) => {
                            const isDanger = action.variant === 'danger';
                            const isPrimary = action.variant === 'primary';
                            const classes = cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-ring whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-40', isDanger
                                ? 'bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-rose-700 dark:text-rose-400 disabled:hover:bg-rose-500/10 disabled:hover:text-rose-700 dark:disabled:hover:text-rose-400'
                                : isPrimary
                                    ? 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-[#FAFAFA] dark:hover:bg-white dark:text-[#050505]'
                                    : 'bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-400 text-neutral-700 hover:text-neutral-900 dark:bg-[#141414] dark:hover:bg-[#0E0E0E] dark:border-[#1F1F1F] dark:hover:border-[#4A4A4A] dark:text-[#A1A1A1] dark:hover:text-[#FAFAFA]');
                            const content = (_jsxs(_Fragment, { children: [action.icon, _jsx("span", { children: action.label })] }));
                            // ioiti-ui: what leads to another page is a link (a click with ⌘ or Ctrl opens it in another tab).
                            const control = action.href !== undefined && !action.disabled ? (_jsx(LinkComponent, { href: action.href, onClick: action.onClick, className: classes, children: content })) : (_jsx("button", { type: "button", onClick: action.onClick, disabled: action.disabled, className: classes, children: content }));
                            if (!action.title)
                                return _jsx(React.Fragment, { children: control }, action.id);
                            // ioiti-ui: a disabled control takes neither focus nor pointer: a wrapper takes them for its tooltip.
                            return (_jsx(DirectionalTooltip, { content: action.title, side: "top", children: action.disabled ? (_jsx("span", { tabIndex: 0, className: "inline-flex rounded-lg [&>:disabled]:pointer-events-none", children: control })) : (control) }, action.id));
                        }) }), onClearSelection && (_jsx("button", { type: "button", onClick: onClearSelection, className: "w-7 h-7 rounded-lg bg-neutral-100 hover:bg-white border border-neutral-200 hover:border-neutral-400 flex items-center justify-center text-muted-foreground hover:text-neutral-900 transition-colors focus-ring shrink-0 ml-1 cursor-pointer dark:bg-[#141414] dark:hover:bg-[#0E0E0E] dark:border-[#1F1F1F] dark:hover:border-[#4A4A4A] dark:hover:text-[#FAFAFA]", title: "Clear selection", "aria-label": "Clear selection", children: _jsx(X, { className: "w-3.5 h-3.5" }) }))] }) })) }));
};
