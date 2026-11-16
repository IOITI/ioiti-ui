import React, { type ReactNode } from "react";
export interface StatCardProps {
    label: string;
    /** The headline number (usually the latest point of `trend`) */
    value: number;
    /** Points for the sparkline, oldest → newest */
    trend: number[];
    /** Names for each trend point, shown while scrubbing (e.g. "Oct 12") */
    trendLabels?: string[];
    /** Previous-period value → the delta is computed from it */
    previous?: number;
    /** …or give the delta in percent directly */
    delta?: number;
    /** Which direction is good news. Use "down" for churn, latency, costs */
    goodWhen?: "up" | "down";
    /** Text under the number, e.g. "vs last 30 days" */
    period?: string;
    format?: (n: number) => string;
    /** ioiti-ui: a class for the headline by the value shown (a profit green, a loss red), the scrubbed point's too. */
    toneOf?: (n: number) => string | undefined;
    color?: string;
    animated?: boolean;
    className?: string;
}
export declare function StatCard({ label, value, trend, trendLabels, previous, delta, goodWhen, period, format, toneOf, color, animated, className, }: StatCardProps): React.JSX.Element;
export declare function StatGrid({ children, className }: {
    children: ReactNode;
    className?: string;
}): React.JSX.Element;
