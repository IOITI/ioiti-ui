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
const COUNTED = [
    { tone: 'danger', words: 'to fix' },
    { tone: 'warning', words: 'to watch' },
    { tone: 'success', words: 'good news' },
];
/**
 * What the top bar's summary says, for a screen reader and in its tip: the one state that stands out by its
 * words, several by how many of each tone ("1 to fix, 2 to watch"), none by the gravest quiet one's words, or
 * that all is well.
 */
export function stateSentence(items, okLabel) {
    const out = items.filter((item) => standsOut(item.tone));
    if (out.length === 1)
        return out[0].label;
    if (out.length > 1) {
        return COUNTED.map(({ tone, words }) => ({ count: out.filter((item) => item.tone === tone).length, words }))
            .filter(({ count }) => count > 0)
            .map(({ count, words }) => `${count} ${words}`)
            .join(', ');
    }
    return items.find((item) => item.tone === 'neutral')?.label ?? okLabel;
}
