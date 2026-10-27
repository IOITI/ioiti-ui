import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Disclosure } from './Disclosure.js'

describe('Disclosure', () => {
  it('shows what it holds when its summary is pressed, as the browser does', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    const { container } = render(
      <Disclosure summary="The figures as a table" onOpenChange={changed}>
        <p>Figures</p>
      </Disclosure>,
    )
    const details = container.querySelector('details') as HTMLDetailsElement
    expect(details.open).toBe(false)

    await user.click(screen.getByText('The figures as a table'))
    expect(details.open).toBe(true)
    await waitFor(() => expect(changed).toHaveBeenCalledWith(true))
  })

  it('asks its caller, who holds it, before opening', async () => {
    const user = userEvent.setup()
    function Held() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <Disclosure summary="Details" open={open} onOpenChange={setOpen}>
            <p>Inside</p>
          </Disclosure>
          <output>{open ? 'open' : 'closed'}</output>
        </>
      )
    }
    const { container } = render(<Held />)
    await user.click(screen.getByText('Details'))
    expect(screen.getByRole('status')).toHaveTextContent('open')
    expect((container.querySelector('details') as HTMLDetailsElement).open).toBe(true)
    await user.click(screen.getByText('Details'))
    expect(screen.getByRole('status')).toHaveTextContent('closed')
  })
})
