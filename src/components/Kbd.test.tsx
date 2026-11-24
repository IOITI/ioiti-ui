import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
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

describe('Kbd in French', () => {
  const caps = (container: HTMLElement) => Array.from(container.firstElementChild!.querySelectorAll('kbd')).map((key) => key.textContent)

  it('names its keys in the provider\'s language, a sequence too', () => {
    const { container, rerender } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Kbd keys="mod+shift+k" />
      </IoitiProvider>,
    )
    expect(caps(container)).toEqual(['Ctrl', 'Maj', 'K'])

    rerender(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Kbd keys="escape" />
      </IoitiProvider>,
    )
    expect(caps(container)).toEqual(['Échap'])

    rerender(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Kbd keys="g o" />
      </IoitiProvider>,
    )
    expect(container.textContent).toBe('G·puisO')
  })

  it('says a key drawn as a symbol in the provider\'s words', () => {
    const { container } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Kbd keys="shift+enter" />
      </IoitiProvider>,
    )
    // The symbol for the eye, its name for a screen reader.
    expect(container.querySelector('.sr-only')).toHaveTextContent('Entrée')
    expect(caps(container)).toEqual(['Maj', '↵Entrée'])
  })

  it("takes an application's own names", () => {
    const { container } = render(
      <IoitiProvider messages={{ keys: { then: 'and then', ctrl: 'Control' } }}>
        <Kbd keys="mod+g o" />
      </IoitiProvider>,
    )
    expect(container.textContent).toBe('ControlG·and thenO')
  })
})
