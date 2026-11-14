import { LogViewer } from 'ioiti-ui'
import { useState } from 'react'

const LEVELS = ['INFO ', 'INFO ', 'INFO ', 'INFO ', 'WARN ', 'INFO ', 'INFO ', 'INFO ', 'INFO ', 'ERROR']

export default function LogViewerLong() {
  // The last 20,000 lines of a catalogue's import: the server kept them, and says 180,000 came before.
  const [lines] = useState(() =>
    Array.from({ length: 20_000 }, (_, index) => {
      const row = 180_001 + index
      const level = LEVELS[row % LEVELS.length]
      return `${level} row ${row.toLocaleString('en-GB')}: ${level === 'ERROR' ? 'the price is not a number, row skipped' : level === 'WARN ' ? 'no weight, the default 1 kg used' : 'imported'}`
    }),
  )
  return <LogViewer label="Import of the catalogue" lines={lines} droppedLines={180_000} height={320} downloadName="catalogue-import.log" />
}
