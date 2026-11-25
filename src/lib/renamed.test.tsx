import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import type { Ref } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { renamed } from './renamed.js'

// The list is empty from 1.0 until a minor version renames again: these tests give their own former name.
vi.mock('./deprecations.js', () => ({
  DEPRECATIONS: {
    'test-former': { kind: 'export', old: 'FormerChoices', new: 'Choices', since: '1.1.0' },
    'test-said': { kind: 'export', old: 'SaidChoices', new: 'Choices', since: '1.1.0' },
  },
}))

/** Former names of the list, as a minor version fills it (their type is the list's: none in 1.0). A warning is said once
 * a name: the test that hears it has one of its own. */
const FORMER = 'FormerChoices' as never
const SAID = 'SaidChoices' as never

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
    const Former = renamed(Choices, FORMER)
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
    const Former = renamed(Choices, SAID)
    const { rerender } = render(<Former options={['solo']} />)
    rerender(<Former options={['team']} />)
    render(<Former options={['solo']} />)

    expect(said()).toHaveLength(1)
    expect(said()[0]).toContain('(SaidChoices: Choices)')
  })

  it('is named by its former name', () => {
    const Former = renamed(Choices, FORMER)
    expect((Former as { displayName?: string }).displayName).toBe('FormerChoices')
    expect(Former).not.toBe(Choices)
  })

  it('keeps the generics of the component it draws, and takes only a former name the package lists', () => {
    const Former = renamed(Choices, FORMER)
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
    const Former = renamed(Choices, FORMER)
    render(<Former options={['solo']} />)

    expect(Former).toBe(Choices)
    expect(said()).toEqual([])
  })
})
