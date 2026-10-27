import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { formatDateTime, formatRelative } from '../lib/format.js';
import { useNow } from '../lib/now.js';
import { Hint } from './Hint.js';
const MINUTE = 60_000;
const HOUR = 3_600_000;
/** How often a time of this age is said again: as precisely as it is said ("12 s ago", "3 min ago", "4 d ago"). */
function intervalFor(age) {
    if (age < MINUTE)
        return 1000;
    if (age < 48 * HOUR)
        return MINUTE;
    return HOUR;
}
/**
 * A moment said from now ("3 min ago", "in 2 h"), kept true as time goes by, its full date in a hint and
 * for a screen reader. Every time on a page shares one clock for each precision (useNow).
 */
export function RelativeTime({ value, timeZone, className }) {
    const time = value instanceof Date ? value.getTime() : typeof value === 'number' ? value : Date.parse(value);
    const iso = Number.isNaN(time) ? '' : new Date(time).toISOString();
    const [pace, setPace] = useState(1000);
    const now = useNow(pace);
    // Said again as often as its age asks: a time a minute old needs no second.
    const wanted = intervalFor(Math.abs(now - time));
    if (wanted !== pace)
        setPace(wanted);
    const zone = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    const full = formatDateTime(iso, zone);
    return (_jsx(Hint, { content: full, children: _jsxs("time", { dateTime: iso, className: className, children: [formatRelative(iso, now), _jsxs("span", { className: "sr-only", children: [", ", full] })] }) }));
}
