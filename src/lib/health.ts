/** The state of something running (a service, a job, a connection), as a health check reports it. */
export type HealthStatus = 'ok' | 'warning' | 'down' | 'unknown' | 'disabled'

/** A state in a word: beside its colour, never instead of it. */
export const HEALTH_STATUS_LABEL: Record<HealthStatus, string> = {
  ok: 'Up',
  warning: 'Degraded',
  down: 'Down',
  unknown: 'Unknown',
  disabled: 'Disabled',
}
