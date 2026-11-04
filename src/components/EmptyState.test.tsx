import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileCode, SearchX } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'

import { ButtonLink } from './ButtonLink.js'
import { EmptyState } from './EmptyState.js'
import { PageHeader, Panel } from './Panel.js'
import { Table, TableBody, TableCell, TableRow } from './Table.js'
import { Button } from './ui/button.js'

describe('EmptyState', () => {
  it('says what there is not under a heading, why, and what to do about it', async () => {
    const user = userEvent.setup()
    const imported = vi.fn()
    const { container } = render(
      <>
        <PageHeader title="Detection rules" />
        <EmptyState
          icon={<FileCode />}
          title="No detection rule yet"
          description="Rules written in the repository appear here once they are pushed."
          actions={
            <>
              <ButtonLink to="/rules/new">New rule</ButtonLink>
              <Button variant="outline" onClick={imported}>
                Import from Sigma
              </Button>
            </>
          }
        />
      </>,
    )

    // A heading under the page's.
    const heading = screen.getByRole('heading', { level: 2, name: 'No detection rule yet' })
    expect(heading).toHaveClass('text-base', 'font-semibold', 'text-foreground')
    expect(screen.getByText(/appear here once they are pushed/)).toHaveClass('text-sm', 'text-muted-foreground')
    // The icon only shows what would be there: nothing for a screen reader.
    expect(container.querySelector('svg')?.parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('link', { name: 'New rule' })).toHaveAttribute('href', '/rules/new')
    await user.click(screen.getByRole('button', { name: 'Import from Sigma' }))
    expect(imported).toHaveBeenCalledOnce()
  })

  it('is smaller in a panel, its heading one under the panel\'s', () => {
    render(
      <Panel title="Alerts of the day">
        <EmptyState compact icon={<SearchX />} title="No alert matches" description="Try another time range." />
      </Panel>,
    )

    const panel = screen.getByRole('heading', { level: 2, name: 'Alerts of the day' })
    const heading = screen.getByRole('heading', { level: 3, name: 'No alert matches' })
    expect(panel.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(heading).toHaveClass('text-sm', 'font-medium')
    expect(heading.parentElement).toHaveClass('py-6')
    expect(screen.getByText('Try another time range.')).toHaveClass('text-xs')
  })

  it('takes the level of heading it is given, and draws only what it is given', () => {
    const { container, rerender } = render(<EmptyState title="Nothing archived" headingLevel={4} />)
    expect(screen.getByRole('heading', { level: 4, name: 'Nothing archived' })).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeNull()
    expect(container.querySelector('p')).toBeNull()

    rerender(<EmptyState compact title="Nothing archived" headingLevel={2} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Nothing archived' })).toBeInTheDocument()
  })

  it('wraps its words across the columns of a table that keeps its cells on one line', () => {
    render(
      <Table density="dense" aria-label="Rules">
        <TableBody>
          <TableRow>
            <TableCell colSpan={4}>
              <EmptyState compact title="No rule matches these filters" description="Clear a filter to see more of them." />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    const cell = within(screen.getByRole('table', { name: 'Rules' })).getByRole('cell')
    expect(cell).toHaveAttribute('colspan', '4')
    expect(screen.getByRole('heading', { level: 3, name: 'No rule matches these filters' }).parentElement).toHaveClass('whitespace-normal', 'text-center')
  })
})
