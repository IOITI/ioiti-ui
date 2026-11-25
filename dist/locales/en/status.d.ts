import type { HealthStatus } from '../../lib/health.js';
import type { MessageKit } from '../../lib/messages.js';
/** What one slot of a StatusHistory is called, and more than one ("hour", "hours"). */
type Unit = {
    one: string;
    other: string;
};
/** States and statuses: StatusBadge and its kin, LiveValue, StatusHistory, the health statuses, Badge, Alert, Skeleton, Loader, Stepper. */
export declare const status: {
    /** "Up": what runs as it should (`ok`). */
    healthOk: string;
    /** "Degraded": what runs, but not as it should (`warning`). */
    healthWarning: string;
    /** "Down": what does not run (`down`). */
    healthDown: string;
    /** "Unknown": what reports nothing (`unknown`). */
    healthUnknown: string;
    /** "Disabled": what is turned off (`disabled`). */
    healthDisabled: string;
    /** "stale": said to a screen reader after a figure whose source stopped (SignedValue, LiveValue: `staleLabel`). */
    stale: string;
    /** "Could not load": the heading of what a page says when its data could not be had. */
    loadFailed: string;
    /** "Could not refresh: showing the last data received": its heading when the data already shown could not be refreshed. */
    refreshFailed: string;
    /** "No history yet": what a strip without a slot says. */
    historyEmpty: string;
    /** "23 hours up": how many slots were up, in the strip's unit ("hour" where it is given none). */
    historyUp: ({ count, unit }: {
        count: number;
        unit?: Unit;
    }, { plural }: MessageKit) => string;
    /**
     * "1 degraded at 14:00", "3 hours down at 01:00, 02:00 and 03:00": the slots in a state other than up, and when they
     * were (`times`, "2 more" last where there are more). The unit is said where the up part has not said it (`upSaid`).
     */
    historyState: ({ status, count, unit, times, upSaid, }: {
        status: Exclude<HealthStatus, "ok">;
        count: number;
        unit?: Unit;
        times: readonly string[];
        upSaid: boolean;
    }, { plural, number, list }: MessageKit) => string;
    /** "2 more": the times of a state past the three said. */
    historyMore: (count: number, { number }: MessageKit) => string;
    /** "API, the last 24 hours: 23 hours up": the strip's name, then what it shows. */
    historyName: ({ label, summary }: {
        label: string;
        summary: string;
    }) => string;
    /** "Remove": the name of Badge's × button, where it is given none (`removeLabel`). */
    remove: string;
    /** "Dismiss": the name of Alert's × button. */
    dismiss: string;
    /** "Loading": the name of what SkeletonReveal shows while its content loads. */
    loadingName: string;
    /** "Loading…": what Loader says to a screen reader, where the application says nothing (`label`). */
    loading: string;
    /** "Progress": the name of Stepper's list of steps. */
    progress: string;
    /** "(completed)": said to a screen reader after a step done. */
    stepCompleted: string;
};
export {};
