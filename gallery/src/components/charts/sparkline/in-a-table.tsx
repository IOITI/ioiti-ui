import { Sparkline, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'

const SERVICES = [
  { name: 'Payments', requests: '48,210', errors: [2, 3, 2, 1, 2, 1, 1], latency: [182, 176, 171, 168, 170, 164, 160] },
  { name: 'Search', requests: '31,904', errors: [4, 4, 5, 7, 6, 8, 9], latency: [96, 98, 104, 110, 118, 121, 130] },
  { name: 'Mail', requests: '6,312', errors: [1, 1, 1, 1, 1, 1, 1], latency: [240, 238, 241, 239, 240, 242, 240] },
]

export default function SparklineInATable() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Service</TableHeaderCell>
          <TableHeaderCell numeric>Requests</TableHeaderCell>
          <TableHeaderCell>Errors, 7 days</TableHeaderCell>
          <TableHeaderCell>Latency, 7 days</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {SERVICES.map((service) => (
          <TableRow key={service.name}>
            <TableHeaderCell>{service.name}</TableHeaderCell>
            <TableCell numeric>{service.requests}</TableCell>
            {/* Fewer errors and a shorter latency are good: a line going down is drawn in the gain's tone. */}
            <TableCell>
              <Sparkline label={`Errors of ${service.name} per day`} values={service.errors} tone={trend(service.errors)} />
            </TableCell>
            <TableCell>
              <Sparkline label={`Latency of ${service.name}, ms`} values={service.latency} tone={trend(service.latency)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** Down is good here: the tone of a line by its last value against its first. */
function trend(values: number[]) {
  const change = values[values.length - 1] - values[0]
  return change < 0 ? 'positive' : change > 0 ? 'negative' : 'neutral'
}
