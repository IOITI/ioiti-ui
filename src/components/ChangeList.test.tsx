import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ChangeList } from './ChangeList.js'

describe('ChangeList', () => {
  it('says each change from its value before to its value after', () => {
    render(
      <ChangeList
        label="Changes to apply"
        numeric
        changes={[
          { label: 'Daily limit', before: '500 €', after: '750 €', note: 'Applies from tomorrow' },
          { label: 'Reminder', after: 'Every Monday' },
          { label: 'Fax number', before: '+33 1 23 45 67 89' },
        ]}
      />,
    )
    const rows = within(screen.getByRole('list', { name: 'Changes to apply' })).getAllByRole('listitem')
    expect(rows[0]).toHaveTextContent('Daily limitfrom 500 €to 750 €Applies from tomorrow')
    expect(rows[1]).toHaveTextContent('ReminderNewto Every Monday')
    expect(rows[2]).toHaveTextContent('Fax numberfrom +33 1 23 45 67 89Removed')
  })

  it('lists changes in their groups', () => {
    render(
      <ChangeList
        label="Changes"
        groups={[
          { title: 'Limits', changes: [{ label: 'Daily limit', before: '500', after: '750' }] },
          { title: 'Mail', changes: [{ label: 'Sender', before: 'shop@', after: 'orders@' }] },
        ]}
      />,
    )
    expect(screen.getByRole('group', { name: 'Changes' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading').map((heading) => heading.textContent)).toEqual(['Limits', 'Mail'])
  })
})
