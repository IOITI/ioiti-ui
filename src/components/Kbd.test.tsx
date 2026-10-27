import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Kbd } from './Kbd.js'

describe('Kbd', () => {
  it('draws a key named as it is', () => {
    const { container } = render(<Kbd>Esc</Kbd>)
    expect(container.querySelector('kbd')).toHaveTextContent('Esc')
  })

  it('draws a shortcut key by key, said in words to a screen reader', () => {
    // jsdom names no platform: the keys are those of a computer that is not Apple's.
    const { container } = render(<Kbd keys="mod+k" />)
    const outer = container.firstElementChild as HTMLElement
    expect(outer.tagName).toBe('KBD')
    expect(Array.from(outer.querySelectorAll('kbd')).map((key) => key.textContent)).toEqual(['Ctrl', 'K'])
  })

  it('says a sequence as one key, then the next', () => {
    const { container } = render(<Kbd keys="g o" />)
    expect(container.textContent).toBe('G·thenO')
  })
})
