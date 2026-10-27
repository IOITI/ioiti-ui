import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { InlineEdit } from './InlineEdit.js'

function Named({ onSave }: { onSave?: (value: string) => string | void | Promise<string | void> }) {
  const [name, setName] = useState('Spring catalogue')
  return (
    <InlineEdit
      label="Name of the run"
      variant="title"
      value={name}
      validate={(value) => (value.trim() ? undefined : 'A run needs a name.')}
      onSave={async (value) => {
        const answer = await onSave?.(value)
        if (typeof answer === 'string') return answer
        setName(value)
      }}
    />
  )
}

describe('InlineEdit', () => {
  it('reads as its value, in a heading, and opens as a field on a click', async () => {
    const user = userEvent.setup()
    render(<Named />)
    const value = screen.getByRole('button', { name: 'Spring catalogue, edit the name of the run' })
    expect(value.closest('h2')).not.toBeNull()

    await user.click(value)
    const field = screen.getByRole('textbox', { name: 'Name of the run' })
    expect(field).toHaveFocus()
    expect(field).toHaveValue('Spring catalogue')
  })

  it('saves with Enter, the focus back on the value', async () => {
    const user = userEvent.setup()
    const saved = vi.fn()
    render(<Named onSave={saved} />)
    await user.click(screen.getByRole('button', { name: /Spring catalogue/ }))
    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), 'Autumn catalogue{Enter}')

    expect(saved).toHaveBeenCalledWith('Autumn catalogue')
    const value = await screen.findByRole('button', { name: /Autumn catalogue/ })
    await waitFor(() => expect(value).toHaveFocus())
  })

  it('gives up with Escape, and keeps the field with what went wrong', async () => {
    const user = userEvent.setup()
    render(<Named onSave={() => 'That name is taken.'} />)
    await user.click(screen.getByRole('button', { name: /Spring catalogue/ }))
    await user.clear(screen.getByRole('textbox'))
    await user.keyboard('{Enter}')
    expect(screen.getByRole('alert')).toHaveTextContent('A run needs a name.')

    await user.type(screen.getByRole('textbox'), 'Winter{Enter}')
    expect(await screen.findByRole('alert')).toHaveTextContent('That name is taken.')
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('That name is taken.')

    await user.keyboard('{Escape}')
    expect(await screen.findByRole('button', { name: /Spring catalogue/ })).toHaveFocus()
  })
})
