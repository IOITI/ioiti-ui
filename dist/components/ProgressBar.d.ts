import type { ReactNode } from 'react';
import type { MeterTone } from './meter-tones.js';
interface ProgressBarProps {
    /** What is under way: "Importing the files". */
    label: ReactNode;
    /** Done so far, out of `max`. None for work whose length is not known: the bar then says it is working. */
    value?: number;
    max?: number;
    /** The progress in words, said beside the bar and to a screen reader: "42 of 120 files". The percentage otherwise. */
    valueText?: string;
    tone?: MeterTone;
    size?: 'sm' | 'md';
    className?: string;
}
/**
 * How far a piece of work has come: a file imported, a run computed. For a ratio against a limit (a quota
 * used), `Meter`.
 */
export declare function ProgressBar({ label, value, max, valueText, tone, size, className }: ProgressBarProps): import("react").JSX.Element;
export interface BarListItem {
    label: ReactNode;
    value: number;
    /** Where the row leads: its label is then a link. */
    href?: string;
    tone?: MeterTone;
}
interface BarListProps {
    items: BarListItem[];
    /** The list's name for a screen reader. */
    label?: string;
    /** The value of a full bar; the largest value otherwise. */
    max?: number;
    format?: (value: number) => string;
    className?: string;
}
/**
 * Things ranked by a figure, each a row of its label, a bar and the figure: the reasons orders were
 * returned, the pages most visited. For values over categories read against an axis, `BarChart`.
 */
export declare function BarList({ items, label, max, format, className }: BarListProps): import("react").JSX.Element;
export {};
