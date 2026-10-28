'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronDown, User, Clock, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
export const RecoveryLedger = ({ entries, currentEntryId, onRestore, onSelect, expandedId: controlledExpandedId, onExpandedChange, title = 'Recovery Ledger', countLabel, restoreLabel = 'Revert', currentLabel = 'Current Head', variant = 'timeline', className, }) => {
    const [internalExpandedId, setInternalExpandedId] = useState(null);
    const [restoringId, setRestoringId] = useState(null);
    const baseId = useId();
    const expandedId = controlledExpandedId !== undefined ? controlledExpandedId : internalExpandedId;
    const toggleExpand = (id) => {
        const next = expandedId === id ? null : id;
        if (controlledExpandedId === undefined)
            setInternalExpandedId(next);
        onExpandedChange?.(next);
        if (onSelect)
            onSelect(id);
    };
    const handleRestore = async (id, e) => {
        e.stopPropagation();
        if (!onRestore || restoringId)
            return;
        setRestoringId(id);
        try {
            await onRestore(id);
        }
        finally {
            setRestoringId(null);
        }
    };
    // ioiti-ui: each colour has a light value in front of EasyUI's own, kept behind `dark:`.
    return (_jsxs("div", { className: cn(
        // ioiti-ui: glass under the glass material, as a card (glass-card).
        'w-full rounded-2xl bg-white border border-neutral-200 overflow-hidden dark:bg-[#0E0E0E] dark:border-[#1F1F1F] glass-card', className), children: [_jsx("div", { className: "px-4 py-3 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between dark:border-[#1F1F1F] dark:bg-[#141414]", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { "aria-hidden": "true", className: "w-4 h-4 text-neutral-500 dark:text-[#525252]" }), _jsx("h3", { className: "text-xs font-semibold text-neutral-900 dark:text-[#FAFAFA]", children: title }), _jsx("span", { className: "text-[10px] font-mono text-muted-foreground bg-white px-2 py-0.5 rounded-full border border-neutral-200 dark:bg-[#141414] dark:border-[#1F1F1F]", children: countLabel ?? `${entries.length} snapshots` })] }) }), _jsxs("div", { className: "relative p-4", children: [variant === 'timeline' && (_jsx("div", { "aria-hidden": "true", className: "absolute top-6 bottom-6 left-[23px] w-[2px] bg-neutral-200 pointer-events-none dark:bg-[#1F1F1F]" })), _jsx("ol", { "aria-label": title, className: "space-y-4", children: entries.map((entry, idx) => {
                            const isCurrent = entry.id === currentEntryId;
                            const isExpanded = expandedId === entry.id;
                            const isRestoring = restoringId === entry.id;
                            const isRestorable = entry.restorable !== false;
                            // ioiti-ui: only an entry with something to show opens (a real button: EasyUI's card took clicks alone).
                            const canExpand = entry.details !== undefined;
                            const detailsId = `${baseId}-${idx}-details`;
                            const dateStr = entry.timestamp === undefined
                                ? null
                                : typeof entry.timestamp === 'string'
                                    ? entry.timestamp
                                    : entry.timestamp.toLocaleString();
                            const summary = (_jsxs(_Fragment, { children: [_jsxs("span", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "text-xs font-semibold text-neutral-900 dark:text-[#FAFAFA]", children: entry.action }), isCurrent && (_jsx("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 dark:text-emerald-400", children: currentLabel }))] }), _jsx("span", { className: "block text-[11px] text-neutral-600 mt-0.5 leading-relaxed dark:text-[#A1A1A1]", children: entry.description }), (dateStr || entry.author || entry.reference) && (_jsxs("span", { className: "flex items-center gap-3 flex-wrap text-[10px] font-mono text-muted-foreground mt-2", children: [dateStr && _jsx("span", { children: dateStr }), entry.reference && _jsx("span", { className: "break-all", children: entry.reference }), entry.author && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(User, { "aria-hidden": "true", className: "w-2.5 h-2.5" }), entry.author] }))] }))] }));
                            return (_jsxs(motion.li, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: idx * 0.05 }, className: "relative pl-8", children: [_jsx("div", { "aria-hidden": "true", className: cn('absolute left-0 top-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors bg-white dark:bg-[#0E0E0E]', isCurrent
                                            ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                                            : isExpanded
                                                ? 'border-neutral-500 dark:border-[#4A4A4A]'
                                                : 'border-neutral-300 dark:border-[#1F1F1F]'), children: isCurrent && _jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" }) }), _jsxs("div", { className: cn('p-3 rounded-xl border transition-all', isCurrent
                                            ? 'bg-neutral-50 border-emerald-500/30 shadow-xs dark:bg-[#141414]'
                                            : isExpanded
                                                ? 'bg-neutral-50 border-neutral-400 dark:bg-[#141414] dark:border-[#4A4A4A]'
                                                : canExpand
                                                    ? 'bg-white border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 dark:bg-[#0E0E0E] dark:border-[#1F1F1F] dark:hover:border-[#4A4A4A] dark:hover:bg-[#141414]'
                                                    : 'bg-white border-neutral-200 dark:bg-[#0E0E0E] dark:border-[#1F1F1F]'), children: [_jsxs("div", { className: "relative flex items-start justify-between gap-3", children: [canExpand ? (_jsx("button", { type: "button", onClick: () => toggleExpand(entry.id), "aria-expanded": isExpanded, "aria-controls": isExpanded ? detailsId : undefined, className: "group min-w-0 text-left rounded-md cursor-pointer after:absolute after:inset-0 after:content-['']", children: summary })) : (_jsx("div", { className: "min-w-0", children: summary })), _jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [!isCurrent && isRestorable && onRestore && (_jsxs("button", { type: "button", disabled: Boolean(restoringId), onClick: (e) => handleRestore(entry.id, e), className: "relative z-10 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-900 hover:text-white transition-colors flex items-center gap-1 cursor-pointer dark:bg-[#141414] dark:text-[#A1A1A1] dark:border-[#1F1F1F] dark:hover:bg-[#FAFAFA] dark:hover:text-[#050505]", "aria-label": `${restoreLabel}: ${entry.action}`, children: [isRestoring ? (_jsx(Loader2, { "aria-hidden": "true", className: "w-3 h-3 animate-spin" })) : (_jsx(RotateCcw, { "aria-hidden": "true", className: "w-3 h-3" })), _jsx("span", { children: restoreLabel })] })), canExpand && (_jsx("div", { "aria-hidden": "true", className: "p-1 text-neutral-500 pointer-events-none dark:text-[#525252]", children: _jsx(motion.div, { animate: { rotate: isExpanded ? 180 : 0 }, transition: motionTransitions.springSnappy, children: _jsx(ChevronDown, { className: "w-3.5 h-3.5" }) }) }))] })] }), _jsx(AnimatePresence, { children: isExpanded && entry.details && (_jsxs(motion.div, { id: detailsId, initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: motionTransitions.springSmooth, className: "mt-3 pt-2.5 border-t border-neutral-200 overflow-hidden dark:border-[#1F1F1F]", children: [entry.details.diff && (_jsx("div", { className: "p-2 rounded-lg bg-neutral-50 border border-neutral-200 font-mono text-[10px] text-neutral-700 leading-relaxed overflow-x-auto dark:bg-[#050505] dark:border-[#1F1F1F] dark:text-[#A1A1A1]", children: _jsx("pre", { children: entry.details.diff }) })), entry.details.preview && (_jsx("p", { className: "text-xs text-neutral-600 mt-2 dark:text-[#A1A1A1]", children: entry.details.preview })), entry.details.content] })) })] })] }, entry.id));
                        }) })] })] }));
};
