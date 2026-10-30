import { type ReactNode, type RefObject } from "react";
export declare const CHART_COLORS: string[];
export declare const EASE_OUT: readonly [0.23, 1, 0.32, 1];
export declare const SPRING: {
    readonly type: "spring";
    readonly duration: 0.5;
    readonly bounce: 0;
};
export declare const clamp: (v: number, min: number, max: number) => number;
export declare const cx: (...a: (string | false | null | undefined)[]) => string;
export declare const fullFmt: Intl.NumberFormat;
export declare const defaultFormat: (n: number) => string;
export declare const defaultTick: (n: number) => string;
export declare const ring = "ring-1 ring-black/[0.07] dark:ring-white/[0.07]";
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
export declare function ChartCard({ title, description, actions, children, className, }: {
    title: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
export declare function SegmentedControl<T extends string>({ value, onChange, options, label, }: {
    value: T;
    onChange: (v: T) => void;
    options: {
        value: T;
        label: string;
    }[];
    label: string;
}): import("react").JSX.Element;
