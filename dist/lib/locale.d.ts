/** A day of the week as `Date#getDay` numbers it: 0 Sunday, 1 Monday … 6 Saturday. */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
/** A clock of 24 hours ("22:52") or of 12 ("10:52 PM"). */
export type HourCycle = 'h23' | 'h12';
/** The locale the package speaks when nothing says another: its English, its formats, as it always has. */
export declare const DEFAULT_LOCALE = "en-GB";
/** The day a locale's weeks start on: Monday in France and Britain, Sunday in the United States. */
export declare function firstDayOf(locale: string): WeekDay;
/** A locale's clock: 24 hours in Britain and France, 12 in the United States. */
export declare function hourCycleOf(locale: string): HourCycle;
/** How a locale writes a number: its decimal separator, the one between groups of thousands, its minus. */
export interface NumberSymbols {
    decimal: string;
    group: string;
    minus: string;
}
export declare function numberSymbolsOf(locale: string): NumberSymbols;
/**
 * A number typed by a person, read as its locale writes one, and as people type it whatever their locale: "1 234,5"
 * and "1234.5" are 1234.5 in French. With both a dot and a comma, the last of them is the decimal one ("1.234,5",
 * "1,234.5"); a separator alone between groups of three is the locale's grouping one ("1,500" is 1500 in English,
 * "1.500" in German); any other is decimal ("1,5" is 1.5 in English too). Anything else: NaN.
 */
export declare function parseLocaleNumber(text: string, locale?: string): number;
