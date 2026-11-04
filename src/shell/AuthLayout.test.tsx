import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { IoitiProvider } from '../components/IoitiProvider.js'
import { Alert } from '../components/ui/alert.js'
import { AuthLayout } from './AuthLayout.js'

/** Whether `first` comes before `then` in the page. */
const before = (first: Element, then: Element) => Boolean(first.compareDocumentPosition(then) & Node.DOCUMENT_POSITION_FOLLOWING)

function Form() {
  return (
    <form aria-label="Sign in">
      <button type="submit">Sign in</button>
    </form>
  )
}

describe('AuthLayout', () => {
  it('is one card: a lock in a tile above the heading, what signing in asks for, the form; the theme button in a corner', () => {
    render(
      <IoitiProvider appName="My App">
        <AuthLayout title="My App" description="Sign in with your password.">
          <Form />
        </AuthLayout>
      </IoitiProvider>,
    )

    const heading = screen.getByRole('heading', { level: 1, name: 'My App' })
    const tile = heading.previousElementSibling as HTMLElement
    expect(tile).toHaveClass('grid', 'size-10', 'rounded-xl', 'border', 'bg-surface-raised')
    expect(tile.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('Sign in with your password.')).toHaveClass('text-sm', 'text-muted-foreground')

    const card = heading.parentElement?.parentElement as HTMLElement
    expect(card).toHaveClass('max-w-sm', 'rounded-2xl', 'glass-card')
    expect(card).toContainElement(screen.getByRole('form', { name: 'Sign in' }))
    // Nothing more than the heading and the form without a notice or a footer.
    expect(card.children).toHaveLength(2)
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('button', { name: /Theme/ }))
    // A page named as the application says the name once.
    expect(document.title).toBe('My App')
  })

  it('draws the icon given in the tile, and leaves out the theme button when asked', () => {
    render(
      <IoitiProvider appName="My App">
        <AuthLayout title="My App" icon={<svg data-testid="key" />} themeToggle={false} tabTitle="Sign in">
          <Form />
        </AuthLayout>
      </IoitiProvider>,
    )

    expect(screen.getByRole('heading', { level: 1 }).previousElementSibling).toContainElement(screen.getByTestId('key'))
    expect(screen.queryByRole('button', { name: /Theme/ })).toBeNull()
    expect(document.title).toBe('Sign in · My App')
  })

  it("draws the application's mark in place of the tile, its icon too", () => {
    render(
      <AuthLayout title="MSSP DaC" logo={<img src="/logo.svg" alt="" className="h-8" />} icon={<svg data-testid="key" />}>
        <Form />
      </AuthLayout>,
    )

    const mark = screen.getByRole('heading', { level: 1 }).previousElementSibling as HTMLElement
    expect(mark.querySelector('img')).toHaveAttribute('src', '/logo.svg')
    expect(mark).not.toHaveClass('size-10')
    expect(screen.queryByTestId('key')).toBeNull()
  })

  it('puts a notice between the heading and the form, and the help under the form, at the foot of the card', () => {
    render(
      <AuthLayout
        title="MSSP DaC"
        notice={
          <Alert tone="warning">
            This Gitea account is not linked to a DaC account. Sign in with your password, then link Gitea from your profile.
          </Alert>
        }
        footer="Need an account? Ask an administrator."
      >
        <Form />
      </AuthLayout>,
    )

    const heading = screen.getByRole('heading', { level: 1 })
    const notice = screen.getByRole('alert')
    const form = screen.getByRole('form', { name: 'Sign in' })
    const footer = screen.getByText('Need an account? Ask an administrator.')
    expect(notice).toHaveTextContent('This Gitea account is not linked')
    expect(before(heading, notice)).toBe(true)
    expect(before(notice, form)).toBe(true)
    expect(before(form, footer)).toBe(true)
    // In the card, set apart from the form by a line.
    expect(heading.closest('.glass-card')).toContainElement(footer)
    expect(footer).toHaveClass('border-t', 'text-sm', 'text-muted-foreground')
  })

  it('leaves no room above the form once its notice is dismissed', async () => {
    const user = userEvent.setup()
    render(
      <AuthLayout title="MSSP DaC" notice={<Alert tone="danger" dismissible>Wrong username or password.</Alert>}>
        <Form />
      </AuthLayout>,
    )

    const place = screen.getByRole('alert').closest('.mb-5') as HTMLElement
    expect(place).toHaveClass('empty:hidden')
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    await waitFor(() => expect(place).toBeEmptyDOMElement())
  })
})
