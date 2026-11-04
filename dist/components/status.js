import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
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
/**
 * Loading and failure states shared by the pages. A failed refresh never blanks what is on screen.
 * What arrives where a skeleton was fades in (animate-reveal); what is there from the start is shown
 * as it is.
 */
export function QueryState({ isPending, error, hasData, skeleton, children }) {
    const waiting = isPending && !hasData;
    const [waited, setWaited] = useState(waiting);
    if (waiting && !waited)
        setWaited(true);
    if (waiting) {
        return skeleton ?? _jsx(Skeleton, { className: "h-40 w-full rounded-2xl" });
    }
    return (_jsxs(_Fragment, { children: [error && (_jsxs(Alert, { tone: "danger", role: "alert", children: [_jsx(AlertTitle, { children: hasData ? 'Could not refresh: showing the last data received' : 'Could not load' }), _jsx(AlertDescription, { children: error.message })] })), hasData &&
                (waited ? (_jsx("div", { className: "contents [&>*]:animate-reveal", children: children })) : (children))] }));
}
