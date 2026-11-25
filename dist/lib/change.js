import { en } from '../locales/en.js';
import { formatPercent } from './format.js';
import { DEFAULT_LOCALE } from './locale.js';
import { bindMessages } from './messages.js';
/**
 * A change's figure, signed: a percentage to one decimal by default (`2.5` is "+2.5%"), written by the formats given
 * (a locale's, `useFormat()`), English's by default.
 */
export function formatChange(change, formats = { formatPercent }) {
    return formats.formatPercent(change, true, 1);
}
/**
 * The tone of a change, by its meaning (a SignTone: `positive` is good news, `negative` bad news, `neutral` none): a rise
 * is good news where up is good, bad news where down is.
 */
export function changeTone(change, goodWhen = 'up') {
    if (!Number.isFinite(change) || change === 0)
        return 'neutral';
    return (change > 0) === (goodWhen === 'up') ? 'positive' : 'negative';
}
// A sign that leads a figure, and the marks of direction some locales write before it (Hebrew's, Arabic's).
const LEADING_SIGN = /^[‎‏؜]*[+−-]\s*/;
/**
 * A change in words, for a screen reader, which reads a sign badly ("plus", or nothing for −): "up 2.5%",
 * "down 0.3%", "unchanged". The figure as `format` writes it, its sign left out; the words given (a locale's), English's
 * by default.
 */
export function changeWords(change, format = formatChange, words = bindMessages(en, DEFAULT_LOCALE).numberInput) {
    if (!Number.isFinite(change) || change === 0)
        return words.changeNone;
    const figure = format(Math.abs(change)).replace(LEADING_SIGN, '');
    return change > 0 ? words.changeUp(figure) : words.changeDown(figure);
}
