import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { ComponentProps, ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LinkProvider } from './LinkProvider.js'
import { SignInProviders } from './SignInProviders.js'
import type { SignInProvider } from './SignInProviders.js'

const GITEA: SignInProvider = {
  id: 'gitea',
  label: 'Sign in with Gitea',
  href: '/api/v1/auth/oidc/gitea/login?next=/w/main',
  icon: <svg data-testid="gitea-mark" />,
}
const OKTA: SignInProvider = { id: 'okta', label: 'Sign in with Okta', href: '/api/v1/auth/oidc/okta/login' }

/** The application's link, as a router's would be: marked, to be told from a plain `<a>`. */
function AppLink(props: ComponentProps<'a'>) {
  return <a data-link="app" {...props} />
}

const withApp = (element: ReactElement) => render(<LinkProvider component={AppLink}>{element}</LinkProvider>)

function PasswordForm() {
  return (
    <form aria-label="Password">
      <button type="submit">Sign in</button>
    </form>
  )
}

/** Whether `first` comes before `then` in the page. */
const before = (first: Element, then: Element) => Boolean(first.compareDocumentPosition(then) & Node.DOCUMENT_POSITION_FOLLOWING)

/** The page coming back from the browser's history, kept whole (`persisted`) or loaded again. */
const pageShown = (persisted: boolean) => act(() => void window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted })))

// jsdom loads no other page: a click that would leave this one is stopped once the component has seen it.
const stay = (event: Event) => event.preventDefault()
beforeEach(() => document.addEventListener('click', stay))
afterEach(() => document.removeEventListener('click', stay))

describe('SignInProviders', () => {
  it('draws a button the whole width for each provider, a plain link the server answers, in a list named for screen readers', () => {
    withApp(
      <SignInProviders providers={[GITEA, OKTA]}>
        <PasswordForm />
      </SignInProviders>,
    )

    const list = screen.getByRole('list', { name: 'Single sign-on' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    const gitea = within(list).getByRole('link', { name: 'Sign in with Gitea' })
    // Never the application's link: the router does not know the address, which sends the browser on to Gitea.
    expect(gitea).not.toHaveAttribute('data-link')
    expect(gitea).toHaveAttribute('href', '/api/v1/auth/oidc/gitea/login?next=/w/main')
    expect(gitea).toHaveClass('w-full', 'border')
    expect(gitea).toContainElement(screen.getByTestId('gitea-mark'))

    // The providers, "or", then the form.
    const or = screen.getByText('or')
    const form = screen.getByRole('form', { name: 'Password' })
    expect(before(list, or)).toBe(true)
    expect(before(or, form)).toBe(true)
  })

  it('puts the providers after the form when asked, with the words or the line given, or none', () => {
    const { rerender } = render(
      <SignInProviders providers={[GITEA]} placement="after" divider="or sign in with">
        <PasswordForm />
      </SignInProviders>,
    )
    const form = screen.getByRole('form', { name: 'Password' })
    expect(before(form, screen.getByText('or sign in with'))).toBe(true)
    expect(before(screen.getByText('or sign in with'), screen.getByRole('list'))).toBe(true)

    rerender(
      <SignInProviders providers={[GITEA]} divider={null}>
        <PasswordForm />
      </SignInProviders>,
    )
    expect(screen.queryByText(/^or/)).toBeNull()
    expect(screen.getByRole('list').nextElementSibling).toBe(screen.getByRole('form', { name: 'Password' }))
  })

  it('draws no line without a form, and the form alone without a provider', () => {
    const { rerender } = render(<SignInProviders providers={[GITEA]} />)
    expect(screen.getByRole('link', { name: 'Sign in with Gitea' })).toBeInTheDocument()
    expect(screen.queryByText('or')).toBeNull()

    rerender(
      <SignInProviders providers={[]}>
        <PasswordForm />
      </SignInProviders>,
    )
    expect(screen.queryByRole('list')).toBeNull()
    expect(screen.queryByText('or')).toBeNull()
    expect(screen.getByRole('form', { name: 'Password' })).toBeInTheDocument()
  })

  it('marks the provider chosen busy and the others disabled, still the link the browser follows, until the page comes back', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<SignInProviders providers={[GITEA, OKTA]} onPendingChange={changed} />)

    const gitea = screen.getByRole('link', { name: 'Sign in with Gitea' })
    await user.click(gitea)
    expect(changed).toHaveBeenLastCalledWith('gitea')
    // The same link, in the page and with its address: the browser leaves for it after the click.
    expect(screen.getByRole('link', { name: 'Sign in with Gitea' })).toBe(gitea)
    expect(gitea).toHaveAttribute('href', GITEA.href)
    expect(gitea).toHaveAttribute('aria-busy', 'true')
    expect(gitea).toHaveAttribute('aria-disabled', 'true')
    expect(gitea.querySelector('.lucide-loader-circle')).not.toBeNull()
    expect(screen.queryByTestId('gitea-mark')).toBeNull()
    expect(screen.getByRole('button', { name: 'Sign in with Okta' })).toBeDisabled()

    // On its way already: a second press does not start it again.
    await user.click(gitea)
    expect(changed).toHaveBeenCalledTimes(1)

    // Loaded again, the page starts afresh anyway; kept whole in the history, it is as it was left.
    pageShown(false)
    expect(gitea).toHaveAttribute('aria-busy', 'true')
    pageShown(true)
    expect(changed).toHaveBeenLastCalledWith(null)
    expect(gitea).not.toHaveAttribute('aria-busy')
    expect(screen.getByTestId('gitea-mark')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign in with Okta' })).toHaveAttribute('href', OKTA.href)
  })

  it('leaves a click that opens another tab to the browser: the page stays as it is', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<SignInProviders providers={[GITEA]} onPendingChange={changed} />)

    await user.keyboard('{Control>}')
    await user.click(screen.getByRole('link', { name: 'Sign in with Gitea' }))
    await user.keyboard('{/Control}')

    expect(changed).not.toHaveBeenCalled()
    expect(screen.getByRole('link', { name: 'Sign in with Gitea' })).not.toHaveAttribute('aria-busy')
  })

  it('shows what it is given: a provider on its way, or the form being sent', () => {
    const { rerender } = render(<SignInProviders providers={[GITEA, OKTA]} pending="password" />)
    // Another id than a provider's (the form's, being sent): every provider waits, none busy.
    expect(screen.getByRole('button', { name: 'Sign in with Gitea' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Sign in with Okta' })).toBeDisabled()
    expect(screen.queryByRole('link')).toBeNull()

    rerender(<SignInProviders providers={[GITEA, OKTA]} pending="okta" />)
    expect(screen.getByRole('link', { name: 'Sign in with Okta' })).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('button', { name: 'Sign in with Gitea' })).toBeDisabled()

    rerender(<SignInProviders providers={[GITEA, OKTA]} pending={null} />)
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('tells the page of the provider chosen, which holds it: the form can wait too', async () => {
    const user = userEvent.setup()
    function Page() {
      const [pending, setPending] = useState<string | null>(null)
      return (
        <SignInProviders providers={[GITEA]} pending={pending} onPendingChange={setPending}>
          <button type="submit" disabled={pending !== null}>
            Sign in
          </button>
        </SignInProviders>
      )
    }
    render(<Page />)

    await user.click(screen.getByRole('link', { name: 'Sign in with Gitea' }))
    expect(screen.getByRole('link', { name: 'Sign in with Gitea' })).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled()
  })

  it('says why a provider cannot be used, its hint on a wrapper the keyboard reaches', async () => {
    const user = userEvent.setup()
    render(<SignInProviders providers={[{ ...OKTA, disabled: true, hint: 'Okta is under maintenance until 14:00' }, { ...GITEA, hint: 'Your account on git.example.com' }]} />)

    const okta = screen.getByRole('button', { name: 'Sign in with Okta' })
    expect(okta).toBeDisabled()
    await user.tab()
    expect(okta.parentElement).toHaveFocus()
    expect(okta.parentElement).toHaveAccessibleDescription('Okta is under maintenance until 14:00')

    await user.tab()
    expect(screen.getByRole('link', { name: 'Sign in with Gitea' })).toHaveFocus()
    expect(screen.getByRole('link', { name: 'Sign in with Gitea' })).toHaveAccessibleDescription('Your account on git.example.com')
  })
})
