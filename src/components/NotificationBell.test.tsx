import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

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

  it('says it is reading them while it is, not that there are none', () => {
    render(<NotificationBell isOpen loading notifications={[]} onMarkAsRead={() => {}} />)

    expect(screen.getByRole('status', { name: 'Loading the notifications' })).toBeInTheDocument()
    expect(screen.queryByText('No notifications right now')).not.toBeInTheDocument()
  })

  it('says they could not be read, and offers to try again, in place of a list it does not have', async () => {
    const user = userEvent.setup()
    const retry = vi.fn()
    render(<NotificationBell isOpen loading error notifications={[]} onMarkAsRead={() => {}} onRetry={retry} />)

    expect(screen.getByText('The notifications could not be read.')).toBeInTheDocument()
    expect(screen.queryByText('No notifications right now')).not.toBeInTheDocument()
    expect(screen.queryByRole('status', { name: 'Loading the notifications' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(retry).toHaveBeenCalledOnce()
  })

  it('keeps the last list read under an error, which says it in its own words', () => {
    render(
      <NotificationBell
        isOpen
        error="Not up to date: the server does not answer."
        notifications={[{ id: '1', message: 'Export ready', timestamp: new Date(), read: false }]}
        onMarkAsRead={() => {}}
      />,
    )

    expect(screen.getByText('Not up to date: the server does not answer.')).toBeInTheDocument()
    expect(screen.getByText('Export ready')).toBeInTheDocument()
    // No retry given: nothing offered.
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument()
  })

  it('says under the list what the application tells of it', () => {
    render(
      <NotificationBell
        isOpen
        footer="The 30 latest are shown."
        notifications={[{ id: '1', message: 'Export ready', timestamp: new Date(), read: true }]}
        onMarkAsRead={() => {}}
      />,
    )

    expect(screen.getByText('The 30 latest are shown.')).toBeInTheDocument()
  })

  it('opens its panel as a layer of the page, not inside the top bar, and Escape gives the bell the focus again', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <header className="glass-bar">
        <NotificationBell
          notifications={[{ id: '1', message: 'Order 2026-0042 paid', timestamp: new Date(2026, 9, 27, 9, 13), read: false }]}
          onMarkAsRead={() => {}}
        />
      </header>,
    )
    const bell = screen.getByRole('button', { name: '1 unread notifications' })
    await user.click(bell)
    const panel = await screen.findByRole('dialog', { name: 'Notifications' })
    expect(container.contains(panel)).toBe(false)
    expect(panel.parentElement).toBe(document.body)
    expect(panel.style.position).toBe('fixed')

    await user.keyboard('{Escape}')
    expect(bell).toHaveAttribute('aria-expanded', 'false')
    expect(bell).toHaveFocus()
  })

  it('closes at a press elsewhere', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Elsewhere</button>
        <NotificationBell notifications={[]} onMarkAsRead={() => {}} />
      </>,
    )
    const bell = screen.getByRole('button', { name: /notifications/i })
    await user.click(bell)
    expect(await screen.findByRole('dialog', { name: 'Notifications' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Elsewhere' }))
    expect(bell).toHaveAttribute('aria-expanded', 'false')
  })
})
