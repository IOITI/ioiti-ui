'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, createContext, useContext, useId } from 'react';
// ioiti-ui: useReducedMotionConfig for what MotionConfig does not reduce (a height, a caret's blink).
import { motion, AnimatePresence, useReducedMotion, useReducedMotionConfig } from 'framer-motion';
import { Check, RotateCw, AlertCircle, Pause, ChevronDown, } from 'lucide-react';
import { useControllableState } from '../../lib/controllable.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { cn } from '../../lib/utils.js';
// =============================================================================
// DESIGN SYSTEM CONSTANTS & SPRING TOKENS
// =============================================================================
const SPRING_PHYSICS = {
    type: 'spring',
    stiffness: 300,
    damping: 32,
    mass: 0.6,
};
const AgentActivityContext = createContext(null);
export function useAgentActivity() {
    const ctx = useContext(AgentActivityContext);
    if (!ctx) {
        throw new Error('AgentActivity compound subcomponents must be used within <AgentActivity>');
    }
    return ctx;
}
// =============================================================================
// HELPER: TYPE & STATUS ICONS (MINIMALIST & REFINED)
// =============================================================================
export function getActivityIcon(_type, status) {
    if (status === 'running') {
        return _jsx(RotateCw, { className: "w-3 h-3 animate-spin text-foreground stroke-[2]" });
    }
    if (status === 'error') {
        return _jsx(AlertCircle, { className: "w-3.5 h-3.5 text-rose-500 stroke-[2]" });
    }
    if (status === 'cancelled') {
        return _jsx(Pause, { className: "w-3 h-3 text-muted-foreground stroke-[2]" });
    }
    if (status === 'success') {
        return _jsx(Check, { className: "w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" });
    }
    // Pending / default: clean minimal point
    return _jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-border" });
}
export const AgentActivityHeader = ({ title = 'Activity', agentName, showControls = true, className, }) => {
    const { activities, isRunning, expandAll, collapseAll, summary, collapsible, open, setOpen, bodyId } = useAgentActivity();
    // ioiti-ui: the steps alone are counted: a note is no step.
    const steps = activities.filter((a) => (a.kind ?? 'step') === 'step');
    const completedCount = steps.filter((a) => a.status === 'success').length;
    const shown = !collapsible || open;
    // ioiti-ui: what folds is opened by its header (in its heading, as a disclosure is): spans, a button's content.
    const Title = collapsible ? 'span' : 'h3';
    const said = (_jsxs(_Fragment, { children: [_jsxs("span", { className: "flex items-center gap-1.5 sm:gap-2 min-w-0", children: [_jsx(Title, { className: "text-sm font-medium text-foreground tracking-tight truncate", children: title }), agentName && (_jsxs("span", { className: "text-xs text-muted-foreground font-normal truncate", children: ["\u2014 ", agentName] }))] }), _jsx("span", { className: "w-1 h-1 rounded-full bg-border shrink-0 hidden sm:inline-block" }), _jsx("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground font-normal", children: isRunning ? (_jsxs("span", { className: "flex items-center gap-1.5 text-foreground", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), "Running"] })) : (_jsx("span", { children: summary ?? `${completedCount} of ${steps.length} completed` })) })] }));
    const line = 'flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap sm:flex-nowrap';
    return (_jsxs("div", { className: cn('px-4 py-3.5 sm:px-8 sm:py-5 border-b border-border/60 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-4 select-none', 
        // ioiti-ui: folded, nothing under it to set apart (the line kept, so that nothing moves).
        !shown && 'border-b-transparent', className), children: [collapsible ? (_jsx("h3", { className: "min-w-0", children: _jsxs("button", { type: "button", onClick: () => setOpen(!open), "aria-expanded": open, "aria-controls": open ? bodyId : undefined, className: cn(line, 'group/fold max-w-full rounded-md text-left cursor-pointer'), children: [_jsx(motion.span, { animate: { rotate: open ? 0 : -90 }, transition: motionTransitions.springSnappy, className: "shrink-0 text-muted-foreground/70 group-hover/fold:text-foreground transition-colors", children: _jsx(ChevronDown, { className: "w-3.5 h-3.5" }) }), said] }) })) : (_jsx("div", { className: line, children: said })), showControls && shown && (_jsxs("div", { className: "flex items-center gap-2.5 sm:gap-3 text-xs text-muted-foreground font-normal shrink-0 ml-auto sm:ml-0", children: [_jsx("button", { type: "button", onClick: expandAll, className: "hover:text-foreground transition-colors cursor-pointer py-1", children: "Expand all" }), _jsx("span", { className: "text-border/80", children: "/" }), _jsx("button", { type: "button", onClick: collapseAll, className: "hover:text-foreground transition-colors cursor-pointer py-1", children: "Collapse all" })] }))] }));
};
export const AgentActivityItem = ({ activity, isLast = false, className, }) => {
    const { expandedIds, toggleExpand, inputLabel, outputLabel } = useAgentActivity();
    const isExpanded = expandedIds.has(activity.id);
    const hasDetails = Boolean(activity.details || activity.metadata);
    const shouldReduceMotion = useReducedMotion();
    const detailsId = useId();
    // ioiti-ui: an item that opens is a button (EasyUI's was a div taking clicks alone): the keyboard opens it too.
    const Header = hasDetails ? 'button' : 'div';
    return (_jsxs("div", { className: cn('relative flex items-start gap-3 sm:gap-4 group', className), children: [!isLast && (_jsx("div", { className: "absolute left-[9px] sm:left-[11px] top-6 bottom-[-20px] w-px bg-border/50 group-last:hidden" })), _jsx("div", { className: "relative z-10 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0 mt-0.5", children: _jsx("div", { className: cn('w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all', activity.status === 'running'
                        ? 'bg-surface border border-border ring-2 ring-emerald-500/20'
                        : activity.status === 'success'
                            ? 'bg-emerald-500/10 dark:bg-emerald-500/15'
                            : activity.status === 'error'
                                ? 'bg-rose-500/10 dark:bg-rose-500/20'
                                : 'bg-surface border border-border/80'), children: getActivityIcon(activity.type, activity.status) }) }), _jsxs("div", { className: "flex-1 min-w-0 pb-4 sm:pb-5", children: [_jsxs(Header, { ...(hasDetails
                            ? { type: 'button', onClick: () => toggleExpand(activity.id), 'aria-expanded': isExpanded, 'aria-controls': detailsId }
                            : {}), className: cn('block w-full text-left select-none transition-colors', hasDetails && 'cursor-pointer group/row rounded-md'), children: [_jsxs("div", { className: "flex items-center justify-between gap-2.5 sm:gap-3", children: [_jsx("div", { className: "flex items-center gap-2 min-w-0", children: _jsx("span", { className: cn('text-xs sm:text-sm tracking-tight transition-colors truncate', activity.status === 'running'
                                                ? 'font-medium text-foreground'
                                                : 'font-normal text-foreground/90 group-hover/row:text-foreground'), children: activity.title }) }), _jsxs("div", { className: "flex items-center gap-2 shrink-0 text-xs text-muted-foreground tabular-nums", children: [activity.timestamp && _jsx("span", { className: "hidden sm:inline", children: activity.timestamp }), activity.statusLabel && _jsx("span", { children: activity.statusLabel }), activity.duration && _jsx("span", { children: activity.duration }), hasDetails && (_jsx(motion.div, { animate: { rotate: isExpanded ? 180 : 0 }, transition: shouldReduceMotion ? { duration: 0 } : SPRING_PHYSICS, className: "text-muted-foreground/60 group-hover/row:text-foreground transition-colors", children: _jsx(ChevronDown, { className: "w-3.5 h-3.5" }) }))] })] }), activity.description && (_jsx("p", { className: "text-xs text-muted-foreground leading-relaxed mt-1 break-words", children: activity.description }))] }), _jsx(AnimatePresence, { children: hasDetails && isExpanded && (_jsxs(motion.div, { id: detailsId, initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: shouldReduceMotion ? { duration: 0 } : SPRING_PHYSICS, className: "overflow-hidden mt-3 pt-3 pl-3 sm:pl-3.5 border-l border-border/60 space-y-3 font-sans text-xs", children: [activity.details?.input && (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-[11px] font-medium text-muted-foreground", children: inputLabel }), _jsx("div", { className: "p-2.5 sm:p-3 rounded-lg bg-surface-raised/50 dark:bg-surface-raised/20 border border-border/40 text-foreground text-xs leading-relaxed overflow-x-auto select-text font-mono whitespace-pre-wrap break-words", children: typeof activity.details.input === 'string'
                                                ? activity.details.input
                                                : JSON.stringify(activity.details.input, null, 2) })] })), activity.details?.codeSnippet && (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-[11px] font-medium text-muted-foreground", children: activity.details.language || 'Code' }), _jsx("pre", { className: "p-2.5 sm:p-3 rounded-lg bg-surface-raised/50 dark:bg-surface-raised/20 border border-border/40 text-foreground text-xs leading-relaxed overflow-x-auto select-text font-sans", children: _jsx("code", { children: activity.details.codeSnippet }) })] })), activity.details?.output && (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-[11px] font-medium text-muted-foreground", children: outputLabel }), _jsx("div", { className: "p-2.5 sm:p-3 rounded-lg bg-surface-raised/50 dark:bg-surface-raised/20 border border-border/40 text-muted-foreground text-xs leading-relaxed overflow-x-auto select-text whitespace-pre-wrap break-words", children: typeof activity.details.output === 'string'
                                                ? activity.details.output
                                                : JSON.stringify(activity.details.output, null, 2) })] })), activity.metadata && Object.keys(activity.metadata).length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1.5 sm:gap-2 pt-1 text-xs text-muted-foreground", children: Object.entries(activity.metadata).map(([key, val]) => (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-raised/50 border border-border/40 text-[11px]", children: [_jsxs("span", { className: "text-muted-foreground", children: [key, ":"] }), _jsx("span", { className: "text-foreground font-medium", children: String(val) })] }, key))) }))] })) })] })] }));
};
// ioiti-ui: the caret at the end of a note still being written, still where motion is reduced (as AIResponse's).
function NoteCaret() {
    const reduce = useReducedMotionConfig();
    return (_jsx(motion.span, { "aria-hidden": true, "data-caret": "", className: "ml-[3px] inline-block h-[1.05em] w-[2px] translate-y-[0.2em] rounded-full bg-current", animate: reduce ? { opacity: 0.7 } : { opacity: [1, 0.15, 1] }, transition: reduce ? undefined : { repeat: Infinity, duration: 1.1, ease: 'easeInOut' } }));
}
/**
 * ioiti-ui: notes in a row, drawn together as the agent's words between two stretches of its steps: whole, from
 * the timeline's edge, with no mark, state or line; the first one's time where a step's is; the one still being
 * written (`status: 'running'`) ending with a caret.
 */
export const AgentActivityNotes = ({ notes, className }) => {
    const { notesLabel } = useAgentActivity();
    const time = notes[0]?.timestamp;
    return (_jsxs("div", { role: "group", "aria-label": notesLabel, "aria-busy": notes.some((note) => note.status === 'running') || undefined, className: cn('flex items-start justify-between gap-2.5 sm:gap-3 pb-4 sm:pb-5', className), children: [_jsx("div", { className: "min-w-0 flex-1 space-y-2", children: notes.map((note) => (_jsxs("p", { className: "text-xs sm:text-sm leading-relaxed tracking-tight text-muted-foreground whitespace-pre-line break-words", children: [note.title, note.status === 'running' && _jsx(NoteCaret, {})] }, note.id))) }), time && (_jsx("span", { className: "hidden sm:inline shrink-0 pt-px text-xs text-muted-foreground tabular-nums", children: time }))] }));
};
// ioiti-ui: the items in stretches of one kind, in their order: a timeline of steps, a group of notes.
function stretchesOf(activities) {
    const stretches = [];
    for (const activity of activities) {
        const kind = activity.kind ?? 'step';
        const last = stretches[stretches.length - 1];
        if (last?.kind === kind)
            last.items.push(activity);
        else
            stretches.push({ kind, items: [activity] });
    }
    return stretches;
}
export const AgentActivityTimeline = ({ className }) => {
    const { activities, collapsible, open, bodyId } = useAgentActivity();
    const reduce = useReducedMotionConfig();
    // ioiti-ui: each stretch of steps a timeline of its own, its line cut where notes come between them.
    const body = activities.length === 0 ? (_jsx("div", { className: "py-12 text-center text-xs text-muted-foreground font-normal", children: "No activity recorded" })) : (_jsx("div", { className: cn('px-4 sm:px-8 py-4 sm:py-7 space-y-2', className), children: stretchesOf(activities).map((stretch) => stretch.kind === 'note' ? (_jsx(AgentActivityNotes, { notes: stretch.items }, stretch.items[0].id)) : (_jsx("div", { className: "space-y-2", children: stretch.items.map((activity, index) => (_jsx(AgentActivityItem, { activity: activity, isLast: index === stretch.items.length - 1 }, activity.id))) }, stretch.items[0].id))) }));
    if (!collapsible)
        return body;
    // ioiti-ui: folded under its header; a height is not reduced by MotionConfig: reduced, it fades.
    return (_jsx(AnimatePresence, { initial: false, children: open && (_jsx(motion.div, { id: bodyId, initial: reduce ? { opacity: 0 } : { height: 0, opacity: 0 }, animate: reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }, exit: reduce ? { opacity: 0, transition: motionTransitions.easeExit } : { height: 0, opacity: 0, transition: motionTransitions.easeExit }, transition: motionTransitions.springGentle, className: "overflow-hidden", children: body }, "body")) }));
};
export const AIAgentActivity = ({ activities = [], isRunning = false, inputLabel = 'Parameters', outputLabel = 'Output Result', summary, notesLabel = 'Notes', collapsible = false, open: given, defaultOpen = true, onOpenChange, title, agentName, accentColor, defaultExpandedIds = [], className, children, }) => {
    const [expandedIds, setExpandedIds] = useState(new Set(defaultExpandedIds));
    const [open, setOpen] = useControllableState(given, defaultOpen, onOpenChange);
    const bodyId = useId();
    const toggleExpand = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    const expandAll = () => {
        setExpandedIds(new Set(activities.map((a) => a.id)));
    };
    const collapseAll = () => {
        setExpandedIds(new Set());
    };
    const contextValue = {
        activities,
        isRunning,
        inputLabel,
        outputLabel,
        summary,
        notesLabel,
        collapsible,
        open,
        setOpen,
        bodyId,
        expandedIds,
        toggleExpand,
        expandAll,
        collapseAll,
        accentColor,
    };
    return (_jsx(AgentActivityContext.Provider, { value: contextValue, children: _jsx("div", { style: {
                fontFamily: "var(--font-sans, 'Geist', sans-serif)",
                ...(accentColor ? { '--accent-custom': accentColor } : {}),
            }, className: cn(
            // ioiti-ui: glass under the glass material, as a panel.
            'w-full font-sans rounded-2xl border border-border/70 bg-surface/50 dark:bg-surface/25 text-foreground overflow-hidden transition-colors glass-card', className), children: children || (_jsxs(_Fragment, { children: [_jsx(AgentActivityHeader, { title: title, agentName: agentName }), _jsx(AgentActivityTimeline, {})] })) }) }));
};
