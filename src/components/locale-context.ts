import { createContext, useContext } from 'react'

import { formattersFor } from '../lib/format.js'
import type { Formatters } from '../lib/format.js'
import { DEFAULT_LOCALE, firstDayOf, hourCycleOf } from '../lib/locale.js'
import type { HourCycle, WeekDay } from '../lib/locale.js'
import { bindMessages } from '../lib/messages.js'
import type { BoundCatalogue, CatalogueOverride } from '../lib/messages.js'
import { en } from '../locales/en.js'
import type { Messages } from '../locales/en.js'

/** The locale the interface speaks and writes in, and what follows from it. */
export interface LocaleState {
  /** A BCP 47 tag: "en-GB", "fr-FR". */
  locale: string
  /** The day its weeks start on (0 Sunday, 1 Monday): the calendars' first column. */
  weekStartsOn: WeekDay
  /** Its clock: 24 hours ("22:52") or 12 ("10:52 PM"). */
  hourCycle: HourCycle
}

/** IoitiProvider's: its locale, and its catalogue (English's, with what an application or a language gives over it). */
export interface LocaleValue extends LocaleState {
  catalogue: Messages
}

/** Some of the package's words, by namespace: a language's catalogue (`fr`), or an application's own words. */
export type MessagesOverride = CatalogueOverride<Messages>

/** The package's words bound to a locale, as `useMessages()` gives them. */
export type BoundMessages = BoundCatalogue<Messages>

export const LocaleContext = createContext<LocaleValue | null>(null)

// Outside a provider (a component rendered alone in a test), the interface is as it always was: English, as Britain
// writes it.
let fallback: LocaleValue | undefined
function current(value: LocaleValue | null): LocaleValue {
  return (
    value ??
    (fallback ??= { locale: DEFAULT_LOCALE, weekStartsOn: firstDayOf(DEFAULT_LOCALE), hourCycle: hourCycleOf(DEFAULT_LOCALE), catalogue: en })
  )
}

/** The interface's locale (IoitiProvider's; en-GB outside one): its tag, its first day of the week, its clock. */
export function useLocale(): LocaleState {
  // The provider's own value, the same from one render to the next.
  return current(useContext(LocaleContext))
}

/** The package's words in the interface's language (`messages.date.previousMonth`, `messages.date.lastDays(7)`). */
export function useMessages(): BoundMessages {
  const { catalogue, locale } = current(useContext(LocaleContext))
  return bindMessages(catalogue, locale)
}

/** The formats in the interface's locale and words: `formatMoney`, `formatDateTime`… as the package exports them in English. */
export function useFormat(): Formatters {
  const { catalogue, locale, hourCycle } = current(useContext(LocaleContext))
  return formattersFor(locale, { messages: catalogue, hourCycle })
}
