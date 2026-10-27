import { jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { formatNumber } from '../lib/format.js';
import { cn } from '../lib/utils.js';
/** How long a change keeps its tone, and how long it then takes to fade back. */
const HOLD = 600;
const FADE = 500;
/**
 * A figure that changes as it is watched (a price, a queue's length): each change shows in its tone a
 * moment, then fades back; a figure gone stale is muted. A fade, so it stays where motion is reduced. For a
 * signed amount, `SignedValue`; for a count that rolls, `AnimatedNumber`.
 */
export function LiveValue({ value, format = (number) => formatNumber(number, Number.isInteger(number) ? 0 : 2), stale = false, flash = true, invert = false, staleLabel = 'stale', className, }) {
    const [previous, setPrevious] = useState(value);
    const [change, setChange] = useState(null);
    const [fading, setFading] = useState(false);
    if (value !== previous) {
        setPrevious(value);
        if (flash && value !== null && previous !== null) {
            setChange({ up: value > previous, at: (change?.at ?? 0) + 1 });
            setFading(false);
        }
    }
    useEffect(() => {
        if (!change)
            return;
        const hold = setTimeout(() => setFading(true), HOLD);
        const done = setTimeout(() => {
            setChange(null);
            setFading(false);
        }, HOLD + FADE);
        return () => {
            clearTimeout(hold);
            clearTimeout(done);
        };
    }, [change]);
    const good = change && change.up !== invert;
    return (_jsxs("span", { className: cn('tabular-nums', stale && 'text-text-muted', 
        // The tone at once; then back, in a fade.
        change && !fading && !stale && (good ? 'text-positive' : 'text-negative'), change && fading ? 'transition-colors duration-500 ease-soft' : 'transition-none', className), children: [value === null ? '—' : format(value), stale && _jsxs("span", { className: "sr-only", children: [" (", staleLabel, ")"] })] }));
}
