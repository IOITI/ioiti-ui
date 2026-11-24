import type { ReactNode } from 'react';
import type { StateItem } from './state-summary.js';
interface StateSummaryProps {
    /** The states, each while it applies; the quiet ones too (all is well, a fallback), said once it is opened. */
    items: StateItem[];
    /** Its name: the button's, before what it says ("State: Payments down"), and the panel's. */
    label?: string;
    /** What it says while nothing stands out and nothing is neutral. */
    okLabel?: string;
    /** Under the states, in the panel: a link to the page where they all are. */
    footer?: ReactNode;
    className?: string;
}
/**
 * The states the user must not miss, in one control of the top bar (AppShell's `topBarChips`): the gravest one's
 * words and icon in its tone, "+N" for the others (its icon and how many under 1280px), and a dot while all is well. It opens on every state, the
 * gravest first and the quiet ones after, each a link to where it is dealt with. Where several StateChips would
 * take the top bar's room: one is still a StateChip.
 */
export declare function StateSummary({ items, label, okLabel, footer, className }: StateSummaryProps): import("react").JSX.Element;
export {};
