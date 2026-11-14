import { ChartLine } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const charts: CategoryInfo = {
  slug: 'charts',
  label: 'Charts',
  icon: ChartLine,
  summary: 'Figures over time, by category or as parts of a whole, in the chart colours of both themes: each with a table or a summary for screen readers.',
  families: [
    {
      slug: 'line-chart',
      name: 'LineChart',
      names: ['LineChart'],
      keywords: ['time series', 'trend', 'compare', 'area', 'limit'],
      examples: [
        { id: 'compared', title: 'Things compared', description: 'Up to four series, in the compare colours in their order; a benchmark dashed. Its legend under it; the pointer or the arrow keys read a moment, and a table gives screen readers every one.' },
        { id: 'limit-and-moments', title: 'One series, its limit and moments', description: 'One series in the series colour, an area under it, the limit it must not cross and the moments that matter (a restart). A gap in the data is a gap in the line; a moment may say more (details).' },
        { id: 'gaps', title: 'Gaps, or joined across', description: 'A gap stays a gap; series measured on days of their own are joined across the days they were not (connectGaps).' },
        { id: 'narrow-and-empty', title: 'Narrow, or with nothing', description: 'Narrow, it names fewer moments on its axis; with no data, it says so in place of an empty frame.' },
      ],
    },
    {
      slug: 'live-line-chart',
      name: 'LiveLineChart',
      names: ['LiveLineChart'],
      keywords: ['real time', 'live', 'streaming', 'monitor'],
      examples: [
        { id: 'response-time', title: 'A value as it arrives', description: 'A reading a second over the last minute: a frame only when the line moves, a pause (or the pointer over it) for reading it. Its readout says the latest value and the change over the window.' },
        { id: 'unit-and-domain', title: 'A unit and a fixed range', description: 'A share from 0 to 100 keeps its axis (domain) however little it moves; the unit is said beside the figure.' },
        { id: 'no-readout', title: 'Without its readout', description: 'Small, in a box that says the figure itself: showReadout={false} leaves the line alone.' },
      ],
    },
    {
      slug: 'bar-chart',
      name: 'BarChart',
      names: ['BarChart'],
      keywords: ['bars', 'columns', 'grouped', 'stacked', 'histogram'],
      examples: [
        { id: 'grouped-or-stacked', title: 'Side by side or stacked', description: 'Things compared in the four compare colours, never recycled; changing the variant moves the bars from one to the other. The arrow keys move from one category to the next.' },
        { id: 'gains-and-losses', title: 'Gains and losses', description: 'Losses go below zero, and tone="sign" colours each bar as a gain or a loss. A category may say more: its title and details, in the tooltip and the table.' },
        { id: 'one-set-apart', title: 'One set apart', description: 'One category set apart among those it is set against, the others grey; counts step by whole numbers, the axis names every other one.' },
        { id: 'missing-and-empty', title: 'A value missing, or none', description: 'A value not counted is no bar and a dash, never a bar of zero; with no data, it says so.' },
      ],
    },
    {
      slug: 'bar-list',
      name: 'BarList',
      names: ['BarList'],
      keywords: ['ranking', 'top', 'leaderboard'],
      examples: [
        { id: 'ranked', title: 'Ranked, with links', description: 'Things ranked by a figure, a row each: its label, its bar and the figure. A row may lead to what it counts; values read against an axis are a BarChart.' },
        { id: 'against-a-limit', title: 'Against a limit, in tones', description: 'max makes a full bar the limit rather than the largest value; a tone says which row is near it.' },
        { id: 'narrow', title: 'Long labels, narrow', description: 'A label longer than its room ends in an ellipsis; the figure stays whole.' },
      ],
    },
    {
      slug: 'donut-chart',
      name: 'DonutChart',
      names: ['DonutChart'],
      keywords: ['pie', 'gauge', 'share', 'parts'],
      examples: [
        { id: 'parts-of-a-whole', title: 'Parts of a whole', description: 'Four segments take the compare colours; the rest are one segment, in grey. The total in its centre; hovering a segment or its line of the legend says its figure and its share.' },
        { id: 'gauge', title: 'A gauge', description: 'One value against its limit, a half ring: what is left of the limit in grey, the legend left out.' },
        { id: 'small-and-empty', title: 'Small, or with nothing', description: 'Smaller and thinner in a tile; with no data, it says so.' },
      ],
    },
    {
      slug: 'funnel-chart',
      name: 'FunnelChart',
      names: ['FunnelChart'],
      keywords: ['conversion', 'stages', 'drop-off'],
      examples: [
        { id: 'stages', title: 'Stages and what each lost', description: 'Where things went, stage after stage: what each stage lost on the way to the next, in words; above it, the share that went all the way and the biggest drop.' },
        { id: 'without-summary', title: 'Without its summary', description: 'Under a heading that says it already, showSummary={false} leaves the stages alone.' },
        { id: 'empty', title: 'No stage yet', description: 'With no stage, it says so in the words given (emptyText).' },
      ],
    },
    {
      slug: 'activity-heatmap',
      name: 'ActivityHeatmap',
      names: ['ActivityHeatmap'],
      keywords: ['calendar', 'heatmap', 'contributions', 'hours'],
      examples: [
        { id: 'calendar', title: 'Days on a calendar', description: 'A day a cell, in four steps of the series colour; above it the total and the peak. Narrow, it drops its oldest weeks rather than shrink its cells.' },
        { id: 'gains-and-losses', title: 'Gains and losses', description: 'Signed values take two scales (gains in teal, losses in red), each step one size on either side; the best and the worst day above it.' },
        { id: 'weekday-by-hour', title: 'Weekday by hour', description: 'A row a weekday, a column an hour. A cell with nothing is not a cell of zero: it says so (emptyText).' },
      ],
    },
    {
      slug: 'sparkline',
      name: 'Sparkline',
      names: ['Sparkline'],
      keywords: ['trend', 'mini chart', 'kpi'],
      examples: [
        { id: 'in-tiles', title: 'In a KPI tile', description: 'The trend of a figure, small and without axes, under the figure it is the trend of. Where down is good (a delay), it is given its tone.' },
        { id: 'in-a-table', title: 'In a table’s row', description: 'A week in a cell, at its default size; its tone set by what is good for that column.' },
        { id: 'tones-and-bars', title: 'Tones and bars', description: 'Its colour says the direction (its last value against its first), or the tone given. Bars start at zero, a loss below.' },
      ],
    },
    {
      slug: 'chart-legend',
      name: 'ChartLegend',
      names: ['ChartLegend'],
      keywords: ['legend', 'key', 'series'],
      examples: [
        { id: 'shapes', title: 'Its shapes', description: 'What a chart’s colours stand for, each swatch drawn as the chart draws its series: a bar, a line, a dashed line, a point, a moment marked; a figure beside each.' },
        { id: 'show-and-hide', title: 'Showing and hiding series', description: 'For a chart of your own, or a LineChart with showLegend={false}: its items show and hide their series, and the page keeps one shown.' },
      ],
    },
    {
      slug: 'dependency-trace',
      name: 'DependencyTrace',
      names: ['DependencyTrace'],
      keywords: ['graph', 'services', 'dependencies', 'health', 'topology'],
      examples: [
        { id: 'services', title: 'What calls what', description: 'A node’s health is a ring, an icon and a word; tracing one (the pointer, the focus, a click, Enter) says what it calls and what calls it.' },
        { id: 'every-health', title: 'Every health', description: 'Up, slow, down, unknown and switched off, each with its words and what was seen; a node with none is an outside service. The page is told which node is traced.' },
        { id: 'placed-round', title: 'Placed round', description: 'Nodes given no place go round an ellipse; the canvas scales to its container.' },
      ],
    },
  ],
}

export default charts
