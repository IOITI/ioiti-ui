'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronDown, User, Clock, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { PRESSABLE, SECTION } from '../../lib/recipes.js';
import { useScrollRegion } from '../../lib/scroll-region.js';
import { useLocale, useMessages } from '../locale-context.js';
// ioiti-ui: a diff wider than its box, holding no control: a stop of the keyboard, which scrolls it
// (src/lib/scroll-region.ts).
function DiffFrame({ children }) {
    const frame = useRef(null);
    // ioiti-ui: named in the provider's language.
    const label = useMessages().ledger.changes;
    const region = useScrollRegion(frame, { label });
    return (_jsx("div", { ref: frame, ...region, className: "p-2 rounded-lg bg-surface-raised border border-border/60 font-mono text-xs text-text-secondary leading-relaxed overflow-x-auto", children: _jsx("pre", { children: children }) }));
}
export const RecoveryLedger = ({ entries, currentEntryId, onRestore, onSelect, expandedId: controlledExpandedId, onExpandedChange, title: givenTitle, countLabel, restoreLabel: givenRestoreLabel, currentLabel: givenCurrentLabel, variant = 'timeline', className, }) => {
    // ioiti-ui: its words in the provider's language, the ones given over them; a date in its locale, on its clock.
    const words = useMessages().ledger;
    const { locale, hourCycle } = useLocale();
    const title = givenTitle ?? words.title;
    const restoreLabel = givenRestoreLabel ?? words.restore;
    const currentLabel = givenCurrentLabel ?? words.current;
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
        // ioiti-ui: glass under the glass material, as a card (glass-card); a section, as a Panel.
        SECTION, 'w-full overflow-hidden', className), children: [_jsx("div", { className: "px-4 py-3 border-b border-border/40 bg-surface-raised/60 flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { "aria-hidden": "true", className: "size-4 text-muted-foreground" }), _jsx("h3", { className: "text-sm font-semibold text-foreground", children: title }), _jsx("span", { className: "text-[11px] font-mono tabular-nums text-muted-foreground bg-surface px-2 py-0.5 rounded-full border border-border", children: countLabel ?? words.count(entries.length) })] }) }), _jsxs("div", { className: "relative p-4", children: [variant === 'timeline' && (_jsx("div", { "aria-hidden": "true", className: "absolute top-6 bottom-6 left-[23px] w-[2px] bg-border pointer-events-none" })), _jsx("ol", { "aria-label": title, className: "space-y-4", children: entries.map((entry, idx) => {
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
                                    : entry.timestamp.toLocaleString(locale, { hourCycle });
                            const summary = (_jsxs(_Fragment, { children: [_jsxs("span", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "text-sm font-semibold text-foreground", children: entry.action }), isCurrent && (_jsx("span", { className: "px-1.5 py-0.5 rounded-sm text-[11px] font-mono bg-positive/5 text-positive border border-positive/30 dark:bg-positive/10", children: currentLabel }))] }), _jsx("span", { className: "block text-xs text-muted-foreground mt-0.5 leading-relaxed", children: entry.description }), (dateStr || entry.author || entry.reference) && (_jsxs("span", { className: "flex items-center gap-3 flex-wrap text-xs font-mono text-muted-foreground mt-2", children: [dateStr && _jsx("span", { children: dateStr }), entry.reference && _jsx("span", { className: "break-all", children: entry.reference }), entry.author && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(User, { "aria-hidden": "true", className: "size-3" }), entry.author] }))] }))] }));
                            return (_jsxs(motion.li, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { ...motionTransitions.easeSoft, delay: idx * 0.05 }, className: "relative pl-8", children: [_jsx("div", { "aria-hidden": "true", className: cn('absolute left-0 top-3 size-4 rounded-full border-2 flex items-center justify-center transition-colors bg-surface', isCurrent
                                            ? 'border-positive text-positive'
                                            : isExpanded
                                                ? 'border-border-hover'
                                                : 'border-border'), children: isCurrent && _jsx("div", { className: "size-1.5 rounded-full bg-positive" }) }), _jsxs("div", { className: cn('p-3 rounded-xl border transition-colors', isCurrent
                                            ? 'bg-surface-hover border-positive/30'
                                            : isExpanded
                                                ? 'bg-surface-hover border-border-hover'
                                                : canExpand
                                                    ? 'bg-surface border-border/60 hover:border-border-hover hover:bg-surface-hover'
                                                    : 'bg-surface border-border/60'), children: [_jsxs("div", { className: "relative flex items-start justify-between gap-3", children: [canExpand ? (_jsx("button", { type: "button", onClick: () => toggleExpand(entry.id), "aria-expanded": isExpanded, "aria-controls": isExpanded ? detailsId : undefined, className: "group min-w-0 text-left rounded-md cursor-pointer after:absolute after:inset-0 after:content-['']", children: summary })) : (_jsx("div", { className: "min-w-0", children: summary })), _jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [!isCurrent && isRestorable && onRestore && (_jsxs("button", { type: "button", disabled: Boolean(restoringId), onClick: (e) => handleRestore(entry.id, e), className: cn('relative z-10 px-2.5 py-1 rounded-md text-xs font-medium bg-surface text-text-secondary border border-border hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1', PRESSABLE), "aria-label": words.restoreEntry({ restore: restoreLabel, action: entry.action }), children: [isRestoring ? (_jsx(Loader2, { "aria-hidden": "true", className: "size-3 animate-spin" })) : (_jsx(RotateCcw, { "aria-hidden": "true", className: "size-3" })), _jsx("span", { children: restoreLabel })] })), canExpand && (_jsx("div", { "aria-hidden": "true", className: "p-1 text-muted-foreground pointer-events-none", children: _jsx(motion.div, { animate: { rotate: isExpanded ? 180 : 0 }, transition: motionTransitions.springSnappy, children: _jsx(ChevronDown, { className: "size-4" }) }) }))] })] }), _jsx(AnimatePresence, { children: isExpanded && entry.details && (_jsxs(motion.div, { id: detailsId, initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: motionTransitions.springSmooth, className: "mt-3 pt-2.5 border-t border-border/40 overflow-hidden", children: [entry.details.diff && (_jsx(DiffFrame, { children: entry.details.diff })), entry.details.preview && (_jsx("p", { className: "text-xs text-muted-foreground mt-2", children: entry.details.preview })), entry.details.content] })) })] })] }, entry.id));
                        }) })] })] }));
};
