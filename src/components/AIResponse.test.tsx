import { act, fireEvent, render, screen, within } from '@testing-library/react'
import type { AnchorHTMLAttributes } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LinkProvider } from './LinkProvider.js'
import { AIResponse, AIResponseContent, AIResponseThinking, safeHref } from './ui/ai-response.js'

/** The application's link, as a router's would be: it says it drew the link. */
function AppLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a data-app-link="" {...props} />
}

const ANSWER = `## The verdict

It can be **believed**: 42 trades on 21 days, see [the run](/runs/42) and [the docs](https://example.com/guide).

| Figure | Value |
| --- | --- |
| Trades | 42 |

- one
- two \`code\`

\`\`\`json
{"trades": 42}
\`\`\``

describe('safeHref', () => {
  it('lets through web and mail addresses, and same-site ones as written', () => {
    expect(safeHref('https://example.com/a?b=1')).toBe('https://example.com/a?b=1')
    expect(safeHref('mailto:someone@example.com')).toBe('mailto:someone@example.com')
    expect(safeHref('/runs/42')).toBe('/runs/42')
    expect(safeHref('#part')).toBe('#part')
  })

  it('refuses scripts, data, obfuscated schemes and addresses that carry credentials', () => {
    for (const address of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'java\tscript:alert(1)', ' javascript:alert(1)',
      'data:text/html,<b>x</b>', 'vbscript:x', 'file:///etc/passwd', 'https://trusted.com@evil.example/', '', null]) {
      expect(safeHref(address)).toBeNull()
    }
  })
})

describe('AIResponse', () => {
  it('draws markdown: headings, a table in its own frame, lists, inline code and a fence in the code block', () => {
    render(<AIResponse content={ANSWER} modelName="Claude Opus 5.5" />)

    expect(screen.getByRole('heading', { name: 'The verdict' })).toBeInTheDocument()
    expect(screen.getByText('believed').tagName).toBe('STRONG')
    expect(screen.getByRole('table').parentElement).toHaveClass('relative', 'overflow-x-auto')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('code').tagName).toBe('CODE')
    expect(screen.getByText('json')).toBeInTheDocument()
    expect(screen.getByText('Claude Opus 5.5')).toBeInTheDocument()
  })

  it("draws a same-site link with the application's link, and an outside one in a new tab", () => {
    render(
      <LinkProvider component={AppLink}>
        <AIResponse content={ANSWER} />
      </LinkProvider>,
    )

    const run = screen.getByRole('link', { name: 'the run' })
    expect(run).toHaveAttribute('href', '/runs/42')
    expect(run).toHaveAttribute('data-app-link')
    expect(run).not.toHaveAttribute('target')
    const docs = screen.getByRole('link', { name: 'the docs' })
    expect(docs).toHaveAttribute('target', '_blank')
    expect(docs.getAttribute('rel')).toContain('noopener')
    expect(docs).not.toHaveAttribute('data-app-link')
  })

  it('never makes a link of a dangerous address', () => {
    render(<AIResponse content="Click [here](javascript:alert(1)) now" />)

    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText('here')).toBeInTheDocument()
  })

  it('renders a stream as it comes: an unclosed fence, a caret, and busy while it streams', () => {
    const { container } = render(<AIResponse status="streaming" content={'Reading it.\n\n```ts\nconst a = 1'} />)

    expect(screen.getByRole('article', { name: 'AI response' })).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('const')).toBeInTheDocument()
    expect(container.querySelector('[data-caret]')).not.toBeNull()
    expect(screen.getByText('Streaming')).toBeInTheDocument()
  })

  it('says an error with a way to try again, and a stop', () => {
    const again = vi.fn()
    const { rerender } = render(<AIResponse status="error" content="The API was out of reach." onRegenerate={again} />)

    const alert = screen.getByRole('alert')
    expect(within(alert).getByText('The API was out of reach.')).toBeInTheDocument()
    fireEvent.click(within(alert).getByRole('button', { name: 'Try again' }))
    expect(again).toHaveBeenCalledOnce()

    rerender(<AIResponse status="cancelled" content="Half an answer" />)
    expect(screen.getByText('Stopped')).toBeInTheDocument()
  })

  it('copies, regenerates only once done, and keeps the feedback pressed', () => {
    const regenerate = vi.fn()
    const feedback = vi.fn()
    const { rerender } = render(<AIResponse content="Done." status="streaming" onRegenerate={regenerate} onFeedback={feedback} />)
    expect(screen.getByRole('button', { name: 'Regenerate response' })).toBeDisabled()

    rerender(<AIResponse content="Done." onRegenerate={regenerate} onFeedback={feedback} feedback="like" />)
    expect(screen.getByRole('button', { name: 'Good response' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Poor response' }))
    expect(feedback).toHaveBeenCalledWith('dislike')
    expect(screen.getByRole('button', { name: 'Poor response' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Regenerate response' }))
    expect(regenerate).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Copy response' })).toBeInTheDocument()
  })

  it('shows no feedback without somewhere to send it, and no badge without a model', () => {
    render(<AIResponse content="Done." />)

    expect(screen.queryByRole('button', { name: 'Good response' })).toBeNull()
    expect(screen.getByText('Assistant').nextElementSibling).toBeNull()
  })

  it('lists its sources: a same-site one is the application link, an outside one opens a new tab', () => {
    render(
      <LinkProvider component={AppLink}>
        <AIResponse content="Done." sources={[
          { id: 1, title: 'Run 42', url: '/runs/42', snippet: '42 trades' },
          { id: 2, title: 'Guide', url: 'https://example.com/guide' },
          { id: 3, title: 'Blocked', url: 'javascript:alert(1)' },
        ]} />
      </LinkProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /Sources/ }))
    expect(screen.getByRole('link', { name: /Run 42/ })).toHaveAttribute('data-app-link')
    expect(screen.getByRole('link', { name: /Guide/ })).toHaveAttribute('target', '_blank')
    expect(screen.queryByRole('link', { name: /Blocked/ })).toBeNull()
  })

  it('can be composed of its parts', () => {
    render(
      <AIResponse content="Only the text.">
        <AIResponseContent />
      </AIResponse>,
    )
    expect(screen.getByText('Only the text.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Copy response' })).toBeNull()
  })
})

describe('AIResponseThinking', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('says what it does and for how long in place of a skeleton, the word said once, and nothing to copy yet', () => {
    vi.useFakeTimers({ now: Date.parse('2026-10-30T15:40:00Z') })
    render(
      <AIResponse status="generating" thinking={{ label: 'Waiting for 3 runs', since: '2026-10-30T15:33:48Z',
        lines: ['r1: done', 'r2: signals, 288 of 356'] }} />,
    )

    // Only what it does is read out as it changes.
    expect(screen.getByText('Waiting for 3 runs').closest('[role="status"]')).toHaveTextContent(/^Waiting for 3 runs$/)
    expect(screen.getByText('6 min 12 s')).toBeInTheDocument()
    expect(screen.getByText('r1: done')).toBeInTheDocument()
    expect(screen.queryByText('Thinking')).toBeNull()
    expect(screen.queryByRole('status', { name: 'Generating response' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Copy response' })).toBeNull()

    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(screen.getByText('7 min 12 s')).toBeInTheDocument()
  })

  it('keeps its skeleton and its word without anything said of what it does', () => {
    render(<AIResponse status="generating" />)

    expect(screen.getByRole('status', { name: 'Generating response' })).toBeInTheDocument()
    expect(screen.getByText('Thinking')).toBeInTheDocument()
  })

  it('turns its lines, holds them while the pointer is on them, and keeps a line that grows in its place', () => {
    vi.useFakeTimers()
    const { rerender } = render(<AIResponseThinking label="Thinking" lines={['One.', 'Two.', 'Three.']} interval={4} />)
    expect(screen.getByText('One.')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(4_000)
    })
    expect(screen.getByText('Two.')).toBeInTheDocument()

    fireEvent.pointerEnter(screen.getByText('Two.').parentElement!)
    act(() => {
      vi.advanceTimersByTime(12_000)
    })
    expect(screen.queryByText('Three.')).toBeNull()

    // Rewritten as it streams, the line shown stays in its place.
    rerender(<AIResponseThinking label="Thinking" lines={['One.', 'Two, and more.', 'Three.']} interval={4} />)
    expect(screen.getByText('Two, and more.')).toBeInTheDocument()

    fireEvent.pointerLeave(screen.getByText('Two, and more.').parentElement!)
    act(() => {
      vi.advanceTimersByTime(4_000)
    })
    expect(screen.getByText('Three.')).toBeInTheDocument()
  })

  it('says a single line without turning it, and none without lines', () => {
    vi.useFakeTimers()
    const { container, rerender } = render(<AIResponseThinking label="Thinking" lines={['Only this.']} />)
    act(() => {
      vi.advanceTimersByTime(20_000)
    })
    expect(screen.getByText('Only this.')).toBeInTheDocument()

    rerender(<AIResponseThinking label="Thinking" />)
    expect(container.querySelector('p')).toBeNull()
  })
})

