import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { QueryState } from './status.js'

function Page({
  isPending,
  hasData,
  error = null,
  aside = false,
}: {
  isPending: boolean
  hasData: boolean
  error?: Error | null
  aside?: boolean
}) {
  return (
    <main className="space-y-6">
      {aside && <aside>Filters</aside>}
      <QueryState isPending={isPending} error={error} hasData={hasData} skeleton={<p>Loading the orders</p>}>
        <h2>Orders</h2>
        <p>Three open</p>
      </QueryState>
      <footer>Totals</footer>
    </main>
  )
}

describe('QueryState', () => {
  it('shows the skeleton while nothing has arrived', () => {
    render(<Page isPending hasData={false} />)

    expect(screen.getByText('Loading the orders')).toBeInTheDocument()
    expect(screen.queryByText('Orders')).not.toBeInTheDocument()
  })

  it('fades in what arrives where the skeleton was, each part one of the page\'s own, as if there from the start', () => {
    const { rerender } = render(<Page isPending hasData={false} />)
    rerender(<Page isPending={false} hasData />)

    const main = screen.getByRole('main')
    // No box of its own: a column's margins (space-y), its gaps, a grid's cells apply to each part.
    expect(screen.getByText('Orders').parentElement).toBe(main)
    expect(screen.getByText('Three open').parentElement).toBe(main)
    expect(screen.getByText('Orders')).toHaveClass('animate-reveal')
    expect(screen.getByText('Three open')).toHaveClass('animate-reveal')
    expect(screen.getByText('Totals')).not.toHaveClass('animate-reveal')
    expect(main.querySelector('template')).toBeNull()
  })

  it('keeps no trace of the fade once it has run', () => {
    const { rerender } = render(<Page isPending hasData={false} />)
    rerender(<Page isPending={false} hasData />)

    const title = screen.getByText('Orders')
    fireEvent.animationEnd(screen.getByText('Three open')) // another part's end
    expect(title).toHaveClass('animate-reveal')
    fireEvent.animationEnd(title)
    expect(title).not.toHaveClass('animate-reveal')
  })

  it('waits on for its own data when another part of the page changes meanwhile', async () => {
    const { rerender } = render(<Page isPending hasData={false} />)
    rerender(<Page isPending hasData={false} aside />)
    await Promise.resolve() // the watch reads that change, which is not its own
    rerender(<Page isPending={false} hasData aside />)

    expect(screen.getByText('Orders')).toHaveClass('animate-reveal')
    expect(screen.getByText('Filters')).not.toHaveClass('animate-reveal')
  })

  it('reveals nothing once it is gone', async () => {
    const { rerender } = render(
      <main>
        <Page isPending hasData={false} />
      </main>,
    )
    rerender(
      <main>
        <section>Another page</section>
      </main>,
    )
    await Promise.resolve()

    expect(screen.getByText('Another page')).not.toHaveClass('animate-reveal')
  })

  it('shows what is there from the start as it is', () => {
    render(<Page isPending={false} hasData />)

    expect(screen.getByText('Orders').parentElement).toBe(screen.getByRole('main'))
  })

  it('keeps what is shown when a refresh fails, and says so above it', () => {
    render(<Page isPending={false} hasData error={new Error('The server does not answer')} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Could not refresh: showing the last data received')
    expect(screen.getByText('Three open')).toBeInTheDocument()
  })
})
