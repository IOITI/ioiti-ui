import { Download } from 'lucide-react'

import { Button } from './ui/button.js'
import { downloadCsv, toCsv } from '../lib/csv.js'
import type { CsvColumn } from '../lib/csv.js'
import { toIsoDay } from '../lib/format.js'

interface ExportButtonProps<T> {
  /** File name without date or extension, e.g. "orders": the day of the export is added ("orders-2026-10-26.csv"). */
  name: string
  rows: readonly T[]
  columns: readonly CsvColumn<T>[]
}

/** Saves the rows currently loaded on the page as a CSV file. */
export function ExportButton<T>({ name, rows, columns }: ExportButtonProps<T>) {
  return (
    <Button
      variant="outline"
      size="sm"
      leftIcon={<Download className="size-3.5" />}
      disabled={rows.length === 0}
      onClick={() => downloadCsv(`${name}-${toIsoDay(new Date())}.csv`, toCsv(rows, columns))}
    >
      Export CSV
    </Button>
  )
}
