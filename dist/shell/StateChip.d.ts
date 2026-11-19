import type { ReactNode } from 'react';
declare const CHIP_TONE: {
    warning: string;
    danger: string;
    success: string;
};
interface StateChipProps {
    /** The page where it is dealt with. */
    to: string;
    /** What it is: something to fix (danger), to watch (warning), or good news (success). */
    tone: keyof typeof CHIP_TONE;
    icon: ReactNode;
    label: string;
    /** What it means and what to do, for the tooltip. */
    hint: ReactNode;
}
/**
 * A state the user must not miss, on whichever page they are (in the top bar,
 * AppShell's `topBarChips`): shown only while it applies, and a link to the
 * page where it is dealt with. On a narrow screen the icon stays and the words
 * are its name; what it means is its hint.
 */
export declare function StateChip({ to, tone, icon, label, hint }: StateChipProps): import("react").JSX.Element;
export {};
