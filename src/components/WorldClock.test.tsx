import { render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import type { MessagesOverride } from './locale-context.js'
import { WorldClock } from './ui/airport-matrix-clock.js'

const CITIES = [
  { id: 'paris', name: 'Paris', timeZone: 'Europe/Paris' },
  { id: 'tokyo', name: 'Tokyo', timeZone: 'Asia/Tokyo' },
]
const PARIS = [CITIES[0]]

describe('WorldClock', () => {
  it('says each city’s time as a text a screen reader reads, its drawn characters hidden from it', async () => {
    const { container } = render(<WorldClock cities={CITIES} />)

    const rows = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(rows.map((row) => row.textContent)).toEqual([expect.stringMatching(/^\d{2}:\d{2}, Paris$/), expect.stringMatching(/^\d{2}:\d{2}, Tokyo$/)])
    for (const row of rows) {
      // No name on an element that takes none: the words are text, the characters pictures.
      expect(row.querySelector('[aria-label]')).toBeNull()
      for (const cell of row.querySelectorAll('div')) expect(cell.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    }
    await expectAccessible(container)
  })

  it('says its seconds and the time of day where it shows them, small or not', async () => {
    const { container } = render(
      <WorldClock size="sm" title={null} showSeconds format="12h" cities={[{ id: 'lisbon', name: 'Lisbon', timeZone: 'Europe/Lisbon' }]} />,
    )
    // As the locale writes it: en-GB's "pm" outside a provider.
    expect(screen.getByRole('listitem')).toHaveTextContent(/^\d{2}:\d{2}:\d{2} (am|pm), Lisbon$/)
    await expectAccessible(container)
  })
})

describe('WorldClock in the provider’s locale', () => {
  beforeEach(() => {
    // Tuesday 24 November 2026, 21:52 in London: 22:52 in Paris.
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-24T21:52:00Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  /** The board's characters for the time, as drawn (pictures hidden from a screen reader). */
  const board = (row: HTMLElement, cell = 0) => row.querySelectorAll(':scope > div')[cell].innerHTML

  it('speaks French, its cities counted', async () => {
    const { container } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <WorldClock cities={CITIES} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('region', { name: 'Horloge mondiale' })).toBeInTheDocument()
    expect(within(screen.getByRole('list')).getAllByRole('listitem').map((row) => row.textContent)).toEqual(['22:52, Paris', '06:52, Tokyo'])
    expect(container.querySelector('footer')).toHaveTextContent('2 villes / fuseaux horaires IANA')
    await expectAccessible(container)
  })

  it('counts one city as one, and is named without a title', () => {
    const { container } = render(<WorldClock title={null} cities={PARIS} />)
    expect(screen.getByRole('region', { name: 'World times' })).toBeInTheDocument()
    expect(container.querySelector('footer')).toHaveTextContent(/^1 city \/ IANA time zones$/)
  })

  it('keeps the provider’s clock unless told one', () => {
    const { unmount } = render(
      <IoitiProvider locale="en-US">
        <WorldClock cities={PARIS} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('listitem')).toHaveTextContent(/^10:52 PM, Paris$/)
    unmount()
    render(
      <IoitiProvider locale="en-US">
        <WorldClock format="24h" cities={PARIS} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('listitem')).toHaveTextContent(/^22:52, Paris$/)
  })

  it('draws on its board what its characters can: Latin digits, the period in capitals', () => {
    const drawn = (locale: string, format: '12h' | '24h') => {
      const { unmount } = render(
        <IoitiProvider locale={locale}>
          <WorldClock format={format} cities={PARIS} />
        </IoitiProvider>,
      )
      const row = screen.getByRole('listitem')
      const result = { said: row.textContent, board: board(row) }
      unmount()
      return result
    }
    const english = drawn('en-US', '12h')
    // Arabic writes its own digits and Japanese its own period, which a screen reader hears; the board draws the time as
    // English does.
    const arabic = drawn('ar-EG', '12h')
    const japanese = drawn('ja-JP', '12h')
    expect(arabic.said).not.toBe(english.said)
    expect(japanese.said).toMatch(/午後/)
    expect(arabic.board).toBe(english.board)
    expect(japanese.board).toBe(english.board)
    expect(drawn('ar-EG', '24h').board).toBe(drawn('en-GB', '24h').board)
  })

  it('draws a letter with an accent as the letter', () => {
    const names = (name: string) => {
      const { unmount } = render(<WorldClock cities={[{ id: 'city', name, timeZone: 'Europe/Zurich' }]} />)
      const drawn = board(screen.getByRole('listitem'), 1)
      unmount()
      return drawn
    }
    expect(names('Zürich')).toBe(names('Zurich'))
  })

  it('says an application’s own words over English’s', () => {
    render(
      <IoitiProvider messages={OWN_WORDS}>
        <WorldClock cities={PARIS} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('region', { name: 'Our offices' })).toBeInTheDocument()
    expect(screen.getByRole('listitem')).toHaveTextContent('Paris: 22:52')
  })
})

// An application's words, given over English's: a constant, as IoitiProvider asks.
const OWN_WORDS: MessagesOverride = { clock: { title: 'Our offices', row: ({ time, city }) => `${city}: ${time}` } }
