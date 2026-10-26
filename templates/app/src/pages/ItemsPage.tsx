import { EmptyText, ExportButton, Field, formatMoney, Input, PageHeader, Panel, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'
import { useState } from 'react'

import { ITEMS, STATUS_LABEL } from '../data'
import type { Item } from '../data'

const COLUMNS = [
  { header: 'Id', value: (item: Item) => item.id },
  { header: 'Item', value: (item: Item) => item.name },
  { header: 'Owner', value: (item: Item) => item.owner },
  { header: 'Status', value: (item: Item) => STATUS_LABEL[item.status] },
  { header: 'Amount', value: (item: Item) => item.amount },
]

export function ItemsPage() {
  const [search, setSearch] = useState('')
  const found = ITEMS.filter((item) => `${item.id} ${item.name} ${item.owner}`.toLowerCase().includes(search.trim().toLowerCase()))
  return (
    <>
      <PageHeader title="Items" description="Every item, newest first (example data)." actions={<ExportButton name="items" rows={found} columns={COLUMNS} />} />

      <Panel>
        <div className="mb-4 max-w-xs">
          <Field label="Find an item">
            <Input value={search} placeholder="Name, owner or id" onChange={(event) => setSearch(event.target.value)} />
          </Field>
        </div>
        {found.length === 0 ? (
          <EmptyText>No item matches “{search}”.</EmptyText>
        ) : (
          <Table className="min-w-[32rem]" aria-label="Items">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Id</TableHeaderCell>
                <TableHeaderCell>Item</TableHeaderCell>
                <TableHeaderCell>Owner</TableHeaderCell>
                <TableHeaderCell numeric>Amount</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {found.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-muted-foreground">{item.id}</TableCell>
                  <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell numeric>{formatMoney(item.amount, 'EUR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>
    </>
  )
}
