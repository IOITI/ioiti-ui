import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Settings, User } from 'lucide-react'
import type { ComponentProps } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ACCENT_ATTRIBUTE, MATERIAL_ATTRIBUTE, THEME_KEY_ATTRIBUTE } from '../lib/theme.js'
import { stubSystemTheme } from '../test/systemTheme.js'

import type { DropdownMenuItem } from './DropdownMenu.js'
import { LinkProvider } from './LinkProvider.js'
import { ThemeProvider } from './ThemeProvider.js'
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

describe('UserMenu, with the look of the interface', () => {
  const html = document.documentElement

  beforeEach(() => {
    window.localStorage.clear()
    html.classList.remove('dark')
    html.removeAttribute(THEME_KEY_ATTRIBUTE)
    html.removeAttribute(ACCENT_ATTRIBUTE)
    html.removeAttribute(MATERIAL_ATTRIBUTE)
    stubSystemTheme(false)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function renderMenu() {
    render(
      <ThemeProvider storageKey="my-app.theme">
        <UserMenu name="Ana María Ortiz" detail="Analyst" items={ITEMS} appearance onSignOut={() => {}} />
      </ThemeProvider>,
    )
    return screen.getByRole('button', { name: 'Ana María Ortiz, Analyst' })
  }

  it('offers the theme after the items, then the accent and the material, signing out still last', async () => {
    const user = userEvent.setup()
    await user.click(renderMenu())

    const menu = screen.getByRole('menu', { name: 'Account' })
    expect(within(menu).getByRole('group', { name: 'Theme' })).toBeInTheDocument()
    expect(within(menu).getByRole('menuitemradio', { name: /^System/ })).toHaveAttribute('aria-checked', 'true')
    expect(within(menu).getByRole('menuitemradio', { name: 'Light' })).toHaveAttribute('aria-checked', 'false')
    const rows = within(menu).getAllByRole('menuitem')
    expect(rows.map((row) => row.textContent)).toEqual(['Profile', 'Settings', 'Accent and materialNeutral, flat', 'Sign out'])
  })

  it('changes the theme, kept in this browser', async () => {
    const user = userEvent.setup()
    await user.click(renderMenu())

    await user.click(screen.getByRole('menuitemradio', { name: 'Dark' }))

    await waitFor(() => expect(html).toHaveClass('dark'))
    expect(window.localStorage.getItem('my-app.theme')).toBe('dark')
  })

  it('changes the accent and the material from their sub-menu, each a choice with its swatch', async () => {
    const user = userEvent.setup()
    const button = renderMenu()

    await user.click(button)
    await user.click(screen.getByRole('menuitem', { name: /^Accent and material/ }))
    const violet = await screen.findByRole('menuitemradio', { name: 'Violet' })
    expect(violet.querySelector('[data-swatch="violet"]')).toHaveAttribute('aria-hidden', 'true')
    await user.click(violet)
    await waitFor(() => expect(html.getAttribute(ACCENT_ATTRIBUTE)).toBe('violet'))
    // A choice closes the menu, as any radio of a menu.
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())

    await user.click(button)
    await user.click(screen.getByRole('menuitem', { name: /^Accent and material/ }))
    await user.click(await screen.findByRole('menuitemradio', { name: 'Glass' }))
    await waitFor(() => expect(html.getAttribute(MATERIAL_ATTRIBUTE)).toBe('glass'))
    expect(window.localStorage.getItem('my-app.theme.accent')).toBe('violet')
    expect(window.localStorage.getItem('my-app.theme.material')).toBe('glass')
  })
})
