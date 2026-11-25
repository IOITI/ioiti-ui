import { type ReactNode, type RefObject } from "react";
export declare const clamp: (v: number, min: number, max: number) => number;
export declare const cx: (...a: (string | false | null | undefined)[]) => string;
export interface ChartFormat {
    /** A value in full, to a tenth at most: "1,234.5". */
    format: (n: number) => string;
    /** A tick of a value axis, compact: "1.2k". */
    tick: (n: number) => string;
    /** A share given in points, to the unit from 10 up and to a tenth under: "12%", "2.5%". */
    percent: (points: number) => string;
    /** A share of a whole given as a fraction (0.04), to the unit: "4%". */
    share: (fraction: number) => string;
}
/** ioiti-ui: the charts' formats in a locale, made once for it; British English's by default. */
export declare function chartFormatFor(locale?: string): ChartFormat;
/** ioiti-ui: the charts' formats in the interface's locale: IoitiProvider's, British English's outside one. */
export declare function useChartFormat(): ChartFormat;
export declare const fullFmt: Intl.NumberFormat;
export declare const defaultFormat: (n: number) => string;
export declare const defaultTick: (n: number) => string;
export declare const muted = "text-muted-foreground";
export declare const focus = "outline-none";
export declare function niceStep(raw: number): number;
/**
 * Container width via ResizeObserver (initial value keeps SSR output sensible)
 *
 * ioiti-ui: the box measured takes its width from its container alone (`contain-inline-size`, which every
 * chart here gives it), never from what is drawn in it at the width measured before. In a column as wide as
 * its content (a grid's single column, on a phone), a chart first drawn 640 px wide held the column open at
 * 640 px, was measured so, and stayed wider than the screen.
 */
export declare function useElementWidth<T extends HTMLElement>(initial: number): readonly [RefObject<T | null>, number];
/** Clear a hover/tap selection when the user taps outside the chart (touch) */
export declare function useDismissOutside(ref: RefObject<HTMLElement | null>, open: boolean, close: () => void): void;
export declare function Tooltip({ pos, boundsWidth, children, }: {
    pos: {
        x: number;
        y: number;
    } | null;
    boundsWidth: number;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function Dot({ color }: {
    color: string;
}): import("react").JSX.Element;
