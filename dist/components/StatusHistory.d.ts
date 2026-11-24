import type { StatusHistorySlot, StatusHistoryUnit } from '../lib/status-history.js';
export interface StatusHistoryProps {
    /** One slot of time each, the oldest first. */
    slots: StatusHistorySlot[];
    /** What the strip is the history of ("API, the last 24 hours"): its name for a screen reader. */
    label: string;
    /** What one slot is called, and more than one: hour and hours by default. */
    unit?: StatusHistoryUnit;
    /** The strip in words, in place of the one written from its slots ("23 hours up, 1 degraded at 14:00"). */
    summary?: string;
    /** What its two ends stand for, written under it ("24 h ago", "Now"). */
    scale?: [string, string];
    className?: string;
}
/**
 * The uptime strip: one block per slot of time, coloured by its state, and the whole said in words for a
 * screen reader, which reads the strip as one picture. The colours are never alone: the words carry them.
 */
export declare function StatusHistory({ slots, label, unit, summary, scale, className }: StatusHistoryProps): import("react").JSX.Element;
