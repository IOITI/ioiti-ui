import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, useLayoutEffect, useRef } from 'react';
import { formatMoney, formatPercent, toneOf } from '../lib/format.js';
import { HEALTH_STATUS_LABEL } from '../lib/health.js';
import { cn } from '../lib/utils.js';
import { Alert, AlertDescription, AlertTitle } from './ui/alert.js';
import { AnimatedNumber } from './ui/animated-number.js';
import { Badge } from './ui/badge.js';
import { Skeleton } from './ui/skeleton.js';
const HEALTH_TONE = {
    ok: 'success',
    warning: 'warning',
    down: 'danger',
    unknown: 'neutral',
    disabled: 'neutral',
};
/** A state: always a word next to the colour, never the colour alone. */
export function StatusBadge({ status, label }) {
    return (_jsx(Badge, { tone: HEALTH_TONE[status], dot: status !== 'disabled', children: label ?? HEALTH_STATUS_LABEL[status] }));
}
const TONE_TEXT = {
    positive: 'text-positive',
    negative: 'text-negative',
    neutral: 'text-foreground/80',
};
/** A gain or a loss, a change: signed, so the sign carries the meaning and the colour repeats it. */
export function SignedValue({ value, kind, currency, className, animate = false, stale = false, staleLabel = 'stale', }) {
    const text = kind === 'money' ? formatMoney(value, currency ?? 'EUR', true) : formatPercent(value, true);
    const tone = stale ? 'text-text-muted' : TONE_TEXT[toneOf(value)];
    const said = stale && _jsxs("span", { className: "sr-only", children: [" (", staleLabel, ")"] });
    if (animate && typeof value === 'number' && Number.isFinite(value)) {
        // The number first in both cases: it is not drawn again (its digits rolled anew) as it goes stale.
        return (_jsxs(_Fragment, { children: [_jsx(AnimatedNumber, { value: value, text: text, className: cn(tone, className) }), said] }));
    }
    return (_jsxs("span", { className: cn('tabular-nums', tone, className), children: [text, said] }));
}
const REVEAL = 'animate-reveal';
/** *element* fades in (the motion's `animate-reveal`), then keeps no trace of it. */
function reveal(element) {
    if (element.classList.contains(REVEAL))
        return;
    element.classList.add(REVEAL);
    const done = (event) => {
        if (event.target !== element)
            return; // one of its own children's animations
        element.classList.remove(REVEAL);
        element.removeEventListener('animationend', done);
        element.removeEventListener('animationcancel', done);
    };
    element.addEventListener('animationend', done);
    element.addEventListener('animationcancel', done);
}
/**
 * While *waiting*, watches the element the skeleton is in: what is put there as the skeleton's *marker* leaves
 * it, in the same commit, fades in. Nothing wraps it: the page's own spacing (a column's gaps and margins, a
 * grid's cells) applies to it as it arrives as to what was there from the start.
 */
function useRevealOfWhatReplaces(marker, waiting) {
    const unmounted = useRef(false);
    // Declared first: on unmount its cleanup runs first, and the watch below then ends with nothing revealed.
    useLayoutEffect(() => {
        unmounted.current = false;
        return () => {
            unmounted.current = true;
        };
    }, []);
    useLayoutEffect(() => {
        const node = marker.current;
        const parent = waiting ? node?.parentNode : null;
        if (!node || !parent || typeof MutationObserver === 'undefined')
            return;
        const observer = new MutationObserver((records) => void handle(records));
        /** Reveals what replaced the skeleton, once its marker left; false while it waits still. */
        function handle(records) {
            // A change of another part of the page: this skeleton still waits.
            if (!records.some((record) => Array.from(record.removedNodes).includes(node)))
                return false;
            observer.disconnect();
            for (const record of records) {
                for (const added of Array.from(record.addedNodes)) {
                    if (added instanceof Element && added.isConnected)
                        reveal(added);
                }
            }
            return true;
        }
        observer.observe(parent, { childList: true });
        return () => {
            if (unmounted.current) {
                observer.disconnect();
                return;
            }
            // The wait ended: what replaces the skeleton is in the page already (React puts a component's children
            // before its effects end), and its records wait to be read. Else the watch's own callback reads them.
            if (!handle(observer.takeRecords()))
                window.setTimeout(() => observer.disconnect(), 1000);
        };
    }, [marker, waiting]);
}
/**
 * Loading and failure states shared by the pages. A failed refresh never blanks what is on screen.
 * What arrives where a skeleton was fades in (animate-reveal); what is there from the start is shown
 * as it is. It has no box of its own, at any time: what it shows keeps its place among the page's (a column's
 * gaps and margins, a grid's cells).
 */
export function QueryState({ isPending, error, hasData, skeleton, children }) {
    const waiting = isPending && !hasData;
    const marker = useRef(null);
    useRevealOfWhatReplaces(marker, waiting);
    if (waiting) {
        return (_jsxs(_Fragment, { children: [_jsx("template", { ref: marker }, "marker"), _jsx(Fragment, { children: skeleton ?? _jsx(Skeleton, { className: "h-40 w-full rounded-2xl" }) }, "skeleton")] }));
    }
    return (_jsxs(_Fragment, { children: [error && (_jsxs(Alert, { tone: "danger", role: "alert", children: [_jsx(AlertTitle, { children: hasData ? 'Could not refresh: showing the last data received' : 'Could not load' }), _jsx(AlertDescription, { children: error.message })] }, "error")), hasData && _jsx(Fragment, { children: children }, "data")] }));
}
