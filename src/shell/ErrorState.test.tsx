import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
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

