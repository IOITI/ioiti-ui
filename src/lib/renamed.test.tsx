import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import type { Ref } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { renamed } from './renamed.js'

const DEPRECATED = /^ioiti-ui: a name or a value the package deprecated/

/** From now on, what the package says of a deprecated name given. */
function watchWarnings(): () => string[] {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  return () => warn.mock.calls.map(([message]) => String(message)).filter((message) => DEPRECATED.test(message))
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

/** A component of the package's kind, generic: its options and what it is told of share their type. */
function Choices<T extends string>({ options, onChoose, ref }: { options: readonly T[]; onChoose?: (option: T) => void; ref?: Ref<HTMLUListElement> }) {
  return (
    <ul ref={ref} aria-label="Plans">
      {options.map((option) => (
        <li key={option}>
          <button type="button" onClick={() => onChoose?.(option)}>
            {option}
          </button>
        </li>
      ))}
    </ul>
  )
}

describe('a component under its former name', () => {
  it('draws the component, with the props it is given, its ref too', () => {
    const Former = renamed(Choices, 'SpringSelect')
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container: today } = render(<Choices options={['solo', 'team']} />)
    const ref = createRef<HTMLUListElement>()
    const chosen = vi.fn()
    const { container: former } = render(<Former options={['solo', 'team']} onChoose={chosen} ref={ref} />)

    expect(former.innerHTML).toBe(today.innerHTML)
    expect(ref.current).toBe(former.querySelector('ul'))
    screen.getAllByRole('button', { name: 'team' })[1].click()
    expect(chosen).toHaveBeenCalledWith('team')
  })

  it('says once, in development, the former name and what replaces it', () => {
    const said = watchWarnings()
    const Former = renamed(Choices, 'SettleModal')
    const { rerender } = render(<Former options={['solo']} />)
    rerender(<Former options={['team']} />)
    render(<Former options={['solo']} />)

    expect(said()).toHaveLength(1)
    expect(said()[0]).toContain('(SettleModal: Dialog)')
  })

  it('is named by its former name', () => {
    const Former = renamed(Choices, 'SmoothAccordion')
    expect((Former as { displayName?: string }).displayName).toBe('SmoothAccordion')
    expect(Former).not.toBe(Choices)
  })

  it('keeps the generics of the component it draws, and takes only a former name the package lists', () => {
    const Former = renamed(Choices, 'AnimatedTabs')
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const chosen: string[] = []
    // `option` is the options' type ('solo' | 'team'), as with the component itself.
    render(<Former options={['solo', 'team'] as const} onChoose={(option: 'solo' | 'team') => chosen.push(option)} />)
    // @ts-expect-error -- an option it was not given: what it is told of is of the options' type
    render(<Former options={['solo', 'team'] as const} onChoose={(option: 'free') => chosen.push(option)} />)
    // @ts-expect-error -- a name the package never deprecated
    renamed(Choices, 'Choices')
    expect(screen.getAllByRole('list', { name: 'Plans' })).toHaveLength(2)
  })

  it('is the component itself in production, which says nothing', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const said = watchWarnings()
    const Former = renamed(Choices, 'DynamicIsland')
    render(<Former options={['solo']} />)

    expect(Former).toBe(Choices)
    expect(said()).toEqual([])
  })
})
