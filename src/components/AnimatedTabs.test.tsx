import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { AnimatedTabs } from './ui/animated-tabs.js'

const TABS = [
  { id: 'lines', label: 'Lines', content: <p>Four lines</p>, badge: 4 },
  { id: 'payments', label: 'Payments', content: <p>Paid by card</p>, badge: 0 },
  { id: 'history', label: 'History', content: <p>Placed on 26 Oct</p> },
]

describe('AnimatedTabs', () => {
  it('is a tablist, its panel named by the tab shown', () => {
    render(<AnimatedTabs label="Views of the order" tabs={TABS} />)
    expect(screen.getByRole('tablist', { name: 'Views of the order' })).toBeInTheDocument()
    const lines = screen.getByRole('tab', { name: 'Lines 4' })
    expect(lines).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Lines 4' })).toHaveTextContent('Four lines')
    expect(lines).toHaveAttribute('aria-controls', screen.getByRole('tabpanel').id)
  })

  it('is one stop of the keyboard, the arrows, Home and End moving and choosing', async () => {
    const user = userEvent.setup()
    render(<AnimatedTabs label="Views of the order" tabs={TABS} />)

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
    render(<AnimatedTabs tabs={TABS} />)
    const zero = screen.getByText('0')
    expect(zero).toHaveClass('font-mono')
  })

  it('stays links where its tabs lead to pages, the current one said so', () => {
    render(
      <AnimatedTabs
        renderContent={false}
        activeTab="open"
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
