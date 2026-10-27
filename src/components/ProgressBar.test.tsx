import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BarList, ProgressBar } from './ProgressBar.js'

describe('ProgressBar', () => {
  it('says how far the work has come', () => {
    render(<ProgressBar label="Importing the files" value={42} max={120} valueText="42 of 120 files" />)
    const bar = screen.getByRole('progressbar', { name: 'Importing the files' })
    expect(bar).toHaveAttribute('aria-valuenow', '42')
    expect(bar).toHaveAttribute('aria-valuemax', '120')
    expect(bar).toHaveAttribute('aria-valuetext', '42 of 120 files')
    expect(screen.getByText('42 of 120 files')).toBeInTheDocument()
  })

  it('says its percentage where it is given no words', () => {
    render(<ProgressBar label="Computing" value={0.25} max={1} />)
    expect(screen.getByRole('progressbar', { name: 'Computing' })).toHaveAttribute('aria-valuetext', '25%')
  })

  it('has no value while how long it takes is not known', () => {
    render(<ProgressBar label="Connecting" />)
    expect(screen.getByRole('progressbar', { name: 'Connecting' })).not.toHaveAttribute('aria-valuenow')
  })
})

describe('BarList', () => {
  it('lists each thing with its figure, a link where it leads somewhere', () => {
    render(
      <BarList
        label="Returns by reason"
        items={[
          { label: 'Too small', value: 42, href: '/returns?reason=small' },
          { label: 'Damaged', value: 17 },
        ]}
      />,
    )
    const list = screen.getByRole('list', { name: 'Returns by reason' })
    const rows = within(list).getAllByRole('listitem')
    expect(rows[0]).toHaveTextContent('Too small42')
    expect(within(rows[0]).getByRole('link', { name: 'Too small' })).toHaveAttribute('href', '/returns?reason=small')
    expect(rows[1]).toHaveTextContent('Damaged17')
  })
})
