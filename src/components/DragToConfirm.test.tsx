import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DragToConfirm } from './ui/drag-to-confirm.js'

/** What a slider draws of its tone: the fill behind its thumb (its track's first child), and the thumb's icon. */
function drawn(name: string) {
  const thumb = screen.getByRole('slider', { name })
  return { fill: thumb.parentElement!.firstElementChild!, icon: thumb.querySelector('svg')! }
}

// DragToConfirm's gestures and words: ConfirmAction.test.tsx (the slide).
describe("DragToConfirm's tone", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // First: a deprecated name is said once in a run, whatever said it before.
  it('draws each tone its own: success in the positive one on its way too, neutral in grey', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <>
        <DragToConfirm label="Slide to confirm" />
        <DragToConfirm label="Slide to approve" tone="success" />
        <DragToConfirm label="Slide to send" tone="info" />
        <DragToConfirm label="Slide to override" tone="warning" />
        <DragToConfirm label="Slide to remove" tone="danger" />
      </>,
    )
    expect(drawn('Slide to confirm').fill).toHaveClass('bg-border', 'border-border-hover')
    expect(drawn('Slide to confirm').icon).toHaveClass('text-text-secondary')
    // Before 0.30.0, success was drawn as the neutral one until it was confirmed.
    expect(drawn('Slide to approve').fill).toHaveClass('bg-positive/5', 'border-positive/30')
    expect(drawn('Slide to approve').icon).toHaveClass('text-positive')
    expect(drawn('Slide to send').fill).toHaveClass('bg-info/5', 'border-info/30')
    expect(drawn('Slide to send').icon).toHaveClass('text-info')
    expect(drawn('Slide to override').fill).toHaveClass('bg-warning/5')
    expect(drawn('Slide to remove').fill).toHaveClass('bg-negative/5')
    expect(drawn('Slide to remove').icon).toHaveClass('text-negative')
    expect(warn).not.toHaveBeenCalled()
  })

  it("takes its action's tone where it is given none, the tone given over it", () => {
    render(
      <>
        <DragToConfirm label="Slide to delete" actionType="delete" />
        <DragToConfirm label="Slide to unlock" actionType="unlock" />
        <DragToConfirm label="Slide to submit" actionType="submit" />
        <DragToConfirm label="Slide to archive" actionType="archive" />
        <DragToConfirm label="Slide to delete the draft" actionType="delete" tone="warning" />
      </>,
    )
    expect(drawn('Slide to delete').fill).toHaveClass('bg-negative/5')
    expect(drawn('Slide to unlock').fill).toHaveClass('bg-warning/5')
    expect(drawn('Slide to submit').fill).toHaveClass('bg-info/5')
    expect(drawn('Slide to archive').fill).toHaveClass('bg-border')
    expect(drawn('Slide to delete the draft').fill).toHaveClass('bg-warning/5')
  })

  it('reads its variant as its tone (default as neutral), the tone given over it, and says once in development that it is deprecated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { rerender } = render(<DragToConfirm label="Slide to approve" variant="success" />)
    expect(drawn('Slide to approve').fill).toHaveClass('bg-positive/5')
    rerender(<DragToConfirm label="Slide to approve" variant="default" actionType="delete" />)
    expect(drawn('Slide to approve').fill).toHaveClass('bg-border')
    rerender(<DragToConfirm label="Slide to approve" variant="danger" tone="info" />)
    expect(drawn('Slide to approve').fill).toHaveClass('bg-info/5')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toMatch(/^ioiti-ui: a name or a value the package deprecated/)
    expect(String(warn.mock.calls[0][0])).toContain("(DragToConfirm's variant: tone")
  })
})
