import { HEALTH_STATUS_LABEL } from './health.js';
const SHOWN_TIMES = 3;
function list(words) {
    return words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
}
/**
 * The strip in words, for a screen reader: how long it was up, then each other state, the worst first, with when it was
 * ("23 hours up, 1 degraded at 14:00"). Three times at most for a state, how many more after them.
 */
export function summariseStatusHistory(slots, unit = { one: 'hour', other: 'hours' }) {
    if (slots.length === 0)
        return 'No history yet';
    const up = slots.filter((slot) => slot.status === 'ok').length;
    const parts = up ? [`${up} ${up === 1 ? unit.one : unit.other} up`] : [];
    const others = ['down', 'warning', 'unknown', 'disabled'];
    for (const status of others) {
        const times = slots.filter((slot) => slot.status === status).map((slot) => slot.at);
        if (!times.length)
            continue;
        const shown = times.length > SHOWN_TIMES ? [...times.slice(0, SHOWN_TIMES), `${times.length - SHOWN_TIMES} more`] : times;
        const words = up ? `${times.length}` : `${times.length} ${times.length === 1 ? unit.one : unit.other}`;
        parts.push(`${words} ${HEALTH_STATUS_LABEL[status].toLowerCase()} at ${list(shown)}`);
    }
    return parts.join(', ');
}
