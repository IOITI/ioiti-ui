import { render, screen } from '@testing-library/react'
import { Search } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { Field } from './Field.js'
import { IconButton } from './IconButton.js'
import { KpiGrid } from './KpiTile.js'
import { EmptyText, ErrorText } from './messages.js'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table.js'
import { TextLink } from './TextLink.js'

// These components are the classes the original pages wrote by hand, again and again
// (docs/provenance.md): a change of one of them here is a change of the design, made on purpose.

describe('a field', () => {
  it('is its control under its label, in small secondary text, which names it', () => {
    render(
      <Field label="Seed" error="A whole number">
        <input defaultValue="x" />
      </Field>,
    )

    const input = screen.getByRole('textbox', { name: /Seed/ })
    expect(input.closest('label')).toHaveClass('flex', 'flex-col', 'gap-1')
    expect(screen.getByText('Seed')).toHaveClass('text-xs', 'text-text-secondary')
    expect(screen.getByText('A whole number')).toHaveClass('text-xs', 'text-negative')
  })

  it('puts its label beside a control that must not be inside one, naming it by its id', () => {
    render(
      <Field label="Asset" htmlFor="asset">
        <button type="button" id="asset" role="combobox" aria-expanded="false" />
      </Field>,
    )

    expect(screen.getByRole('combobox', { name: 'Asset' })).toBeInTheDocument()
    expect(screen.getByText('Asset').tagName).toBe('LABEL')
  })
})

describe('an icon button', () => {
  it('is named by its words, and square and quiet as the top bar\'s', () => {
    render(<IconButton label="Search" icon={<Search />} />)

    expect(screen.getByRole('button', { name: 'Search' })).toHaveClass(
      'grid', 'size-9', 'rounded-lg', 'text-neutral-500', 'hover:bg-neutral-200/70', 'dark:text-neutral-400', 'dark:hover:bg-neutral-800', 'focus-ring',
    )
  })

  it('says what it does on hover, focus and a tap when given a hint', () => {
    render(<IconButton label="Search" icon={<Search />} hint="Search every page (⌘K)" />)

    expect(screen.getByRole('button', { name: 'Search' })).toHaveAccessibleDescription('Search every page (⌘K)')
  })
})

describe('a compact table', () => {
  it('is small text, its head quiet, its rows apart by a line, its figures right and of one width', () => {
    render(
      <Table className="min-w-[40rem]" aria-label="Orders">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Customer</TableHeaderCell>
            <TableHeaderCell numeric>Amount</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Acme</TableCell>
            <TableCell numeric>120.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    const table = screen.getByRole('table', { name: 'Orders' })
    expect(table.parentElement).toHaveClass('overflow-x-auto')
    expect(table).toHaveClass('w-full', 'text-left', 'text-xs', 'min-w-[40rem]')
    expect(table.querySelector('thead')).toHaveClass('text-muted-foreground')
    expect(table.querySelector('tbody')).toHaveClass('divide-y', 'divide-border/40')
    expect(screen.getByRole('columnheader', { name: 'Customer' })).toHaveClass('py-2', 'pr-4', 'font-medium')
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveClass('text-right')
    expect(screen.getByRole('cell', { name: 'Acme' })).toHaveClass('py-2.5', 'pr-4')
    expect(screen.getByRole('cell', { name: '120.00' })).toHaveClass('text-right', 'tabular-nums')
  })
})

describe('a dense table', () => {
  it('is body-size text in narrow cells, its rows each under a line, a row named by its first cell', () => {
    render(
      <Table density="dense" aria-label="Figures">
        <TableHead>
          <TableRow>
            <TableHeaderCell>After</TableHeaderCell>
            <TableHeaderCell numeric>Signals</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableHeaderCell>5 min</TableHeaderCell>
            <TableCell numeric>42</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByRole('table', { name: 'Figures' })).toHaveClass('w-full', 'whitespace-nowrap', 'text-sm')
    expect(screen.getByRole('columnheader', { name: 'After' }).parentElement).toHaveClass('text-xs', 'text-muted-foreground')
    expect(screen.getByRole('columnheader', { name: 'After' })).toHaveClass('p-2', 'text-left', 'font-medium')
    expect(screen.getByRole('rowheader', { name: '5 min' })).toHaveAttribute('scope', 'row')
    expect(screen.getByRole('rowheader', { name: '5 min' }).parentElement).toHaveClass('border-t', 'border-border/50')
    expect(screen.getByRole('cell', { name: '42' })).toHaveClass('p-2', 'text-right')
  })
})

describe('the short texts and the grid of tiles', () => {
  it('say nothing to show quietly, centred, and what went wrong at once', () => {
    render(
      <>
        <EmptyText>No order yet.</EmptyText>
        <ErrorText>Could not send the invoice.</ErrorText>
        <KpiGrid>tiles</KpiGrid>
      </>,
    )

    expect(screen.getByText('No order yet.')).toHaveClass('py-6', 'text-center', 'text-sm', 'text-muted-foreground')
    expect(screen.getByRole('alert')).toHaveTextContent('Could not send the invoice.')
    expect(screen.getByRole('alert')).toHaveClass('text-sm', 'text-negative')
    expect(screen.getByText('tiles')).toHaveClass('grid', 'grid-cols-2', 'gap-3', 'sm:gap-4', 'xl:grid-cols-4')
  })

  it('lay the tiles in the columns asked from a wide screen, two on a phone', () => {
    render(
      <>
        <KpiGrid columns={3}>three</KpiGrid>
        <KpiGrid columns={5}>five</KpiGrid>
      </>,
    )
    expect(screen.getByText('three')).toHaveClass('grid-cols-2', 'lg:grid-cols-3')
    expect(screen.getByText('five')).toHaveClass('grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-5')
  })
})

describe('a link made of words', () => {
  it('is underlined in text, underlined under the pointer in a list, quiet as a panel\'s way further', () => {
    render(
      <>
        <TextLink to="/terms">the terms</TextLink>
        <TextLink to="/orders/42" variant="hover">
          Order 42
        </TextLink>
        <TextLink to="/orders" variant="quiet">
          View all
        </TextLink>
      </>,
    )

    expect(screen.getByRole('link', { name: 'the terms' })).toHaveClass('underline', 'underline-offset-2')
    expect(screen.getByRole('link', { name: 'the terms' })).toHaveAttribute('href', '/terms')
    expect(screen.getByRole('link', { name: 'Order 42' })).toHaveClass('underline-offset-2', 'hover:underline')
    expect(screen.getByRole('link', { name: 'View all' })).toHaveClass('text-xs', 'text-muted-foreground', 'hover:text-foreground')
  })
})
