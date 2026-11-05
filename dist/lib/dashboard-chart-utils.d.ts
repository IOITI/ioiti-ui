/**
 * Shared math for the EasyUI dashboard charts.
 *
 * Kept in `src/lib` so the registry generator ships it as a `registry:lib`
 * dependency for StatCard, FunnelChart and LiveLineChart.
 */
export declare const pctText: (x: number) => string;
/** A value sampled at a timestamp (UTC ms) */
export interface TimestampedPoint {
    t: number;
    v: number;
}
/** Smooth monotone cubic through points (never overshoots the data) */
export declare function monotonePath(p: [number, number][]): string;
/** Linear interpolation of the stream at time t (clamped to the data) */
export declare function valueAt(buf: TimestampedPoint[], t: number): number | null;
export declare function visibleExtent(buf: TimestampedPoint[], tEnd: number, win: number): {
    min: number;
    max: number;
};
export declare function buildFrame(buf: TimestampedPoint[], tEnd: number, win: number, dom: {
    lo: number;
    hi: number;
}, g: {
    l: number;
    t: number;
    iw: number;
    ih: number;
}): {
    line: string;
    area: string;
    head: {
        x: number;
        y: number;
    } | null;
    tStart: number;
};
