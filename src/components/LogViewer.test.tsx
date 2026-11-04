import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { blocksInSight, findInLog, logLevel, matchParts, splitLog } from '../lib/log.js'
import { LogViewer } from './LogViewer.js'

const lineNumbers = (container: HTMLElement) => [...container.querySelectorAll('[data-line]')].map((line) => Number(line.getAttribute('data-line')))

afterEach(() => vi.restoreAllMocks())

describe('what LogViewer reads in a log', () => {
  it('tells errors, warnings and information apart', () => {
    expect(logLevel('2026-11-04 12:00:01 ERROR upload failed')).toBe('error')
    expect(logLevel('Traceback (most recent call last):')).toBe('error')
    expect(logLevel('error: no such file')).toBe('error')
    expect(logLevel('WARNING: rule 42 is deprecated')).toBe('warning')
    expect(logLevel('INFO  loaded 4133 rules')).toBe('info')
    expect(logLevel('loaded 4133 rules, no errors here')).toBeNull()
  })

  it('cuts a text into lines, a last line break ending the last line', () => {
    expect(splitLog('a\r\nb\n')).toEqual(['a', 'b'])
    expect(splitLog('')).toEqual([])
  })

  it('finds the lines a search asks for, whatever their case, and the parts that match', () => {
    expect(findInLog(['Build sandbox', 'deploy', 'BUILD prod'], 'build')).toEqual([0, 2])
    expect(matchParts('a Build b build', 'build')).toEqual([
      { text: 'a ', match: false },
      { text: 'Build', match: true },
      { text: ' b ', match: false },
      { text: 'build', match: true },
    ])
  })

  it('draws the blocks in sight, one more on each side, and the space of the others', () => {
    const height = () => 2000
    expect(blocksInSight(10, height, 0, 600)).toEqual({ first: 0, last: 1, before: 0, after: 16000 })
    expect(blocksInSight(10, height, 9000, 600)).toEqual({ first: 3, last: 5, before: 6000, after: 8000 })
  })
})

describe('LogViewer', () => {
  it('shows numbered lines under its name, errors and warnings in their tones', () => {
    const { container } = render(<LogViewer label="Build log" lines={['start', 'WARN slow', 'ERROR failed']} />)
    expect(screen.getByRole('log', { name: 'Build log' })).toBeInTheDocument()
    expect(lineNumbers(container)).toEqual([1, 2, 3])
    expect(screen.getByText('ERROR failed')).toHaveClass('text-(--negative)')
    expect(screen.getByText('WARN slow')).toHaveClass('text-(--warning)')
    expect(screen.getByText('start')).not.toHaveClass('text-(--negative)')
  })

  it('keeps the last lines only, and says how many were dropped', () => {
    const lines = Array.from({ length: 30 }, (_, index) => `line ${index + 1}`)
    const { container } = render(<LogViewer label="Build log" lines={lines} maxLines={10} droppedLines={5} />)
    expect(screen.getByText('25 earlier lines dropped')).toBeInTheDocument()
    expect(lineNumbers(container)[0]).toBe(26)
    expect(screen.getByText('line 30')).toBeInTheDocument()
    expect(screen.queryByText('line 20')).not.toBeInTheDocument()
  })

  it('draws only the lines in sight of a long log', () => {
    const lines = Array.from({ length: 100_000 }, (_, index) => `line ${index + 1}`)
    const { container } = render(<LogViewer label="Build log" lines={lines} maxLines={200_000} follow={false} />)
    const drawn = lineNumbers(container)
    expect(drawn[0]).toBe(1)
    expect(drawn.length).toBeLessThan(1000)
  })

  it('goes from one line found to the next, and brings it into sight', async () => {
    const user = userEvent.setup()
    const lines = Array.from({ length: 50_000 }, (_, index) => (index === 42_000 || index === 49_000 ? `deploy ${index + 1}` : `step ${index + 1}`))
    const { container } = render(<LogViewer label="Build log" lines={lines} follow={false} />)
    await user.type(screen.getByRole('textbox', { name: 'Search Build log' }), 'deploy')
    expect(screen.getByRole('status')).toHaveTextContent('1 of 2')
    expect(lineNumbers(container)).toContain(42_001)
    expect(screen.getByText('deploy', { selector: 'mark' })).toBeInTheDocument()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('status')).toHaveTextContent('2 of 2')
    expect(lineNumbers(container)).toContain(49_001)
    await user.click(screen.getByRole('button', { name: 'Next match' }))
    expect(screen.getByRole('status')).toHaveTextContent('1 of 2')
    await user.clear(screen.getByRole('textbox', { name: 'Search Build log' }))
    await user.type(screen.getByRole('textbox', { name: 'Search Build log' }), 'nowhere')
    expect(screen.getByRole('status')).toHaveTextContent('No match')
    expect(screen.getByRole('button', { name: 'Next match' })).toBeDisabled()
  })

  it('stops following when the reader scrolls up, and jumps to the end when asked', async () => {
    const user = userEvent.setup()
    render(<LogViewer label="Build log" lines={['a', 'b', 'c']} />)
    const log = screen.getByRole('log')
    Object.defineProperty(log, 'scrollHeight', { configurable: true, value: 2000 })
    Object.defineProperty(log, 'clientHeight', { configurable: true, value: 400 })
    expect(screen.queryByRole('button', { name: 'Jump to the end' })).not.toBeInTheDocument()
    log.scrollTop = 100
    fireEvent.scroll(log)
    await user.click(screen.getByRole('button', { name: 'Jump to the end' }))
    expect(log.scrollTop).toBe(2000)
    expect(screen.queryByRole('button', { name: 'Jump to the end' })).not.toBeInTheDocument()
  })

  it('wraps long lines when asked, and says it does', async () => {
    const user = userEvent.setup()
    render(<LogViewer label="Build log" lines={['a long line']} />)
    const toggle = screen.getByRole('button', { name: 'Wrap long lines' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('a long line')).toHaveClass('whitespace-pre-wrap')
  })

  it('downloads what it shows as a text file', async () => {
    const user = userEvent.setup()
    const made: Blob[] = []
    URL.createObjectURL = vi.fn((blob: Blob) => {
      made.push(blob)
      return 'blob:log'
    })
    URL.revokeObjectURL = vi.fn()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    render(<LogViewer label="Build log" text={'one\ntwo\n'} downloadName="build.log" />)
    await user.click(screen.getByRole('button', { name: 'Download the log' }))
    expect(click).toHaveBeenCalled()
    expect(await made[0].text()).toBe('one\ntwo\n')
  })

  it('says when nothing is logged yet, and keeps up with lines appended', () => {
    const { rerender, container } = render(<LogViewer label="Build log" lines={[]} />)
    expect(screen.getByText('Nothing logged yet.')).toBeInTheDocument()
    act(() => rerender(<LogViewer label="Build log" lines={['first']} />))
    act(() => rerender(<LogViewer label="Build log" lines={['first', 'second']} />))
    expect(lineNumbers(container)).toEqual([1, 2])
  })
})
