import type { Check, CheckState } from '../lib/checks.js';
/** A check's outcome as an icon, named for a screen reader unless what it stands beside says it already. */
export declare function CheckIcon({ state, named }: {
    state: CheckState;
    named?: boolean;
}): import("react").JSX.Element;
/**
 * Checks and what each found, an icon telling passed, failed and open apart (and
 * named for a screen reader). A check with an address leads to what says more of it.
 */
export declare function CheckList<T extends Check>({ checks, label, hrefOf, className, }: {
    checks: readonly T[];
    label: string;
    hrefOf?: (check: T) => string | null;
    className?: string;
}): import("react").JSX.Element;
