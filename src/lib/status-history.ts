import { HEALTH_STATUS_LABEL } from './health.js'
import type { HealthStatus } from './health.js'

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

function list(words: string[]): string {
  return words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`
}

/**
 * The strip in words, for a screen reader: how long it was up, then each other state, the worst first, with when it was
 * ("23 hours up, 1 degraded at 14:00"). Three times at most for a state, how many more after them.
 */
export function summariseStatusHistory(slots: StatusHistorySlot[], unit: StatusHistoryUnit = { one: 'hour', other: 'hours' }): string {
  if (slots.length === 0) return 'No history yet'
  const up = slots.filter((slot) => slot.status === 'ok').length
  const parts = up ? [`${up} ${up === 1 ? unit.one : unit.other} up`] : []
  const others: HealthStatus[] = ['down', 'warning', 'unknown', 'disabled']
  for (const status of others) {
    const times = slots.filter((slot) => slot.status === status).map((slot) => slot.at)
    if (!times.length) continue
    const shown = times.length > SHOWN_TIMES ? [...times.slice(0, SHOWN_TIMES), `${times.length - SHOWN_TIMES} more`] : times
    const words = up ? `${times.length}` : `${times.length} ${times.length === 1 ? unit.one : unit.other}`
    parts.push(`${words} ${HEALTH_STATUS_LABEL[status].toLowerCase()} at ${list(shown)}`)
  }
  return parts.join(', ')
}
