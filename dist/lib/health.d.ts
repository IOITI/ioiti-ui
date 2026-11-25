/** The state of something running (a service, a job, a connection), as a health check reports it. */
export type HealthStatus = 'ok' | 'warning' | 'down' | 'unknown' | 'disabled';
/**
 * A state in a word: beside its colour, never instead of it.
 *
 * @deprecated English whatever the interface's language: the provider's words are `useMessages().status`'s
 * (`healthOk`, `healthWarning`, `healthDown`, `healthUnknown`, `healthDisabled`), which `StatusBadge` says; English's,
 * outside React, `en.status` of `ioiti-ui/locales/en`. Removed in 1.0.
 */
export declare const HEALTH_STATUS_LABEL: Record<HealthStatus, string>;
