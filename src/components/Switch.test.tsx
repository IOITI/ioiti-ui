import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Switch } from './ui/form.js'

describe('Switch', () => {
  it('is named by its label and described by its description: a screen reader says which setting it is', () => {
    render(
      <>
        <Switch label="Weekly summary" description="Every Monday, by email" />
        <Switch label="Alerts" defaultChecked />
      </>,
    )

    const summary = screen.getByRole('switch', { name: 'Weekly summary' })
    expect(summary).toHaveAccessibleDescription('Every Monday, by email')
    expect(summary).not.toBeChecked()
    const alerts = screen.getByRole('switch', { name: 'Alerts' })
    expect(alerts).toBeChecked()
    expect(alerts).not.toHaveAttribute('aria-describedby')
  })

  it('turns on from itself or from its words', () => {
    const onChange = vi.fn()
    render(<Switch label="Weekly summary" onChange={onChange} />)

    fireEvent.click(screen.getByText('Weekly summary'))
    expect(screen.getByRole('switch', { name: 'Weekly summary' })).toBeChecked()
    fireEvent.click(screen.getByRole('switch', { name: 'Weekly summary' }))
    expect(screen.getByRole('switch', { name: 'Weekly summary' })).not.toBeChecked()
    expect(onChange.mock.calls).toEqual([[true], [false]])
  })
})
