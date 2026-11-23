import { formatPercent } from './format.js';
/** A change's figure, signed: a percentage to one decimal by default (`2.5` is "+2.5%"). */
export function formatChange(change) {
    return formatPercent(change, true, 1);
}
/** The tone of a change, by its meaning: a rise is good news where up is good, bad news where down is. */
export function changeTone(change, goodWhen = 'up') {
    if (!Number.isFinite(change) || change === 0)
        return 'neutral';
    return (change > 0) === (goodWhen === 'up') ? 'positive' : 'negative';
}
/**
 * A change in words, for a screen reader, which reads a sign badly ("plus", or nothing for −): "up 2.5%",
 * "down 0.3%", "unchanged". The figure as `format` writes it, its sign left out.
 */
export function changeWords(change, format = formatChange) {
    if (!Number.isFinite(change) || change === 0)
        return 'unchanged';
    const figure = format(Math.abs(change)).replace(/^[+−-]\s*/, '');
    return `${change > 0 ? 'up' : 'down'} ${figure}`;
}
