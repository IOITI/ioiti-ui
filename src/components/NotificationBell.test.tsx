import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { NotificationBell } from './ui/notification-bell.js'

describe('NotificationBell', () => {
  it('is a button as the top bar\'s others, held as pressed while its panel is open', async () => {
    const user = userEvent.setup()
    render(
      <NotificationBell
        notifications={[{ id: '1', message: 'Order 2026-0042 paid', timestamp: new Date(2026, 9, 27, 9, 13), read: false }]}
        onMarkAsRead={() => {}}
      />,
    )
    const bell = screen.getByRole('button', { name: '1 unread notifications' })
    expect(bell).toHaveClass('size-9', 'rounded-lg')
    expect(bell).not.toHaveClass('border')

    await user.click(bell)
    expect(bell).toHaveAttribute('aria-expanded', 'true')
    expect(bell).toHaveClass('bg-neutral-200/70')
  })

  it('says a moment from now, its full date in a hint, and a time the application wrote as it wrote it', async () => {
    const user = userEvent.setup()
    render(
      <NotificationBell
        notifications={[
          { id: '1', message: 'Export ready', timestamp: new Date(Date.now() - 2 * 60_000), read: false },
          { id: '2', message: 'Weekly summary sent', timestamp: 'Yesterday, 18:00', read: true },
        ]}
        onMarkAsRead={() => {}}
      />,
    )

    await user.click(screen.getByRole('button', { name: '1 unread notifications' }))
    const said = screen.getByText('2 min ago')
    expect(said.tagName).toBe('TIME')
    expect(said).toHaveAttribute('dateTime')
    expect(screen.getByText('Yesterday, 18:00')).toBeInTheDocument()
  })
})
