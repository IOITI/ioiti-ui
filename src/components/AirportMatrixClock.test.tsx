import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { AirportMatrixClock } from './ui/airport-matrix-clock.js'

const CITIES = [
  { id: 'paris', name: 'Paris', timeZone: 'Europe/Paris' },
  { id: 'tokyo', name: 'Tokyo', timeZone: 'Asia/Tokyo' },
]

describe('AirportMatrixClock', () => {
  it('says each city’s time as a text a screen reader reads, its drawn characters hidden from it', async () => {
    const { container } = render(<AirportMatrixClock cities={CITIES} />)

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
      <AirportMatrixClock size="sm" title={null} showSeconds format="12h" cities={[{ id: 'lisbon', name: 'Lisbon', timeZone: 'Europe/Lisbon' }]} />,
    )
    expect(screen.getByRole('listitem')).toHaveTextContent(/^\d{2}:\d{2}:\d{2} (AM|PM), Lisbon$/)
    await expectAccessible(container)
  })
})
