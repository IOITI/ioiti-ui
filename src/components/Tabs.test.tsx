import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Tabs } from './ui/animated-tabs.js'

const TABS = [
  { id: 'lines', label: 'Lines', content: <p>Four lines</p>, badge: 4 },
  { id: 'payments', label: 'Payments', content: <p>Paid by card</p>, badge: 0 },
  { id: 'history', label: 'History', content: <p>Placed on 26 Oct</p> },
]

describe('Tabs', () => {
  it('is a tablist, its panel named by the tab shown', () => {
    render(<Tabs label="Views of the order" tabs={TABS} />)
    expect(screen.getByRole('tablist', { name: 'Views of the order' })).toBeInTheDocument()
    const lines = screen.getByRole('tab', { name: 'Lines 4' })
    expect(lines).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Lines 4' })).toHaveTextContent('Four lines')
    expect(lines).toHaveAttribute('aria-controls', screen.getByRole('tabpanel').id)
  })

  it('is one stop of the keyboard, the arrows, Home and End moving and choosing', async () => {
    const user = userEvent.setup()
    render(<Tabs label="Views of the order" tabs={TABS} />)

    await user.tab()
    expect(screen.getByRole('tab', { name: 'Lines 4' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Payments 0' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Payments 0' })).toHaveAttribute('aria-selected', 'true')
    await waitFor(() => expect(screen.getByRole('tabpanel')).toHaveTextContent('Paid by card'))
    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'History' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Lines 4' })).toHaveFocus()
  })

  it('draws a badge of 0 as a badge', () => {
    render(<Tabs tabs={TABS} />)
    const zero = screen.getByText('0')
    expect(zero).toHaveClass('font-mono')
  })

  it('stays links where its tabs lead to pages, the current one said so', () => {
    render(
      <Tabs
        renderContent={false}
        value="open"
        tabs={[
          { id: 'open', label: 'Open', href: '/orders?status=open' },
          { id: 'done', label: 'Done', href: '/orders?status=done' },
        ]}
      />,
    )
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open' })).toHaveAttribute('aria-current', 'page')
  })
})

describe('Tabs holding the tab shown', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('holds it from defaultValue, or leaves it to the page (value), onChange told either way', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    const { unmount } = render(<Tabs label="Views" tabs={TABS} defaultValue="payments" onChange={changed} />)
    expect(screen.getByRole('tab', { name: 'Payments 0' })).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('tab', { name: 'History' }))
    expect(changed).toHaveBeenLastCalledWith('history')
    expect(screen.getByRole('tab', { name: 'History' })).toHaveAttribute('aria-selected', 'true')
    unmount()

    // Held by the page: a click tells it, and the tab stays until the page moves it.
    render(<Tabs label="Views" tabs={TABS} value="lines" onChange={changed} />)
    await user.click(screen.getByRole('tab', { name: 'History' }))
    expect(changed).toHaveBeenLastCalledWith('history')
    expect(screen.getByRole('tab', { name: 'Lines 4' })).toHaveAttribute('aria-selected', 'true')
  })

  it('takes its default as the first tab shown only', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Tabs label="Views" tabs={TABS} defaultValue="payments" />)
    await user.click(screen.getByRole('tab', { name: 'History' }))
    rerender(<Tabs label="Views" tabs={TABS} defaultValue="lines" />)
    expect(screen.getByRole('tab', { name: 'History' })).toHaveAttribute('aria-selected', 'true')
  })
})
