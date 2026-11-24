import { DEFAULT_LOCALE } from '../lib/locale.js';
import { bindMessages } from '../lib/messages.js';
import { en } from '../locales/en.js';
const RANK = { ok: 0, neutral: 1, success: 2, warning: 3, danger: 4 };
/** The design's tone of each (recipes.ts): all is well in the positive colour, a neutral state in grey. */
export const STATE_TONE = {
    danger: 'negative',
    warning: 'warning',
    success: 'positive',
    neutral: 'neutral',
    ok: 'positive',
};
/** Whether a state stands out: it is counted, and the top bar says it without being opened. */
export function standsOut(tone) {
    return RANK[tone] >= RANK.success;
}
/** The gravest tone among states; `ok` for none. */
export function gravestTone(items) {
    return items.reduce((gravest, item) => (RANK[item.tone] > RANK[gravest] ? item.tone : gravest), 'ok');
}
/** States from the gravest, in their order otherwise. */
export function byGravity(items) {
    return items
        .map((item, index) => ({ item, index }))
        .sort((a, b) => RANK[b.item.tone] - RANK[a.item.tone] || a.index - b.index)
        .map(({ item }) => item);
}
/**
 * What the top bar's summary says, for a screen reader and in its tip: the one state that stands out by its
 * words, several by how many of each tone ("1 to fix, 2 to watch", in the words given: a provider's
 * `useMessages().shell.stateCounts`, English's by default), none by the gravest quiet one's words, or that all is well.
 */
export function stateSentence(items, okLabel, counted = bindMessages(en, DEFAULT_LOCALE).shell.stateCounts) {
    const out = items.filter((item) => standsOut(item.tone));
    if (out.length === 1)
        return out[0].label;
    if (out.length > 1) {
        const count = (tone) => out.filter((item) => item.tone === tone).length;
        return counted({ danger: count('danger'), warning: count('warning'), success: count('success') });
    }
    return items.find((item) => item.tone === 'neutral')?.label ?? okLabel;
}
