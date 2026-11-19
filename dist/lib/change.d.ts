/** Which way is good news: `down` for a cost, a latency, a churn. */
export type GoodWhen = 'up' | 'down';
/** What a change means: good news, bad news, or none (no change). */
export type ChangeTone = 'positive' | 'negative' | 'neutral';
/** A change's figure, signed: a percentage to one decimal by default (`2.5` is "+2.5%"). */
export declare function formatChange(change: number): string;
/** The tone of a change, by its meaning: a rise is good news where up is good, bad news where down is. */
export declare function changeTone(change: number, goodWhen?: GoodWhen): ChangeTone;
/**
 * A change in words, for a screen reader, which reads a sign badly ("plus", or nothing for −): "up 2.5%",
 * "down 0.3%", "unchanged". The figure as `format` writes it, its sign left out.
 */
export declare function changeWords(change: number, format?: (change: number) => string): string;
