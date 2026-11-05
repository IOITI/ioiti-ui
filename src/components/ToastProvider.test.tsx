import { act, fireEvent, render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import type { ComponentProps } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LinkProvider } from './LinkProvider.js'
import { useToast } from './toast-context.js'
import { ToastProvider } from './ToastProvider.js'

let show: ReturnType<typeof useToast>

/** Hands the provider's function to the test. */
function Capture() {
  const toast = useToast()
  useEffect(() => {
    show = toast
  }, [toast])
  return null
}

function renderProvider() {
  render(
    <ToastProvider>
      <Capture />
    </ToastProvider>,
  )
}

/** The application's link, as a router's would be: marked, to be told from a plain `<a>`. */
function AppLink(props: ComponentProps<'a'>) {
  return <a data-link="app" {...props} />
}

/** Let the toast's own clock (animation frames) run for `ms`. */
async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
}

// framer-motion draws on the window's own frames, which it took before the clock was faked and which
// keep real time, and reads the faked clock: an animation (a toast leaving) starts on one of its
// frames, at the time it reads then, and moves on as the clock is advanced, on its next frames.
const realTimeout = globalThis.setTimeout

async function nextFrame() {
  await act(async () => {
    await new Promise((resolve) => realTimeout(resolve, 50))
  })
}

/** A toast dismissed leaves: its exit starts, plays (easeExit's 150 ms, and more) and ends. */
async function leave() {
  await nextFrame()
  await advance(400)
  await nextFrame()
}

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a second toast after the first one instead of replacing it', async () => {
    renderProvider()

    act(() => {
      show({ title: 'Export requested', variant: 'success' })
      show({ title: 'Export ready', variant: 'success' })
    })

    expect(screen.getByText('Export requested')).toBeInTheDocument()
    expect(screen.queryByText('Export ready')).not.toBeInTheDocument()

    // With another one waiting, the first stays 2.5 seconds.
    await advance(2000)
    expect(screen.getByText('Export requested')).toBeInTheDocument()
    // Then it leaves, its exit played, and the second one comes.
    await advance(1000)
    await leave()
    expect(screen.getByText('Export ready')).toBeInTheDocument()
  })

  it('lets a toast leave, its exit played, before the next one comes', async () => {
    renderProvider()

    act(() => {
      show({ title: 'Export requested' })
      show({ title: 'Export ready' })
    })

    // Its 2.5 seconds over, it is leaving: still drawn, the next one not yet.
    await advance(2520)
    await nextFrame()
    expect(screen.getByText('Export requested')).toBeInTheDocument()
    expect(screen.queryByText('Export ready')).not.toBeInTheDocument()

    await advance(400)
    await nextFrame()
    expect(screen.queryByText('Export requested')).not.toBeInTheDocument()
    expect(screen.getByText('Export ready')).toBeInTheDocument()
  })

  it('keeps an error on screen longer', async () => {
    renderProvider()

    act(() => show({ title: 'The mail server does not answer', variant: 'error' }))

    await advance(6000)
    expect(screen.getByText('The mail server does not answer')).toBeInTheDocument()
  })

  it('leads on to where its news is dealt with: a link, the application\'s; followed, the toast leaves', async () => {
    render(
      <LinkProvider component={AppLink}>
        <ToastProvider>
          <Capture />
        </ToastProvider>
      </LinkProvider>,
    )

    act(() => show({ title: 'Deploy failed', variant: 'error', action: { label: 'Open the job', href: '/ops/jobs/7' } }))

    const link = screen.getByRole('link', { name: 'Open the job' })
    expect(link).toHaveAttribute('href', '/ops/jobs/7')
    expect(link).toHaveAttribute('data-link', 'app')
    fireEvent.click(link)
    await leave()
    expect(screen.queryByText('Deploy failed')).not.toBeInTheDocument()
  })

  it('does what its button says, and leaves', async () => {
    const retry = vi.fn()
    renderProvider()

    act(() => show({ title: 'Could not save', action: { label: 'Retry', onClick: retry } }))

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(retry).toHaveBeenCalledOnce()
    await leave()
    expect(screen.queryByText('Could not save')).not.toBeInTheDocument()
  })

  it('gives a toast with something to do the time to reach it, even with others waiting', async () => {
    renderProvider()

    act(() => {
      show({ title: 'Import ready', action: { label: 'Review it', href: '/imports/3' } })
      show({ title: 'Next one' })
    })

    // Another waits: a plain one would have left at 2.5 s.
    await advance(5000)
    expect(screen.getByText('Import ready')).toBeInTheDocument()
    await advance(1500)
    await leave()
    expect(screen.getByText('Next one')).toBeInTheDocument()
  })

  it('stops its time while the keyboard is in it', async () => {
    renderProvider()

    act(() => show({ title: 'Import ready', action: { label: 'Review it', onClick: () => {} } }))

    act(() => screen.getByRole('button', { name: 'Review it' }).focus())
    await advance(10_000)
    expect(screen.getByText('Import ready')).toBeInTheDocument()
  })

  it('drops the oldest waiting toasts of a burst', () => {
    renderProvider()

    act(() => {
      for (let index = 1; index <= 10; index += 1) show({ title: `Event ${index}` })
    })

    // Ten arrived, six are kept: the fifth is the oldest left.
    expect(screen.getByText('Event 5')).toBeInTheDocument()
  })
})
