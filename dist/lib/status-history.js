import { en } from '../locales/en.js';
import { DEFAULT_LOCALE } from './locale.js';
import { bindMessages } from './messages.js';
const SHOWN_TIMES = 3;
// The states other than up, the worst first.
const OTHERS = ['down', 'warning', 'unknown', 'disabled'];
/**
 * The strip in words, for a screen reader: how long it was up, then each other state, the worst first, with when it was
 * ("23 hours up, 1 degraded at 14:00"). Three times at most for a state, how many more after them. In the words given
 * (the provider's, `useMessages().status`), English's by default; in their unit ("hour" by default) where none is given.
 */
export function summariseStatusHistory(slots, unit, words = bindMessages(en, DEFAULT_LOCALE).status) {
    if (slots.length === 0)
        return words.historyEmpty;
    const up = slots.filter((slot) => slot.status === 'ok').length;
    const parts = up ? [words.historyUp({ count: up, unit })] : [];
    for (const status of OTHERS) {
        const times = slots.filter((slot) => slot.status === status).map((slot) => slot.at);
        if (!times.length)
            continue;
        const shown = times.length > SHOWN_TIMES ? [...times.slice(0, SHOWN_TIMES), words.historyMore(times.length - SHOWN_TIMES)] : times;
        parts.push(words.historyState({ status, count: times.length, unit, times: shown, upSaid: up > 0 }));
    }
    return parts.join(', ');
}
