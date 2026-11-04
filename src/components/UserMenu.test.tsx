import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Settings, User } from 'lucide-react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { DropdownMenuItem } from './DropdownMenu.js'
import { LinkProvider } from './LinkProvider.js'
import { UserMenu } from './UserMenu.js'

/** The application's link, as a router's would be: marked, to be told from a plain `<a>`. */
function AppLink(props: ComponentProps<'a'>) {
  return <a data-link="app" {...props} />
}

const ITEMS: DropdownMenuItem[] = [
  { type: 'link', label: 'Profile', href: '/profile', icon: <User /> },
  { type: 'link', label: 'Settings', href: '/settings', icon: <Settings /> },
]

describe('UserMenu', () => {
  it('is a button that shows who is signed in, named by their name and role; the avatar alone on a narrow screen', () => {
    const { container } = render(<UserMenu name="Ana María Ortiz" detail="Analyst" avatarSrc="/api/v1/me/avatar" items={ITEMS} />)

    const button = screen.getByRole('button', { name: 'Ana María Ortiz, Analyst' })
    expect(button).toHaveAttribute('aria-haspopup', 'menu')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    // The picture, said once: the name says who it is.
    expect(container.querySelector('img')).toHaveAttribute('src', '/api/v1/me/avatar')
    expect(screen.queryByRole('img')).toBeNull()
    // Hidden but for screen readers below 640 px, shown from there, cut short where it is long.
    const words = screen.getByText('Ana María Ortiz').parentElement as HTMLElement
    expect(words).toHaveClass('sr-only', 'sm:not-sr-only', 'sm:max-w-40')
    expect(screen.getByText('Ana María Ortiz')).toHaveClass('truncate')
    expect(screen.getByText('Analyst')).toHaveClass('truncate', 'text-muted-foreground')
  })

  it("draws the initials without a picture, and the name alone without a detail", () => {
    render(<UserMenu name="Léa Brun" items={ITEMS} />)

    const button = screen.getByRole('button', { name: 'Léa Brun' })
    expect(button).toHaveTextContent('LB')
  })

  it('opens the menu of the account: the items given, the application\'s links, then signing out, last', async () => {
    const user = userEvent.setup()
    const signedOut = vi.fn()
    render(
      <LinkProvider component={AppLink}>
        <UserMenu name="Ana María Ortiz" detail="Analyst" items={ITEMS} onSignOut={signedOut} />
      </LinkProvider>,
    )

    const button = screen.getByRole('button', { name: 'Ana María Ortiz, Analyst' })
    await user.click(button)
    const menu = screen.getByRole('menu', { name: 'Account' })
    expect(button).toHaveAttribute('aria-expanded', 'true')
    const rows = within(menu).getAllByRole('menuitem')
    expect(rows.map((row) => row.textContent)).toEqual(['Profile', 'Settings', 'Sign out'])
    expect(within(menu).getByRole('separator')).toBeInTheDocument()
    expect(rows[0]).toHaveAttribute('data-link', 'app')
    expect(rows[0]).toHaveAttribute('href', '/profile')
    // Signing out is an action: a button.
    expect(rows[2].tagName).toBe('BUTTON')
    await waitFor(() => expect(rows[0]).toHaveFocus())

    await user.keyboard('{ArrowDown}')
    expect(rows[1]).toHaveFocus()
    await user.keyboard('{End}')
    expect(rows[2]).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(signedOut).toHaveBeenCalledOnce()
    expect(button).toHaveFocus()
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })

  it('opens from the keyboard on its last item with the up arrow, and closes on Escape', async () => {
    const user = userEvent.setup()
    render(<UserMenu name="Ana María Ortiz" items={ITEMS} onSignOut={() => {}} />)
    const button = screen.getByRole('button', { name: 'Ana María Ortiz' })
    button.focus()

    await user.keyboard('{ArrowUp}')
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus())
    await user.keyboard('s')
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toHaveFocus()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    expect(button).toHaveFocus()
  })

  it('signs out at an address the server answers: a plain link, never the application\'s', async () => {
    const user = userEvent.setup()
    render(
      <LinkProvider component={AppLink}>
        <UserMenu name="Ana María Ortiz" signOutHref="/api/v1/auth/logout" onSignOut={() => {}} />
      </LinkProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Ana María Ortiz' }))
    // Signing out alone: no line before it.
    const menu = screen.getByRole('menu', { name: 'Account' })
    expect(within(menu).queryByRole('separator')).toBeNull()
    const signOut = within(menu).getByRole('menuitem', { name: 'Sign out' })
    expect(signOut.tagName).toBe('A')
    expect(signOut).not.toHaveAttribute('data-link')
    expect(signOut).toHaveAttribute('href', '/api/v1/auth/logout')
  })

  it("takes the words of the application's language", async () => {
    const user = userEvent.setup()
    render(<UserMenu name="Ana María Ortiz" detail="Analyste" label="Compte" signOutLabel="Se déconnecter" onSignOut={() => {}} />)

    await user.click(screen.getByRole('button', { name: 'Ana María Ortiz, Analyste' }))
    expect(within(screen.getByRole('menu', { name: 'Compte' })).getByRole('menuitem')).toHaveTextContent('Se déconnecter')
  })
})
