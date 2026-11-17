import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SmartComparison } from './ui/smart-comparison.js'

describe('SmartComparison', () => {
  it('says what a feature is in a Hint, read with its button and drawn in the page’s body', async () => {
    render(
      <SmartComparison
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
  })
})
