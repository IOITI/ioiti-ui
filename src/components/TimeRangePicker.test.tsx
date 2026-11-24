import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import type { MessagesOverride } from './locale-context.js'
import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { AutoRefresh, TimeRangePicker } from './TimeRangePicker.js'

describe('TimeRangePicker', () => {
  it('says its range as people say it, and refreshes it', async () => {
    const user = userEvent.setup()
    const refreshed = vi.fn()
    render(<TimeRangePicker onRefresh={refreshed} />)

    expect(screen.getByRole('button', { name: 'Last 15 minutes: show its start and its end' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Refresh' }))
    expect(refreshed).toHaveBeenCalledWith({ from: 'now-15m', to: 'now' })
  })

  it('applies a range commonly used in two clicks, then lists it as recently used', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<TimeRangePicker onChange={changed} />)

    await user.click(screen.getByRole('button', { name: 'Quick select' }))
    const panel = screen.getByRole('dialog', { name: 'Quick select' })
    await user.click(within(panel).getByRole('button', { name: 'Last 7 days' }))
    expect(changed).toHaveBeenCalledWith({ from: 'now-7d', to: 'now' })
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Quick select' })).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: /^Last 7 days/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Quick select' }))
    const again = screen.getByRole('dialog', { name: 'Quick select' })
    expect(within(within(again).getByRole('region', { name: 'Recently used' })).getByRole('button', { name: 'Last 7 days' })).toBeInTheDocument()
  })

  it('applies a span from its quick select', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<TimeRangePicker onChange={changed} />)

    await user.click(screen.getByRole('button', { name: 'Quick select' }))
    const panel = screen.getByRole('dialog', { name: 'Quick select' })
    const count = within(panel).getByRole('spinbutton', { name: 'How many' })
    await user.clear(count)
    await user.type(count, '2')
    await user.selectOptions(within(panel).getByRole('combobox', { name: 'Unit' }), 'h')
    await user.click(within(panel).getByRole('button', { name: 'Apply' }))
    expect(changed).toHaveBeenCalledWith({ from: 'now-2h', to: 'now' })
  })

  it('sets an end by itself, and applies it with Update', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<TimeRangePicker defaultValue={{ from: 'now-15m', to: 'now' }} onChange={changed} />)

    await user.click(screen.getByRole('button', { name: /show its start and its end/ }))
    await user.click(screen.getByRole('button', { name: '15 minutes ago' }))
    const start = screen.getByRole('dialog', { name: 'The start of the range' })
    expect(within(start).getByRole('tab', { name: 'Relative' })).toHaveAttribute('aria-selected', 'true')

    const count = within(start).getByRole('spinbutton', { name: 'How many' })
    await user.clear(count)
    await user.type(count, '3')
    await user.selectOptions(within(start).getByRole('combobox', { name: 'Unit' }), 'd')
    await user.keyboard('{Escape}')

    await user.click(screen.getByRole('button', { name: 'Update' }))
    expect(changed).toHaveBeenLastCalledWith({ from: 'now-3d', to: 'now' })
  })

  it('names the panel of an end by its tab, which says which panel it shows', async () => {
    const user = userEvent.setup()
    render(<TimeRangePicker defaultValue={{ from: 'now-15m', to: 'now' }} />)
    await expectAccessible(document.body)

    await user.click(screen.getByRole('button', { name: /show its start and its end/ }))
    await user.click(screen.getByRole('button', { name: '15 minutes ago' }))
    const start = screen.getByRole('dialog', { name: 'The start of the range' })
    const relative = within(start).getByRole('tab', { name: 'Relative' })
    const panel = within(start).getByRole('tabpanel', { name: 'Relative' })
    expect(relative).toHaveAttribute('aria-controls', panel.id)
    await expectAccessible(document.body)

    for (const mode of ['Absolute', 'Now']) {
      const tab = within(start).getByRole('tab', { name: mode })
      await user.click(tab)
      expect(tab).toHaveAttribute('aria-selected', 'true')
      expect(within(start).getByRole('tabpanel', { name: mode }).id).toBe(tab.getAttribute('aria-controls'))
      await expectAccessible(document.body)
    }
  })
})

describe('refreshing on a timer', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('refreshes every interval, not while stopped', () => {
    vi.useFakeTimers()
    const refreshed = vi.fn()
    const { rerender } = render(<AutoRefresh value={{ interval: 1000, paused: false }} onChange={() => {}} onRefresh={refreshed} />)
    expect(screen.getByRole('button', { name: 'Every 1 s' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(refreshed).toHaveBeenCalledTimes(3)

    rerender(<AutoRefresh value={{ interval: 1000, paused: true }} onChange={() => {}} onRefresh={refreshed} />)
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(refreshed).toHaveBeenCalledTimes(3)
    expect(screen.getByRole('button', { name: 'Off' })).toBeInTheDocument()
  })

  it('waits while the page is hidden', () => {
    vi.useFakeTimers()
    const refreshed = vi.fn()
    render(<AutoRefresh value={{ interval: 1000, paused: false }} onChange={() => {}} onRefresh={refreshed} />)

    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
      vi.advanceTimersByTime(3000)
    })
    expect(refreshed).not.toHaveBeenCalled()

    visibility.mockReturnValue('visible')
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
      vi.advanceTimersByTime(1000)
    })
    expect(refreshed).toHaveBeenCalledOnce()
    visibility.mockRestore()
  })
})

describe('in the provider’s language', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('says its range, its quick select and its ends in French', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <TimeRangePicker onChange={changed} />
      </IoitiProvider>,
    )

    // jsdom's name drops the no-break space the words put before the colon, which a browser keeps.
    expect(screen.getByRole('button', { name: /^15 dernières minutes\u00a0?: afficher son début et sa fin$/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Actualiser' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sélection rapide' }))
    const panel = screen.getByRole('dialog', { name: 'Sélection rapide' })
    const side = within(panel).getByRole('combobox', { name: 'Avant ou après maintenant' })
    expect(within(side).getAllByRole('option').map((option) => option.textContent)).toEqual(['Depuis', 'D’ici'])
    // The units agree with the count beside them.
    const units = () => within(within(panel).getByRole('combobox', { name: 'Unité' })).getAllByRole('option').map((option) => option.textContent)
    expect(units()).toEqual(['secondes', 'minutes', 'heures', 'jours', 'semaines', 'mois', 'ans'])
    const count = within(panel).getByRole('spinbutton', { name: 'Combien' })
    await user.clear(count)
    await user.type(count, '1')
    expect(units()).toEqual(['seconde', 'minute', 'heure', 'jour', 'semaine', 'mois', 'an'])

    // The ranges commonly used are named as the button names them.
    const common = within(panel).getByRole('region', { name: 'Plages courantes' })
    expect(within(common).getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Aujourd’hui',
      'Cette semaine',
      '15 dernières minutes',
      '30 dernières minutes',
      'Dernière heure',
      '24 dernières heures',
      '7 derniers jours',
      '30 derniers jours',
      '90 derniers jours',
      'Dernière année',
    ])
    await user.click(within(common).getByRole('button', { name: '7 derniers jours' }))
    expect(changed).toHaveBeenCalledWith({ from: 'now-7d', to: 'now' })
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Sélection rapide' })).not.toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /^7 derniers jours/ }))
    expect(screen.getByRole('button', { name: 'maintenant' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'il y a 7 jours' }))
    const start = screen.getByRole('dialog', { name: 'Le début de la plage' })
    const tabs = within(start).getByRole('tablist', { name: 'Date de début' })
    expect(within(tabs).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['Absolue', 'Relative', 'Maintenant'])
    expect(within(start).getByRole('checkbox', { name: 'Arrondir au jour' })).toBeInTheDocument()
    const before = within(start).getByRole('combobox', { name: 'Avant ou après maintenant' })
    expect(within(before).getAllByRole('option').map((option) => option.textContent)).toEqual(['plus tôt', 'plus tard'])
    await user.click(within(start).getByRole('tab', { name: 'Maintenant' }))
    expect(within(start).getByRole('button', { name: 'Mettre le début à maintenant' })).toBeInTheDocument()
    await expectAccessible(document.body)
  })

  it('starts the week and writes the clock as the locale does, unless it is told a day', async () => {
    // Wednesday 25 November 2026, 10:00, in the browser's time zone.
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 25, 10))
    const user = userEvent.setup()
    const thisWeek = { from: 'now/w', to: 'now' }

    const { unmount } = render(
      <IoitiProvider locale="en-US">
        <TimeRangePicker defaultValue={thisWeek} />
      </IoitiProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'This week so far: show its start and its end' }))
    expect(screen.getByRole('button', { name: 'Nov 22, 2026, 12:00 AM' })).toBeInTheDocument()
    unmount()

    render(
      <IoitiProvider locale="en-US">
        <TimeRangePicker defaultValue={thisWeek} weekStartsOn={1} />
      </IoitiProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'This week so far: show its start and its end' }))
    expect(screen.getByRole('button', { name: 'Nov 23, 2026, 12:00 AM' })).toBeInTheDocument()
  })

  it('starts the week on Monday and writes 24 hours outside a provider, as it always did', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 25, 10))
    const user = userEvent.setup()
    render(<TimeRangePicker defaultValue={{ from: 'now/w', to: 'now/d' }} />)
    await user.click(screen.getByRole('button', { name: /show its start and its end/ }))
    expect(screen.getByRole('button', { name: '23 Nov 2026, 00:00' })).toBeInTheDocument()
    // The end of a range is its unit's end, as it is read.
    expect(screen.getByRole('button', { name: '25 Nov 2026, 23:59' })).toBeInTheDocument()
  })

  it('says an application’s own words over English’s', async () => {
    const user = userEvent.setup()
    render(
      <IoitiProvider messages={OWN_WORDS}>
        <TimeRangePicker />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'The past 15 minutes: show its start and its end' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Quick select' }))
    const common = within(screen.getByRole('dialog', { name: 'Quick select' })).getByRole('region', { name: 'Commonly used' })
    expect(within(common).getByRole('button', { name: 'Since midnight' })).toBeInTheDocument()
    expect(within(common).getByRole('button', { name: 'The past 7 days' })).toBeInTheDocument()
  })

  it('says how often it refreshes in French', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <AutoRefresh value={{ interval: 1000, paused: false }} onChange={() => {}} onRefresh={() => {}} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Toutes les secondes' })).toBeInTheDocument()
    rerender(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <AutoRefresh value={{ interval: 300_000, paused: false }} onChange={() => {}} onRefresh={() => {}} />
      </IoitiProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Toutes les 5 min' }))
    const panel = screen.getByRole('dialog', { name: 'Actualisation' })
    expect(within(panel).getByRole('region', { name: 'Actualiser toutes les' })).toBeInTheDocument()
    expect(within(panel).getByRole('spinbutton', { name: 'Actualiser toutes les' })).toBeInTheDocument()
    const unit = within(panel).getByRole('combobox', { name: 'Unité de l’actualisation' })
    expect(within(unit).getAllByRole('option').map((option) => option.textContent)).toEqual(['secondes', 'minutes', 'heures'])
    expect(within(panel).getByRole('button', { name: 'Arrêter' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    rerender(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <AutoRefresh value={{ interval: 300_000, paused: true }} onChange={() => {}} onRefresh={() => {}} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Désactivée' })).toBeInTheDocument()
  })
})

// An application's words, given over English's: a constant, as IoitiProvider asks.
const OWN_WORDS: MessagesOverride = {
  timeRange: {
    refresh: 'Reload',
    today: 'Since midnight',
    lastSpan: ({ count, unit }, { plural }) => {
      const forms = unit === 'm' ? { one: '# minute', other: '# minutes' } : unit === 'd' ? { one: '# day', other: '# days' } : { other: `# ${unit}` }
      return `The past ${plural(count, forms)}`
    },
  },
}
