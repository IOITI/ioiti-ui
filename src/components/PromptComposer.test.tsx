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
})
