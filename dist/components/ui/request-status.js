'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotionConfig } from 'framer-motion';
import { Check, AlertCircle, Copy, Send, Hourglass, CircleHelp, ArrowRight, X } from 'lucide-react';
import { cn, copyToClipboard } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, TONE_LINE, TONE_SOFT } from '../../lib/recipes.js';
import { useLinkComponent } from '../link-context.js';
// ioiti-ui: its buttons named in the provider's language.
import { useMessages } from '../locale-context.js';
// ioiti-ui: the design's tokens, and its tones (recipes.ts) for an outcome.
const BADGE = 'size-11 shrink-0 rounded-full flex items-center justify-center relative border';
const QUIET = 'bg-surface-raised border-border';
// ioiti-ui: no Retry, no other payment method, no receipt to view or download: the card follows what was asked and
// acts on nothing. Laid out in a row (the badge beside the words): docked at the edge of the screen, EasyUI's
// centred column took half of a phone's height.
export const RequestStatus = ({ status = 'processing', title, description, subject, figures = [], reference, link, linkComponent, onDismiss, className, }) => {
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const LinkComponent = useLinkComponent(linkComponent);
    const words = useMessages().toast;
    const [copied, setCopied] = useState(false);
    const reduce = useReducedMotionConfig();
    // ioiti-ui: a spinner stands still where motion is reduced.
    const spin = reduce ? undefined : { rotate: 360 };
    const handleCopyId = () => {
        if (!reference)
            return;
        void copyToClipboard(reference.value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (_jsxs("div", { className: cn(
        // ioiti-ui: a card in the page, with no shadow (it does not float); glass under the glass material (glass-card).
        'w-full rounded-2xl border border-border bg-surface p-5 text-left font-sans text-foreground glass-card', className), children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsxs("div", { className: "relative", "aria-hidden": "true", children: [status === 'processing' && (_jsxs("div", { className: cn(BADGE, QUIET), children: [_jsx(motion.div, { className: "absolute inset-0 rounded-full border border-foreground/25 border-t-foreground accent:border-brand/25 accent:border-t-brand", animate: spin, transition: { duration: 1.2, repeat: Infinity, ease: 'linear' } }), _jsx(Send, { className: "size-4 text-muted-foreground" })] })), status === 'verifying' && (_jsxs("div", { className: cn(BADGE, QUIET), children: [_jsx(motion.div, { className: "absolute inset-1 rounded-full border border-info/30 border-t-info", animate: spin, transition: { duration: 1, repeat: Infinity, ease: 'linear' } }), _jsx(Hourglass, { className: "size-5 text-info" })] })), status === 'success' && (_jsx(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: motionTransitions.springSnappy, className: cn(BADGE, TONE_SOFT.positive, TONE_LINE.positive), children: _jsx("svg", { className: "size-6", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx(motion.path, { d: "M20 6L9 17l-5-5", initial: { pathLength: reduce ? 1 : 0 }, animate: { pathLength: 1 }, transition: { ...motionTransitions.easeSoft, delay: 0.1 } }) }) })), status === 'failed' && (_jsx(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: motionTransitions.springSnappy, className: cn(BADGE, TONE_SOFT.negative, TONE_LINE.negative), children: _jsx(AlertCircle, { className: "size-6" }) })), status === 'unknown' && (_jsx(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: motionTransitions.springSnappy, className: cn(BADGE, QUIET, 'text-muted-foreground'), children: _jsx(CircleHelp, { className: "size-6" }) }))] }), _jsxs("div", { className: "min-w-0 flex-1", role: "status", "aria-live": "polite", children: [_jsx("h3", { className: "text-base font-semibold text-foreground tracking-tight text-balance", children: title }), description && (_jsx("p", { className: "text-sm text-muted-foreground mt-1 text-pretty", children: description })), subject && (_jsx("div", { className: "mt-3 inline-flex max-w-full items-center gap-1.5 px-3 py-1 rounded-full bg-surface-raised border border-border", children: _jsx("span", { className: "truncate text-xs font-medium text-foreground", children: subject }) }))] }), onDismiss && (_jsx("button", { type: "button", onClick: onDismiss, "aria-label": words.dismiss, className: cn(CLOSE_SM, '-mr-1 -mt-1'), children: _jsx(X, {}) }))] }), _jsx(AnimatePresence, { mode: "wait", children: (figures.length > 0 || reference || link) && (_jsxs(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 }, transition: motionTransitions.springGentle, className: "mt-4 pt-4 border-t border-border space-y-1.5 text-sm", children: [figures.map((figure) => (_jsxs("div", { className: "flex items-baseline justify-between gap-3 py-0.5", children: [_jsx("span", { className: "text-muted-foreground", children: figure.label }), _jsx("span", { className: "min-w-0 text-right tabular-nums text-foreground", children: figure.value })] }, figure.label))), reference && (_jsxs("div", { className: "flex items-center justify-between gap-3 py-0.5", children: [_jsx("span", { className: "text-muted-foreground", children: reference.label }), _jsxs("button", { type: "button", onClick: handleCopyId, className: "inline-flex min-w-0 items-center gap-1 font-mono text-muted-foreground hover:text-foreground transition-[color,scale] px-1.5 py-0.5 rounded-md bg-surface-raised border border-border cursor-pointer motion-safe:active:scale-[0.97]", "aria-label": words.copyReference(reference), children: [_jsx("span", { className: "truncate", children: reference.value }), copied ? (_jsx(Check, { className: "size-3.5 shrink-0 text-positive" })) : (_jsx(Copy, { className: "size-3.5 shrink-0 text-muted-foreground" }))] })] })), link && (_jsx("div", { className: "pt-2", children: _jsxs(LinkComponent, { href: link.href, className: "inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline", children: [link.label, _jsx(ArrowRight, { className: "size-4", "aria-hidden": "true" })] }) }))] })) })] }));
};
