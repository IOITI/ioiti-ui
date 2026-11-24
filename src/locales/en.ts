// The words the package says, in English: the catalogue every other language is typed after (`Messages`), and what is
// said where no language is given. One file per namespace (en/), each a component's or a family's. A word that takes
// values is a function of them and of the locale's kit (its plurals, its numbers, its lists), called with the values
// alone once bound (`useMessages()`).
import { ai } from './en/ai.js'
import { chart } from './en/chart.js'
import { clock } from './en/clock.js'
import { code } from './en/code.js'
import { date } from './en/date.js'
import { dialog } from './en/dialog.js'
import { error } from './en/error.js'
import { field } from './en/field.js'
import { format } from './en/format.js'
import { heatmap } from './en/heatmap.js'
import { keys } from './en/keys.js'
import { layout } from './en/layout.js'
import { ledger } from './en/ledger.js'
import { log } from './en/log.js'
import { look } from './en/look.js'
import { notFound } from './en/notFound.js'
import { notification } from './en/notification.js'
import { numberInput } from './en/numberInput.js'
import { router } from './en/router.js'
import { search } from './en/search.js'
import { select } from './en/select.js'
import { shell } from './en/shell.js'
import { shortcuts } from './en/shortcuts.js'
import { status } from './en/status.js'
import { table } from './en/table.js'
import { timeRange } from './en/timeRange.js'
import { toast } from './en/toast.js'
import { tour } from './en/tour.js'
import { upload } from './en/upload.js'

export const en = { format, date, heatmap, timeRange, chart, clock, ledger, log, numberInput, table, select, field, status, layout, shell, look, error, notFound, router, shortcuts, keys, code, ai, upload, notification, search, tour, toast, dialog }

/** The package's words, by namespace: English's, which every language's catalogue gives in full. */
export type Messages = typeof en
