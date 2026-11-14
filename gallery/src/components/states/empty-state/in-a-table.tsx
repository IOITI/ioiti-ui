import { EmptyState, Panel, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'

export default function EmptyStateInATable() {
  return (
    <div className="max-w-lg">
      <Panel title="Runs" description="The last runs of the rule." dense>
        <Table aria-label="Runs">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Started</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell numeric>Hits</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {/* Across every column, the table keeping its head. */}
              <TableCell colSpan={3}>
                <EmptyState compact title="No run yet" description="A rule runs once it is deployed." />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Panel>
    </div>
  )
}
