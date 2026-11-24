import type { HealthStatus } from '../../lib/health.js'
import type { MessageKit } from '../../lib/messages.js'

/** What one slot of a StatusHistory is called, and more than one ("hour", "hours"). */
type Unit = { one: string; other: string }

// The unit a strip counts in where it is given none.
const HOURS: Unit = { one: 'hour', other: 'hours' }

// A state other than up, as the strip's summary says it.
const STATE: Record<Exclude<HealthStatus, 'ok'>, string> = { warning: 'degraded', down: 'down', unknown: 'unknown', disabled: 'disabled' }

/** States and statuses: StatusBadge and its kin, LiveValue, StatusHistory, the health statuses, Badge, Alert, Skeleton, Loader, Stepper. */
export const status = {
  // A health status in a word (StatusBadge), beside its colour, never instead of it.
  /** "Up": what runs as it should (`ok`). */
  healthOk: 'Up',
  /** "Degraded": what runs, but not as it should (`warning`). */
  healthWarning: 'Degraded',
  /** "Down": what does not run (`down`). */
  healthDown: 'Down',
  /** "Unknown": what reports nothing (`unknown`). */
  healthUnknown: 'Unknown',
  /** "Disabled": what is turned off (`disabled`). */
  healthDisabled: 'Disabled',

  /** "stale": said to a screen reader after a figure whose source stopped (SignedValue, LiveValue: `staleLabel`). */
  stale: 'stale',

  // QueryState.
  /** "Could not load": the heading of what a page says when its data could not be had. */
  loadFailed: 'Could not load',
  /** "Could not refresh: showing the last data received": its heading when the data already shown could not be refreshed. */
  refreshFailed: 'Could not refresh: showing the last data received',

  // StatusHistory.
  /** "No history yet": what a strip without a slot says. */
  historyEmpty: 'No history yet',
  /** "23 hours up": how many slots were up, in the strip's unit ("hour" where it is given none). */
  historyUp: ({ count, unit = HOURS }: { count: number; unit?: Unit }, { plural }: MessageKit) =>
    plural(count, { one: `# ${unit.one} up`, other: `# ${unit.other} up` }),
  /**
   * "1 degraded at 14:00", "3 hours down at 01:00, 02:00 and 03:00": the slots in a state other than up, and when they
   * were (`times`, "2 more" last where there are more). The unit is said where the up part has not said it (`upSaid`).
   */
  historyState: (
    {
      status,
      count,
      unit = HOURS,
      times,
      upSaid,
    }: { status: Exclude<HealthStatus, 'ok'>; count: number; unit?: Unit; times: readonly string[]; upSaid: boolean },
    { plural, number, list }: MessageKit,
  ) => `${upSaid ? number(count) : plural(count, { one: `# ${unit.one}`, other: `# ${unit.other}` })} ${STATE[status]} at ${list(times)}`,
  /** "2 more": the times of a state past the three said. */
  historyMore: (count: number, { number }: MessageKit) => `${number(count)} more`,
  /** "API, the last 24 hours: 23 hours up": the strip's name, then what it shows. */
  historyName: ({ label, summary }: { label: string; summary: string }) => `${label}: ${summary}`,

  /** "Remove": the name of Badge's × button, where it is given none (`removeLabel`). */
  remove: 'Remove',
  /** "Dismiss": the name of Alert's × button. */
  dismiss: 'Dismiss',
  /** "Loading": the name of what SkeletonReveal shows while its content loads. */
  loadingName: 'Loading',
  /** "Loading…": what Loader says to a screen reader, where the application says nothing (`label`). */
  loading: 'Loading…',
  /** "Progress": the name of Stepper's list of steps. */
  progress: 'Progress',
  /** "(completed)": said to a screen reader after a step done. */
  stepCompleted: '(completed)',
}
