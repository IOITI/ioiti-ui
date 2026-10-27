import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { NotificationBell } from './ui/notification-bell.js'

describe('NotificationBell', () => {
  it('is a button as the top bar\'s others, held as pressed while its panel is open', async () => {
    const user = userEvent.setup()
    render(<NotificationBell notifications={[{ id: '1', message: 'Order 2026-0042 paid', timestamp: new Date(2026, 9, 27, 9, 13), read: false }]} />)
    const bell = screen.getByRole('button', { name: '1 unread notifications' })
    expect(bell).toHaveClass('size-9', 'rounded-lg')
    expect(bell).not.toHaveClass('border')

    await user.click(bell)
    expect(bell).toHaveAttribute('aria-expanded', 'true')
    expect(bell).toHaveClass('bg-neutral-200/70')
  })
})
