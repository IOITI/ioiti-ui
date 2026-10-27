import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AutoRefresh, TimeRangePicker } from './TimeRangePicker.js'

describe('TimeRangePicker', () => {
  it('says its range as people say it, and refreshes it', async () => {
    const user = userEvent.setup()
    const refreshed = vi.fn()
    render(<TimeRangePicker onRefresh={refreshed} />)

    expect(screen.getByRole('button', { name: 'Last 15 minutes: show its start and its end' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Refresh' }))
    expect(refreshed).toHaveBeenCalledWith({ from: 'now-15m', to: 'now' })
  })

  it('applies a range commonly used in two clicks, then lists it as recently used', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<TimeRangePicker onChange={changed} />)

    await user.click(screen.getByRole('button', { name: 'Quick select' }))
    const panel = screen.getByRole('dialog', { name: 'Quick select' })
    await user.click(within(panel).getByRole('button', { name: 'Last 7 days' }))
    expect(changed).toHaveBeenCalledWith({ from: 'now-7d', to: 'now' })
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Quick select' })).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: /^Last 7 days/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Quick select' }))
    const again = screen.getByRole('dialog', { name: 'Quick select' })
    expect(within(within(again).getByRole('region', { name: 'Recently used' })).getByRole('button', { name: 'Last 7 days' })).toBeInTheDocument()
  })

  it('applies a span from its quick select', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<TimeRangePicker onChange={changed} />)

    await user.click(screen.getByRole('button', { name: 'Quick select' }))
    const panel = screen.getByRole('dialog', { name: 'Quick select' })
    const count = within(panel).getByRole('spinbutton', { name: 'How many' })
    await user.clear(count)
    await user.type(count, '2')
    await user.selectOptions(within(panel).getByRole('combobox', { name: 'Unit' }), 'h')
    await user.click(within(panel).getByRole('button', { name: 'Apply' }))
    expect(changed).toHaveBeenCalledWith({ from: 'now-2h', to: 'now' })
  })

  it('sets an end by itself, and applies it with Update', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<TimeRangePicker defaultValue={{ from: 'now-15m', to: 'now' }} onChange={changed} />)

    await user.click(screen.getByRole('button', { name: /show its start and its end/ }))
    await user.click(screen.getByRole('button', { name: '15 minutes ago' }))
    const start = screen.getByRole('dialog', { name: 'The start of the range' })
    expect(within(start).getByRole('tab', { name: 'Relative' })).toHaveAttribute('aria-selected', 'true')

    const count = within(start).getByRole('spinbutton', { name: 'How many' })
    await user.clear(count)
    await user.type(count, '3')
    await user.selectOptions(within(start).getByRole('combobox', { name: 'Unit' }), 'd')
    await user.keyboard('{Escape}')

    await user.click(screen.getByRole('button', { name: 'Update' }))
    expect(changed).toHaveBeenLastCalledWith({ from: 'now-3d', to: 'now' })
  })
})

describe('refreshing on a timer', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('refreshes every interval, not while stopped', () => {
    vi.useFakeTimers()
    const refreshed = vi.fn()
    const { rerender } = render(<AutoRefresh value={{ interval: 1000, paused: false }} onChange={() => {}} onRefresh={refreshed} />)
    expect(screen.getByRole('button', { name: 'Every 1 s' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(refreshed).toHaveBeenCalledTimes(3)

    rerender(<AutoRefresh value={{ interval: 1000, paused: true }} onChange={() => {}} onRefresh={refreshed} />)
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(refreshed).toHaveBeenCalledTimes(3)
    expect(screen.getByRole('button', { name: 'Off' })).toBeInTheDocument()
  })

  it('waits while the page is hidden', () => {
    vi.useFakeTimers()
    const refreshed = vi.fn()
    render(<AutoRefresh value={{ interval: 1000, paused: false }} onChange={() => {}} onRefresh={refreshed} />)

    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
      vi.advanceTimersByTime(3000)
    })
    expect(refreshed).not.toHaveBeenCalled()

    visibility.mockReturnValue('visible')
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
      vi.advanceTimersByTime(1000)
    })
    expect(refreshed).toHaveBeenCalledOnce()
    visibility.mockRestore()
  })
})
