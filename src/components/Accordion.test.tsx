import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { Accordion } from './ui/smooth-accordion.js'

const ITEMS = [
  { id: 'returns', title: 'Can an order be returned?', content: 'Within 30 days, in its box.' },
  { id: 'invoice', title: 'Where is the invoice?', subtitle: 'In every order’s page', content: 'Under Documents, as a PDF.' },
]

describe('Accordion', () => {
  it('ties each question to its answer, a region named by it', async () => {
    const user = userEvent.setup()
    const { container } = render(<Accordion defaultValue={['returns']} items={ITEMS} />)

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
        <Accordion items={ITEMS} />
      </form>,
    )
    const returns = screen.getByRole('button', { name: 'Can an order be returned?' })
    expect(returns).toHaveAttribute('type', 'button')
    await user.click(returns)
    expect(returns).toHaveAttribute('aria-expanded', 'true')
    expect(submitted).not.toHaveBeenCalled()
  })

  it('puts each question in a heading of the level asked, and in none by default', async () => {
    const { unmount } = render(<Accordion items={ITEMS} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    unmount()

    const { container } = render(<Accordion headingLevel={3} defaultValue={['returns']} items={ITEMS} />)
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings).toHaveLength(2)
    expect(within(headings[0]).getByRole('button', { name: 'Can an order be returned?' })).toBeInTheDocument()
    expect(headings[1]).toHaveAccessibleName('Where is the invoice? In every order’s page')
    await expectAccessible(container)
  })
})

// What the package says of a former name, once, in development.
const DEPRECATED = /^ioiti-ui: a name or a value the package deprecated/
const deprecations = (warn: { mock: { calls: unknown[][] } }) => warn.mock.calls.filter(([message]) => DEPRECATED.test(String(message)))

describe('Accordion holding what is open', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('tells onChange of the items open, held by itself or by the page (value)', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    const { unmount } = render(<Accordion allowMultiple defaultValue={['returns']} onChange={changed} items={ITEMS} />)
    await user.click(screen.getByRole('button', { name: /Where is the invoice\?/ }))
    expect(changed).toHaveBeenLastCalledWith(['returns', 'invoice'])
    expect(screen.getByRole('button', { name: /Where is the invoice\?/ })).toHaveAttribute('aria-expanded', 'true')
    unmount()

    // Held by the page: the click tells it, and nothing opens until the page says so.
    const { rerender } = render(<Accordion value={[]} onChange={changed} items={ITEMS} />)
    const returns = screen.getByRole('button', { name: 'Can an order be returned?' })
    await user.click(returns)
    expect(changed).toHaveBeenLastCalledWith(['returns'])
    expect(returns).toHaveAttribute('aria-expanded', 'false')
    rerender(<Accordion value={['returns']} onChange={changed} items={ITEMS} />)
    expect(returns).toHaveAttribute('aria-expanded', 'true')
  })

  it('says nothing of its names of today, and still takes defaultOpen, said once in development', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { unmount } = render(<Accordion defaultValue={['returns']} items={ITEMS} />)
    expect(deprecations(warn)).toHaveLength(0)
    unmount()

    const { rerender } = render(<Accordion defaultOpen={['invoice']} items={ITEMS} />)
    rerender(<Accordion defaultOpen={['invoice']} items={ITEMS} />)
    expect(screen.getByRole('button', { name: /Where is the invoice\?/ })).toHaveAttribute('aria-expanded', 'true')
    const said = deprecations(warn)
    expect(said).toHaveLength(1)
    expect(String(said[0][0])).toContain("(Accordion's defaultOpen: defaultValue)")
  })

  it('takes defaultValue over defaultOpen, given both', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<Accordion defaultValue={['returns']} defaultOpen={['invoice']} items={ITEMS} />)
    expect(screen.getByRole('button', { name: 'Can an order be returned?' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /Where is the invoice\?/ })).toHaveAttribute('aria-expanded', 'false')
  })
})
