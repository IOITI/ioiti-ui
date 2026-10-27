import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CopyButton } from './CopyButton.js'

const announcer = () => document.querySelector('[data-ioiti-announcer]')

describe('CopyButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('copies its value, says so, and keeps the focus', async () => {
    vi.stubGlobal('isSecureContext', true)
    // userEvent's setup gives the page a clipboard to read back.
    const user = userEvent.setup()
    const copied = vi.fn()
    render(<CopyButton value="sk_test_4242" label="Copy the key" onCopy={copied} />)

    const button = screen.getByRole('button', { name: 'Copy the key' })
    await user.click(button)

    expect(await navigator.clipboard.readText()).toBe('sk_test_4242')
    expect(copied).toHaveBeenCalledWith(true)
    expect(button).toHaveFocus()
    await waitFor(() => expect(announcer()).toHaveTextContent('Copied'))
  })

  it('says it could not copy where the clipboard refused', async () => {
    vi.stubGlobal('isSecureContext', true)
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'))
    render(<CopyButton value="sk_test_4242" showLabel />)

    await user.click(screen.getByRole('button', { name: 'Copy' }))

    expect(await screen.findByRole('button', { name: "Couldn't copy" })).toBeInTheDocument()
    await waitFor(() => expect(announcer()).toHaveTextContent("Couldn't copy"))
  })

  it('reads its value when pressed, from a function', async () => {
    vi.stubGlobal('isSecureContext', true)
    const user = userEvent.setup()
    let value = 'first'
    render(<CopyButton value={() => value} />)
    value = 'second'

    await user.click(screen.getByRole('button', { name: 'Copy' }))

    expect(await navigator.clipboard.readText()).toBe('second')
  })
})
