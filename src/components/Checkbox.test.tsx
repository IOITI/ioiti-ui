import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { DrawCheckbox } from './ui/draw-checkbox.js'

describe('the check box (EasyUI’s draw-checkbox)', () => {
  it('is a real check box, checked by a click on it or on its label, its ref the input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const ref = createRef<HTMLInputElement>()
    render(<DrawCheckbox ref={ref} label="Keep me signed in" description="On this browser only" onChange={onChange} />)
    const box = screen.getByRole('checkbox', { name: 'Keep me signed in' })
    expect(box).toHaveAccessibleDescription('On this browser only')
    expect(ref.current).toBe(box)

    await user.click(box)
    expect(box).toBeChecked()
    await user.click(screen.getByText('On this browser only'))
    expect(box).not.toBeChecked()
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('says it is indeterminate, as it draws it, and nothing when it is disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<DrawCheckbox aria-label="Every row" checked={false} indeterminate onChange={onChange} />)
    const box = screen.getByRole('checkbox', { name: 'Every row' }) as HTMLInputElement
    expect(box.indeterminate).toBe(true)

    rerender(<DrawCheckbox aria-label="Every row" checked indeterminate={false} onChange={onChange} />)
    expect(box.indeterminate).toBe(false)
    expect(box).toBeChecked()

    rerender(<DrawCheckbox aria-label="Every row" checked={false} disabled onChange={onChange} />)
    await user.click(box)
    expect(onChange).not.toHaveBeenCalled()
  })
})
