import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { QueryState } from './status.js'

function Page({ isPending, hasData, error = null }: { isPending: boolean; hasData: boolean; error?: Error | null }) {
  return (
    <main>
      <QueryState isPending={isPending} error={error} hasData={hasData} skeleton={<p>Loading the orders</p>}>
        <h2>Orders</h2>
        <p>Three open</p>
      </QueryState>
    </main>
  )
}

describe('QueryState', () => {
  it('shows the skeleton while nothing has arrived', () => {
    render(<Page isPending hasData={false} />)

    expect(screen.getByText('Loading the orders')).toBeInTheDocument()
    expect(screen.queryByText('Orders')).not.toBeInTheDocument()
  })

  it('fades in what arrives where the skeleton was, each part keeping its place among the page\'s', () => {
    const { rerender } = render(<Page isPending hasData={false} />)
    rerender(<Page isPending={false} hasData />)

    const revealed = screen.getByText('Orders').parentElement
    expect(revealed).toHaveClass('contents', '[&>*]:animate-reveal')
    expect(revealed).toContainElement(screen.getByText('Three open'))
    expect(revealed?.parentElement).toBe(screen.getByRole('main'))
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
