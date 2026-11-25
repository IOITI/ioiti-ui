/**
 * The charts' words (LineChart, FanChart, BarChart, DonutChart, FunnelChart, StatCard, Sparkline, LiveLineChart): what
 * they say without data, what they are named, their legends and their tables for a screen reader.
 */
export const chart = {
    /** "No data": what a chart without points says in its place. */
    noData: 'No data',
    /** "Chart data": the caption of a chart's table for a screen reader, where the chart has no name of its own. */
    tableCaption: 'Chart data',
    /** "Series": the name of a chart's legend of series, for a screen reader. */
    seriesLegend: 'Series',
    /** "Legend": the name of a donut's legend of segments, for a screen reader. */
    legend: 'Legend',
    /** "Details": the head of the column of what more a chart says of a point. */
    detailsColumn: 'Details',
    /** "Total": the sum of a stacked bar's series in its tooltip, and the words above a donut's total. */
    total: 'Total',
    /** "Today: +€4.20": a figure after its name, as a tile, a sparkline or a point scrubbed says it. */
    namedValue: ({ name, value }) => `${name}: ${value}`,
    // English names its series with commas alone, as it always has: its list (`kit.list`) says "a, b and c".
    /** "Line chart of Run 41, Run 42": a line chart's name, where the application gives none. */
    lineChartName: (series, _kit) => `Line chart of ${series.join(', ')}`,
    /** "Time": the head of the column of a line chart's moments. */
    timeColumn: 'Time',
    /** "Fan chart of Expected, Actual": a fan chart's name, where the application gives none. */
    fanChartName: (lines, _kit) => `Fan chart of ${lines.join(', ')}`,
    /** "Place": the head of the column of a fan chart's places on its x axis, where it has no `xLabel`. */
    placeColumn: 'Place',
    /** "−4.0 to 5.2": a band's range at a place, its edges written. */
    bandRange: ({ low, high }) => `${low} to ${high}`,
    /** "Bar chart of Profit, Fees across 7 categories": a bar chart's name, where the application gives none. */
    barChartName: ({ series, count }, { plural }) => `Bar chart of ${series.join(', ')} across ${plural(count, { one: '# category', other: '# categories' })}`,
    /** "Category": the head of the column of a bar chart's categories. */
    categoryColumn: 'Category',
    /** "Donut chart. Total 750": a donut's name, its total written, where the application gives none. */
    donutChartName: (total) => `Donut chart. Total ${total}`,
    /** "Gauge chart. Total 750": a half-ring gauge's name, its total written, where the application gives none. */
    gaugeChartName: (total) => `Gauge chart. Total ${total}`,
    /** "Other": the segment the fifth and those after it make together. */
    otherSegment: 'Other',
    /** "Segment": the head of the column of a donut's segments. */
    segmentColumn: 'Segment',
    /** "Value": the head of the column of a donut's values. */
    valueColumn: 'Value',
    /** "Share": the head of the column of each segment's share of the total. */
    shareColumn: 'Share',
    /** "Funnel with 4 stages from Visited to Paid": a funnel's name, where the application gives none. */
    funnelChartName: ({ count, first, last }, { plural }) => `Funnel with ${plural(count, { one: '# stage', other: '# stages' })} from ${first} to ${last}`,
    /** "Funnel data": the caption of a funnel's table for a screen reader, where the funnel has no name of its own. */
    funnelTableCaption: 'Funnel data',
    /** "overall conversion": what follows the share of the first stage that reached the last ("5.1% overall conversion"). */
    conversionSummary: 'overall conversion',
    /** "Biggest drop:": what introduces the stage that loses the most, above a funnel. */
    biggestDrop: 'Biggest drop:',
    /** "Users": what a funnel counts, where the application names nothing. */
    funnelCounted: 'Users',
    /** "Of the first": a stage's share of the first, in its tooltip. */
    shareOfFirstStage: 'Of the first',
    /** "Lost next": what a stage loses before the next, in its tooltip, where the application names nothing. */
    lossToNextStage: 'Lost next',
    /** "none": what a stage loses before the next when it loses nothing. */
    noLoss: 'none',
    /** "Stage": the head of the column of a funnel's stages. */
    stageColumn: 'Stage',
    /** "% of first stage": the head of the column of each stage's share of the first. */
    firstStageShareColumn: '% of first stage',
    /** "vs previous period": what a tile's change is against, under its figure, where the application says nothing. */
    previousPeriod: 'vs previous period',
    /** "Account value: €1,025.00, up 2.5%": a tile's name, its figure and its change. */
    statCardName: ({ name, value, direction, change }) => `${name}: ${value}, ${direction === 'up' ? 'up' : direction === 'down' ? 'down' : 'unchanged'} ${change}`,
    /** "Revenue trend from €18,200.00 to €23,950.00": the name of a tile's line. */
    trendName: ({ name, first, last }) => `${name} trend from ${first} to ${last}`,
    /** "Point 3": a point of a tile's line that has no name of its own. */
    trendPoint: (index) => `Point ${index}`,
    /** "from 120 to 180, high 200, low 90": what a sparkline shows, after its name. */
    sparklineSummary: ({ first, last, high, low }) => `from ${first} to ${last}, high ${high}, low ${low}`,
    /** "Live chart of the last 60 s, currently 42 ms": a live chart's name, its latest value once it has one. */
    liveChartName: ({ span, value, unit }) => `Live chart of the last ${span}${value === undefined ? '' : `, currently ${value} ${unit}`}`,
    /** "over the last 60 s": the window a live chart's change is over, after the change. */
    liveWindow: (span) => `over the last ${span}`,
    /** "Pause live updates": the name of the button that pauses a live chart. */
    pauseLive: 'Pause live updates',
    /** "Resume live updates": the name of the button that resumes a paused live chart. */
    resumeLive: 'Resume live updates',
    /** "Live": what the button of a live chart that moves says. */
    live: 'Live',
    /** "Paused": what the button of a paused live chart says. */
    paused: 'Paused',
    /** "Live updates paused": what a screen reader is told when a live chart pauses. */
    livePausedStatus: 'Live updates paused',
    /** "now": the latest moment of a live chart, at the end of its axis and in its tooltip. */
    now: 'now',
    /** "−30 s": a moment of a live chart's axis, so long before now. */
    beforeNow: (span) => `−${span}`,
};
