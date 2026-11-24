import { en } from '../locales/en.js'
import type { Messages } from '../locales/en.js'
import type { HealthStatus } from './health.js'
import { DEFAULT_LOCALE } from './locale.js'
import { bindMessages } from './messages.js'
import type { BoundCatalogue } from './messages.js'

/** A slot of time and the state it was in: one block of StatusHistory. */
export interface StatusHistorySlot {
  status: HealthStatus
  /** When the slot starts, as a person reads it ("14:00", "Mon 3"): said of a slot that was not up. */
  at: string
}

/** What one slot is called, and more than one ("hour", "hours"). */
export interface StatusHistoryUnit {
  one: string
  other: string
}

const SHOWN_TIMES = 3

// The states other than up, the worst first.
const OTHERS: Exclude<HealthStatus, 'ok'>[] = ['down', 'warning', 'unknown', 'disabled']

/**
 * The strip in words, for a screen reader: how long it was up, then each other state, the worst first, with when it was
 * ("23 hours up, 1 degraded at 14:00"). Three times at most for a state, how many more after them. In the words given
 * (the provider's, `useMessages().status`), English's by default; in their unit ("hour" by default) where none is given.
 */
export function summariseStatusHistory(
  slots: StatusHistorySlot[],
  unit?: StatusHistoryUnit,
  words: BoundCatalogue<Messages>['status'] = bindMessages(en, DEFAULT_LOCALE).status,
): string {
  if (slots.length === 0) return words.historyEmpty
  const up = slots.filter((slot) => slot.status === 'ok').length
  const parts = up ? [words.historyUp({ count: up, unit })] : []
  for (const status of OTHERS) {
    const times = slots.filter((slot) => slot.status === status).map((slot) => slot.at)
    if (!times.length) continue
    const shown = times.length > SHOWN_TIMES ? [...times.slice(0, SHOWN_TIMES), words.historyMore(times.length - SHOWN_TIMES)] : times
    parts.push(words.historyState({ status, count: times.length, unit, times: shown, upSaid: up > 0 }))
  }
  return parts.join(', ')
}
