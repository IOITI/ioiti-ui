import { toIsoDay } from './format.js';
export const ALL_TIME = { from: null, to: null };
export function lastDays(days, today = new Date()) {
    const from = new Date(today);
    from.setDate(today.getDate() - (days - 1));
    return { from, to: today };
}
/** The range as an API's `from` / `to` days. A range still being picked (no end yet) is open-ended. */
export function rangeParams(range) {
    return {
        from: range.from ? toIsoDay(range.from) : null,
        to: range.to ? toIsoDay(range.to) : null,
    };
}
