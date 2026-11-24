import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table.js'

function Orders({ cell = 'Atelier Brun', ...props }: { cell?: ReactNode; 'aria-label'?: string; 'aria-labelledby'?: string }) {
  return (
    <Table className="min-w-[40rem]" {...props}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Order</TableHeaderCell>
          <TableHeaderCell>Customer</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>2026-0042</TableCell>
          <TableCell>{cell}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

// jsdom lays nothing out: the table's frame shows 400 px of a table as wide as the test says.
let tableWidth = 640
beforeEach(() => {
  tableWidth = 640
  const frame = (element: Element) => element.classList.contains('overflow-x-auto')
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function (this: Element) {
    return frame(this) ? 400 : 0
  })
  vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(function (this: Element) {
    return frame(this) ? tableWidth : 0
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('a table wider than its frame', () => {
  it('has its frame for a stop of the keyboard, a region named as the table is, which holds it', async () => {
    const user = userEvent.setup()
    render(<Orders aria-label="Latest orders" />)

    const frame = screen.getByRole('region', { name: 'Latest orders' })
    expect(frame).toHaveAttribute('tabindex', '0')
    expect(frame).toHaveClass('relative', 'overflow-x-auto')
    expect(frame.firstElementChild).toBe(screen.getByRole('table', { name: 'Latest orders' }))
    await user.tab()
    expect(frame).toHaveFocus()
  })

  it('is named by what names the table, or "Table" where nothing does', () => {
    render(
      <>
        <h2 id="open-orders">Open orders</h2>
        <Orders aria-labelledby="open-orders" />
        <Orders />
      </>,
    )

    expect(screen.getByRole('region', { name: 'Open orders' })).toHaveAttribute('aria-labelledby', 'open-orders')
    expect(screen.getByRole('region', { name: 'Table' })).toHaveAttribute('tabindex', '0')
  })

  it('is reached through the controls of its cells, where it has some: its frame no stop of its own', () => {
    render(<Orders aria-label="Latest orders" cell={<a href="/customers/brun">Atelier Brun</a>} />)

    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Latest orders' }).parentElement).not.toHaveAttribute('tabindex')
  })
})

describe('a table that fits its frame', () => {
  it('leaves its frame out of the tab order, no region', async () => {
    tableWidth = 400
    const user = userEvent.setup()
    render(<Orders aria-label="Latest orders" />)

    const frame = screen.getByRole('table', { name: 'Latest orders' }).parentElement!
    expect(frame).not.toHaveAttribute('tabindex')
    expect(frame).not.toHaveAttribute('role')
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    await user.tab()
    expect(document.body).toHaveFocus()
  })
})
