import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ResizableHandle, ResizablePanel, ResizablePanels } from './ResizablePanels.js'

function Editor({ onSizesChange }: { onSizesChange?: (sizes: number[]) => void }) {
  return (
    <ResizablePanels onSizesChange={onSizesChange}>
      <ResizablePanel defaultSize={60} minSize={30} label="the editor">
        <p>Editor</p>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40} minSize={20} collapsible>
        <p>Preview</p>
      </ResizablePanel>
    </ResizablePanels>
  )
}

describe('ResizablePanels', () => {
  it('is a separator with its value, controlling the panel before it', () => {
    render(<Editor />)
    const handle = screen.getByRole('separator', { name: 'Resize the editor' })
    expect(handle).toHaveAttribute('aria-valuenow', '60')
    expect(handle).toHaveAttribute('aria-valuemin', '30')
    expect(handle).toHaveAttribute('aria-orientation', 'vertical')
    expect(document.getElementById(handle.getAttribute('aria-controls') ?? '')).toHaveTextContent('Editor')
  })

  it('moves with the arrow keys, within the panels\' bounds', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<Editor onSizesChange={changed} />)
    const handle = screen.getByRole('separator', { name: 'Resize the editor' })
    handle.focus()

    await user.keyboard('{ArrowRight}')
    expect(handle).toHaveAttribute('aria-valuenow', '62')
    expect(changed).toHaveBeenLastCalledWith([62, 38])
    await user.keyboard('{Shift>}{ArrowLeft}{/Shift}')
    expect(handle).toHaveAttribute('aria-valuenow', '52')
    await user.keyboard('{End}')
    expect(handle).toHaveAttribute('aria-valuenow', '80')
    await user.keyboard('{Home}')
    expect(handle).toHaveAttribute('aria-valuenow', '30')
  })

  it('folds the collapsible panel away with Enter, and back; a double click gives the first sizes', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<Editor onSizesChange={changed} />)
    const handle = screen.getByRole('separator', { name: 'Resize the editor' })
    handle.focus()

    await user.keyboard('{Enter}')
    expect(changed).toHaveBeenLastCalledWith([100, 0])
    await user.keyboard('{Enter}')
    expect(changed).toHaveBeenLastCalledWith([60, 40])

    await user.keyboard('{ArrowLeft}')
    await user.dblClick(handle)
    expect(changed).toHaveBeenLastCalledWith([60, 40])
  })

  it('is dragged', () => {
    const changed = vi.fn()
    render(<Editor onSizesChange={changed} />)
    const handle = screen.getByRole('separator', { name: 'Resize the editor' })
    Object.defineProperty(handle.parentElement, 'clientWidth', { configurable: true, value: 1000 })

    fireEvent.pointerDown(handle, { button: 0, clientX: 600, pointerId: 1 })
    fireEvent.pointerMove(handle, { clientX: 700, pointerId: 1 })
    expect(handle).toHaveAttribute('aria-valuenow', '70')
    fireEvent.pointerUp(handle, { clientX: 700, pointerId: 1 })
    expect(changed).toHaveBeenLastCalledWith([70, 30])
  })
})
