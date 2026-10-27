import React from "react";
import { type TimestampedPoint } from "../../lib/dashboard-chart-utils.js";
export { buildFrame, valueAt, visibleExtent } from "../../lib/dashboard-chart-utils.js";
export interface LiveLineChartProps {
    /**
     * Your data feed. Called once; call `push(value)` whenever a new reading arrives
     * and return a cleanup function (close the socket, clear the timer…).
     */
    source?: (push: (value: number, time?: number) => void) => void | (() => void);
    /** Values already known, oldest → newest, spaced `intervalMs` apart and ending now */
    initial?: number[];
    /** ioiti-ui: values already known with their own times (ms), oldest → newest: what the tab kept of a feed. */
    initialPoints?: TimestampedPoint[];
    /** How often readings arrive, roughly. Also the small delay that makes motion silky (default 1000) */
    intervalMs?: number;
    /** Seconds visible on screen (default 60) */
    windowSeconds?: number;
    height?: number;
    color?: string;
    unit?: string;
    formatValue?: (n: number) => string;
    /** ioiti-ui: the y-axis labels (EasyUI's compact numbers), short enough for the left margin. */
    formatTick?: (n: number) => string;
    /**
     * ioiti-ui: the change over the window as the readout says it (latest minus the value at the window's start). EasyUI
     * gave a percentage of the first value ever pushed, which means nothing for a value that is itself a percentage.
     */
    formatChange?: (change: number) => string;
    domain?: [number, number];
    /** Big current value + pause button above the chart (default true) */
    showReadout?: boolean;
    ariaLabel?: string;
    className?: string;
}
export declare function LiveLineChart({ source, initial, intervalMs, windowSeconds, height, color, unit, formatValue, formatTick, formatChange, initialPoints, domain, showReadout, ariaLabel, className, }: LiveLineChartProps): React.JSX.Element;
