import { ExportButton } from 'ioiti-ui'

const ROWS = [
  { id: 'IT-1042', name: 'Spring catalogue print run', amount: 1840 },
  { id: 'IT-1041', name: 'Warehouse shelving', amount: 960.5 },
  // Read as a formula by a spreadsheet, were it not neutralised.
  { id: 'IT-1040', name: '=HYPERLINK("https://example.com")', amount: 12 },
]

export default function ExportButtonCsv() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ExportButton
        name="items"
        rows={ROWS}
        columns={[
          { header: 'Id', value: (row) => row.id },
          { header: 'Item', value: (row) => row.name },
          { header: 'Amount', value: (row) => row.amount },
        ]}
      />
      <span className="text-sm text-muted-foreground">Saves items-YYYY-MM-DD.csv (the day), 3 rows.</span>
    </div>
  )
}
