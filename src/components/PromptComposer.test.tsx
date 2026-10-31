import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { PromptComposer } from './PromptComposer.js'

function Composer(props: Partial<Parameters<typeof PromptComposer>[0]> & { start?: string }) {
  const [value, setValue] = useState(props.start ?? '')
  return (
    <PromptComposer label="Ask the assistant" onSubmit={() => {}} {...props} value={value}
      onValueChange={(next) => { setValue(next); props.onValueChange?.(next) }} />
  )
}

describe('PromptComposer', () => {
  it('sends what is typed with Enter, without its spaces, and breaks a line with Shift+Enter', () => {
    const sent = vi.fn()
    render(<Composer onSubmit={sent} />)
    const field = screen.getByRole('textbox', { name: 'Ask the assistant' })

    fireEvent.change(field, { target: { value: '  Analyse this run  ' } })
    fireEvent.keyDown(field, { key: 'Enter', shiftKey: true })
    expect(sent).not.toHaveBeenCalled()
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(sent).toHaveBeenCalledWith('Analyse this run')
  })

  it('sends nothing empty, nothing while busy, and stops what is under way', () => {
    const sent = vi.fn()
    const stopped = vi.fn()
    const { rerender } = render(<PromptComposer label="Ask" value="" onValueChange={() => {}} onSubmit={sent} />)
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()

    rerender(<PromptComposer label="Ask" value="Again" onValueChange={() => {}} onSubmit={sent} busy onStop={stopped} />)
    expect(screen.queryByRole('button', { name: 'Send' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
    expect(stopped).toHaveBeenCalledOnce()
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
    expect(sent).not.toHaveBeenCalled()
  })

  it('fills the field from a suggestion and puts the focus in it', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => { callback(0); return 0 })
    render(<Composer suggestions={[{ label: 'Analyse', prompt: 'Is this run believable?' }]} />)

    act(() => fireEvent.click(screen.getByRole('button', { name: 'Analyse' })))

    const field = screen.getByRole('textbox')
    expect(field).toHaveValue('Is this run believable?')
    expect(field).toHaveFocus()
    vi.restoreAllMocks()
  })

  it('says why nothing can be sent, and counts what is typed against its limit', () => {
    render(<Composer start={'x'.repeat(12)} maxLength={10} footer="Claude Opus 5.5" disabled disabledReason="No key is set" />)

    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByText(/12 \/ 10/)).toHaveClass('text-negative')
    expect(screen.getByText('Claude Opus 5.5')).toBeInTheDocument()
    fireEvent.focus(screen.getByRole('button', { name: 'Send' }).parentElement!)
    expect(screen.getAllByText('No key is set').length).toBeGreaterThan(0)
  })

  it('keeps its controls whole beside the footer, which alone is cut short', () => {
    const chosen = vi.fn()
    render(<Composer footer="up to $5.00 a request" controls={<button type="button" onClick={chosen}>Model 2</button>} />)

    const control = screen.getByRole('button', { name: 'Model 2' })
    fireEvent.click(control)
    expect(chosen).toHaveBeenCalledOnce()
    expect(control.closest('.truncate')).toBeNull()
    expect(screen.getByText('up to $5.00 a request').closest('.truncate')).not.toBeNull()
  })

  it("floats at a page's foot: its frame lifted, glass under the glass material, its focus said over the glass's edge", () => {
    const { rerender } = render(<PromptComposer label="Ask" value="" onValueChange={() => {}} onSubmit={() => {}} floating />)

    const frame = screen.getByRole('textbox').parentElement!
    expect(frame).toHaveClass('glass-float', 'shadow-[var(--shadow-elevated)]', 'glass:focus-within:border-border-hover')

    rerender(<PromptComposer label="Ask" value="" onValueChange={() => {}} onSubmit={() => {}} />)
    expect(screen.getByRole('textbox').parentElement).not.toHaveClass('glass-float')
  })
})

describe('PromptComposer with attachments', () => {
  function files(...names: string[]) {
    return names.map((name) => new File(['x'], name, { type: name.endsWith('.png') ? 'image/png' : 'text/csv' }))
  }

  it('shows what the request goes with above its field, inside its frame', () => {
    render(<Composer attachments={<span>chart.png</span>} />)

    const group = screen.getByRole('group', { name: 'Attached' })
    expect(group).toHaveTextContent('chart.png')
    expect(group.nextElementSibling).toBe(screen.getByRole('textbox'))
  })

  it('hands over files dropped on its frame, shown while they are dragged over it', () => {
    const given = vi.fn()
    render(<Composer onFiles={given} />)
    const frame = screen.getByRole('textbox').parentElement!
    const dropped = files('chart.png', 'export.csv')
    const transfer = { types: ['Files'], files: dropped, dropEffect: 'none' }

    fireEvent.dragEnter(frame, { dataTransfer: transfer })
    expect(frame).toHaveAttribute('data-dropping', 'true')
    fireEvent.dragOver(frame, { dataTransfer: transfer })
    fireEvent.drop(frame, { dataTransfer: transfer })

    expect(given).toHaveBeenCalledWith(dropped)
    expect(frame).not.toHaveAttribute('data-dropping')
  })

  it('takes no drag of text for files, and nothing while disabled', () => {
    const given = vi.fn()
    const { rerender } = render(<PromptComposer label="Ask" value="" onValueChange={() => {}} onSubmit={() => {}} onFiles={given} />)
    const frame = screen.getByRole('textbox').parentElement!

    fireEvent.dragEnter(frame, { dataTransfer: { types: ['text/plain'], files: [] } })
    expect(frame).not.toHaveAttribute('data-dropping')

    rerender(<PromptComposer label="Ask" value="" onValueChange={() => {}} onSubmit={() => {}} onFiles={given} disabled />)
    fireEvent.drop(frame, { dataTransfer: { types: ['Files'], files: files('chart.png') } })
    expect(given).not.toHaveBeenCalled()
  })

  it('hands over a pasted screenshot, and leaves a paste of text as it is', () => {
    const given = vi.fn()
    render(<Composer onFiles={given} />)
    const field = screen.getByRole('textbox')
    const shot = files('chart.png')

    const pastedFiles = fireEvent.paste(field, { clipboardData: { files: shot, getData: () => '' } })
    const pastedText = fireEvent.paste(field, { clipboardData: { files: [], getData: () => 'Analyse' } })

    expect(given).toHaveBeenCalledOnce()
    expect(given).toHaveBeenCalledWith(shot)
    // fireEvent says false when the default was prevented: the screenshot is not pasted as text.
    expect(pastedFiles).toBe(false)
    expect(pastedText).toBe(true)
  })
})
