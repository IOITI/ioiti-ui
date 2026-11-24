import type { HealthStatus } from './health.js';
/** A slot of time and the state it was in: one block of StatusHistory. */
export interface StatusHistorySlot {
    status: HealthStatus;
    /** When the slot starts, as a person reads it ("14:00", "Mon 3"): said of a slot that was not up. */
    at: string;
}
/** What one slot is called, and more than one ("hour", "hours"). */
export interface StatusHistoryUnit {
    one: string;
    other: string;
}
/**
 * The strip in words, for a screen reader: how long it was up, then each other state, the worst first, with when it was
 * ("23 hours up, 1 degraded at 14:00"). Three times at most for a state, how many more after them.
 */
export declare function summariseStatusHistory(slots: StatusHistorySlot[], unit?: StatusHistoryUnit): string;
