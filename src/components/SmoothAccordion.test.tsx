import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { SmoothAccordion } from './ui/smooth-accordion.js'

const ITEMS = [
  { id: 'returns', title: 'Can an order be returned?', content: 'Within 30 days, in its box.' },
  { id: 'invoice', title: 'Where is the invoice?', subtitle: 'In every order’s page', content: 'Under Documents, as a PDF.' },
]

describe('SmoothAccordion', () => {
  it('ties each question to its answer, a region named by it', async () => {
    const user = userEvent.setup()
    const { container } = render(<SmoothAccordion defaultOpen={['returns']} items={ITEMS} />)

    const returns = screen.getByRole('button', { name: 'Can an order be returned?' })
    const answer = screen.getByRole('region', { name: 'Can an order be returned?' })
    expect(returns).toHaveAttribute('aria-expanded', 'true')
    expect(returns).toHaveAttribute('aria-controls', answer.id)
    expect(answer).toHaveTextContent('Within 30 days, in its box.')
    // A closed question points at no answer, which is not there.
    const invoice = screen.getByRole('button', { name: /Where is the invoice\?/ })
    expect(invoice).toHaveAttribute('aria-expanded', 'false')
    expect(invoice).not.toHaveAttribute('aria-controls')
    await expectAccessible(container)

    // One at a time: the other one closes.
    await user.click(invoice)
    const pdf = screen.getByRole('region', { name: 'Where is the invoice? In every order’s page' })
    expect(invoice).toHaveAttribute('aria-controls', pdf.id)
    await waitFor(() => expect(screen.queryByRole('region', { name: 'Can an order be returned?' })).not.toBeInTheDocument())
    expect(returns).toHaveAttribute('aria-expanded', 'false')
    await expectAccessible(container)
  })

  it('submits no form it is in', async () => {
    const user = userEvent.setup()
    const submitted = vi.fn()
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          submitted()
        }}
      >
        <SmoothAccordion items={ITEMS} />
      </form>,
    )
    const returns = screen.getByRole('button', { name: 'Can an order be returned?' })
    expect(returns).toHaveAttribute('type', 'button')
    await user.click(returns)
    expect(returns).toHaveAttribute('aria-expanded', 'true')
    expect(submitted).not.toHaveBeenCalled()
  })

  it('puts each question in a heading of the level asked, and in none by default', async () => {
    const { unmount } = render(<SmoothAccordion items={ITEMS} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    unmount()

    const { container } = render(<SmoothAccordion headingLevel={3} defaultOpen={['returns']} items={ITEMS} />)
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings).toHaveLength(2)
    expect(within(headings[0]).getByRole('button', { name: 'Can an order be returned?' })).toBeInTheDocument()
    expect(headings[1]).toHaveAccessibleName('Where is the invoice? In every order’s page')
    await expectAccessible(container)
  })
})
