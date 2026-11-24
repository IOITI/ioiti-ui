import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import type { MessageKit } from '../lib/messages.js'
import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import type { MessagesOverride } from './locale-context.js'
import { ActivityHeatmap } from './ui/activity-heatmap.js'

// Four weeks ending on Wednesday 21 Oct 2026; Tuesday the 20th has a value.
const END = '2026-10-21'
const DAYS = [{ date: '2026-10-20', value: 3 }]
const SIGNED = [
  { date: '2026-10-20', value: 120 },
  { date: '2026-10-21', value: -80 },
]
const GAIN_LOSS = {
  positive: ['var(--chart-gain-1)', 'var(--chart-gain-2)', 'var(--chart-gain-3)', 'var(--chart-gain-4)'],
  negative: ['var(--chart-loss-1)', 'var(--chart-loss-2)', 'var(--chart-loss-3)', 'var(--chart-loss-4)'],
}
// A week of hours, Monday first: two at 23:00 on Monday, nothing elsewhere.
const HOURS = Array.from({ length: 7 }, (_, row) => Array.from({ length: 24 }, (_, hour) => (row === 0 && hour === 23 ? 2 : 0)))

/** An application's own words, given over English's. */
const OWN_WORDS: MessagesOverride = {
  heatmap: { unit: (count: number, { plural }: MessageKit) => plural(count, { one: 'order', other: 'orders' }), less: 'Fewer' },
}

/** The names written beside the rows, each with the row it stands on (0 the top one). */
function rowNamesOf(container: HTMLElement, rows = 7): [string | null, number][] {
  const grid = container.querySelector('svg rect[fill="transparent"]')!
  const top = Number(grid.getAttribute('y'))
  const pitch = Number(grid.getAttribute('height')) / rows
  return [...container.querySelectorAll('svg text[x="0"]')].map((text) => [
    text.textContent,
    Math.floor((Number(text.getAttribute('y')) - top) / pitch),
  ])
}

/** The words at the two ends of the legend. */
function legendOf(container: HTMLElement) {
  const scale = container.querySelector('span[aria-hidden="true"]')!
  return [scale.previousSibling?.textContent, scale.nextSibling?.textContent]
}

/** What a screen reader is told of the cell the keys reach first: the first of the last column. */
function firstCellSaid() {
  fireEvent.keyDown(screen.getByRole('img'), { key: 'ArrowRight' })
  return screen.getByRole('status').textContent
}

describe('ActivityHeatmap in the provider’s language', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('speaks English as Britain writes it outside a provider: its weeks from Monday, a unit that counts', () => {
    const { container, rerender } = render(<ActivityHeatmap data={DAYS} endDate={END} weeks={4} />)
    expect(screen.getByText('3 contributions in the last 4 weeks')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAccessibleName('Activity heatmap. 3 contributions in the last 4 weeks')
    expect(screen.getByText(/^Peak/)).toHaveTextContent('Peak Tue, 20 Oct 2026 · 3')
    expect(legendOf(container)).toEqual(['Less', 'More'])
    // Monday, Wednesday and Friday named on their rows, the first row Monday's in the grid too.
    expect(rowNamesOf(container)).toEqual([
      ['Mon', 0],
      ['Wed', 2],
      ['Fri', 4],
    ])
    expect(firstCellSaid()).toBe('Mon, 19 Oct 2026: 0 contributions')

    rerender(<ActivityHeatmap data={[{ date: '2026-10-20', value: 1 }]} endDate={END} weeks={4} />)
    expect(screen.getByText('1 contribution in the last 4 weeks')).toBeInTheDocument()
  })

  it('starts its weeks on Sunday in the United States, unless told another day', () => {
    const { container, unmount } = render(
      <IoitiProvider locale="en-US">
        <ActivityHeatmap data={DAYS} endDate={END} weeks={4} />
      </IoitiProvider>,
    )
    expect(rowNamesOf(container)).toEqual([
      ['Mon', 1],
      ['Wed', 3],
      ['Fri', 5],
    ])
    expect(firstCellSaid()).toBe('Sun, Oct 18, 2026: 0 contributions')
    unmount()

    const monday = render(
      <IoitiProvider locale="en-US">
        <ActivityHeatmap data={DAYS} endDate={END} weeks={4} weekStart={1} />
      </IoitiProvider>,
    )
    expect(rowNamesOf(monday.container)).toEqual([
      ['Mon', 0],
      ['Wed', 2],
      ['Fri', 4],
    ])
    expect(firstCellSaid()).toBe('Mon, Oct 19, 2026: 0 contributions')
  })

  it('speaks French with a French provider: its words agree with their count, its days and numbers are French', async () => {
    const { container } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ActivityHeatmap data={[{ date: '2026-10-20', value: 12.5 }]} endDate={END} weeks={4} />
      </IoitiProvider>,
    )
    expect(screen.getByText(/dernières semaines$/).textContent).toBe('12,5 contributions au cours des 4 dernières semaines')
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Carte thermique de l’activité. 12,5 contributions au cours des 4 dernières semaines',
    )
    expect(screen.getByText(/^Pic/).textContent).toBe('Pic : mar. 20 oct. 2026 · 12,5')
    expect(legendOf(container)).toEqual(['Moins', 'Plus'])
    expect(rowNamesOf(container)).toEqual([
      ['lun.', 0],
      ['mer.', 2],
      ['ven.', 4],
    ])
    expect(firstCellSaid()).toBe('lun. 19 oct. 2026 : 0 contribution')
    await expectAccessible(container)
  })

  it('agrees the period of its summary with its count in French', () => {
    const { rerender } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ActivityHeatmap data={DAYS} endDate={END} weeks={1} />
      </IoitiProvider>,
    )
    expect(screen.getByText(/semaine$/).textContent).toBe('3 contributions au cours de la dernière semaine')
    rerender(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ActivityHeatmap data={DAYS} endDate={END} weeks={21} />
      </IoitiProvider>,
    )
    expect(screen.getByText(/mois$/).textContent).toBe('3 contributions au cours des 5 derniers mois')
  })

  it('says the best and the worst of a signed scale in its words, each value on one line', () => {
    const { unmount } = render(<ActivityHeatmap data={SIGNED} endDate={END} weeks={4} diverging={GAIN_LOSS} />)
    expect(screen.getByText(/^Best/)).toHaveTextContent('Best Tue, 20 Oct 2026 · 120 contributions · worst Wed, 21 Oct 2026 · −80 contributions')
    // Each value in a span of its own, which keeps it on one line.
    expect(screen.getByText('120 contributions')).toHaveClass('whitespace-nowrap')
    expect(screen.getByText('−80 contributions')).toHaveClass('whitespace-nowrap')
    unmount()

    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ActivityHeatmap data={SIGNED} endDate={END} weeks={4} diverging={GAIN_LOSS} />
      </IoitiProvider>,
    )
    expect(screen.getByText(/^Meilleur/).textContent).toBe(
      'Meilleur : mar. 20 oct. 2026 · 120 contributions · pire : mer. 21 oct. 2026 · −80 contributions',
    )
    expect(screen.getByText('−80 contributions')).toHaveClass('whitespace-nowrap')
  })

  it('names the rows and cells of its hours as the locale does, the hour in its clock', () => {
    const { container, unmount } = render(<ActivityHeatmap mode="hours" matrix={HOURS} />)
    expect(rowNamesOf(container).map(([name]) => name)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    expect(screen.getByText('2 contributions per week')).toBeInTheDocument()
    expect(firstCellSaid()).toBe('Mon · 23:00: 2 contributions')
    unmount()

    const french = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ActivityHeatmap mode="hours" matrix={HOURS} />
      </IoitiProvider>,
    )
    expect(rowNamesOf(french.container).map(([name]) => name)).toEqual(['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'])
    expect(screen.getByText('2 contributions par semaine')).toBeInTheDocument()
    expect(firstCellSaid()).toBe('lun. · 23:00 : 2 contributions')
    french.unmount()

    render(
      <IoitiProvider locale="en-US">
        <ActivityHeatmap mode="hours" matrix={HOURS} />
      </IoitiProvider>,
    )
    expect(firstCellSaid()).toBe('Mon · 11:00 PM: 2 contributions')
  })

  it('writes the locale’s narrow names of the days on a narrow screen', () => {
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(400)
    const { container, unmount } = render(<ActivityHeatmap data={DAYS} endDate={END} weeks={4} />)
    expect(rowNamesOf(container).map(([name]) => name)).toEqual(['M', 'W', 'F'])
    unmount()

    const french = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ActivityHeatmap data={DAYS} endDate={END} weeks={4} />
      </IoitiProvider>,
    )
    expect(rowNamesOf(french.container).map(([name]) => name)).toEqual(['L', 'M', 'V'])
  })

  it('says an application’s own words over English’s, and its own unit and legend as it gives them', () => {
    const { container, unmount } = render(
      <IoitiProvider messages={OWN_WORDS}>
        <ActivityHeatmap data={DAYS} endDate={END} weeks={4} />
      </IoitiProvider>,
    )
    expect(screen.getByText('3 orders in the last 4 weeks')).toBeInTheDocument()
    expect(legendOf(container)).toEqual(['Fewer', 'More'])
    unmount()

    const own = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ActivityHeatmap data={DAYS} endDate={END} weeks={4} unit="livraisons" legend={['Perte', 'Gain']} ariaLabel="Livraisons" />
      </IoitiProvider>,
    )
    expect(screen.getByText(/dernières semaines$/).textContent).toBe('3 livraisons au cours des 4 dernières semaines')
    expect(legendOf(own.container)).toEqual(['Perte', 'Gain'])
    expect(screen.getByRole('img')).toHaveAccessibleName('Livraisons')
  })
})
