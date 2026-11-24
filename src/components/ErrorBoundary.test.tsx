import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { ErrorBoundary } from './ErrorBoundary.js'
import { IoitiProvider } from './IoitiProvider.js'

let failing = true

function Chart() {
  if (failing) throw new Error('The figures are not numbers')
  return <p>Revenue, by month</p>
}

beforeEach(() => {
  failing = true
  // React says what a boundary caught in the console: said here, not in the test's output.
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ErrorBoundary', () => {
  it('shows what went wrong in place of the part that threw, the rest of the page kept, and tells the application once', async () => {
    const onError = vi.fn()
    const own = vi.fn()
    render(
      <IoitiProvider onError={onError}>
        <h1>Dashboard</h1>
        <ErrorBoundary onError={own}>
          <Chart />
        </ErrorBoundary>
      </IoitiProvider>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument()
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('This part could not be shown')
    expect(screen.getByRole('heading', { level: 3, name: 'This part could not be shown' })).not.toHaveFocus()
    expect(own).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledTimes(1)
    const [error, report] = onError.mock.calls[0]
    expect(error).toBeInstanceOf(Error)
    expect(report).toMatchObject({ source: 'boundary' })
    expect(typeof report.componentStack).toBe('string')
    await expectAccessible(document.body)
  })

  it('draws the part again on Try again, which may work then', async () => {
    const user = userEvent.setup()
    render(
      <ErrorBoundary>
        <Chart />
      </ErrorBoundary>,
    )
    failing = false
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(screen.getByText('Revenue, by month')).toBeInTheDocument()
  })

  it('keeps the focus on the error when its Try again fails again', async () => {
    const user = userEvent.setup()
    render(
      <ErrorBoundary>
        <Chart />
      </ErrorBoundary>,
    )
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(screen.getByRole('heading', { name: 'This part could not be shown' })).toHaveFocus()
  })

  it('draws it again by itself once a reset key changes', () => {
    function Page() {
      const [page, setPage] = useState('/orders')
      return (
        <>
          <button type="button" onClick={() => setPage('/clients')}>
            Clients
          </button>
          <ErrorBoundary resetKeys={[page]}>
            <Chart />
          </ErrorBoundary>
        </>
      )
    }
    render(<Page />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    failing = false
    screen.getByRole('button', { name: 'Clients' }).click()
    return screen.findByText('Revenue, by month')
  })

  it('takes a fallback of its own, given the error and the way to try again', async () => {
    const user = userEvent.setup()
    render(
      <ErrorBoundary
        fallback={({ error, reset }) => (
          <p>
            {(error as Error).message}{' '}
            <button type="button" onClick={reset}>
              Again
            </button>
          </p>
        )}
      >
        <Chart />
      </ErrorBoundary>,
    )
    expect(screen.getByText(/The figures are not numbers/)).toBeInTheDocument()
    failing = false
    await user.click(screen.getByRole('button', { name: 'Again' }))
    expect(screen.getByText('Revenue, by month')).toBeInTheDocument()
  })
})
