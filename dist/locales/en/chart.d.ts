import type { MessageKit } from '../../lib/messages.js';
/**
 * The charts' words (LineChart, FanChart, BarChart, DonutChart, FunnelChart, StatCard, Sparkline, LiveLineChart): what
 * they say without data, what they are named, their legends and their tables for a screen reader.
 */
export declare const chart: {
    /** "No data": what a chart without points says in its place. */
    noData: string;
    /** "Chart data": the caption of a chart's table for a screen reader, where the chart has no name of its own. */
    tableCaption: string;
    /** "Series": the name of a chart's legend of series, for a screen reader. */
    seriesLegend: string;
    /** "Legend": the name of a donut's legend of segments, for a screen reader. */
    legend: string;
    /** "Details": the head of the column of what more a chart says of a point. */
    detailsColumn: string;
    /** "Total": the sum of a stacked bar's series in its tooltip, and the words above a donut's total. */
    total: string;
    /** "Today: +€4.20": a figure after its name, as a tile, a sparkline or a point scrubbed says it. */
    namedValue: ({ name, value }: {
        name: string;
        value: string;
    }) => string;
    /** "Line chart of Run 41, Run 42": a line chart's name, where the application gives none. */
    lineChartName: (series: readonly string[], _kit: MessageKit) => string;
    /** "Time": the head of the column of a line chart's moments. */
    timeColumn: string;
    /** "Fan chart of Expected, Actual": a fan chart's name, where the application gives none. */
    fanChartName: (lines: readonly string[], _kit: MessageKit) => string;
    /** "Place": the head of the column of a fan chart's places on its x axis, where it has no `xLabel`. */
    placeColumn: string;
    /** "−4.0 to 5.2": a band's range at a place, its edges written. */
    bandRange: ({ low, high }: {
        low: string;
        high: string;
    }) => string;
    /** "Bar chart of Profit, Fees across 7 categories": a bar chart's name, where the application gives none. */
    barChartName: ({ series, count }: {
        series: readonly string[];
        count: number;
    }, { plural }: MessageKit) => string;
    /** "Category": the head of the column of a bar chart's categories. */
    categoryColumn: string;
    /** "Donut chart. Total 750": a donut's name, its total written, where the application gives none. */
    donutChartName: (total: string) => string;
    /** "Gauge chart. Total 750": a half-ring gauge's name, its total written, where the application gives none. */
    gaugeChartName: (total: string) => string;
    /** "Other": the segment the fifth and those after it make together. */
    otherSegment: string;
    /** "Segment": the head of the column of a donut's segments. */
    segmentColumn: string;
    /** "Value": the head of the column of a donut's values. */
    valueColumn: string;
    /** "Share": the head of the column of each segment's share of the total. */
    shareColumn: string;
    /** "Funnel with 4 stages from Visited to Paid": a funnel's name, where the application gives none. */
    funnelChartName: ({ count, first, last }: {
        count: number;
        first: string;
        last: string;
    }, { plural }: MessageKit) => string;
    /** "Funnel data": the caption of a funnel's table for a screen reader, where the funnel has no name of its own. */
    funnelTableCaption: string;
    /** "overall conversion": what follows the share of the first stage that reached the last ("5.1% overall conversion"). */
    conversionSummary: string;
    /** "Biggest drop:": what introduces the stage that loses the most, above a funnel. */
    biggestDrop: string;
    /** "Users": what a funnel counts, where the application names nothing. */
    funnelCounted: string;
    /** "Of the first": a stage's share of the first, in its tooltip. */
    shareOfFirstStage: string;
    /** "Lost next": what a stage loses before the next, in its tooltip, where the application names nothing. */
    lossToNextStage: string;
    /** "none": what a stage loses before the next when it loses nothing. */
    noLoss: string;
    /** "Stage": the head of the column of a funnel's stages. */
    stageColumn: string;
    /** "% of first stage": the head of the column of each stage's share of the first. */
    firstStageShareColumn: string;
    /** "vs previous period": what a tile's change is against, under its figure, where the application says nothing. */
    previousPeriod: string;
    /** "Account value: €1,025.00, up 2.5%": a tile's name, its figure and its change. */
    statCardName: ({ name, value, direction, change }: {
        name: string;
        value: string;
        direction: "up" | "down" | "flat";
        change: string;
    }) => string;
    /** "Revenue trend from €18,200.00 to €23,950.00": the name of a tile's line. */
    trendName: ({ name, first, last }: {
        name: string;
        first: string;
        last: string;
    }) => string;
    /** "Point 3": a point of a tile's line that has no name of its own. */
    trendPoint: (index: number) => string;
    /** "from 120 to 180, high 200, low 90": what a sparkline shows, after its name. */
    sparklineSummary: ({ first, last, high, low }: {
        first: string;
        last: string;
        high: string;
        low: string;
    }) => string;
    /** "Live chart of the last 60 s, currently 42 ms": a live chart's name, its latest value once it has one. */
    liveChartName: ({ span, value, unit }: {
        span: string;
        value?: string;
        unit: string;
    }) => string;
    /** "over the last 60 s": the window a live chart's change is over, after the change. */
    liveWindow: (span: string) => string;
    /** "Pause live updates": the name of the button that pauses a live chart. */
    pauseLive: string;
    /** "Resume live updates": the name of the button that resumes a paused live chart. */
    resumeLive: string;
    /** "Live": what the button of a live chart that moves says. */
    live: string;
    /** "Paused": what the button of a paused live chart says. */
    paused: string;
    /** "Live updates paused": what a screen reader is told when a live chart pauses. */
    livePausedStatus: string;
    /** "now": the latest moment of a live chart, at the end of its axis and in its tooltip. */
    now: string;
    /** "−30 s": a moment of a live chart's axis, so long before now. */
    beforeNow: (span: string) => string;
};
