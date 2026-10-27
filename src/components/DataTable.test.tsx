import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { AdvancedDataTable } from './ui/advanced-data-table.js'
import type { ColumnDef } from './ui/advanced-data-table.js'

interface Row {
  id: string
  name: string
  kind: string
  group: string
}

const ROWS: Row[] = Array.from({ length: 12 }, (_, index) => ({
  id: `r${index + 1}`,
  name: `Row ${index + 1}`,
  kind: index % 2 === 0 ? 'even' : 'odd',
  // Rows 1 to 6, 7 to 9, 10 to 12.
  group: index < 6 ? 'a' : index < 9 ? 'b' : 'c',
}))
const COLUMNS: ColumnDef<Row>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'kind', header: 'Kind', accessorKey: 'kind', filterable: true, filterOptions: [{ label: 'Even', value: 'even' }, { label: 'Odd', value: 'odd' }] },
]
// A list of twelve names (searchable), an on/off pair, a list of three.
const FILTERED: ColumnDef<Row>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name', filterable: true, filterOptions: ROWS.map((row) => ({ label: row.name, value: row.name })) },
  COLUMNS[1],
  { id: 'group', header: 'Group', accessorKey: 'group', filterable: true, filterOptions: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }, { label: 'C', value: 'c' }] },
]
const shown = () =>
  within(screen.getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.textContent)
    .filter((text) => text?.startsWith('Row'))

describe('the data table, as the pages use it', () => {
  it('lets the page hold its selection, leaves out the rows that cannot be chosen, and selects all that a search leaves', async () => {
    const user = userEvent.setup()
    const changes: string[][] = []
    function Held() {
      const [selected, setSelected] = useState<ReadonlySet<string>>(new Set())
      return (
        <AdvancedDataTable<Row>
          data={ROWS}
          columns={COLUMNS}
          getRowId={(row) => row.id}
          defaultPageSize={5}
          rowLabel={(row) => row.name}
          isRowSelectable={(row) => row.id !== 'r1'}
          selectedRowIds={selected}
          onSelectionChange={(ids) => {
            changes.push([...ids])
            setSelected(ids)
          }}
          selectionBasket={{ noun: ['row', 'rows'], actions: [{ id: 'act', label: 'Act' }] }}
        />
      )
    }
    render(<Held />)

    // Row 1 cannot be chosen: no box, and the header's box leaves it out.
    expect(screen.queryByRole('checkbox', { name: 'Select Row 1' })).not.toBeInTheDocument()
    // One row of the page chosen: the header's box says it is partly checked.
    await user.click(screen.getByRole('checkbox', { name: 'Select Row 2' }))
    const header = screen.getByRole('checkbox', { name: 'Select all rows' }) as HTMLInputElement
    expect(header.indeterminate).toBe(true)
    await user.click(header)
    expect(changes.at(-1)).toEqual(['r2', 'r3', 'r4', 'r5'])
    expect(header.indeterminate).toBe(false)
    expect(header).toBeChecked()
    const basket = within(await screen.findByRole('toolbar', { name: 'Bulk actions toolbar' }))
    expect(basket.getByText('rows selected')).toBeInTheDocument()
    // Said once: the table's own counter is not shown beside the basket.
    expect(screen.queryByText('4 selected')).not.toBeInTheDocument()
    await user.click(basket.getByRole('button', { name: 'Clear selection' }))
    expect(changes.at(-1)).toEqual([])
    await waitFor(() => expect(screen.queryByRole('toolbar', { name: 'Bulk actions toolbar' })).not.toBeInTheDocument())

    // "All" is every row the search leaves that can be chosen, on every page: Row 10, 11 and 12.
    await user.type(screen.getByPlaceholderText('Search...'), 'Row 1')
    await user.click(screen.getByRole('checkbox', { name: 'Select Row 10' }))
    const searched = within(await screen.findByRole('toolbar', { name: 'Bulk actions toolbar' }))
    await user.click(searched.getByRole('button', { name: 'All (3)' }))
    expect(new Set(changes.at(-1))).toEqual(new Set(['r10', 'r11', 'r12']))
    expect(searched.getByRole('button', { name: 'Select none' })).toBeInTheDocument()
  })

  it('shows what a search finds from its first page, wherever the reader was', async () => {
    const user = userEvent.setup()
    render(<AdvancedDataTable<Row> data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} selectable={false} defaultPageSize={5} />)

    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(shown()[0]).toMatch(/^Row 6/)

    await user.type(screen.getByPlaceholderText('Search...'), 'Row 1')

    // Row 1, 10, 11, 12: from the first of them.
    expect(shown()[0]).toMatch(/^Row 1(?!\d)/)
  })

  it('opens on the filters it is given', () => {
    render(
      <AdvancedDataTable<Row>
        data={ROWS}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        selectable={false}
        initialFilters={{ kind: ['odd'] }}
        defaultPageSize={20}
      />,
    )

    expect(shown()).toHaveLength(6)
    expect(shown().every((text) => text?.endsWith('odd'))).toBe(true)
  })

  it('opens a row on a click only where it is asked to, and names each row’s button when told how', async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <AdvancedDataTable<Row>
        data={ROWS.slice(0, 2)}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        selectable={false}
        renderSubComponent={(row) => <p>Inside {row.name}</p>}
      />,
    )

    // As before: the arrow opens a row, a click on the row does not, and the arrow is named in general.
    await user.click(screen.getByText('Row 1'))
    expect(screen.queryByText('Inside Row 1')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Expand row details' })).toHaveLength(2)
    unmount()

    render(
      <AdvancedDataTable<Row>
        data={ROWS.slice(0, 2)}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        selectable={false}
        expandOnRowClick
        rowLabel={(row) => row.name}
        renderSubComponent={(row) => <p>Inside {row.name}</p>}
      />,
    )

    await user.click(screen.getByText('Row 1'))
    expect(screen.getByText('Inside Row 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close Row 1' })).toHaveAttribute('aria-expanded', 'true')
    // Several open at once, unless told otherwise.
    await user.click(screen.getByRole('button', { name: 'Open Row 2' }))
    expect(screen.getByText('Inside Row 1')).toBeInTheDocument()
    expect(screen.getByText('Inside Row 2')).toBeInTheDocument()
  })

  it('chooses a row by its box without opening it, and hides a column from the column list', async () => {
    const user = userEvent.setup()
    render(
      <AdvancedDataTable<Row>
        data={ROWS.slice(0, 2)}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        expandOnRowClick
        rowLabel={(row) => row.name}
        renderSubComponent={(row) => <p>Inside {row.name}</p>}
      />,
    )

    await user.click(screen.getByRole('checkbox', { name: 'Select Row 1' }))
    expect(screen.getByRole('checkbox', { name: 'Select Row 1' })).toBeChecked()
    expect(screen.queryByText('Inside Row 1')).not.toBeInTheDocument()

    // A click on a column's name in the list, as on its box.
    await user.click(screen.getByRole('button', { name: 'Toggle visible columns' }))
    const kind = screen.getByRole('checkbox', { name: 'Kind' })
    expect(kind).toBeChecked()
    await user.click(within(kind.closest('label')!).getByText('Kind'))
    expect(screen.getByRole('checkbox', { name: 'Kind' })).not.toBeChecked()
    expect(screen.queryByRole('columnheader', { name: 'Kind' })).not.toBeInTheDocument()
  })
})

describe('the filters, as one group of buttons', () => {
  function renderFiltered() {
    render(<AdvancedDataTable<Row> data={ROWS} columns={FILTERED} getRowId={(row) => row.id} selectable={false} defaultPageSize={20} />)
  }
  const names = () => shown().map((text) => text?.match(/^Row \d+/)?.[0])

  it('draws two options as an on/off pair, pressed one at a time', async () => {
    const user = userEvent.setup()
    renderFiltered()
    const odd = screen.getByRole('button', { name: 'Kind: Odd' })
    const even = screen.getByRole('button', { name: 'Kind: Even' })
    expect(screen.getByRole('group', { name: 'Filters' })).toContainElement(odd)

    await user.click(odd)
    expect(odd).toHaveAttribute('aria-pressed', 'true')
    expect(names()).toEqual(['Row 2', 'Row 4', 'Row 6', 'Row 8', 'Row 10', 'Row 12'])

    await user.click(even)
    expect(even).toHaveAttribute('aria-pressed', 'true')
    expect(odd).toHaveAttribute('aria-pressed', 'false')
    expect(names()).toHaveLength(6)

    // Pressed again, let go: every row.
    await user.click(even)
    expect(even).toHaveAttribute('aria-pressed', 'false')
    expect(names()).toHaveLength(12)
  })

  it('opens a list of options, each with the rows it would leave under the other filters, and filters by those ticked', async () => {
    const user = userEvent.setup()
    renderFiltered()
    await user.click(screen.getByRole('button', { name: 'Kind: Odd' }))

    const button = screen.getByRole('button', { name: 'Group, 3 options' })
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    const list = screen.getByRole('group', { name: 'Filter by Group' })
    // The odd rows: 2, 4 and 6 in A, 8 in B, 10 and 12 in C. The focus goes in.
    expect(within(list).getByRole('checkbox', { name: 'A, 3 rows' })).toHaveFocus()
    expect(within(list).getByRole('checkbox', { name: 'B, 1 row' })).toBeInTheDocument()

    await user.click(within(list).getByRole('checkbox', { name: 'C, 2 rows' }))
    expect(names()).toEqual(['Row 10', 'Row 12'])
    expect(screen.getByRole('button', { name: 'Group, 1 of 3 chosen' })).toBeInTheDocument()

    // Escape: the list closes, the focus back on its button.
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('group', { name: 'Filter by Group' })).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Group, 1 of 3 chosen' })).toHaveFocus()
    expect(names()).toEqual(['Row 10', 'Row 12'])
  })

  it('gives the focus back to the button when a Tab leaves the list, and clears a column from it', async () => {
    const user = userEvent.setup()
    renderFiltered()
    await user.click(screen.getByRole('button', { name: 'Group, 3 options' }))
    const list = screen.getByRole('group', { name: 'Filter by Group' })
    await user.click(within(list).getByRole('checkbox', { name: 'B, 3 rows' }))
    expect(names()).toEqual(['Row 7', 'Row 8', 'Row 9'])

    await user.click(within(list).getByRole('button', { name: 'Clear' }))
    expect(names()).toHaveLength(12)
    expect(within(list).getByRole('checkbox', { name: 'A, 6 rows' })).toHaveFocus()

    await user.tab({ shift: true })
    await waitFor(() => expect(screen.queryByRole('group', { name: 'Filter by Group' })).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Group, 3 options' })).toHaveFocus()
  })

  it('searches a long list, every word typed in an option', async () => {
    const user = userEvent.setup()
    renderFiltered()
    await user.click(screen.getByRole('button', { name: 'Name, 12 options' }))
    const search = screen.getByRole('searchbox', { name: 'Search the options of Name' })
    expect(search).toHaveFocus()

    await user.type(search, 'row 1')
    const list = screen.getByRole('group', { name: 'Filter by Name' })
    expect(within(list).getAllByRole('checkbox')).toHaveLength(4)

    await user.clear(search)
    await user.type(search, 'row nine')
    expect(within(list).queryAllByRole('checkbox')).toHaveLength(0)
    expect(within(list).getByText('No option matches.')).toBeInTheDocument()
  })
})
