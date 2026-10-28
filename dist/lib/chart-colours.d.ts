export declare const SERIES_COLOUR = "var(--chart-series)";
export declare const MUTED_COLOUR = "var(--chart-muted)";
export declare const POSITIVE_COLOUR = "var(--chart-positive)";
export declare const NEGATIVE_COLOUR = "var(--chart-negative)";
export declare const GRID_COLOUR = "var(--chart-grid)";
export declare const AXIS_COLOUR = "var(--chart-axis)";
/** The colour of each series, in order: a colour given wins, the design's otherwise. */
export declare function seriesColours(given: (string | undefined)[]): string[];
