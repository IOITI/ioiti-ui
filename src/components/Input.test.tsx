import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Field } from './Field.js'
import { Input, Select, Textarea } from './ui/form.js'

describe('Input with its units', () => {
  it('draws a unit before or after the value, and a screen reader hears it with the field', () => {
    render(
      <>
        <Field label="Timeout">
          <Input suffix="ms" defaultValue="250" />
        </Field>
        <Field label="Site">
          <Input prefix="https://" defaultValue="example.com" aria-describedby="site-help" />
        </Field>
        <p id="site-help">Without a path</p>
      </>,
    )
    expect(screen.getByRole('textbox', { name: 'Timeout' })).toHaveAccessibleDescription('ms')
    expect(screen.getByRole('textbox', { name: 'Site' })).toHaveAccessibleDescription('Without a path https://')
  })

  it('is as it was without them', () => {
    render(<Input aria-label="Name" />)
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('aria-describedby')
  })
})

describe('what is typed in a field', () => {
  it('is body-size, and 16px on a phone, where a smaller field zooms the page in when it takes the focus', () => {
    render(
      <>
        <Input aria-label="Name" />
        <Textarea aria-label="Note" />
        <Select aria-label="Status" options={[{ value: 'open', label: 'Open' }]} />
      </>,
    )
    for (const field of [
      screen.getByRole('textbox', { name: 'Name' }),
      screen.getByRole('textbox', { name: 'Note' }),
      screen.getByRole('combobox', { name: 'Status' }),
    ]) {
      expect(field).toHaveClass('text-base', 'sm:text-sm')
    }
  })
})

describe('the room a field keeps for its unit', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('follows the unit as it changes size (16px on a phone, then 14px from 640px; a web font arriving late)', () => {
    let width = 75
    let resized = () => {}
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resized = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    const offsetWidth = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(() => width)
    render(<Input aria-label="Site" prefix="https://" />)
    const field = screen.getByRole('textbox', { name: 'Site' })
    expect(field).toHaveStyle({ paddingLeft: '75px' })

    width = 68
    act(() => resized())
    expect(field).toHaveStyle({ paddingLeft: '68px' })
    offsetWidth.mockRestore()
  })
})
