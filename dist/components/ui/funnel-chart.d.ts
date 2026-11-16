import React from "react";
export interface FunnelStage {
    label: string;
    value: number;
    color?: string;
    /** ioiti-ui: what was lost between this stage and the next, in the caller's words ("refused by a rule"). */
    dropLabel?: string;
}
export interface FunnelChartProps {
    stages: FunnelStage[];
    formatValue?: (n: number) => string;
    /** Overall conversion + biggest drop-off line above the chart (default true) */
    showSummary?: boolean;
    animated?: boolean;
    ariaLabel?: string;
    className?: string;
    /** ioiti-ui: what the last stage is of the first, beside its share ("of the visits ended in a purchase"). */
    summaryLabel?: string;
    /** ioiti-ui: what is counted, in the tooltip and the table ("Visits"; EasyUI's "Users"). */
    noun?: string;
    /** ioiti-ui: said in place of the chart when there is no stage. */
    emptyText?: string;
}
export declare function FunnelChart({ stages, formatValue, showSummary, animated, ariaLabel, className, summaryLabel, noun, emptyText, }: FunnelChartProps): React.JSX.Element;
