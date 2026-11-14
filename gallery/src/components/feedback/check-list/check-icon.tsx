import { CheckIcon, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'

const PAIRS = [
  { text: 'Body text', surface: 'Page', ratio: 15.9 },
  { text: 'Muted text', surface: 'Card', ratio: 4.62 },
  { text: 'Muted text', surface: 'Hovered row', ratio: 4.44 },
  { text: 'Link', surface: 'Card', ratio: 7.1 },
]

export default function CheckListCheckIcon() {
  return (
    <div className="flex flex-col gap-4">
      {/* On its own, beside a figure: named, the figure says nothing of the outcome. */}
      <Table aria-label="Contrast of the texts" density="dense">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Text</TableHeaderCell>
            <TableHeaderCell>On</TableHeaderCell>
            <TableHeaderCell numeric>Ratio, 4.5 at least</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {PAIRS.map((pair) => (
            <TableRow key={`${pair.text}-${pair.surface}`}>
              <TableCell>{pair.text}</TableCell>
              <TableCell>{pair.surface}</TableCell>
              <TableCell numeric>
                <span className="inline-flex items-center gap-1.5">
                  {pair.ratio.toFixed(2)}
                  <CheckIcon state={pair.ratio >= 4.5 ? 'pass' : 'fail'} />
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Beside words that say the outcome: not named again. */}
      <p className="flex items-start gap-2 text-sm">
        <CheckIcon state="pass" named={false} />
        Passed: the build is ready to release.
      </p>
    </div>
  )
}
