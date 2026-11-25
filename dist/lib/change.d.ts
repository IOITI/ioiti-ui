import type { Messages } from '../locales/en.js';
import type { Formatters } from './format.js';
import type { BoundCatalogue } from './messages.js';
import type { SignTone } from './tones.js';
/** Which way is good news: `down` for a cost, a latency, a churn. */
export type GoodWhen = 'up' | 'down';
/** The words a change is said in: a locale's (`useMessages().numberInput`), English's by default. */
export type ChangeWords = Pick<BoundCatalogue<Messages>['numberInput'], 'changeNone' | 'changeUp' | 'changeDown'>;
/**
 * A change's figure, signed: a percentage to one decimal by default (`2.5` is "+2.5%"), written by the formats given
 * (a locale's, `useFormat()`), English's by default.
 */
export declare function formatChange(change: number, formats?: Pick<Formatters, 'formatPercent'>): string;
/**
 * The tone of a change, by its meaning (a SignTone: `positive` is good news, `negative` bad news, `neutral` none): a rise
 * is good news where up is good, bad news where down is.
 */
export declare function changeTone(change: number, goodWhen?: GoodWhen): SignTone;
/**
 * A change in words, for a screen reader, which reads a sign badly ("plus", or nothing for −): "up 2.5%",
 * "down 0.3%", "unchanged". The figure as `format` writes it, its sign left out; the words given (a locale's), English's
 * by default.
 */
export declare function changeWords(change: number, format?: (change: number) => string, words?: ChangeWords): string;
