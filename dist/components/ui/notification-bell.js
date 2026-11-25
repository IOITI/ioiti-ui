'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Bell, CheckCheck, X } from 'lucide-react';
import { useAnchoredLayer } from '../../lib/anchor.js';
// ioiti-ui: held by its caller or by itself, as every layer (useControllableState); a former name said once, in
// development (deprecated).
import { useControllableState } from '../../lib/controllable.js';
import { deprecated } from '../../lib/deprecated.js';
import { isPlainClick } from '../../lib/links.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, FLOATING, PRESSABLE, TONE_LINE, TONE_MARK, TONE_SOFT, TONE_SOLID } from '../../lib/recipes.js';
import { useLinkComponent } from '../link-context.js';
// ioiti-ui: its words in the provider's language, its counts in its locale.
import { useFormat, useMessages } from '../locale-context.js';
// ioiti-ui: a moment is said from now, its full date in a hint.
import { RelativeTime } from '../RelativeTime.js';
import { Hint } from '../Hint.js';
import { Skeleton } from './skeleton.js';
// ioiti-ui: the design's tones (recipes.ts), as a dot.
const DOT = {
    neutral: TONE_MARK.neutral,
    info: TONE_MARK.info,
    success: TONE_MARK.positive,
    warning: TONE_MARK.warning,
    danger: `${TONE_MARK.negative} animate-pulse`,
};
export const NotificationBell = ({ notifications, onMarkAsRead, onMarkAllAsRead, open, defaultOpen = false, isOpen: formerOpen, onOpenChange, showCount = true, linkComponent, footer, loading = false, error, onRetry, triggerClassName, className, }) => {
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const LinkComponent = useLinkComponent(linkComponent);
    // ioiti-ui: its words in the provider's language, its counts in its locale ("1 unread notification", counted).
    const words = useMessages().notification;
    const { formatNumber } = useFormat();
    const [isShaking, setIsShaking] = useState(false);
    const triggerRef = useRef(null);
    const layerRef = useRef(null);
    // ioiti-ui: `open`, as every layer; `isOpen`, its former name, read where it alone is given. Held by the bell unless
    // the page holds it, `onOpenChange` told either way: given without `isOpen`, it took the bell's own state's place,
    // and the panel never opened.
    if (formerOpen !== undefined)
        deprecated('notification-bell-is-open', 'NotificationBell');
    const [isPanelOpen, setPanelOpen] = useControllableState(open ?? formerOpen, defaultOpen, onOpenChange);
    const unreadCount = notifications.filter((n) => !n.read).length;
    const prevCountRef = useRef(unreadCount);
    // Trigger subtle bell shake when new unread notifications arrive
    useEffect(() => {
        if (unreadCount > prevCountRef.current) {
            setIsShaking(true);
            const timer = setTimeout(() => setIsShaking(false), 600);
            return () => clearTimeout(timer);
        }
        prevCountRef.current = unreadCount;
    }, [unreadCount]);
    // ioiti-ui: the panel is a layer in document.body, placed under the bell (anchor.ts): drawn in the top bar, it would
    // be held by a blur, a filter or a transform the bar took (its containing block, its backdrop's root: the panel's own
    // blur would see nothing of the page).
    // A press elsewhere, Escape and a Tab past its ends close it; the focus goes into it, and back to the bell.
    const layer = useAnchoredLayer({
        open: isPanelOpen,
        onClose: () => setPanelOpen(false),
        triggerRef,
        layerRef,
        side: 'bottom',
        align: 'end',
        offset: 8,
    });
    // ioiti-ui: the notifications could not be read, and what to do about it.
    const failed = error !== undefined && error !== null && error !== false && error !== '';
    const failedSaid = error === true ? words.readFailed : error;
    const retry = failed && onRetry && (_jsx("button", { type: "button", onClick: onRetry, className: "shrink-0 rounded-md px-1.5 py-0.5 text-sm font-medium text-foreground underline-offset-2 hover:underline focus-ring cursor-pointer", children: words.tryAgain }));
    return (_jsxs("div", { className: cn('relative inline-block', className), children: [_jsxs(motion.button, { ref: triggerRef, type: "button", onKeyDown: layer.onTriggerKeyDown, onClick: () => setPanelOpen(!isPanelOpen), animate: isShaking
                    ? {
                        rotate: [0, -12, 10, -8, 6, -2, 0],
                    }
                    : {}, transition: { ...motionTransitions.easeSoft, duration: 0.5 }, "aria-expanded": isPanelOpen, "aria-label": unreadCount > 0
                    ? words.unread(unreadCount)
                    : words.notifications, className: cn('relative cursor-pointer transition-colors', triggerClassName ??
                    // ioiti-ui: the top bar's icon buttons' look (IconButton), where it sits: square, quiet until hovered, giving
                    // a little when pressed; held as pressed while its panel is open. EasyUI's was a bordered box that grew.
                    cn('grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-[color,background-color,scale] hover:bg-surface-hover hover:text-foreground [&>svg]:size-[18px]', PRESSABLE, isPanelOpen && 'bg-surface-hover text-foreground')), children: [_jsx(Bell, {}), _jsx(AnimatePresence, { children: unreadCount > 0 && (_jsx(motion.span, { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0, opacity: 0 }, transition: motionTransitions.springSnappy, className: cn('absolute -top-1 -right-1 flex items-center justify-center rounded-full font-mono font-semibold tabular-nums border-2 border-background', TONE_SOLID.negative, showCount
                                ? 'min-w-[18px] h-[18px] px-1 text-[11px]'
                                : 'size-2.5'), children: showCount && (unreadCount > 99 ? words.overflow(99) : formatNumber(unreadCount)) })) })] }), typeof document !== 'undefined' &&
                createPortal(_jsx(AnimatePresence, { children: isPanelOpen && (_jsxs(motion.div, { ref: layerRef, tabIndex: -1, onKeyDown: layer.onLayerKeyDown, style: layer.style, initial: { opacity: 0, y: 8, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, 
                        // ioiti-ui: it leaves quicker than it came (easeExit), as everything that floats.
                        exit: { opacity: 0, y: 8, scale: 0.95, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, role: "dialog", "aria-label": words.notifications, 
                        // ioiti-ui: on a phone the panel spans the screen but its edges (centred on the bell, it went past the edge).
                        // Glass under the glass material (glass-float), its header clear on it.
                        className: cn(FLOATING, 'flex w-[calc(100vw-2rem)] flex-col outline-none sm:w-96 z-50 overflow-hidden'), children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border bg-surface-raised glass:bg-transparent", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-semibold text-foreground", children: words.notifications }), unreadCount > 0 && (_jsx("span", { className: cn('px-1.5 py-0.5 rounded-full border text-[11px] font-mono tabular-nums', TONE_SOFT.negative, TONE_LINE.negative), children: words.newCount(unreadCount) }))] }), _jsxs("div", { className: "flex items-center gap-1", children: [unreadCount > 0 && onMarkAllAsRead && (_jsx(Hint, { content: words.markAllRead, children: _jsxs("button", { type: "button", onClick: onMarkAllAsRead, className: cn('p-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-[color,background-color,scale] flex items-center gap-1', PRESSABLE), children: [_jsx(CheckCheck, { className: "size-3.5" }), _jsx("span", { children: words.readAll })] }) })), _jsx("button", { type: "button", onClick: () => setPanelOpen(false), className: CLOSE_SM, "aria-label": words.close, children: _jsx(X, {}) })] })] }), failed && notifications.length > 0 && (_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-border px-4 py-2 text-sm text-negative", children: [_jsx("span", { className: "min-w-0", children: failedSaid }), retry] })), _jsx("div", { className: "min-h-0 max-h-80 overflow-y-auto divide-y divide-border/40", children: notifications.length === 0 && failed ? (_jsxs("div", { className: "py-8 px-4 text-center", children: [_jsx(AlertCircle, { "aria-hidden": "true", className: "size-6 text-negative mx-auto mb-2" }), _jsx("p", { className: "text-sm text-negative", children: failedSaid }), retry && _jsx("div", { className: "mt-3 flex justify-center", children: retry })] })) : notifications.length === 0 && loading ? (_jsx("div", { role: "status", "aria-label": words.loading, className: "divide-y divide-border/40", children: [0, 1, 2].map((row) => (_jsxs("div", { className: "p-3 flex items-start gap-3", children: [_jsx(Skeleton, { className: "size-2 rounded-full mt-1.5 shrink-0" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { className: "h-3 w-4/5" }), _jsx(Skeleton, { className: "h-2.5 w-1/4" })] })] }, row))) })) : notifications.length === 0 ? (_jsxs("div", { className: "py-8 px-4 text-center", children: [_jsx(Bell, { className: "size-6 text-muted-foreground mx-auto mb-2" }), _jsx("p", { className: "text-xs text-muted-foreground", children: words.empty })] })) : (notifications.map((item) => {
                                    const messageClass = cn('text-sm leading-relaxed text-muted-foreground', !item.read && 'font-medium text-foreground');
                                    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: cn('p-3 flex items-start gap-3 transition-colors hover:bg-surface-hover', !item.read && 'bg-surface-hover'), children: [_jsx("span", { "aria-hidden": "true", className: cn('size-2 rounded-full mt-1.5 shrink-0', item.read ? 'bg-transparent' : DOT[item.tone ?? 'danger']) }), _jsxs("div", { className: "flex-1 min-w-0", children: [item.href !== undefined ? (_jsx(LinkComponent, { href: item.href, onClick: (e) => {
                                                            onMarkAsRead(item.id);
                                                            if (isPlainClick(e))
                                                                setPanelOpen(false);
                                                        }, className: cn(messageClass, 'block underline-offset-2 hover:underline'), children: item.message })) : (_jsx("p", { className: messageClass, children: item.message })), item.detail && (_jsx("p", { className: "text-xs text-muted-foreground leading-relaxed [overflow-wrap:anywhere]", children: item.detail })), _jsx("span", { className: "text-xs font-mono text-muted-foreground mt-1 block", children: typeof item.timestamp === 'string' ? item.timestamp : _jsx(RelativeTime, { value: item.timestamp, past: true }) })] }), !item.read && (_jsx(Hint, { content: words.markRead, children: _jsx("button", { type: "button", onClick: () => onMarkAsRead(item.id), className: cn('p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-raised transition-[color,background-color,scale] shrink-0', PRESSABLE), "aria-label": words.markNotificationRead, children: _jsx(CheckCheck, { className: "size-3.5" }) }) }))] }, item.id));
                                })) }), footer && (_jsx("div", { className: "border-t border-border px-4 py-2.5 text-xs text-muted-foreground", children: footer }))] })) }), document.body)] }));
};
