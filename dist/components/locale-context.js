import { createContext, useContext } from 'react';
import { formattersFor } from '../lib/format.js';
import { DEFAULT_LOCALE, firstDayOf, hourCycleOf } from '../lib/locale.js';
import { bindMessages } from '../lib/messages.js';
import { en } from '../locales/en.js';
export const LocaleContext = createContext(null);
// Outside a provider (a component rendered alone in a test), the interface is as it always was: English, as Britain
// writes it.
let fallback;
function current(value) {
    return (value ??
        (fallback ??= { locale: DEFAULT_LOCALE, weekStartsOn: firstDayOf(DEFAULT_LOCALE), hourCycle: hourCycleOf(DEFAULT_LOCALE), catalogue: en }));
}
/** The interface's locale (IoitiProvider's; en-GB outside one): its tag, its first day of the week, its clock. */
export function useLocale() {
    // The provider's own value, the same from one render to the next.
    return current(useContext(LocaleContext));
}
/** The package's words in the interface's language (`messages.date.previousMonth`, `messages.date.lastDays(7)`). */
export function useMessages() {
    const { catalogue, locale } = current(useContext(LocaleContext));
    return bindMessages(catalogue, locale);
}
/** The formats in the interface's locale and words: `formatMoney`, `formatDateTime`… as the package exports them in English. */
export function useFormat() {
    const { catalogue, locale, hourCycle } = current(useContext(LocaleContext));
    return formattersFor(locale, { messages: catalogue, hourCycle });
}
