import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { fr } from '../locales/fr.js'
import { ConfirmAction } from './ConfirmAction.js'
import { IoitiProvider } from './IoitiProvider.js'
import { DragToConfirm } from './ui/drag-to-confirm.js'

/** The dialog opened from a table's row: a right-aligned cell that does not wrap. */
function DeleteFromATableCell() {
  const [open, setOpen] = useState(false)
  return (
    <table>
      <tbody>
        <tr>
          <td className="whitespace-nowrap text-right">
            <button type="button" onClick={() => setOpen(true)}>
              Delete
            </button>
            <ConfirmAction
              open={open}
              title="Delete this project"
              confirmLabel="Slide to delete"
              description="The project and its files are removed."
              onConfirm={() => {}}
              onOpenChange={setOpen}
            />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

describe('confirmation dialog', () => {
  it('is not inside the element that opens it, so it takes none of its layout', async () => {
    const user = userEvent.setup()
    render(<DeleteFromATableCell />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    const dialog = await screen.findByRole('dialog', { name: 'Delete this project' })
    expect(dialog.closest('td')).toBeNull()
    expect(dialog.parentElement).toBe(document.body)
    expect(dialog).toHaveClass('text-left')
  })

  it('takes keyboard focus when it opens, without putting it on the control that confirms', async () => {
    const user = userEvent.setup()
    render(<DeleteFromATableCell />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveFocus()
    expect(screen.getByRole('slider')).not.toHaveFocus()
  })

  it('keeps Tab inside it, in both directions', async () => {
    const user = userEvent.setup()
    render(<DeleteFromATableCell />)
    const opener = screen.getByRole('button', { name: 'Delete' })
    await user.click(opener)
    const dialog = await screen.findByRole('dialog')

    const visited = new Set<Element | null>()
    for (let press = 0; press < 8; press += 1) {
      await user.tab()
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
      visited.add(document.activeElement)
    }
    // The slider, Cancel and the close button, and nothing of the page behind.
    expect(visited).toContain(screen.getByRole('slider'))
    expect(visited).toContain(screen.getByRole('button', { name: 'Cancel' }))
    expect(visited).not.toContain(opener)

    await user.tab({ shift: true })
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
  })

  it('gives focus back to what opened it when it is dismissed', async () => {
    const user = userEvent.setup()
    render(<DeleteFromATableCell />)
    const opener = screen.getByRole('button', { name: 'Delete' })
    await user.click(opener)
    await screen.findByRole('dialog')

    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(opener).toHaveFocus()
  })
})

describe('what is at stake', () => {
  it('is said first when it is given, and not at all otherwise', () => {
    const { rerender } = render(
      <ConfirmAction open title="Delete" confirmLabel="Slide to delete" description="…" onConfirm={() => {}} onClose={() => {}} />,
    )
    expect(screen.queryByText('This cannot be undone.')).not.toBeInTheDocument()

    rerender(
      <ConfirmAction
        open
        title="Delete"
        confirmLabel="Slide to delete"
        warning="This cannot be undone."
        description="…"
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    )
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })
})

describe('how an action is confirmed', () => {
  it('is a slide for what cannot be taken back', () => {
    render(
      <ConfirmAction open title="Delete this project" confirmLabel="Slide to delete" description="…" onConfirm={() => {}} onClose={() => {}} />,
    )

    expect(screen.getByRole('slider', { name: 'Slide to delete' })).toBeInTheDocument()
    // The component keeps a button for screen readers, out of sight: it must not be
    // a Tab stop, or Enter on a focus nobody can see would confirm the action.
    expect(screen.getByRole('button', { name: 'Slide to delete' })).toHaveAttribute('tabindex', '-1')
  })

  it('has no Tab stop that cannot be seen', async () => {
    const user = userEvent.setup()
    render(
      <ConfirmAction open title="Delete this project" confirmLabel="Slide to delete" description="…" onConfirm={() => {}} onClose={() => {}} />,
    )
    const hidden = screen.getByRole('button', { name: 'Slide to delete' })

    for (let press = 0; press < 6; press += 1) {
      await user.tab()
      expect(hidden).not.toHaveFocus()
    }
  })

  it('is one click for the protective direction', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ConfirmAction
        open
        gesture="button"
        title="Pause the imports"
        confirmLabel="Pause the imports"
        description="…"
        onConfirm={onConfirm}
        onClose={() => {}}
      />,
    )

    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Pause the imports' }))

    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('does not confirm a slide on an arrow key, only on Enter or Space', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ConfirmAction open title="Send" confirmLabel="Slide to send" description="…" onConfirm={onConfirm} onClose={() => {}} />,
    )
    screen.getByRole('slider').focus()

    await user.keyboard('{ArrowRight}')
    expect(onConfirm).not.toHaveBeenCalled()

    await user.keyboard('{Enter}')
    expect(onConfirm).toHaveBeenCalledOnce()
    await expectAccessible(document.body)
  })
})

describe('the slide (DragToConfirm)', () => {
  // jsdom lays nothing out: a track 248 px wide, which leaves the medium thumb (48 px with its padding) 200 px to go.
  const track = () => vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(248)
  afterEach(() => {
    vi.restoreAllMocks()
  })

  /** Where the pointer is, `x` px from the track's start: framer-motion reads the page's coordinates, jsdom gives none. */
  const at = (x: number) => ({ clientX: x, clientY: 10, pageX: x, pageY: 10 })

  /** The pointer pressed on the thumb, moved by `by` px, and let go if `release`. */
  async function drag(user: ReturnType<typeof userEvent.setup>, thumb: HTMLElement, by: number, release = true) {
    await user.pointer([{ keys: '[MouseLeft>]', target: thumb, coords: at(10) }])
    await user.pointer([{ target: thumb, coords: at(20) }])
    await user.pointer([{ target: thumb, coords: at(10 + by) }])
    if (release) await user.pointer([{ keys: '[/MouseLeft]', target: thumb, coords: at(10 + by) }])
  }

  it('says how far its thumb is while it is dragged, in tenths, and again as it goes back', async () => {
    track()
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const { container } = render(<DragToConfirm label="Slide to send" confirmedLabel="Sent" onConfirm={onConfirm} />)
    const thumb = screen.getByRole('slider', { name: 'Slide to send' })
    expect(thumb).toHaveAttribute('aria-valuenow', '0')
    expect(thumb).toHaveAttribute('aria-valuetext', '0%')
    await expectAccessible(container)

    // 80 px of 200: 40 %, said as the thumb stands there, before it is let go.
    await drag(user, thumb, 80, false)
    await waitFor(() => expect(thumb).toHaveAttribute('aria-valuenow', '40'))
    expect(thumb).toHaveAttribute('aria-valuetext', '40%')
    await expectAccessible(container)

    // Let go before the end: the thumb goes back, and says so.
    await user.pointer([{ keys: '[/MouseLeft]', target: thumb, coords: at(90) }])
    await waitFor(() => expect(thumb).toHaveAttribute('aria-valuenow', '0'))
    expect(thumb).toHaveAttribute('aria-valuetext', '0%')
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('says it is confirmed in its words once dragged to the end, and starts again from nothing', async () => {
    track()
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const { container } = render(<DragToConfirm label="Slide to send" confirmedLabel="Sent" autoResetDelay={300} onConfirm={onConfirm} />)
    const thumb = screen.getByRole('slider', { name: 'Slide to send' })

    // 180 px of 200, past the 85 % that confirms once let go.
    await drag(user, thumb, 180, false)
    await waitFor(() => expect(thumb).toHaveAttribute('aria-valuenow', '90'))
    expect(thumb).toHaveAttribute('aria-valuetext', '90%')
    await user.pointer([{ keys: '[/MouseLeft]', target: thumb, coords: at(190) }])
    await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce())
    await waitFor(() => expect(thumb).toHaveAttribute('aria-valuetext', 'Sent'))
    expect(thumb).toHaveAttribute('aria-valuenow', '100')
    await expectAccessible(container)

    await waitFor(() => expect(thumb).toHaveAttribute('aria-valuenow', '0'), { timeout: 3000 })
    expect(thumb).toHaveAttribute('aria-valuetext', '0%')
  })

  it('says it is confirmed from the keyboard too, and says it is disabled', async () => {
    const user = userEvent.setup()
    const { container, rerender } = render(<DragToConfirm label="Slide to send" confirmedLabel="Sent" autoResetDelay={0} />)
    const thumb = screen.getByRole('slider', { name: 'Slide to send' })
    expect(thumb).not.toHaveAttribute('aria-disabled')

    thumb.focus()
    await user.keyboard('{Enter}')
    expect(thumb).toHaveAttribute('aria-valuenow', '100')
    expect(thumb).toHaveAttribute('aria-valuetext', 'Sent')
    await expectAccessible(container)

    rerender(<DragToConfirm label="Slide to pay" disabled />)
    const disabled = screen.getByRole('slider', { name: 'Slide to pay' })
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
    expect(disabled).toHaveAttribute('tabindex', '-1')
    await expectAccessible(container)
  })

  it('says how far its thumb is as the locale writes a percentage', async () => {
    track()
    const user = userEvent.setup()
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <DragToConfirm label="Glisser pour envoyer" confirmedLabel="Envoyé" />
      </IoitiProvider>,
    )
    const thumb = screen.getByRole('slider', { name: 'Glisser pour envoyer' })
    expect(thumb).toHaveAttribute('aria-valuetext', '0\u00a0%')
    await drag(user, thumb, 80, false)
    await waitFor(() => expect(thumb).toHaveAttribute('aria-valuetext', '40\u00a0%'))
  })
})

describe('the confirmation in a language', () => {
  it('says its words in the language given: its button, its slider, what it says while it works and once done', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ConfirmAction open title="Supprimer ce projet" confirmLabel="Glisser pour supprimer" description="Le projet et ses fichiers sont supprimés." onConfirm={() => {}} onClose={() => {}} />
      </IoitiProvider>,
    )
    expect(await screen.findByRole('button', { name: 'Annuler' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    const slider = screen.getByRole('slider', { name: 'Glisser pour supprimer' })
    slider.focus()
    await user.keyboard('{Enter}')
    expect(slider).toHaveAttribute('aria-valuetext', 'Terminé')

    rerender(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ConfirmAction open pending title="Supprimer ce projet" confirmLabel="Glisser pour supprimer" description="Le projet et ses fichiers sont supprimés." onConfirm={() => {}} onClose={() => {}} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('slider', { name: 'Glisser pour supprimer' })).toHaveAttribute('aria-valuetext', 'En cours…')
  })

  it("slides to confirm in the language given, and in an application's own words over English's", async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <DragToConfirm autoResetDelay={0} />
      </IoitiProvider>,
    )
    const thumb = screen.getByRole('slider', { name: 'Glisser pour confirmer' })
    thumb.focus()
    await user.keyboard('{Enter}')
    expect(thumb).toHaveAttribute('aria-valuetext', 'Confirmé ✓')
    unmount()

    render(
      <IoitiProvider messages={{ dialog: { slideToConfirm: 'Slide to go live' } }}>
        <DragToConfirm autoResetDelay={0} />
      </IoitiProvider>,
    )
    const own = screen.getByRole('slider', { name: 'Slide to go live' })
    own.focus()
    await user.keyboard('{Enter}')
    expect(own).toHaveAttribute('aria-valuetext', 'Confirmed ✓')
  })
})

describe('the confirmation held open', () => {
  it('by itself (defaultOpen): Cancel closes it, and tells onOpenChange and onClose', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    const closed = vi.fn()
    render(
      <ConfirmAction defaultOpen title="Delete" confirmLabel="Slide to delete" description="…" onConfirm={() => {}} onOpenChange={changed} onClose={closed} />,
    )
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(changed).toHaveBeenCalledWith(false)
    expect(closed).toHaveBeenCalledOnce()
  })

  it('stays while what it confirms is under way: no close button, Escape and its backdrop close nothing', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    const closed = vi.fn()
    render(
      <ConfirmAction open pending title="Delete" confirmLabel="Slide to delete" description="…" onConfirm={() => {}} onOpenChange={changed} onClose={closed} />,
    )
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    await user.keyboard('{Escape}')
    expect(changed).not.toHaveBeenCalled()
    expect(closed).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog', { name: 'Delete' })).toBeInTheDocument()
  })
})
