import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { NotFoundState } from '../shell/NotFoundState.js'
import { AIAgentActivity } from './ui/ai-agent-activity.js'
import { Alert } from './ui/alert.js'
import { AnimatedTabs } from './ui/animated-tabs.js'
import { AdvancedDataTable } from './ui/advanced-data-table.js'
import { ScrollProgressNav } from './ui/scroll-progress-nav.js'

describe('a page that is none, drawn in a part of a page', () => {
  it('leaves the focus where it is, when told to', () => {
    render(
      <>
        <button type="button" autoFocus>
          Where I am
        </button>
        <NotFoundState title="This invoice does not exist." description="It was removed." pathname="/invoices/9" focusOnMount={false} back={null} />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Where I am' })).toHaveFocus()
  })

  it('takes the focus to its heading by default: a page that replaces the page', () => {
    render(<NotFoundState title="This invoice does not exist." description="It was removed." pathname="/invoices/9" back={null} />)
    expect(screen.getByRole('heading', { level: 1, name: 'This invoice does not exist.' })).toHaveFocus()
  })
})

describe('a nav of the parts of a box', () => {
  function Box() {
    const box = useRef<HTMLDivElement>(null)
    return (
      <div ref={box} data-testid="box">
        <ScrollProgressNav
          mode="inline"
          containerRef={box}
          sections={[
            { id: 'one', label: 'One' },
            { id: 'two', label: 'Two' },
          ]}
        />
        <section id="one">One</section>
        <section id="two">Two</section>
      </div>
    )
  }

  it('scrolls its box alone, never the page around it', async () => {
    const user = userEvent.setup()
    render(<Box />)
    const box = screen.getByTestId('box')
    const scrollTo = vi.fn()
    box.scrollTo = scrollTo as unknown as typeof box.scrollTo
    const intoView = vi.fn()
    Element.prototype.scrollIntoView = intoView
    try {
      await user.click(screen.getAllByRole('button', { name: /Two/ })[0])
      expect(scrollTo).toHaveBeenCalledTimes(1)
      expect(intoView).not.toHaveBeenCalled()
    } finally {
      delete (Element.prototype as Partial<Element>).scrollIntoView
    }
  })
})

describe('a nav of parts whose ids are no selectors', () => {
  function Guide() {
    const box = useRef<HTMLDivElement>(null)
    return (
      <div ref={box} data-testid="guide">
        <ScrollProgressNav
          mode="sticky"
          containerRef={box}
          sections={[
            { id: '1-install', label: 'Install' },
            { id: '2.run', label: 'Run' },
          ]}
        />
        <h2 id="1-install">Install</h2>
        <h2 id="2.run">Run</h2>
      </div>
    )
  }

  it('marks the part read as the page scrolls, an id starting with a digit or holding a dot', () => {
    render(<Guide />)
    const box = screen.getByTestId('guide')
    box.getBoundingClientRect = () => ({ top: 0 }) as DOMRect
    const second = document.getElementById('2.run')!
    second.getBoundingClientRect = () => ({ top: 40 }) as DOMRect
    expect(() => fireEvent.scroll(box)).not.toThrow()
    expect(screen.getAllByRole('button', { name: /Run/ }).find((item) => item.hasAttribute('aria-current'))).toBeDefined()
  })
})

describe('a nav of parts the page cannot bring to its top', () => {
  // A box of 400 px scrolling 1000 px; its parts' tops as the test says, the box's at 0.
  function Short() {
    const box = useRef<HTMLDivElement>(null)
    return (
      <div ref={box} data-testid="short">
        <ScrollProgressNav
          mode="sticky"
          containerRef={box}
          sections={[
            { id: 'first', label: 'First' },
            { id: 'middle', label: 'Middle' },
            { id: 'last', label: 'Last' },
          ]}
        />
        <section id="first">First</section>
        <section id="middle">Middle</section>
        <section id="last">Last</section>
      </div>
    )
  }

  function place(box: HTMLElement, scrollTop: number, tops: Record<string, number>) {
    Object.defineProperty(box, 'scrollHeight', { configurable: true, value: 1000 })
    Object.defineProperty(box, 'clientHeight', { configurable: true, value: 400 })
    box.scrollTop = scrollTop
    box.getBoundingClientRect = () => ({ top: 0, bottom: 400 }) as DOMRect
    for (const [id, top] of Object.entries(tops)) document.getElementById(id)!.getBoundingClientRect = () => ({ top }) as DOMRect
    fireEvent.scroll(box)
  }

  const marked = () => screen.getAllByRole('button').find((item) => item.hasAttribute('aria-current'))?.textContent

  it('marks the last part at the end of the page, though its top never reaches the top', () => {
    render(<Short />)
    const box = screen.getByTestId('short')
    place(box, 300, { first: -300, middle: 100, last: 250 })
    expect(marked()).toMatch(/Middle/)
    place(box, 600, { first: -600, middle: -200, last: 150 })
    expect(marked()).toMatch(/Last/)
  })

  it('keeps the part clicked marked while the page goes there, until the reader scrolls', async () => {
    const user = userEvent.setup()
    render(<Short />)
    const box = screen.getByTestId('short')
    box.scrollTo = (() => {}) as typeof box.scrollTo
    place(box, 0, { first: 0, middle: 300, last: 600 })
    await user.click(screen.getByRole('button', { name: /Middle/ }))
    // The page can bring it no higher than 150 px from the top: the part above would be the one marked.
    place(box, 450, { first: -450, middle: 150, last: 300 })
    expect(marked()).toMatch(/Middle/)
    fireEvent.wheel(box)
    place(box, 400, { first: -400, middle: 200, last: 350 })
    expect(marked()).toMatch(/First/)
  })
})

describe('a data table loading its records', () => {
  it('says so, shows rows to come in both themes, and counts nothing yet', () => {
    render(
      <AdvancedDataTable
        title="Orders"
        isLoading
        data={[{ id: 'a', name: 'Old row' }]}
        columns={[{ id: 'name', header: 'Name', accessorKey: 'name' }]}
      />,
    )
    const loading = screen.getByRole('status', { name: 'Loading the records' })
    expect(loading.firstElementChild).toHaveClass('dark:bg-neutral-800/70')
    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('names its toggles by what they do, as their hints say it', () => {
    render(<AdvancedDataTable title="Orders" data={[{ id: 'a', name: 'A' }]} columns={[{ id: 'name', header: 'Name', accessorKey: 'name' }]} />)
    expect(screen.getByRole('button', { name: /^Show as (cards|a table)$/ })).not.toHaveAttribute('title')
    expect(screen.getByRole('button', { name: 'Columns shown' })).toHaveAccessibleDescription('Columns shown')
  })
})

describe('an assistant’s activity', () => {
  it('says it has not started rather than "0 of 0", and names an input and an output in the design’s words', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<AIAgentActivity title="Checking the order" activities={[]} />)
    expect(screen.getByText('Not started')).toBeInTheDocument()
    unmount()

    render(
      <AIAgentActivity
        title="Checking the order"
        activities={[{ id: 'a', type: 'reading', title: 'Read the order', status: 'success', details: { input: { id: 42 }, output: 'Found' } }]}
      />,
    )
    expect(screen.getByText('1 of 1 done')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Read the order/ }))
    expect(screen.getByText('Asked')).toBeInTheDocument()
    expect(screen.getByText('Answer')).toBeInTheDocument()
  })
})

describe('what draws no ring of its own, and blurs nothing', () => {
  it('is an alert’s dismiss button, and a track of tabs', () => {
    render(
      <>
        <Alert dismissible>Saved</Alert>
        <AnimatedTabs variant="glass" label="Period" tabs={[{ id: 'day', label: 'Day' }, { id: 'week', label: 'Week' }]} />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Dismiss' }).className).not.toMatch(/focus-visible:ring/)
    const track = within(screen.getByRole('tablist', { name: 'Period' })).getAllByRole('tab')[0].parentElement!
    expect(document.body.innerHTML).not.toContain('backdrop-blur-xl')
    expect(track).toBeInTheDocument()
  })
})
