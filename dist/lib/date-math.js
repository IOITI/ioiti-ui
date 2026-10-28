// A range of time written as people mean it, which stays true as time goes by: "the last 15 minutes" is
// `{ from: 'now-15m', to: 'now' }`, "today" `{ from: 'now/d', to: 'now/d' }`. Each end is `now`, `now` moved
// (`now-15m`, `now+1h`) and rounded to a unit (`now-1d/d`: yesterday's start, or its end for the range's
// end), or a moment written out (an ISO string). Read and rounded in the browser's time zone.
export const TIME_UNITS = ['s', 'm', 'h', 'd', 'w', 'M', 'y'];
const NAMES = {
    s: ['second', 'seconds'],
    m: ['minute', 'minutes'],
    h: ['hour', 'hours'],
    d: ['day', 'days'],
    w: ['week', 'weeks'],
    M: ['month', 'months'],
    y: ['year', 'years'],
};
/** A unit's name for a count: "1 minute", "15 minutes". */
export function unitName(unit, count) {
    return NAMES[unit][count === 1 ? 0 : 1];
}
function shift(date, count, unit) {
    const out = new Date(date);
    if (unit === 's')
        out.setSeconds(out.getSeconds() + count);
    else if (unit === 'm')
        out.setMinutes(out.getMinutes() + count);
    else if (unit === 'h')
        out.setHours(out.getHours() + count);
    else if (unit === 'd')
        out.setDate(out.getDate() + count);
    else if (unit === 'w')
        out.setDate(out.getDate() + count * 7);
    else if (unit === 'M')
        out.setMonth(out.getMonth() + count);
    else
        out.setFullYear(out.getFullYear() + count);
    return out;
}
/** The start of the unit a moment is in, or its end (the last millisecond before the next). */
function round(date, unit, up, weekStartsOn) {
    const out = new Date(date);
    if (unit === 's')
        out.setMilliseconds(0);
    else if (unit === 'm')
        out.setSeconds(0, 0);
    else if (unit === 'h')
        out.setMinutes(0, 0, 0);
    else {
        out.setHours(0, 0, 0, 0);
        if (unit === 'w')
            out.setDate(out.getDate() - ((out.getDay() - weekStartsOn + 7) % 7));
        else if (unit === 'M')
            out.setDate(1);
        else if (unit === 'y')
            out.setMonth(0, 1);
    }
    return up ? new Date(shift(out, 1, unit).getTime() - 1) : out;
}
const STEP = /^([+-])(\d+)([smhdwMy])|^\/([smhdwMy])/;
/** The moment an end of a range stands for, or `null` where it is not one. */
export function parseDateMath(text, { now = Date.now(), roundUp = false, weekStartsOn = 1 } = {}) {
    const written = text.trim();
    if (!written.startsWith('now')) {
        const time = Date.parse(written);
        return Number.isNaN(time) ? null : new Date(time);
    }
    let date = new Date(now);
    let rest = written.slice(3);
    while (rest) {
        const step = STEP.exec(rest);
        if (!step)
            return null;
        if (step[4])
            date = round(date, step[4], roundUp, weekStartsOn);
        else
            date = shift(date, (step[1] === '-' ? -1 : 1) * Number(step[2]), step[3]);
        rest = rest.slice(step[0].length);
    }
    return date;
}
/** The two moments of a range, for a query (`rangeParams`), its end rounded up; `null` for what cannot be read. */
export function resolveTimeRange(range, options = {}) {
    return {
        from: parseDateMath(range.from, options),
        to: parseDateMath(range.to, { ...options, roundUp: true }),
    };
}
/** An end written as `now` moved by one step, and maybe rounded (`now-15m`, `now-1d/d`): its parts. */
export function relativeEnd(text) {
    const match = /^now([+-])(\d+)([smhdwMy])(?:\/([smhdwMy]))?$/.exec(text.trim());
    if (!match)
        return null;
    return { past: match[1] === '-', count: Number(match[2]), unit: match[3], round: match[4] || undefined };
}
const NAMED = {
    'now/d now/d': 'Today',
    'now-1d/d now-1d/d': 'Yesterday',
    'now/d now': 'Today so far',
    'now/w now/w': 'This week',
    'now/w now': 'This week so far',
    'now-1w/w now-1w/w': 'Last week',
    'now/M now/M': 'This month',
    'now/M now': 'This month so far',
    'now-1M/M now-1M/M': 'Last month',
    'now/y now/y': 'This year',
    'now/y now': 'This year so far',
};
function endInWords(text, locale) {
    if (text.trim() === 'now')
        return 'now';
    const relative = relativeEnd(text);
    if (relative) {
        const span = `${relative.count} ${unitName(relative.unit, relative.count)}`;
        const moved = relative.past ? `${span} ago` : `in ${span}`;
        return relative.round ? `${moved}, to the ${NAMES[relative.round][0]}` : moved;
    }
    const date = parseDateMath(text);
    if (!date)
        return text;
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
}
/** A range in words: "Last 15 minutes", "Today", or its two ends, "27 Oct 2026, 09:30 → now". */
export function formatTimeRange(range, locale = 'en-GB') {
    const named = NAMED[`${range.from.trim()} ${range.to.trim()}`];
    if (named)
        return named;
    if (range.to.trim() === 'now') {
        const relative = relativeEnd(range.from);
        if (relative?.past && !relative.round)
            return `Last ${relative.count} ${unitName(relative.unit, relative.count)}`;
    }
    if (range.from.trim() === 'now') {
        const relative = relativeEnd(range.to);
        if (relative && !relative.past && !relative.round)
            return `Next ${relative.count} ${unitName(relative.unit, relative.count)}`;
    }
    return `${endInWords(range.from, locale)} → ${endInWords(range.to, locale)}`;
}
