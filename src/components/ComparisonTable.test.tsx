import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { ComparisonTable } from './ui/smart-comparison.js'

const PLANS = [
  { id: 'solo', name: 'Solo', tagline: 'One user', price: '€9', ctaText: 'Choose Solo' },
  { id: 'team', name: 'Team', tagline: 'Up to ten', price: '€29', featured: true, badge: 'Chosen most', ctaText: 'Choose Team' },
]
const CATEGORIES = [
  {
    id: 'use',
    title: 'Use',
    features: [
      { id: 'users', name: 'Users', values: { solo: '1', team: '10' } },
      { id: 'sso', name: 'Single sign-on', description: 'Sign in with the company’s accounts', values: { solo: false, team: true } },
    ],
  },
  { id: 'support', title: 'Support', features: [{ id: 'mail', name: 'Help by email', values: { solo: true, team: true } }] },
]

describe('ComparisonTable', () => {
  it('says what a feature is in a Hint, read with its button and drawn in the page’s body', async () => {
    render(
      <ComparisonTable
        plans={[{ id: 'pro', name: 'Pro', tagline: 'For teams', price: '€20' }]}
        categories={[
          {
            id: 'core',
            title: 'Core',
            features: [{ id: 'sso', name: 'Single sign-on', description: 'Sign in with the company’s accounts', values: { pro: true } }],
          },
        ]}
      />,
    )

    const info = screen.getAllByRole('button', { name: 'Info about Single sign-on' })[0]
    expect(info).toHaveAccessibleDescription('Sign in with the company’s accounts')
    info.focus()
    const tip = await screen.findByRole('tooltip', { hidden: true })
    expect(tip).toHaveTextContent('Sign in with the company’s accounts')
    expect(tip.parentElement).toBe(document.body)
    await expectAccessible(document.body)
  })

  it('is a table of rows alone, the controls that filter it above it, each group’s toggle in its own row', async () => {
    const { container } = render(<ComparisonTable label="Plans compared" plans={PLANS} categories={CATEGORIES} />)

    const table = screen.getByRole('table', { name: 'Plans compared' })
    // What filters the table is no part of it.
    expect(table).not.toContainElement(screen.getByRole('textbox', { name: 'Filter capabilities…' }))
    expect(table).not.toContainElement(screen.getByRole('button', { name: 'Differences only' }))
    for (const plan of PLANS) expect(table).not.toContainElement(screen.getByRole('button', { name: plan.name, pressed: plan.id === 'team' }))

    // A row of column headers (the matrix's, a plan's), then a group of rows by category, its toggle heading its first.
    expect(within(table).getAllByRole('columnheader')).toHaveLength(PLANS.length + 1)
    const use = within(table).getByRole('rowgroup', { name: 'Use' })
    const toggle = within(use).getByRole('button', { name: 'Use' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle.closest('[role="rowheader"]')?.parentElement).toHaveAttribute('role', 'row')
    expect(within(use).getByRole('row', { name: /Users/ })).toBeInTheDocument()
    await expectAccessible(container)
  })

  it('gives the table what names or describes it, the frame around it the rest', async () => {
    const { container } = render(
      <>
        <h2 id="compared">Our plans</h2>
        <p id="prices">Prices without taxes</p>
        <ComparisonTable aria-labelledby="compared" aria-describedby="prices" data-testid="frame" plans={PLANS} categories={CATEGORIES} />
      </>,
    )
    const table = screen.getByRole('table', { name: 'Our plans' })
    expect(table).toHaveAccessibleDescription('Prices without taxes')
    expect(screen.getByTestId('frame')).toContainElement(table)
    expect(screen.getByTestId('frame')).not.toHaveAttribute('aria-labelledby')
    await expectAccessible(container)
  })

  it('stays a table of rows with a group folded, and with nothing found', async () => {
    const user = userEvent.setup()
    const { container } = render(<ComparisonTable label="Plans compared" plans={PLANS} categories={CATEGORIES} />)

    await user.click(screen.getByRole('button', { name: 'Support' }))
    expect(screen.getByRole('button', { name: 'Support' })).toHaveAttribute('aria-expanded', 'false')
    await expectAccessible(container)

    await user.type(screen.getByRole('textbox', { name: 'Filter capabilities…' }), 'nothing of the kind')
    const empty = within(screen.getByRole('table', { name: 'Plans compared' })).getByRole('cell')
    expect(empty).toHaveTextContent('No features match your current search or difference filters.')
    await expectAccessible(container)
  })
})
