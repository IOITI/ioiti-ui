import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { useFormat, useLocale, useMessages } from './locale-context.js'

function Probe() {
  const { locale, weekStartsOn, hourCycle } = useLocale()
  const words = useMessages()
  const { formatMoney, formatRelative, formatDateTime } = useFormat()
  return (
    <dl>
      <dt>locale</dt>
      <dd data-testid="locale">{locale}</dd>
      <dt>week</dt>
      <dd data-testid="week">{weekStartsOn}</dd>
      <dt>clock</dt>
      <dd data-testid="clock">{hourCycle}</dd>
      <dt>past</dt>
      <dd data-testid="past">{words.format.past('5 min')}</dd>
      <dt>money</dt>
      <dd data-testid="money">{formatMoney(-1234.5)}</dd>
      <dt>relative</dt>
      <dd data-testid="relative">{formatRelative('2026-10-11T11:42:00Z', Date.parse('2026-10-11T12:00:00Z'))}</dd>
      <dt>time</dt>
      <dd data-testid="time">{formatDateTime('2026-10-11T20:52:12Z', 'Europe/Paris', false, new Date('2026-10-12T00:00:00Z'))}</dd>
    </dl>
  )
}

const text = (id: string) => screen.getByTestId(id).textContent

describe('the locale', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.documentElement.lang = ''
  })

  it('is English as Britain writes it outside a provider, as the package always was', () => {
    render(<Probe />)
    expect(text('locale')).toBe('en-GB')
    expect(text('week')).toBe('1')
    expect(text('clock')).toBe('h23')
    expect(text('past')).toBe('5 min ago')
    expect(text('money')).toBe('−€1,234.50')
    expect(text('relative')).toBe('18 min ago')
    expect(text('time')).toBe('11 Oct, 22:52')
  })

  it('is the provider’s: its formats, its first day, its clock, and the words of the language given', () => {
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Probe />
      </IoitiProvider>,
    )
    expect(text('locale')).toBe('fr-FR')
    expect(text('week')).toBe('1')
    expect(text('clock')).toBe('h23')
    expect(text('past')).toBe('il y a 5 min')
    expect(text('money')).toBe('−1 234,50 €')
    expect(text('relative')).toBe('il y a 18 min')
    expect(text('time')).toBe('11 oct., 22:52')
  })

  it('follows the locale for the week and the clock, unless the application says otherwise', () => {
    const { unmount } = render(
      <IoitiProvider locale="en-US">
        <Probe />
      </IoitiProvider>,
    )
    expect(text('week')).toBe('0')
    expect(text('clock')).toBe('h12')
    expect(text('time')).toBe('Oct 11, 10:52 PM')
    unmount()
    render(
      <IoitiProvider locale="en-US" weekStartsOn={1} hourCycle="h23">
        <Probe />
      </IoitiProvider>,
    )
    expect(text('week')).toBe('1')
    expect(text('time')).toBe('Oct 11, 22:52')
  })

  it('takes an application’s own words over English’s, the others kept', () => {
    render(
      <IoitiProvider messages={{ format: { past: (duration: string) => `${duration} back` } }}>
        <Probe />
      </IoitiProvider>,
    )
    expect(text('past')).toBe('5 min back')
    expect(text('relative')).toBe('18 min back')
    expect(text('money')).toBe('−€1,234.50')
  })

  it('takes a tag in any case, and says in development that one Intl does not know is replaced by en-GB', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { unmount } = render(
      <IoitiProvider locale="fr-fr">
        <Probe />
      </IoitiProvider>,
    )
    expect(text('locale')).toBe('fr-FR')
    unmount()
    render(
      <IoitiProvider locale="not a locale">
        <Probe />
      </IoitiProvider>,
    )
    expect(text('locale')).toBe('en-GB')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('no language tag Intl knows'))
  })

  it('says in development when the page’s language is another (a screen reader reads with lang’s rules)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    document.documentElement.lang = 'en'
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Probe />
      </IoitiProvider>,
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('not the language of the page'))
  })
})
