import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { lastDays, rangeParams } from '../lib/dateRange.js'
import { fr } from '../locales/fr.js'
import { DateRangeFilter } from './DateRangeFilter.js'
import type { DateRangePreset } from './DateRangeFilter.js'
import { IoitiProvider } from './IoitiProvider.js'
import type { MessagesOverride } from './locale-context.js'
import type { DateRange } from './ui/calendar.js'

const TODAY = new Date(2026, 10, 14)

/** An application's own words, given over English's. */
const OWN_WORDS: MessagesOverride = { date: { lastDays: (count: number) => `Last ${count} days`, allTime: 'Everything' } }

/** The heads of the days of the week of the calendar opened, in their order. */
const heads = () => document.querySelector('[role="dialog"] div[aria-hidden="true"]')?.textContent

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

  it('speaks French with a French provider: its presets, all time, its calendar and the range it shows', async () => {
    const user = userEvent.setup()
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Filter today={TODAY} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Toute la période' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '7 jours' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '90 jours' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Période personnalisée' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '30 jours' }))
    expect(screen.getByRole('button', { name: '30 jours' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '16 oct. 2026 – 14 nov. 2026' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '16 oct. 2026 – 14 nov. 2026' }))
    await screen.findByRole('dialog', { name: 'Choisir une date' })
    expect(heads()).toBe('LMMJVSD')
  })

  it('opens its calendar on the provider’s weeks: from Monday in en-GB, from Sunday in the United States', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Filter today={TODAY} />)
    await user.click(screen.getByRole('button', { name: 'Custom range' }))
    await screen.findByRole('dialog', { name: 'Choose date' })
    expect(heads()).toBe('MTWTFSS')
    unmount()

    render(
      <IoitiProvider locale="en-US">
        <Filter today={TODAY} />
      </IoitiProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Custom range' }))
    await screen.findByRole('dialog', { name: 'Choose date' })
    expect(heads()).toBe('SMTWTFS')
  })

  it('names its presets and all time in an application’s own words, its own presets first', () => {
    const { unmount } = render(
      <IoitiProvider messages={OWN_WORDS}>
        <Filter />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Last 7 days' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Everything' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Custom range' })).toBeInTheDocument()
    unmount()

    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Filter presets={[{ label: 'Trimestre', days: 90 }]} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Trimestre' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '90 jours' })).not.toBeInTheDocument()
  })
})
