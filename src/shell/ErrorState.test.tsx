import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { ErrorBoundary } from '../components/ErrorBoundary.js'
import { IoitiProvider } from '../components/IoitiProvider.js'
import { fr } from '../locales/fr.js'
import { ErrorState } from './ErrorState.js'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('ErrorState', () => {
  it('is a page that says what went wrong, takes the focus, and leads on: Try again, home', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<ErrorState error={new Error('Cannot read properties of undefined')} onRetry={onRetry} />)
    const heading = screen.getByRole('heading', { level: 1, name: 'Something went wrong' })
    expect(heading).toHaveFocus()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
    await expectAccessible(document.body)
  })

  it('says a part of the application that failed to load is reloaded, not tried again', () => {
    render(<ErrorState error={new TypeError('Failed to fetch dynamically imported module: /assets/ItemsPage-1a2b.js')} onRetry={() => {}} />)
    expect(screen.getByRole('heading', { level: 1, name: 'This page could not be loaded' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull()
  })

  it('says a server out of reach as such', () => {
    render(<ErrorState error={new TypeError('Failed to fetch')} onRetry={() => {}} />)
    expect(screen.getByRole('heading', { name: 'The server could not be reached' })).toBeInTheDocument()
  })

  it('shows the details in development only', () => {
    const { unmount } = render(<ErrorState error={new Error('The figures are not numbers')} />)
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByText(/Error: The figures are not numbers/)).toBeInTheDocument()
    unmount()
    vi.stubEnv('NODE_ENV', 'production')
    render(<ErrorState error={new Error('The figures are not numbers')} />)
    expect(screen.queryByText('Details')).toBeNull()
  })

  it('in a part of a page, is said where the focus is, smaller, without a way home', async () => {
    render(
      <>
        <button type="button">Elsewhere</button>
        <ErrorState page={false} title="The chart could not be drawn" onRetry={() => {}} />
      </>,
    )
    screen.getByRole('button', { name: 'Elsewhere' }).focus()
    expect(screen.getByRole('alert')).toHaveTextContent('The chart could not be drawn')
    expect(screen.getByRole('heading', { level: 3 })).not.toHaveFocus()
    expect(screen.queryByRole('link')).toBeNull()
    await expectAccessible(document.body)
  })

  it('says nothing of trying again without a Try again, and takes an icon and a heading level of its own', () => {
    render(<ErrorState page={false} headingLevel={2} icon={<span data-testid="lock" />} />)
    expect(screen.getByRole('heading', { level: 2, name: 'This part could not be shown' })).toBeInTheDocument()
    expect(screen.getByText(/Come back to it later/)).toBeInTheDocument()
    expect(screen.queryByText(/Try again/)).toBeNull()
    expect(screen.getByTestId('lock')).toBeInTheDocument()
  })

  it('gives the focus to the page once its Try again worked, not to nothing', async () => {
    const user = userEvent.setup()
    function Page() {
      const [failed, setFailed] = useState(true)
      return <main>{failed ? <ErrorState page={false} onRetry={() => setFailed(false)} /> : <p>The chart</p>}</main>
    }
    render(<Page />)
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus())
  })
})

describe('ErrorState in French', () => {
  /** French's no-break spaces (before a semicolon, a colon) read as spaces. */
  const spaced = (text: string | null) => (text ?? '').replace(/\s/g, ' ')

  it('says what went wrong and the way on in the provider\'s words, its details too', () => {
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ErrorState error={new Error('Les chiffres ne sont pas des nombres')} onRetry={() => {}} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Une erreur s’est produite' })).toHaveFocus()
    expect(spaced(screen.getByText(/^Réessayez/).textContent)).toBe('Réessayez ; en cas de nouvel échec, revenez plus tard.')
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Retour à l’accueil' })).toHaveAttribute('href', '/')
    expect(screen.getByText('Détails')).toBeInTheDocument()
  })

  it('says each kind of error in French: a server out of reach, code that did not load', () => {
    const { unmount } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ErrorState page={false} error={new TypeError('Failed to fetch')} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('heading', { level: 3, name: 'Le serveur est injoignable' })).toBeInTheDocument()
    expect(screen.getByText('Vérifiez la connexion, puis revenez plus tard.')).toBeInTheDocument()
    unmount()

    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ErrorState error={new TypeError('Failed to fetch dynamically imported module: /assets/ItemsPage-1a2b.js')} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Cette page n’a pas pu être chargée' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recharger' })).toBeInTheDocument()
  })

  it("says a part that threw in the provider's words, and takes an application's own over them", () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    function Broken(): never {
      throw new Error('Nothing to draw')
    }
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ErrorBoundary>
          <Broken />
        </ErrorBoundary>
      </IoitiProvider>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Cette partie n’a pas pu être affichée')
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it("takes an application's own words over the language's", () => {
    render(
      <IoitiProvider messages={{ error: { otherPage: 'Oops', tryAgain: 'Retry' } }}>
        <ErrorState error={new Error('No')} onRetry={() => {}} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Oops' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to home' })).toBeInTheDocument()
  })
})
