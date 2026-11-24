import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { OTPInput } from './ui/otp-input.js'

// As the login page has it: left to itself, each digit stays in the box it was typed in.
function renderCode() {
  const onComplete = vi.fn()
  render(<OTPInput id="code" aria-label="One-time code" onComplete={onComplete} />)
  const boxes = screen.getAllByRole('textbox') as HTMLInputElement[]
  return { boxes, onComplete, values: () => boxes.map((box) => box.value).join('|') }
}

describe('the one-time code', () => {
  it('moves on a box at each digit, back at Backspace, and says when the code is whole', async () => {
    const user = userEvent.setup()
    const { boxes, onComplete, values } = renderCode()
    expect(screen.getByRole('group', { name: 'One-time code' })).toBeInTheDocument()
    expect(boxes[0]).toHaveAttribute('id', 'code')

    await user.click(boxes[0])
    await user.keyboard('12a3')
    expect(values()).toBe('1|2|3|||')
    expect(boxes[3]).toHaveFocus()
    await user.keyboard('{Backspace}')
    expect(values()).toBe('1|2||||')
    await user.keyboard('3456')
    expect(onComplete).toHaveBeenCalledWith('123456')
  })

  it('takes several digits arriving in one box, as an autofill or a keyboard gives them', () => {
    const { boxes, onComplete, values } = renderCode()

    // A few digits go on from the box they arrived in.
    fireEvent.change(boxes[1], { target: { value: '0128' } })
    expect(values()).toBe('|0|1|2|8|')
    expect(boxes[5]).toHaveFocus()
    expect(onComplete).not.toHaveBeenCalled()

    // A whole code fills every box, wherever it arrived.
    fireEvent.change(boxes[3], { target: { value: '654 321' } })
    expect(values()).toBe('6|5|4|3|2|1')
    expect(onComplete).toHaveBeenLastCalledWith('654321')
  })

  it('replaces a box’s digit by one typed beside it, and keeps it when only a letter is', () => {
    const { boxes, values } = renderCode()
    fireEvent.change(boxes[0], { target: { value: '3' } })

    fireEvent.change(boxes[0], { target: { value: '3x' } })
    expect(values()).toBe('3|||||')
    fireEvent.change(boxes[0], { target: { value: '37' } })
    expect(values()).toBe('7|||||')
  })
})

describe('the one-time code, held', () => {
  it('by its boxes from defaultValue, the page told of the code and of its end', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    const completed = vi.fn()
    render(<OTPInput aria-label="Code" length={4} defaultValue="12" onChange={changed} onComplete={completed} />)
    const boxes = screen.getAllByRole('textbox') as HTMLInputElement[]
    expect(boxes.map((box) => box.value).join('|')).toBe('1|2||')

    await user.click(boxes[2])
    await user.keyboard('34')
    expect(changed).toHaveBeenLastCalledWith('1234')
    expect(completed).toHaveBeenCalledWith('1234')
  })

  it('by the page (value): its boxes show the page’s code, a digit typed told and shown once the page takes it', () => {
    const changed = vi.fn()
    const { rerender } = render(<OTPInput aria-label="Code" length={4} value="12" onChange={changed} />)
    const boxes = screen.getAllByRole('textbox') as HTMLInputElement[]
    fireEvent.change(boxes[2], { target: { value: '3' } })
    expect(changed).toHaveBeenLastCalledWith('123')
    expect(boxes.map((box) => box.value).join('|')).toBe('1|2||')

    rerender(<OTPInput aria-label="Code" length={4} value="123" onChange={changed} />)
    expect(boxes.map((box) => box.value).join('|')).toBe('1|2|3|')
  })
})
