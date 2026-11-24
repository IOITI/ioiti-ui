// The words the package says, in English: the catalogue every other language is typed after (`Messages`), and what is
// said where no language is given. One file per namespace (en/), each a component's or a family's. A word that takes
// values is a function of them and of the locale's kit (its plurals, its numbers, its lists), called with the values
// alone once bound (`useMessages()`).
import { chart } from './en/chart.js'
import { clock } from './en/clock.js'
import { date } from './en/date.js'
import { format } from './en/format.js'
import { heatmap } from './en/heatmap.js'
import { ledger } from './en/ledger.js'
import { log } from './en/log.js'
import { numberInput } from './en/numberInput.js'
import { timeRange } from './en/timeRange.js'

export const en = { format, date, heatmap, timeRange, chart, clock, ledger, log, numberInput }

/** The package's words, by namespace: English's, which every language's catalogue gives in full. */
export type Messages = typeof en
