import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useFocusScope } from './focus-scope.js'

function Layer({ name, open, onEscape, children }: { name: string; open: boolean; onEscape?: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusScope(ref, { active: open, onEscape })
  return open ? (
    <div ref={ref} role="dialog" aria-label={name}>
      {children}
    </div>
  ) : null
}

function Page() {
  const [outer, setOuter] = useState(false)
  const [inner, setInner] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOuter(true)}>
        Open
      </button>
      <button type="button">Elsewhere</button>
      <Layer name="Outer" open={outer} onEscape={() => setOuter(false)}>
        <button type="button">First</button>
        <button type="button" onClick={() => setInner(true)}>
          Open inner
        </button>
        <button type="button" onClick={() => setOuter(false)}>
          Last
        </button>
      </Layer>
      <Layer name="Inner" open={inner} onEscape={() => setInner(false)}>
        <button type="button">Only</button>
      </Layer>
    </>
  )
}

describe('useFocusScope', () => {
  it('moves the focus in, keeps Tab and Shift+Tab inside, and gives it back to what opened it', async () => {
    const user = userEvent.setup()
    render(<Page />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Last' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus()
  })

  it('closes on Escape, the latest scope first, each giving the focus back to its opener', async () => {
    const user = userEvent.setup()
    render(<Page />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await user.click(screen.getByRole('button', { name: 'Open inner' }))
    expect(screen.getByRole('button', { name: 'Only' })).toHaveFocus()
    // The inner scope keeps Tab while it is open.
    await user.tab()
    expect(screen.getByRole('button', { name: 'Only' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Inner' })).toBeNull()
    expect(screen.getByRole('dialog', { name: 'Outer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open inner' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus()
  })

  it('leaves alone a key something inside took, and a focus moved elsewhere on purpose', async () => {
    const onEscape = vi.fn()
    function Taken() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <button type="button">Elsewhere</button>
          <Layer name="Layer" open={open} onEscape={onEscape}>
            <input aria-label="Field" onKeyDown={(event) => event.key === 'Escape' && event.preventDefault()} />
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </Layer>
        </>
      )
    }
    const user = userEvent.setup()
    render(<Taken />)
    expect(screen.getByRole('textbox', { name: 'Field' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(onEscape).not.toHaveBeenCalled()
    screen.getByRole('button', { name: 'Elsewhere' }).focus()
    screen.getByRole('button', { name: 'Close' }).click()
    expect(await screen.findByRole('button', { name: 'Elsewhere' })).toHaveFocus()
  })
})
