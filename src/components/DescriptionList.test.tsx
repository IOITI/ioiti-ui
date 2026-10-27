import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DescriptionList } from './DescriptionList.js'

const ORDER = [
  { term: 'Reference', details: 'IT-1042' },
  { term: 'Customer', details: 'Atelier Brun' },
  { term: 'Total', details: '1,840.00 €' },
]

describe('DescriptionList', () => {
  it('is a list of terms and their details, in every layout', () => {
    for (const layout of ['rows', 'columns', 'grid', 'inline'] as const) {
      const { container, unmount } = render(<DescriptionList layout={layout} items={ORDER} />)
      const list = container.querySelector('dl') as HTMLElement
      expect(within(list).getAllByRole('term').map((term) => term.textContent)).toEqual(['Reference', 'Customer', 'Total'])
      expect(within(list).getAllByRole('definition').map((details) => details.textContent)).toEqual(['IT-1042', 'Atelier Brun', '1,840.00 €'])
      unmount()
    }
  })

  it('lines up figures', () => {
    render(<DescriptionList numeric items={ORDER} />)
    expect(screen.getByText('1,840.00 €')).toHaveClass('tabular-nums')
  })
})
