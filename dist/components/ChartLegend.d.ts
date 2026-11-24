import type { ReactNode } from 'react';
export interface ChartLegendItem {
    label: ReactNode;
    /** The series' colour, as the chart draws it: a token (`var(--chart-compare-1)`) or a colour. */
    color: string;
    /**
     * How the chart draws it: a bar or an area (`square`, the default), a line, a dashed line, a point, or a moment
     * marked across the chart (`marker`: LineChart's markers, a restart).
     */
    shape?: 'square' | 'line' | 'dashed' | 'dot' | 'marker';
    /** A figure beside it: the series' total, its last value. */
    value?: ReactNode;
    /** With `onToggle`: whether the chart shows it. */
    shown?: boolean;
}
interface ChartLegendProps {
    items: ChartLegendItem[];
    /** Makes each item a button that shows or hides its series. The chart decides what it allows (one series left). */
    onToggle?: (index: number) => void;
    /** The legend's name for a screen reader. */
    label?: string;
    className?: string;
}
/**
 * What the colours of a chart stand for, each with its swatch drawn as the chart draws it, and a figure
 * where there is one. With `onToggle`, each shows or hides its series. Also for an application's own charts.
 */
export declare function ChartLegend({ items, onToggle, label, className }: ChartLegendProps): import("react").JSX.Element;
export {};
