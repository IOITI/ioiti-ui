import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { lastDays, rangeParams } from '../lib/dateRange.js'
import { DateRangeFilter } from './DateRangeFilter.js'
import type { DateRangePreset } from './DateRangeFilter.js'
import type { DateRange } from './ui/calendar.js'

function Filter({ presets, today, allTime }: { presets?: DateRangePreset[]; today?: Date; allTime?: boolean }) {
  const [range, setRange] = useState<DateRange>({ from: null, to: null })
  return (
    <>
      <DateRangeFilter value={range} onChange={setRange} presets={presets} today={today} allTime={allTime} />
      <output>{JSON.stringify(rangeParams(range))}</output>
    </>
  )
}

describe('DateRangeFilter', () => {
  it('offers the last 7, 30 and 90 days and all time, the one shown pressed', async () => {
    const user = userEvent.setup()
    render(<Filter />)
    expect(screen.getByRole('button', { name: 'All time' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: '30 days' }))
    expect(screen.getByRole('button', { name: '30 days' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent(JSON.stringify(rangeParams(lastDays(30))))
  })

  it('offers the caller\'s presets, the days ending on the day given', async () => {
    const user = userEvent.setup()
    const lastDay = new Date(2026, 9, 23)
    const quarter = { from: new Date(2026, 6, 1), to: new Date(2026, 8, 30) }
    render(
      <Filter
        today={lastDay}
        allTime={false}
        presets={[
          { label: 'Week', days: 7 },
          { label: 'Third quarter', range: quarter },
        ]}
      />,
    )
    expect(screen.queryByRole('button', { name: 'All time' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Week' }))
    expect(screen.getByRole('status')).toHaveTextContent('{"from":"2026-10-17","to":"2026-10-23"}')
    await user.click(screen.getByRole('button', { name: 'Third quarter' }))
    expect(screen.getByRole('status')).toHaveTextContent('{"from":"2026-07-01","to":"2026-09-30"}')
    expect(screen.getByRole('button', { name: 'Third quarter' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('tells its caller of each range', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<DateRangeFilter value={{ from: null, to: null }} onChange={changed} />)
    await user.click(screen.getByRole('button', { name: '7 days' }))
    expect(changed).toHaveBeenCalledOnce()
  })
})
