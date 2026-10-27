import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { SegmentedControl } from './SegmentedControl.js'

const PERIODS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month', disabled: true },
  { value: 'year', label: 'Year' },
]

describe('SegmentedControl', () => {
  it('is a radio group, the chosen segment its one stop of the keyboard', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Before</button>
        <SegmentedControl label="Period" options={PERIODS} defaultValue="week" />
      </>,
    )

    expect(screen.getByRole('radiogroup', { name: 'Period' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Before' }))
    await user.tab()
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveFocus()
  })

  it('moves and chooses with the arrow keys, past what cannot be chosen, round the ends', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<SegmentedControl label="Period" options={PERIODS} defaultValue="week" onChange={changed} />)

    await user.click(screen.getByRole('radio', { name: 'Week' }))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Year' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Year' })).toBeChecked()
    expect(changed).toHaveBeenLastCalledWith('year')

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked()
    await user.keyboard('{End}')
    expect(screen.getByRole('radio', { name: 'Year' })).toBeChecked()
    await user.keyboard('{Home}')
    expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked()
  })

  it('shows what its caller holds', async () => {
    const user = userEvent.setup()
    function Held() {
      const [period, setPeriod] = useState('day')
      return (
        <>
          <SegmentedControl label="Period" options={PERIODS} value={period} onChange={setPeriod} />
          <output>{period}</output>
        </>
      )
    }
    render(<Held />)

    await user.click(screen.getByRole('radio', { name: 'Year' }))
    expect(screen.getByRole('status')).toHaveTextContent('year')
    expect(screen.getByRole('radio', { name: 'Year' })).toBeChecked()
  })

  it('switches panels as a list of tabs', () => {
    render(
      <SegmentedControl
        role="tablist"
        label="Start"
        options={[
          { value: 'absolute', label: 'Absolute', panelId: 'panel-absolute' },
          { value: 'relative', label: 'Relative', panelId: 'panel-relative' },
        ]}
        defaultValue="relative"
      />,
    )

    expect(screen.getByRole('tablist', { name: 'Start' })).toBeInTheDocument()
    const tab = screen.getByRole('tab', { name: 'Relative' })
    expect(tab).toHaveAttribute('aria-selected', 'true')
    expect(tab).toHaveAttribute('aria-controls', 'panel-relative')
  })
})
