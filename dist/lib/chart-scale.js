// The scales of the charts: a value axis that may go below zero, and a time axis in a time zone.
/** A "nice" step (1, 2, 2.5 or 5 times a power of ten) near `raw`. */
export function niceStep(raw) {
    if (!(raw > 0) || !Number.isFinite(raw))
        return 1;
    const exponent = Math.floor(Math.log10(raw));
    const base = raw / 10 ** exponent;
    const nice = base <= 1 ? 1 : base <= 2 ? 2 : base <= 2.5 ? 2.5 : base <= 5 ? 5 : 10;
    return nice * 10 ** exponent;
}
/** Rounds away the binary noise of a multiple of a step (0.30000000000000004). */
function tidy(value, step) {
    const digits = Math.max(0, -Math.floor(Math.log10(step)) + 2);
    return Number(value.toFixed(digits));
}
/**
 * An axis over the values from `min` to `max` in about `count` nice steps, zero on it (a bar starts there):
 * `niceDomain(-120, 340)` is −200 to 400 by 200. Without `zero`, it fits the values (a price far from zero).
 */
export function niceDomain(min, max, count = 4, zero = true) {
    let low = zero ? Math.min(0, min) : min;
    let high = zero ? Math.max(0, max) : max;
    if (!Number.isFinite(low) || !Number.isFinite(high)) {
        low = 0;
        high = 1;
    }
    if (low === high) {
        // One value: a step either side of it.
        const pad = Math.abs(low) / 10 || 1;
        low = zero ? Math.min(0, low - pad) : low - pad;
        high = high + pad;
    }
    const step = niceStep((high - low) / count);
    const from = Math.floor(low / step) * step;
    const to = Math.ceil(high / step) * step;
    const ticks = [];
    for (let tick = from; tick <= to + step / 2; tick += step)
        ticks.push(tidy(tick, step));
    return { min: tidy(from, step), max: tidy(to, step), step, ticks };
}
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const INTERVALS = [
    { every: SECOND, unit: 'second' },
    { every: 5 * SECOND, unit: 'second' },
    { every: 15 * SECOND, unit: 'second' },
    { every: 30 * SECOND, unit: 'second' },
    { every: MINUTE, unit: 'minute' },
    { every: 5 * MINUTE, unit: 'minute' },
    { every: 15 * MINUTE, unit: 'minute' },
    { every: 30 * MINUTE, unit: 'minute' },
    { every: HOUR, unit: 'hour' },
    { every: 3 * HOUR, unit: 'hour' },
    { every: 6 * HOUR, unit: 'hour' },
    { every: 12 * HOUR, unit: 'hour' },
    { every: DAY, unit: 'day' },
    { every: 2 * DAY, unit: 'day' },
    { every: 7 * DAY, unit: 'day' },
    { every: 14 * DAY, unit: 'day' },
    { every: 30 * DAY, unit: 'month' },
    { every: 91 * DAY, unit: 'month' },
    { every: 365 * DAY, unit: 'month' },
];
/** How far a time zone is ahead of UTC at an instant, in milliseconds. */
export function zoneOffset(at, timeZone) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).formatToParts(new Date(at));
    const part = (type) => Number(parts.find((each) => each.type === type)?.value);
    const wall = Date.UTC(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'), part('second'));
    return wall - Math.floor(at / SECOND) * SECOND;
}
/**
 * Times for the axis of a span, at most `count` of them, on round moments of the time zone's clock (the
 * hour, midnight): the shortest interval of a second to a year that keeps within `count`.
 */
export function timeTicks(from, to, count, timeZone = 'UTC') {
    const span = Math.max(to - from, 1);
    const chosen = INTERVALS.find((interval) => span / interval.every <= Math.max(count, 1)) ?? INTERVALS[INTERVALS.length - 1];
    const offset = zoneOffset(from, timeZone);
    const ticks = [];
    const first = Math.ceil((from + offset) / chosen.every) * chosen.every - offset;
    for (let tick = first; tick <= to; tick += chosen.every)
        ticks.push(tick);
    return { ticks, unit: chosen.unit };
}
/** A time of the axis, as its unit reads it: "09:30", "27 Oct", "Oct 2026". */
export function formatTimeTick(at, unit, timeZone = 'UTC') {
    const options = unit === 'second'
        ? { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }
        : unit === 'minute' || unit === 'hour'
            ? { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
            : unit === 'day'
                ? { day: 'numeric', month: 'short' }
                : { month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', { timeZone, ...options }).format(new Date(at));
}
