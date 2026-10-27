import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { ContextMenu, DropdownMenu } from './DropdownMenu.js'
import type { DropdownMenuItem } from './DropdownMenu.js'
import { Button } from './ui/button.js'

function Actions({ onSelect = () => {}, items }: { onSelect?: (what: string) => void; items?: DropdownMenuItem[] }) {
  const [compact, setCompact] = useState(false)
  const [sort, setSort] = useState('newest')
  return (
    <DropdownMenu
      label="Actions on the order"
      trigger={<Button>Actions</Button>}
      items={
        items ?? [
          { label: 'Duplicate', shortcut: 'mod+d', onSelect: () => onSelect('duplicate') },
          { label: 'Archive', onSelect: () => onSelect('archive'), disabled: true },
          { type: 'link', label: 'Open the customer', href: '/customers/42' },
          { type: 'separator' },
          { type: 'checkbox', label: 'Compact rows', checked: compact, onCheckedChange: setCompact },
          {
            type: 'radio',
            label: 'Sort',
            value: sort,
            onValueChange: setSort,
            options: [
              { value: 'newest', label: 'Newest first' },
              { value: 'oldest', label: 'Oldest first' },
            ],
          },
          {
            type: 'submenu',
            label: 'Export',
            items: [
              { label: 'As CSV', onSelect: () => onSelect('csv') },
              { label: 'As PDF', onSelect: () => onSelect('pdf') },
            ],
          },
          { label: 'Delete', tone: 'danger', onSelect: () => onSelect('delete') },
        ]
      }
    />
  )
}

describe('DropdownMenu', () => {
  it('opens a menu of its items, the focus on the first', async () => {
    const user = userEvent.setup()
    render(<Actions />)
    const button = screen.getByRole('button', { name: 'Actions' })
    expect(button).toHaveAttribute('aria-haspopup', 'menu')

    await user.click(button)
    const menu = screen.getByRole('menu', { name: 'Actions on the order' })
    expect(menu.parentElement).toBe(document.body)
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /Duplicate/ })).toHaveFocus())
    expect(screen.getByRole('menuitem', { name: 'Open the customer' })).toHaveAttribute('href', '/customers/42')
    expect(screen.getByRole('menuitemcheckbox', { name: 'Compact rows' })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('menuitemradio', { name: 'Newest first' })).toHaveAttribute('aria-checked', 'true')
  })

  it('moves with the arrows past what is disabled, jumps with a letter, and acts with the focus back on its button', async () => {
    const user = userEvent.setup()
    const selected = vi.fn()
    render(<Actions onSelect={selected} />)
    const button = screen.getByRole('button', { name: 'Actions' })
    await user.click(button)
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /Duplicate/ })).toHaveFocus())

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Open the customer' })).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus()
    await user.keyboard('c')
    expect(screen.getByRole('menuitemcheckbox', { name: 'Compact rows' })).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(screen.getByRole('menuitemcheckbox', { name: 'Compact rows' })).toHaveAttribute('aria-checked', 'true')
    await user.keyboard('{Home}{Enter}')
    expect(selected).toHaveBeenCalledWith('duplicate')
    expect(button).toHaveFocus()
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })

  it('opens a sub-menu in its place, and goes back to the row that opened it', async () => {
    const user = userEvent.setup()
    const selected = vi.fn()
    render(<Actions onSelect={selected} />)
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /Duplicate/ })).toHaveFocus())

    await user.keyboard('e')
    expect(screen.getByRole('menuitem', { name: 'Export' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'As CSV' })).toHaveFocus())
    await user.keyboard('{ArrowLeft}')
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Export' })).toHaveFocus())

    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'As CSV' })).toHaveFocus())
    await user.keyboard('{ArrowDown}{Enter}')
    expect(selected).toHaveBeenCalledWith('pdf')
  })

  it('opens on its last item with the up arrow, and closes on Escape and on Tab', async () => {
    const user = userEvent.setup()
    render(<Actions />)
    const button = screen.getByRole('button', { name: 'Actions' })
    button.focus()

    await user.keyboard('{ArrowUp}')
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus())
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    expect(button).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /Duplicate/ })).toHaveFocus())
    await user.tab()
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    expect(button).toHaveFocus()
  })
})

describe('ContextMenu', () => {
  it('opens at the pointer on a right click, and from the keyboard', async () => {
    const user = userEvent.setup()
    const selected = vi.fn()
    render(
      <ContextMenu label="Actions on the row" items={[{ label: 'Copy the reference', onSelect: () => selected('copy') }]}>
        <button type="button">IT-1042</button>
      </ContextMenu>,
    )

    fireEvent.contextMenu(screen.getByRole('button', { name: 'IT-1042' }), { clientX: 120, clientY: 80 })
    const menu = screen.getByRole('menu', { name: 'Actions on the row' })
    await waitFor(() => expect(menu.style.top).toBe('86px'))
    expect(menu.style.left).toBe('120px')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())

    screen.getByRole('button', { name: 'IT-1042' }).focus()
    await user.keyboard('{Shift>}{F10}{/Shift}')
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Copy the reference' })).toHaveFocus())
    await user.keyboard('{Enter}')
    expect(selected).toHaveBeenCalledWith('copy')
    expect(screen.getByRole('button', { name: 'IT-1042' })).toHaveFocus()
  })
})
