/** The state of something running (a service, a job, a connection), as a health check reports it. */
export type HealthStatus = 'ok' | 'warning' | 'down' | 'unknown' | 'disabled'
