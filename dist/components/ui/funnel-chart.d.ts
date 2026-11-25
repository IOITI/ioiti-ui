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
    /** ioiti-ui: a stage's value: as the interface's locale writes it by default, to a tenth at most ("1,234.5"). */
    formatValue?: (n: number) => string;
    /** Overall conversion + biggest drop-off line above the chart (default true) */
    showSummary?: boolean;
    animated?: boolean;
    /**
     * ioiti-ui: its name for a screen reader, and its table's caption. By default, in the interface's language, "Funnel
     * with 4 stages from Visited to Paid" and "Funnel data".
     */
    "aria-label"?: string;
    /** @deprecated Use `aria-label`. Removed in 1.0. */
    ariaLabel?: string;
    className?: string;
    /**
     * ioiti-ui: what the last stage is of the first, beside its share ("of the visits ended in a purchase"); "overall
     * conversion" in the interface's language by default.
     */
    summaryLabel?: string;
    /**
     * ioiti-ui: what is counted, in the tooltip and the table ("Visits"; EasyUI's "Users", in the interface's language, by
     * default).
     */
    noun?: string;
    /** ioiti-ui: said in place of the chart when there is no stage; "No data" in the interface's language by default. */
    emptyText?: string;
}
export declare function FunnelChart({ stages, formatValue: givenFormatValue, showSummary, animated, "aria-label": givenName, ariaLabel, className, summaryLabel: givenSummaryLabel, noun: givenNoun, emptyText: givenEmptyText, }: FunnelChartProps): React.JSX.Element;
