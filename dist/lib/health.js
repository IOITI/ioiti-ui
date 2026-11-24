/**
 * A state in a word: beside its colour, never instead of it.
 *
 * @deprecated English whatever the interface's language: the provider's words are `useMessages().status`'s
 * (`healthOk`, `healthWarning`, `healthDown`, `healthUnknown`, `healthDisabled`), which `StatusBadge` says; English's,
 * outside React, `en.status` of `ioiti-ui/locales/en`. Removed in 1.0.
 */
export const HEALTH_STATUS_LABEL = {
    ok: 'Up',
    warning: 'Degraded',
    down: 'Down',
    unknown: 'Unknown',
    disabled: 'Disabled',
};
