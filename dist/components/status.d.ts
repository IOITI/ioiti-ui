import type { ReactNode } from 'react';
import type { HealthStatus } from '../lib/health.js';
/** A state: always a word next to the colour, never the colour alone. */
export declare function StatusBadge({ status, label }: {
    status: HealthStatus;
    label?: string;
}): import("react").JSX.Element;
/** A gain or a loss, a change: signed, so the sign carries the meaning and the colour repeats it. */
export declare function SignedValue({ value, kind, currency, className, animate, }: {
    value: number | null | undefined;
    kind: 'money' | 'percent';
    /** For money: the currency's code (EUR by default). */
    currency?: string | null;
    className?: string;
    /** Its digits roll to each new value: for a figure that changes in front of the user. */
    animate?: boolean;
}): import("react").JSX.Element;
interface QueryStateProps {
    isPending: boolean;
    error: Error | null;
    /** There is data from an earlier fetch: keep showing it and report the failure above it. */
    hasData: boolean;
    skeleton?: ReactNode;
    children: ReactNode;
}
/** Loading and failure states shared by the pages. A failed refresh never blanks what is on screen. */
export declare function QueryState({ isPending, error, hasData, skeleton, children }: QueryStateProps): string | number | bigint | boolean | import("react").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>;
export {};
