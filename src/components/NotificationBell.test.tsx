import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { NotificationBell } from './ui/notification-bell.js'
import type { NotificationBellProps } from './ui/notification-bell.js'

describe('NotificationBell', () => {
  it('is a button as the top bar\'s others, held as pressed while its panel is open', async () => {
    const user = userEvent.setup()
    render(
      <NotificationBell
        notifications={[{ id: '1', message: 'Order 2026-0042 paid', timestamp: new Date(2026, 9, 27, 9, 13), read: false }]}
        onMarkAsRead={() => {}}
      />,
    )
    const bell = screen.getByRole('button', { name: '1 unread notification' })
    expect(bell).toHaveClass('size-9', 'rounded-lg')
    expect(bell).not.toHaveClass('border')

    await user.click(bell)
    expect(bell).toHaveAttribute('aria-expanded', 'true')
    expect(bell).toHaveClass('bg-surface-hover')
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

    await user.click(screen.getByRole('button', { name: '1 unread notification' }))
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
    const bell = screen.getByRole('button', { name: '1 unread notification' })
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

describe('NotificationBell in a language', () => {
  const UNREAD = [
    { id: '1', message: 'Export prêt', timestamp: 'Hier, 18:00', read: false },
    { id: '2', message: 'Commande payée', timestamp: 'Hier, 17:00', read: false },
  ]

  it('says its words in the language given, its unread ones counted as it counts them', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <NotificationBell notifications={UNREAD.slice(0, 1)} onMarkAsRead={() => {}} onMarkAllAsRead={() => {}} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: '1 notification non lue' })).toBeInTheDocument()
    rerender(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <NotificationBell notifications={UNREAD} onMarkAsRead={() => {}} onMarkAllAsRead={() => {}} />
      </IoitiProvider>,
    )
    await user.click(screen.getByRole('button', { name: '2 notifications non lues' }))
    const panel = await screen.findByRole('dialog', { name: 'Notifications' })
    expect(within(panel).getByText('2 nouvelles')).toBeInTheDocument()
    expect(within(panel).getByRole('button', { name: 'Tout marquer comme lu' })).toBeInTheDocument()
    expect(within(panel).getByRole('button', { name: 'Fermer les notifications' })).toBeInTheDocument()
    expect(within(panel).getAllByRole('button', { name: 'Marquer la notification comme lue' })).toHaveLength(2)
  })

  it('says it reads them, that there are none, and that they could not be read, in the language given', async () => {
    const user = userEvent.setup()
    const french = (props: Partial<NotificationBellProps>) => (
      <IoitiProvider locale="fr-FR" messages={fr}>
        <NotificationBell isOpen notifications={[]} onMarkAsRead={() => {}} {...props} />
      </IoitiProvider>
    )
    const { rerender } = render(french({ loading: true }))
    expect(screen.getByRole('status', { name: 'Chargement des notifications' })).toBeInTheDocument()

    rerender(french({}))
    expect(screen.getByText('Aucune notification pour le moment')).toBeInTheDocument()

    const retry = vi.fn()
    rerender(french({ error: true, onRetry: retry }))
    expect(screen.getByText('Les notifications n’ont pas pu être chargées.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(retry).toHaveBeenCalledOnce()
  })

  it('shows its count up to 99, the locale\'s number past it, the whole count in its name', () => {
    const many = Array.from({ length: 1234 }, (_, index) => ({ id: String(index), message: `Order ${index} paid`, timestamp: 'Today', read: false }))
    const { rerender } = render(<NotificationBell notifications={many} onMarkAsRead={() => {}} />)
    expect(screen.getByRole('button', { name: '1,234 unread notifications' })).toHaveTextContent('99+')

    rerender(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <NotificationBell notifications={many} onMarkAsRead={() => {}} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: /notifications non lues/ })).toHaveAccessibleName('1\u202f234 notifications non lues')
  })

  it("takes an application's own words over English's, the others English still", async () => {
    const user = userEvent.setup()
    render(
      <IoitiProvider messages={{ notification: { notifications: 'Alerts', unread: (count: number) => `${count} new alerts` } }}>
        <NotificationBell notifications={UNREAD} onMarkAsRead={() => {}} onMarkAllAsRead={() => {}} />
      </IoitiProvider>,
    )
    await user.click(screen.getByRole('button', { name: '2 new alerts' }))
    const panel = await screen.findByRole('dialog', { name: 'Alerts' })
    expect(within(panel).getByRole('button', { name: 'Read all' })).toBeInTheDocument()
    expect(within(panel).getByRole('button', { name: 'Close notifications' })).toBeInTheDocument()
  })
})
