import { ExportButton, toCsv, toIsoDay } from 'ioiti-ui'
import type { CsvColumn } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const ROWS = [
  { id: 'IT-1042', name: 'Spring catalogue print run', amount: 1840 },
  { id: 'IT-1041', name: 'Warehouse shelving', amount: 960.5 },
]
type Row = (typeof ROWS)[number]
const COLUMNS: CsvColumn<Row>[] = [
  { header: 'Id', value: (row) => row.id },
  { header: 'Item', value: (row) => row.name },
  { header: 'Amount', value: (row) => row.amount },
]

function Preview() {
  const [file, setFile] = useState<string | null>(null)
  return (
    <div className="flex flex-col items-start gap-3 p-5">
      {/* The frame saves nothing: the press is caught before the button's own, and the file shown instead. */}
      <div
        onClickCapture={(event) => {
          event.preventDefault()
          event.stopPropagation()
          if ((event.target as HTMLElement).closest('button:not(:disabled)')) setFile(toCsv(ROWS, COLUMNS))
        }}
      >
        <ExportButton name="items" rows={ROWS} columns={COLUMNS} />
      </div>
      <p className="text-xs text-muted-foreground">Pressed, it saves the rows as items-{toIsoDay(new Date())}.csv. In this frame, the file is shown here instead.</p>
      {file && <pre className="rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-text-secondary">{file}</pre>}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
