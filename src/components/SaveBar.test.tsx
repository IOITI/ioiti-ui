import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { SaveBar } from './SaveBar.js'
import { ToastProvider } from './ToastProvider.js'
import { useToast } from './toast-context.js'

function Settings() {
  const toast = useToast()
  const [saved, setSaved] = useState(500)
  const [limit, setLimit] = useState(500)
  return (
    <>
      <label>
        Limit <input value={limit} onChange={(event) => setLimit(Number(event.target.value))} />
      </label>
      <SaveBar
        open={limit !== saved}
        message="1 unsaved change"
        onDiscard={() => setLimit(saved)}
        onSave={() => {
          setSaved(limit)
          toast({ title: 'Saved' })
        }}
      />
    </>
  )
}

describe('SaveBar', () => {
  it('comes while there is something to save, says it once, and goes once saved', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <Settings />
      </ToastProvider>,
    )
    expect(screen.queryByRole('region', { name: 'Unsaved changes' })).not.toBeInTheDocument()

    await user.type(screen.getByRole('textbox', { name: 'Limit' }), '0')
    const bar = screen.getByRole('region', { name: 'Unsaved changes' })
    expect(bar).toHaveTextContent('1 unsaved change')
    await waitFor(() => expect(document.querySelector('[data-ioiti-announcer]')).toHaveTextContent('1 unsaved change'))

    await user.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(screen.queryByRole('region', { name: 'Unsaved changes' })).not.toBeInTheDocument())
    expect(await screen.findByText('Saved')).toBeInTheDocument()
  })

  it('discards the changes', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <Settings />
      </ToastProvider>,
    )
    await user.type(screen.getByRole('textbox', { name: 'Limit' }), '0')
    await user.click(screen.getByRole('button', { name: 'Discard' }))
    expect(screen.getByRole('textbox', { name: 'Limit' })).toHaveValue('500')
    await waitFor(() => expect(screen.queryByRole('region', { name: 'Unsaved changes' })).not.toBeInTheDocument())
  })

  it('lifts the toasts above it while it is there', async () => {
    const user = userEvent.setup()
    function Lifted() {
      const toast = useToast()
      return (
        <>
          <button type="button" onClick={() => toast({ title: 'Imported' })}>
            Toast
          </button>
          <SaveBar open message="2 unsaved changes" onSave={() => {}} />
        </>
      )
    }
    render(
      <ToastProvider>
        <Lifted />
      </ToastProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Toast' }))
    const frame = (await screen.findByText('Imported')).closest('.fixed') as HTMLElement
    // jsdom lays nothing out: the bar's height is read as none, and its gap is all that is left.
    expect(frame.style.marginBottom).toBe('16px')
  })

  it('keeps Save from being pressed while what there is to save is not valid, and says why at once', async () => {
    const user = userEvent.setup()
    let saved = 0
    render(
      <SaveBar
        open
        message="2 unsaved changes"
        saveDisabled
        error="1 field holds a value that cannot be used."
        onSave={() => (saved += 1)}
      />,
    )

    const save = screen.getByRole('button', { name: 'Save' })
    expect(save).toBeDisabled()
    await user.click(save)
    expect(saved).toBe(0)
    expect(screen.getByRole('alert')).toHaveTextContent('1 field holds a value that cannot be used.')
  })
})
