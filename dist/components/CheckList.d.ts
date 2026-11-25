import type { Check, CheckState } from '../lib/checks.js';
/** The props of `CheckIcon`. */
export interface CheckIconProps {
    /** The outcome it draws: passed, failed or open. */
    state: CheckState;
    /** Named for a screen reader; not where what it stands beside says it already. */
    named?: boolean;
}
/** A check's outcome as an icon, named for a screen reader unless what it stands beside says it already. */
export declare function CheckIcon({ state, named }: CheckIconProps): import("react").JSX.Element;
/** The props of `CheckList`. */
export interface CheckListProps<T extends Check = Check> {
    /** The checks, in the order shown: each its label, its outcome and what it found. */
    checks: readonly T[];
    /** The list's name for a screen reader: "Checks of the release". */
    label: string;
    /** Where a check leads, to what says more of it; `null` where it leads nowhere. */
    hrefOf?: (check: T) => string | null;
    className?: string;
}
/**
 * Checks and what each found, an icon telling passed, failed and open apart (and
 * named for a screen reader). A check with an address leads to what says more of it.
 */
export declare function CheckList<T extends Check>({ checks, label, hrefOf, className }: CheckListProps<T>): import("react").JSX.Element;
