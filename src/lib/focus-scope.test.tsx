import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { currentFocusScope, useFocusScope } from './focus-scope.js'
import type { FocusScopeOptions } from './focus-scope.js'

type LayerProps = { name: string; open: boolean; onEscape?: () => void; children: ReactNode } & Pick<FocusScopeOptions, 'contain' | 'autoFocus'>

function Layer({ name, open, onEscape, children, ...options }: LayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusScope(ref, { active: open, onEscape, ...options })
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

  it('leaves a key that composes a character to the composition: an IME’s Escape closes nothing', () => {
    const onEscape = vi.fn()
    render(
      <Layer name="Layer" open onEscape={onEscape}>
        <input aria-label="Name" />
      </Layer>,
    )
    const field = screen.getByRole('textbox', { name: 'Name' })
    expect(field).toHaveFocus()
    fireEvent.keyDown(field, { key: 'Escape', isComposing: true })
    fireEvent.keyDown(field, { key: 'Escape', keyCode: 229 })
    expect(onEscape).not.toHaveBeenCalled()
    fireEvent.keyDown(field, { key: 'Escape' })
    expect(onEscape).toHaveBeenCalledOnce()
  })

  it('goes round the stops it holds: not what is inert, and from a part past its last control', async () => {
    const user = userEvent.setup()
    render(
      <Layer name="Layer" open>
        <div inert>
          <button type="button">Under</button>
        </div>
        <button type="button">First</button>
        <button type="button">Last</button>
        <p tabIndex={-1}>A note</p>
        <div inert>
          <button type="button">Below</button>
        </div>
      </Layer>,
    )
    // In on its first stop, not on what is inert before it.
    const first = screen.getByRole('button', { name: 'First' })
    expect(first).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus()
    await user.tab()
    expect(first).toHaveFocus()
    // A part that is no stop, past the last (focused by a script): Tab goes round to the first.
    act(() => screen.getByText('A note').focus())
    await user.tab()
    expect(first).toHaveFocus()
  })

  it('leaves the focus free in a layer that holds no page: moved in and given back, Tab in and out, its Escape only from within', async () => {
    const user = userEvent.setup()
    const onEscape = vi.fn()
    function Help() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(!open)}>
            Help
          </button>
          <button type="button">On the page</button>
          <Layer
            name="Help"
            open={open}
            contain={false}
            onEscape={() => {
              onEscape()
              setOpen(false)
            }}
          >
            <button type="button">Read more</button>
          </Layer>
        </>
      )
    }
    render(<Help />)
    const help = screen.getByRole('button', { name: 'Help' })
    await user.click(help)
    const more = screen.getByRole('button', { name: 'Read more' })
    expect(more).toHaveFocus()
    // It holds no page: what is said is said in the page, not in it.
    expect(currentFocusScope()).toBeNull()
    // Nothing keeps Tab in it: past its last control, the focus goes on out of it.
    await user.tab()
    expect(document.body).toHaveFocus()
    // Escape on the page is the page's; in the layer, the layer's.
    await user.click(screen.getByRole('button', { name: 'On the page' }))
    await user.keyboard('{Escape}')
    expect(onEscape).not.toHaveBeenCalled()
    await user.click(more)
    await user.keyboard('{Escape}')
    expect(onEscape).toHaveBeenCalledOnce()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(help).toHaveFocus()
  })

  it('keeps the keys for the latest layer that holds the page or the focus, one that holds no page among them', async () => {
    const user = userEvent.setup()
    function Both() {
      const [outer, setOuter] = useState(true)
      const [help, setHelp] = useState(false)
      return (
        <>
          <Layer name="Outer" open={outer} onEscape={() => setOuter(false)}>
            <button type="button" onClick={() => setHelp(true)}>
              Open help
            </button>
          </Layer>
          <Layer name="Help" open={help} contain={false} onEscape={() => setHelp(false)}>
            <button type="button">Read more</button>
          </Layer>
        </>
      )
    }
    render(<Both />)
    const opener = screen.getByRole('button', { name: 'Open help' })
    expect(opener).toHaveFocus()
    expect(currentFocusScope()).toBe(screen.getByRole('dialog', { name: 'Outer' }))
    await user.click(opener)
    expect(screen.getByRole('button', { name: 'Read more' })).toHaveFocus()
    // The focus in the help: its Escape closes it alone, the focus back on what opened it.
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Help' })).toBeNull()
    expect(opener).toHaveFocus()
    // The focus in the dialog under it, the help open: the dialog's.
    await user.click(opener)
    act(() => opener.focus())
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Outer' })).toBeNull()
    expect(screen.getByRole('dialog', { name: 'Help' })).toBeInTheDocument()
  })

  it('leaves the focus where it is when asked (a layer open with the page), giving it back from within all the same', async () => {
    const user = userEvent.setup()
    function Later() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <input aria-label="Search" onChange={() => setOpen(true)} />
          <Layer name="Results" open={open} autoFocus={false} contain={false} onEscape={() => setOpen(false)}>
            <button type="button">First result</button>
          </Layer>
        </>
      )
    }
    render(<Later />)
    const field = screen.getByRole('textbox', { name: 'Search' })
    await user.type(field, 'a')
    expect(screen.getByRole('dialog', { name: 'Results' })).toBeInTheDocument()
    expect(field).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'First result' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(field).toHaveFocus()
  })

  it('reads whether it holds the page as each key comes', async () => {
    const user = userEvent.setup()
    function Changing({ contain }: { contain: boolean }) {
      return (
        <Layer name="Layer" open contain={contain}>
          <button type="button">Only</button>
        </Layer>
      )
    }
    const { rerender } = render(<Changing contain={false} />)
    const only = screen.getByRole('button', { name: 'Only' })
    expect(only).toHaveFocus()
    await user.tab()
    expect(document.body).toHaveFocus()
    rerender(<Changing contain />)
    act(() => only.focus())
    await user.tab()
    expect(only).toHaveFocus()
  })
})
