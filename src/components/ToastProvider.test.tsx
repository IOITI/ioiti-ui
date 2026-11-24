import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useEffect } from 'react'
import type { ComponentProps } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { LinkProvider } from './LinkProvider.js'
import { useToast } from './toast-context.js'
import { ToastProvider } from './ToastProvider.js'
import { VelocityToast } from './ui/velocity-toast.js'

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
      show({ title: 'Export requested', tone: 'success' })
      show({ title: 'Export ready', tone: 'success' })
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

  it('keeps what went wrong (danger) on screen longer', async () => {
    renderProvider()

    act(() => show({ title: 'The mail server does not answer', tone: 'danger' }))

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

    act(() => show({ title: 'Deploy failed', tone: 'danger', action: { label: 'Open the job', href: '/ops/jobs/7' } }))

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

  it('says a toast in a live region there from the start, an error at once, never in a region of its own', async () => {
    renderProvider()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('alert')).toBeEmptyDOMElement()
    act(() => show({ title: 'Export requested', description: 'It arrives by mail.' }))
    await advance(0)
    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('Export requested')
    expect(screen.getByRole('alert')).toBeEmptyDOMElement()
  })

  it('says what went wrong (danger) at once, in the region that alerts', async () => {
    renderProvider()
    act(() => show({ title: 'Could not send the invoice', tone: 'danger' }))
    await advance(0)
    expect(screen.getByRole('alert')).toHaveTextContent('Could not send the invoice')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})

describe("a toast's tone, and its former variant", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  // First: a deprecated name is said once in a run, whatever said it before.
  it('is drawn by its tone, the icon its own, nothing said of a name deprecated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const icon = (frame: HTMLElement) => frame.querySelector('.size-8 > svg')
    const { rerender } = render(<VelocityToast open title="Could not print the labels" tone="danger" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Could not print the labels')
    expect(icon(screen.getByRole('alert'))).toHaveClass('text-negative')
    rerender(<VelocityToast open title="Labels printed" tone="success" />)
    expect(icon(screen.getByRole('status'))).toHaveClass('text-positive')
    rerender(<VelocityToast open title="Draft saved" />)
    expect(icon(screen.getByRole('status'))).toHaveClass('text-muted-foreground')
    renderProvider()
    act(() => show({ title: 'Saved', tone: 'success' }))
    expect(warn).not.toHaveBeenCalled()
  })

  it("reads useToast's variant as its tone (error as danger), and says once in development that it is deprecated", async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    renderProvider()
    act(() => show({ title: 'The mail server does not answer', variant: 'error' }))
    await waitFor(() => expect(screen.getAllByRole('alert').at(-1)).toHaveTextContent('The mail server does not answer'))
    act(() => show({ title: 'Sent anyway', variant: 'default' }))
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toMatch(/^ioiti-ui: a name or a value the package deprecated/)
    expect(String(warn.mock.calls[0][0])).toContain("(useToast's variant: tone, its values too: default is neutral, error is danger)")
  })

  it("reads VelocityToast's variant as its tone, the tone given over it, and says so once", () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { rerender } = render(<VelocityToast open title="Could not print the labels" variant="error" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Could not print the labels')
    rerender(<VelocityToast open title="Could not print the labels" variant="default" />)
    expect(screen.getByRole('status')).toHaveTextContent('Could not print the labels')
    rerender(<VelocityToast open title="Could not print the labels" variant="default" tone="danger" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Could not print the labels')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toContain("(VelocityToast's variant: tone, its values too: default is neutral, error is danger)")
  })
})


describe('a toast in a language', () => {
  it("names its close button in the language given, or in an application's own word", () => {
    const { unmount } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <ToastProvider>
          <Capture />
        </ToastProvider>
      </IoitiProvider>,
    )
    act(() => show({ title: 'Export prêt' }))
    expect(screen.getByRole('button', { name: 'Fermer la notification' })).toBeInTheDocument()
    unmount()

    render(
      <IoitiProvider messages={{ toast: { close: 'Dismiss' } }}>
        <VelocityToast open title="Export ready" />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
  })
})
