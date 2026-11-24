// Les mots du paquet, en français : le catalogue de l'anglais (`Messages`), mot pour mot, un fichier par espace de
// noms (fr/). Donné à IoitiProvider avec une locale française : <IoitiProvider locale="fr-FR" messages={fr}>.
import type { Messages } from './en.js'
import { chart } from './fr/chart.js'
import { clock } from './fr/clock.js'
import { date } from './fr/date.js'
import { format } from './fr/format.js'
import { heatmap } from './fr/heatmap.js'
import { ledger } from './fr/ledger.js'
import { log } from './fr/log.js'
import { numberInput } from './fr/numberInput.js'
import { timeRange } from './fr/timeRange.js'

export const fr: Messages = { format, date, heatmap, timeRange, chart, clock, ledger, log, numberInput }
