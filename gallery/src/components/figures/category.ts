import { Gauge } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const figures: CategoryInfo = {
  slug: 'figures',
  label: 'Figures',
  icon: Gauge,
  summary: 'The figures a page is about: tiles first, each change signed and in the tone of what it means, digits of one width.',
  families: [
    {
      slug: 'kpi-tile',
      name: 'KpiTile',
      names: ['KpiTile', 'KpiGrid'],
      keywords: ['kpi', 'metric', 'stat', 'dashboard', 'tile'],
      examples: [
        { id: 'dashboard', title: 'The figures of a page', description: 'Four across from 1280 px, two on a phone. The lead tile takes two columns, its chart beside the figure; what the changes are compared with is said once, above the row.' },
        { id: 'change', title: 'A change and what it means', description: 'Signed, an arrow its way, in the tone of what it means: down is good news for a cost or a delay (goodWhen="down"). changeFormat writes another unit than a percentage.' },
        { id: 'attention', title: 'A tile that needs attention', description: 'Faintly tinted in its tone, warning or negative, and saying why in a word or two (toneLabel): never the colour alone.' },
        { id: 'limits', title: 'Against a limit', description: 'No change to show: what the figure is out of, or since when, in its hint; a Meter for a ratio against a limit.' },
        { id: 'columns', title: 'Three across', description: 'columns: the tiles side by side on a wide screen (2 to 6), two on a phone whatever is asked.' },
      ],
    },
    {
      slug: 'kpi-strip',
      name: 'KpiStrip',
      names: ['KpiStrip'],
      keywords: ['kpi', 'metrics', 'secondary figures'],
      examples: [
        { id: 'strip', title: 'Secondary figures', description: 'In one panel, divided by hairlines: as many across as there are (six at most), three on a tablet, two on a phone. It takes what a tile takes: a label, a value, a change.' },
        { id: 'under-tiles', title: 'Under the tiles', description: 'The figures that support the tiles above it: a KpiGrid first, the strip under it, never a strip alone at the top of a page.' },
        { id: 'columns', title: 'Columns', description: 'columns sets the count from 1024 px: six figures in three columns wrap into two rows, the hairlines holding however they wrap. A figure without a change says its hint.' },
      ],
    },
    {
      slug: 'stat-card',
      name: 'StatCard',
      names: ['StatCard', 'StatGrid'],
      keywords: ['trend', 'sparkline', 'scrub', 'metric'],
      examples: [
        { id: 'trend', title: 'A figure and its line', description: 'Scrub the line, with the pointer or the arrows, to read a day. The change is shown only against what it is told it changes from: previous, or delta.' },
        { id: 'tone', title: 'A tone by value', description: 'toneOf gives the headline a tone by the value shown, the scrubbed point’s too: a result green above zero, red below.' },
        { id: 'among-tiles', title: 'Among tiles', description: 'A StatCard sits in a KpiGrid beside KpiTiles, where its line says more than a figure alone.' },
      ],
    },
    {
      slug: 'meter',
      name: 'Meter',
      names: ['Meter'],
      keywords: ['gauge', 'quota', 'usage', 'limit', 'ratio'],
      examples: [
        { id: 'tones', title: 'Its tones', description: 'neutral (the accent’s colour where one is chosen), positive, warning, negative: the state of the figure, its track a faint step of the same colour. The figure is written beside it.' },
        { id: 'in-a-tile', title: 'In a tile', description: 'Under a KpiTile’s figure, its scale under it: what the two ends stand for.' },
        { id: 'changing', title: 'A ratio that changes', description: 'A new ratio slides to its place (at once where motion is reduced); its tone follows thresholds the page knows.' },
      ],
    },
    {
      slug: 'signed-value',
      name: 'SignedValue',
      names: ['SignedValue'],
      keywords: ['gain', 'loss', 'change', 'delta', 'profit'],
      examples: [
        { id: 'formats', title: 'Money and percentages', description: 'A true minus, a plus on a gain, the colour repeating the sign; zero has neither. Money in euros by default, or the currency given.' },
        { id: 'in-a-table', title: 'In a table', description: 'In a numeric cell, its digits of one width lining up with the column’s.' },
        { id: 'rolling', title: 'Rolling, then stale', description: 'animate rolls its digits when it changes in front of the reader; stale mutes it, its sign still there, and a screen reader hears that it is old.' },
      ],
    },
    {
      slug: 'animated-number',
      name: 'AnimatedNumber',
      names: ['AnimatedNumber'],
      keywords: ['counter', 'odometer', 'rolling digits', 'count up'],
      examples: [
        { id: 'counter', title: 'A count that changes', description: 'Its digits roll to each new value, in digits of one width; a screen reader hears the value once.' },
        { id: 'formats', title: 'Its formats', description: 'decimals, compact, a prefix or a suffix; or text, written by the application’s formats, whose digits roll while the rest stays.' },
      ],
    },
    {
      slug: 'live-value',
      name: 'LiveValue',
      names: ['LiveValue'],
      keywords: ['realtime', 'ticker', 'flash', 'stale'],
      examples: [
        { id: 'watched', title: 'A figure being watched', description: 'Each change in its tone a moment, then back in a fade (which stays where motion is reduced); muted, and said stale, once what sends it stops.' },
        { id: 'invert', title: 'Where down is good', description: 'invert swaps the tones for a delay or a cost; flash={false} keeps them off for a figure that changes too often to be read.' },
        { id: 'waiting', title: 'Before the first figure', description: 'null while nothing has come: a dash, which the first figure replaces without a flash.' },
      ],
    },
    {
      slug: 'status-history',
      name: 'StatusHistory',
      names: ['StatusHistory'],
      keywords: ['uptime', 'availability', 'health', 'status page'],
      examples: [
        { id: 'day', title: 'A day, an hour a block', description: 'One block per slot of time, coloured by its state. A screen reader hears it in words: how long it was up, then each other state with when it was.' },
        { id: 'days', title: 'A month, a day a block', description: 'unit names the slot (day, days) for the words a screen reader hears; scale says what the two ends stand for.' },
        { id: 'in-a-panel', title: 'In a panel, said your way', description: 'In a Panel that says what runs; summary says the strip in the page’s own words. Unknown and switched off are greys.' },
      ],
    },
  ],
}

export default figures
