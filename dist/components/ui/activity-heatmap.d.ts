import { type ReactNode } from "react";
import type { WeekDay } from "../../lib/locale.js";
export interface HeatDay {
    /** "YYYY-MM-DD" or a Date */
    date: string | Date;
    value: number;
    /** ioiti-ui: a line under the value in the cell's tooltip (what it is made of). */
    detail?: string;
}
/** ioiti-ui: signed values, gains on one side and losses on the other, each in steps of size (smallest first). */
export interface DivergingColors {
    positive: string[];
    negative: string[];
}
export interface ActivityHeatmapProps {
    /** calendar: one cell per day (GitHub style) · hours: weekday × hour grid */
    mode?: "calendar" | "hours";
    /** calendar mode */
    data?: HeatDay[];
    /** hours mode: a row per row label × a column per hour. ioiti-ui: null for a cell with nothing. */
    matrix?: (number | null)[][];
    /**
     * hours mode row names (default Mon…Sun). ioiti-ui: as many rows as names; by default the days Monday first, as the
     * provider's locale names them.
     */
    rowLabels?: string[];
    /** ioiti-ui: hours mode, the hours shown as columns (default 0 to 23). */
    hours?: number[];
    /** ioiti-ui: hours mode, a line under each cell's value in its tooltip. */
    details?: (string | null | undefined)[][];
    /** Most weeks to show. Narrow screens automatically show fewer (default 53) */
    weeks?: number;
    /** Last day shown (default: latest date in data) */
    endDate?: string | Date;
    /** ioiti-ui: calendar mode, no day drawn before it (the start of a period). */
    startDate?: string | Date;
    /**
     * 0 = Sunday, 1 = Monday. ioiti-ui: any day (… 6 = Saturday); by default the provider's first day of the week
     * (IoitiProvider: Monday in en-GB), not Sunday.
     */
    weekStart?: WeekDay;
    color?: string;
    /** ioiti-ui: signed values on two scales, in place of `color`. */
    diverging?: DivergingColors;
    /**
     * Plural noun used in the tooltip / summary. ioiti-ui: written after each number as given; by default the provider's
     * word, which counts ("1 contribution", "12 contributions": `heatmap.unit`).
     */
    unit?: string;
    /** ioiti-ui: how a value is written (its unit included), in place of the number and `unit`. */
    format?: (value: number) => string;
    /** ioiti-ui: in place of the total over the grid. */
    summary?: ReactNode;
    /** ioiti-ui: what a cell with nothing says. */
    emptyText?: string;
    /** ioiti-ui: the two ends of the legend (default Less, More, in the provider's words). */
    legend?: [string, string];
    /** Smallest cell size in px before weeks are dropped (default 11) */
    minCell?: number;
    animated?: boolean;
    /** ioiti-ui: the grid's name; by default "Activity heatmap." and its summary, in the provider's words. */
    "aria-label"?: string;
    className?: string;
}
export declare function ActivityHeatmap({ mode, data, matrix, rowLabels: rowLabelsGiven, hours: columnHours, details, weeks, endDate, startDate, weekStart: weekStartGiven, color, diverging, unit, format, summary: summaryText, emptyText, legend, minCell, animated, "aria-label": name, className, }: ActivityHeatmapProps): import("react").JSX.Element;
