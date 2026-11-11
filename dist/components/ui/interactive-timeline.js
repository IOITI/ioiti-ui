'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, AlertCircle, AlertTriangle, Loader2, GitCommit, Copy, CheckCheck, ChevronDown } from 'lucide-react';
import { cn, copyToClipboard } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
/** ioiti-ui: an item with nothing more than its title and time has no fold. */
function hasDetails(item) {
    return Boolean(item.description || item.metrics?.length || item.author || item.commitHash);
}
export const InteractiveTimeline = ({ items = [], defaultSelectedId, defaultExpandedIds, label, onItemSelect, className, collapsible = true, ...props }) => {
    const [selectedId, setSelectedId] = useState(defaultSelectedId || items[0]?.id);
    const [expandedIds, setExpandedIds] = useState(new Set(defaultExpandedIds ?? (defaultSelectedId ? [defaultSelectedId] : items.length > 0 ? [items[0].id] : [])));
    const [copiedHash, setCopiedHash] = useState(null);
    const listId = useId();
    const handleToggleExpand = (item) => {
        setSelectedId(item.id);
        onItemSelect?.(item);
        if (!collapsible || !hasDetails(item))
            return;
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(item.id)) {
                next.delete(item.id);
            }
            else {
                next.add(item.id);
            }
            return next;
        });
    };
    const handleCopyHash = (e, hash) => {
        e.stopPropagation();
        copyToClipboard(hash);
        setCopiedHash(hash);
        setTimeout(() => setCopiedHash(null), 2000);
    };
    // ioiti-ui: each colour has a light value in front of EasyUI's own, kept behind `dark:`. What is done and
    // under way is in the accent's colour, where the theme has one (accent:), in place of EasyUI's blue.
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return _jsx(Check, { className: "w-3.5 h-3.5 text-blue-600 dark:text-white accent:text-brand-text" });
            case 'in-progress':
                return _jsx(Loader2, { className: "w-3.5 h-3.5 text-blue-600 dark:text-white accent:text-brand-text animate-spin" });
            case 'failed':
                return _jsx(AlertCircle, { className: "w-3.5 h-3.5 text-rose-600 dark:text-rose-400" });
            case 'warning':
                return _jsx(AlertTriangle, { className: "w-3.5 h-3.5 text-amber-600 dark:text-amber-400" });
            case 'pending':
            default:
                return _jsx(Clock, { className: "w-3.5 h-3.5 text-neutral-500 dark:text-[#606060]" });
        }
    };
    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-white/10 dark:text-white dark:border-white/20';
            case 'in-progress':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-white/15 dark:text-white dark:border-white/30 dark:shadow-[0_0_12px_rgba(255,255,255,0.15)] accent:bg-brand-soft accent:text-brand-text accent:border-brand/30';
            case 'failed':
                return 'bg-rose-500/10 text-rose-700 border-rose-500/30 dark:text-rose-300';
            case 'warning':
                return 'bg-amber-500/10 text-amber-800 border-amber-500/30 dark:text-amber-300';
            case 'pending':
            default:
                return 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-[#141414] dark:text-muted-foreground dark:border-[#1F1F1F]';
        }
    };
    const getStatusNodeStyle = (status, isSelected) => {
        switch (status) {
            case 'completed':
                return 'bg-white border-blue-500 text-blue-600 ring-1 ring-blue-500/20 dark:bg-[#141414] dark:border-[#3B82F6] dark:text-[#3B82F6] dark:ring-[#3B82F6]/20 accent:border-brand accent:text-brand-text accent:ring-brand/20';
            case 'in-progress':
                return 'bg-white border-blue-500 text-blue-600 shadow-xs ring-2 ring-blue-500/30 dark:bg-[#141414] dark:border-[#3B82F6] dark:text-[#3B82F6] dark:ring-[#3B82F6]/30 accent:border-brand accent:text-brand-text accent:ring-brand/30';
            case 'failed':
                return 'bg-rose-500/10 border-rose-500 text-rose-600 ring-1 ring-rose-500/30 dark:text-rose-400';
            case 'warning':
                return 'bg-amber-500/10 border-amber-500 text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-400';
            case 'pending':
            default:
                return isSelected
                    ? 'bg-neutral-100 border-neutral-400 text-neutral-600 dark:bg-[#141414] dark:border-[#4A4A4A] dark:text-[#A1A1A1]'
                    : 'bg-white border-neutral-200 text-neutral-500 dark:bg-[#0E0E0E] dark:border-[#1F1F1F] dark:text-muted-foreground';
        }
    };
    // Calculate completed count for progress line indicator
    const completedIndex = items.reduce((acc, curr, idx) => {
        return curr.status === 'completed' || curr.status === 'in-progress' ? idx : acc;
    }, -1);
    const progressPercent = items.length > 1 && completedIndex >= 0
        ? (completedIndex / (items.length - 1)) * 100
        : 0;
    // ioiti-ui: a plain block named by its list, not a landmark: a page may open several.
    return (_jsx("div", { className: cn('w-full rounded-xl border border-neutral-200 bg-white p-3.5 sm:p-5 text-neutral-900 dark:border-[#1F1F1F] dark:bg-[#0E0E0E] dark:text-[#FAFAFA]', className), ...props, children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute left-[17px] top-6 bottom-6 w-[2px] bg-neutral-200 dark:bg-[#1F1F1F]" }), _jsx(motion.div
                // ioiti-ui: in the accent, where the theme has one (accent:).
                , { 
                    // ioiti-ui: in the accent, where the theme has one (accent:).
                    className: "absolute left-[17px] top-6 w-[2px] bg-gradient-to-b from-[#3B82F6] via-[#3B82F6]/80 to-transparent accent:from-brand accent:via-brand/80 origin-top", initial: { height: 0 }, animate: { height: `${progressPercent}%` }, transition: motionTransitions.springGentle }), _jsx("div", { className: "space-y-3 sm:space-y-4 relative", role: "list", "aria-label": label, children: items.map((item) => {
                        const details = hasDetails(item);
                        const isExpanded = details && expandedIds.has(item.id);
                        const isSelected = selectedId === item.id;
                        const itemId = `${listId}-item-${item.id}`;
                        return (_jsxs("div", { role: "listitem", className: "relative flex items-start gap-4 group", children: [_jsxs("button", { type: "button", onClick: () => handleToggleExpand(item), "aria-expanded": collapsible && details ? isExpanded : undefined, "aria-controls": collapsible && details ? itemId : undefined, className: cn('relative z-10 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 shrink-0 focus-visible:outline-none cursor-pointer', getStatusNodeStyle(item.status, isSelected)), title: `${item.title} - ${item.statusLabel ?? item.status}`, children: [getStatusIcon(item.status), item.status === 'in-progress' && (_jsx("span", { className: "absolute inset-0 rounded-full animate-ping bg-[#3B82F6]/20 accent:bg-brand/20 -z-10" }))] }), _jsxs("div", { onClick: () => handleToggleExpand(item), className: cn('flex-1 min-w-0 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden p-3.5 sm:p-4', isSelected
                                        ? 'bg-neutral-50 border-neutral-300 shadow-xs dark:bg-[#141414] dark:border-[#4A4A4A]'
                                        : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 dark:bg-[#0E0E0E] dark:border-[#1F1F1F] dark:hover:border-[#4A4A4A] dark:hover:bg-[#141414]'), children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [_jsx("span", { className: "text-xs sm:text-sm font-medium text-neutral-900 dark:text-[#FAFAFA] truncate", children: item.title }), item.tag && (_jsx("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-600 dark:bg-[#141414] dark:border-[#1F1F1F] dark:text-[#A1A1A1]", children: item.tag })), item.statusLabel && (_jsx("span", { className: cn('text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border', getStatusBadgeStyle(item.status)), children: item.statusLabel }))] }), _jsx("span", { className: "text-[11px] font-mono text-muted-foreground block", children: item.timestamp })] }), _jsx("div", { className: "flex items-center gap-1.5 shrink-0", children: collapsible && details && (_jsx(motion.div, { animate: { rotate: isExpanded ? 180 : 0 }, transition: { duration: 0.2 }, className: "text-muted-foreground group-hover:text-neutral-900 dark:group-hover:text-[#FAFAFA] p-1", children: _jsx(ChevronDown, { className: "w-4 h-4" }) })) })] }), _jsx(AnimatePresence, { initial: false, children: isExpanded && (_jsx(motion.div, { id: itemId, initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: motionTransitions.springGentle, className: "overflow-hidden", children: _jsxs("div", { className: "pt-3 mt-3 border-t border-neutral-200 dark:border-[#1F1F1F] space-y-3", children: [item.description && (_jsx("p", { className: "text-xs text-neutral-600 dark:text-[#A1A1A1] leading-relaxed [overflow-wrap:anywhere]", children: item.description })), item.metrics && item.metrics.length > 0 && (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1", children: item.metrics.map((m, i) => (_jsxs("div", { className: "p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 dark:bg-[#0E0E0E] dark:border-[#1F1F1F]", children: [_jsx("span", { className: "text-[10px] font-mono text-muted-foreground block uppercase", children: m.label }), _jsx("span", { className: "text-xs font-mono font-medium text-neutral-900 dark:text-[#FAFAFA]", children: m.value })] }, i))) })), (item.author || item.commitHash) && (_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] font-mono text-muted-foreground", children: [item.author && (_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-[#6B6B6B]" }), _jsx("span", { className: "text-neutral-600 dark:text-[#A1A1A1]", children: item.author.name }), item.author.role && (_jsxs("span", { className: "text-muted-foreground", children: ["(", item.author.role, ")"] }))] })), item.commitHash && (_jsxs("button", { type: "button", onClick: (e) => handleCopyHash(e, item.commitHash), className: "inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 text-neutral-600 hover:text-neutral-900 transition-colors focus-visible:outline-none cursor-pointer dark:bg-[#0E0E0E] dark:hover:bg-[#141414] dark:border-[#1F1F1F] dark:hover:border-[#4A4A4A] dark:text-[#A1A1A1] dark:hover:text-[#FAFAFA]", title: "Copy commit hash", children: [_jsx(GitCommit, { className: "w-3 h-3" }), _jsx("span", { children: item.commitHash.slice(0, 7) }), copiedHash === item.commitHash ? (_jsx(CheckCheck, { className: "w-3 h-3 text-neutral-900 dark:text-white" })) : (_jsx(Copy, { className: "w-3 h-3 text-muted-foreground" }))] }))] }))] }) })) })] })] }, item.id));
                    }) })] }) }));
};
