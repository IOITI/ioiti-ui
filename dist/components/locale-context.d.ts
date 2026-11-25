import type { Formatters } from '../lib/format.js';
import type { HourCycle, WeekDay } from '../lib/locale.js';
import type { BoundCatalogue, CatalogueOverride } from '../lib/messages.js';
import type { Messages } from '../locales/en.js';
/** The locale the interface speaks and writes in, and what follows from it. */
export interface LocaleState {
    /** A BCP 47 tag: "en-GB", "fr-FR". */
    locale: string;
    /** The day its weeks start on (0 Sunday, 1 Monday): the calendars' first column. */
    weekStartsOn: WeekDay;
    /** Its clock: 24 hours ("22:52") or 12 ("10:52 PM"). */
    hourCycle: HourCycle;
}
/** IoitiProvider's: its locale, and its catalogue (English's, with what an application or a language gives over it). */
export interface LocaleValue extends LocaleState {
    catalogue: Messages;
}
/** Some of the package's words, by namespace: a language's catalogue (`fr`), or an application's own words. */
export type MessagesOverride = CatalogueOverride<Messages>;
/** The package's words bound to a locale, as `useMessages()` gives them. */
export type BoundMessages = BoundCatalogue<Messages>;
export declare const LocaleContext: import("react").Context<LocaleValue | null>;
/** The interface's locale (IoitiProvider's; en-GB outside one): its tag, its first day of the week, its clock. */
export declare function useLocale(): LocaleState;
/** The package's words in the interface's language (`messages.date.previousMonth`, `messages.date.lastDays(7)`). */
export declare function useMessages(): BoundMessages;
/** The formats in the interface's locale and words: `formatMoney`, `formatDateTime`… as the package exports them in English. */
export declare function useFormat(): Formatters;
