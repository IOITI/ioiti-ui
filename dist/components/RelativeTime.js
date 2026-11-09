import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { formatDateTime, formatRelative } from '../lib/format.js';
import { nowOf, useNow } from '../lib/now.js';
import { Hint } from './Hint.js';
const SECOND = 1000;
const MINUTE = 60_000;
const HOUR = 3_600_000;
/** How often a time of this age is said again: as precisely as it is said ("12 s ago", "3 min ago", "4 d ago"). */
function intervalFor(age) {
    if (age < MINUTE)
        return SECOND;
    if (age < 48 * HOUR)
        return MINUTE;
    return HOUR;
}
/**
 * The clock a moment is said on: the one its age asks for on the second's clock, read last; a clock read
 * less often only once its own time asks for it too. Read longer ago, that clock says a moment past younger:
 * a minute old on the second's clock, a moment may be 20 s old on the minute's, which would send it back to
 * the second's, and the second's to the minute's again, without end.
 */
function clockFor(time) {
    const asked = (interval) => intervalFor(Math.abs(nowOf(interval) - time));
    const wanted = asked(SECOND);
    if (wanted >= HOUR && asked(HOUR) >= HOUR)
        return HOUR;
    if (wanted >= MINUTE && asked(MINUTE) >= MINUTE)
        return MINUTE;
    return SECOND;
}
/**
 * A moment said from now ("3 min ago", "in 2 h"), kept true as time goes by, its full date in a hint and
 * for a screen reader. Every time on a page shares one clock for each precision (useNow).
 */
export function RelativeTime({ value, timeZone, past = false, className }) {
    const time = value instanceof Date ? value.getTime() : typeof value === 'number' ? value : Date.parse(value);
    const iso = Number.isNaN(time) ? '' : new Date(time).toISOString();
    // Said again as often as its age asks: a time a minute old needs no second.
    const now = useNow(clockFor(time));
    const zone = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    const full = formatDateTime(iso, zone);
    // Never later than now when it has happened: the clock it was read on is ahead of this one.
    const said = past && iso && time > now ? new Date(now).toISOString() : iso;
    return (_jsx(Hint, { content: full, children: _jsxs("time", { dateTime: iso, className: className, children: [formatRelative(said, now), _jsxs("span", { className: "sr-only", children: [", ", full] })] }) }));
}
