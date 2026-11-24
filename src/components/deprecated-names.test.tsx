// The names 0.30.0 gave the props that said one thing several ways (docs/conventions.md, Names and Busy), and the former
// names they replace: each still taken until 1.0, read as the new one, and said once in development. Each component's
// new name is tried first: a warning is said once in a file, and the old name's would hide a second.
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { StateChip } from '../shell/StateChip.js'
import { AttachmentChip } from './AttachmentChip.js'
import { ButtonLink } from './ButtonLink.js'
import { EmptyState } from './EmptyState.js'
import { FanChart } from './FanChart.js'
import { LineChart } from './LineChart.js'
import { Panel } from './Panel.js'
import { PeekLink } from './PeekLink.js'
import { SaveBar } from './SaveBar.js'
import { RangeSlider, Slider } from './Slider.js'
import { TextLink } from './TextLink.js'
import { TimeRangePicker } from './TimeRangePicker.js'
import { ActivityHeatmap } from './ui/activity-heatmap.js'
import { AdvancedDataTable, DataTable, useDataTable } from './ui/advanced-data-table.js'
import type { ColumnDef } from './ui/advanced-data-table.js'
import { AnimatedFileUpload } from './ui/animated-file-upload.js'
import { BarChart } from './ui/bar-chart.js'
import { DonutChart } from './ui/donut-chart.js'
import { FunnelChart } from './ui/funnel-chart.js'
import { LiveLineChart } from './ui/live-line-chart.js'

const DEPRECATED = /^ioiti-ui: a name or a value the package deprecated/

/** From now on, what the package says of a deprecated name given. */
function watchWarnings(): () => string[] {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  return () => warn.mock.calls.map(([message]) => String(message)).filter((message) => DEPRECATED.test(message))
}

afterEach(() => {
  vi.restoreAllMocks()
})

type Named = { 'aria-label'?: string; ariaLabel?: string }

const DAY = 86_400_000
const DAYS = [
  { label: 'Mon', profit: 120 },
  { label: 'Tue', profit: -80 },
]
const CONE = [1, 2, 3].map((x) => ({ x, low: -x, high: x, median: 0 }))

// Each chart, named as it is given: by the image a screen reader meets, and by its table's caption where it has one.
const CHARTS: { name: string; table: boolean; draw: (named: Named) => ReactElement }[] = [
  {
    name: 'LineChart',
    table: true,
    draw: (named) => (
      <LineChart data={[0, 1, 2].map((index) => ({ t: Date.UTC(2026, 9, 1) + index * DAY, orders: index }))} series={[{ key: 'orders', label: 'Orders' }]} animated={false} {...named} />
    ),
  },
  {
    name: 'FanChart',
    table: true,
    draw: (named) => (
      <FanChart data={CONE} bands={[{ lower: 'low', upper: 'high', label: 'Paths' }]} lines={[{ key: 'median', label: 'Expected' }]} animated={false} {...named} />
    ),
  },
  { name: 'BarChart', table: true, draw: (named) => <BarChart data={DAYS} series={[{ key: 'profit', label: 'Profit' }]} animated={false} {...named} /> },
  { name: 'DonutChart', table: true, draw: (named) => <DonutChart data={[{ label: 'Shop', value: 3 }, { label: 'Phone', value: 1 }]} animated={false} {...named} /> },
  { name: 'FunnelChart', table: true, draw: (named) => <FunnelChart stages={[{ label: 'Visited', value: 100 }, { label: 'Paid', value: 20 }]} animated={false} {...named} /> },
  { name: 'ActivityHeatmap', table: false, draw: (named) => <ActivityHeatmap data={[{ date: '2026-10-20', value: 3 }]} endDate="2026-10-21" weeks={4} animated={false} {...named} /> },
  { name: 'LiveLineChart', table: false, draw: (named) => <LiveLineChart initial={[1, 2, 3]} {...named} /> },
]

describe('a chart', () => {
  for (const chart of CHARTS) {
    const named = (name: string) => {
      expect(screen.getByRole('img', { name })).toBeInTheDocument()
      if (chart.table) expect(screen.getByRole('table', { name })).toBeInTheDocument()
    }

    it(`${chart.name} is named by aria-label, and says nothing of it`, () => {
      const said = watchWarnings()
      render(chart.draw({ 'aria-label': 'Orders of the week' }))
      named('Orders of the week')
      expect(said()).toEqual([])
    })

    it(`${chart.name} still takes ariaLabel, says so once, and takes aria-label over it`, () => {
      const said = watchWarnings()
      const { rerender, unmount } = render(chart.draw({ ariaLabel: 'Orders of the week' }))
      named('Orders of the week')
      rerender(chart.draw({ ariaLabel: 'Orders of the week' }))
      expect(said()).toHaveLength(1)
      expect(said()[0]).toContain(`(${chart.name}'s ariaLabel: aria-label)`)
      unmount()

      render(chart.draw({ 'aria-label': 'Orders', ariaLabel: 'Former' }))
      named('Orders')
      expect(said()).toHaveLength(1)
    })
  }
})

describe('a bar chart coloured by sign', () => {
  const fills = (container: HTMLElement) => Array.from(container.querySelectorAll('svg path')).map((path) => path.getAttribute('fill'))

  it('takes colorBy, and says nothing of it', () => {
    const said = watchWarnings()
    const { container } = render(<BarChart data={DAYS} series={[{ key: 'profit', label: 'Profit' }]} colorBy="sign" animated={false} />)
    expect(fills(container)).toEqual(['var(--chart-positive)', 'var(--chart-negative)'])
    expect(said()).toEqual([])
  })

  it('still takes tone, says so once, and takes colorBy over it', () => {
    const said = watchWarnings()
    const { container, rerender } = render(<BarChart data={DAYS} series={[{ key: 'profit', label: 'Profit' }]} tone="sign" animated={false} />)
    expect(fills(container)).toEqual(['var(--chart-positive)', 'var(--chart-negative)'])
    rerender(<BarChart data={DAYS} series={[{ key: 'profit', label: 'Profit' }]} tone="sign" animated={false} />)
    expect(said()).toHaveLength(1)
    expect(said()[0]).toContain("(BarChart's tone: colorBy)")

    rerender(<BarChart data={DAYS} series={[{ key: 'profit', label: 'Profit' }]} colorBy="series" tone="sign" animated={false} />)
    expect(fills(container)).toEqual(['var(--chart-series)', 'var(--chart-series)'])
  })
})

describe('a slider', () => {
  it('is named by aria-label where its label is not text, and says nothing of it', () => {
    const said = watchWarnings()
    render(
      <>
        <Slider label={<b>Risk</b>} aria-label="Risk per trade" defaultValue={2} showInput />
        <RangeSlider label={<b>Price</b>} aria-label="Price" />
      </>,
    )
    expect(screen.getByRole('slider', { name: 'Risk per trade' })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: 'Risk per trade' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Price, from' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Price, to' })).toBeInTheDocument()
    expect(said()).toEqual([])
  })

  it('still takes ariaLabel, each says so once', () => {
    const said = watchWarnings()
    const sliders = (
      <>
        <Slider label={<b>Risk</b>} ariaLabel="Risk per trade" defaultValue={2} />
        <RangeSlider label={<b>Price</b>} ariaLabel="Price" />
      </>
    )
    const { rerender } = render(sliders)
    rerender(sliders)
    expect(screen.getByRole('slider', { name: 'Risk per trade' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Price, from' })).toBeInTheDocument()
    expect(said()).toHaveLength(2)
    expect(said()[0]).toContain("(Slider's ariaLabel: aria-label)")
    expect(said()[1]).toContain("(RangeSlider's ariaLabel: aria-label)")
  })
})

const COLUMNS: ColumnDef<{ id: string; name: string }>[] = [{ id: 'name', header: 'Name', accessorKey: 'name' }]

/** What the table's parts read of its loading, the former name with the new. */
function Loading() {
  const { loading, isLoading } = useDataTable()
  return <p>{`loading ${String(loading)}, isLoading ${String(isLoading)}`}</p>
}

describe('a data table loading its records', () => {
  it('takes loading, says so to its parts, and says nothing of it', () => {
    const said = watchWarnings()
    const { unmount } = render(<AdvancedDataTable data={[]} columns={COLUMNS} loading />)
    expect(screen.getByRole('status', { name: 'Loading the records' })).toBeInTheDocument()
    unmount()

    render(
      <DataTable data={[]} columns={COLUMNS} loading>
        <Loading />
      </DataTable>,
    )
    expect(screen.getByText('loading true, isLoading true')).toBeInTheDocument()
    expect(said()).toEqual([])
  })

  it('still takes isLoading, each says so once as its own', () => {
    const said = watchWarnings()
    const { rerender, unmount } = render(<AdvancedDataTable data={[]} columns={COLUMNS} isLoading />)
    rerender(<AdvancedDataTable data={[]} columns={COLUMNS} isLoading />)
    expect(screen.getByRole('status', { name: 'Loading the records' })).toBeInTheDocument()
    expect(said()).toHaveLength(1)
    expect(said()[0]).toContain("(AdvancedDataTable's isLoading: loading)")
    unmount()

    render(
      <DataTable data={[]} columns={COLUMNS} isLoading>
        <Loading />
      </DataTable>,
    )
    expect(screen.getByText('loading true, isLoading true')).toBeInTheDocument()
    expect(said()).toHaveLength(2)
    expect(said()[1]).toContain("(DataTable's isLoading: loading)")
  })
})

describe('a time range refreshed', () => {
  it('takes loading, its Refresh busy, and says nothing of it', () => {
    const said = watchWarnings()
    render(<TimeRangePicker loading />)
    expect(screen.getByRole('button', { name: 'Refreshing' })).toHaveAttribute('aria-busy', 'true')
    expect(said()).toEqual([])
  })

  it('still takes isLoading, and says so once', () => {
    const said = watchWarnings()
    const { rerender } = render(<TimeRangePicker isLoading />)
    rerender(<TimeRangePicker isLoading />)
    expect(screen.getByRole('button', { name: 'Refreshing' })).toHaveAttribute('aria-busy', 'true')
    expect(said()).toHaveLength(1)
    expect(said()[0]).toContain("(TimeRangePicker's isLoading: loading)")
  })
})

describe('a save on its way', () => {
  const pressable = () => {
    expect(screen.getByRole('button', { name: 'Saving' })).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('button', { name: 'Discard' })).toBeDisabled()
  }

  it('takes pending, and says nothing of it', () => {
    const said = watchWarnings()
    render(<SaveBar open onSave={() => {}} onDiscard={() => {}} pending />)
    pressable()
    expect(said()).toEqual([])
  })

  it('still takes saving, says so once, and takes pending over it', () => {
    const said = watchWarnings()
    const { rerender } = render(<SaveBar open onSave={() => {}} onDiscard={() => {}} saving />)
    rerender(<SaveBar open onSave={() => {}} onDiscard={() => {}} saving />)
    pressable()
    expect(said()).toHaveLength(1)
    expect(said()[0]).toContain("(SaveBar's saving: pending)")

    rerender(<SaveBar open onSave={() => {}} onDiscard={() => {}} pending={false} saving />)
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
  })
})

describe('an attachment made ready', () => {
  it('takes pending, and says nothing of it', () => {
    const said = watchWarnings()
    const { container } = render(<AttachmentChip label="export.csv" pending />)
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText(', being made ready')).toHaveClass('sr-only')
    expect(said()).toEqual([])
  })

  it('still takes busy, and says so once', () => {
    const said = watchWarnings()
    const { container, rerender } = render(<AttachmentChip label="export.csv" busy />)
    rerender(<AttachmentChip label="export.csv" busy />)
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
    expect(said()).toHaveLength(1)
    expect(said()[0]).toContain("(AttachmentChip's busy: pending)")
  })
})

describe('a link', () => {
  const links = (props: { href?: string; to?: string }) => (
    <>
      <TextLink {...props}>Terms</TextLink>
      <PeekLink {...props} content={() => <p>The terms</p>}>
        Peek
      </PeekLink>
      <StateChip {...props} tone="warning" icon={null} label="Restart needed" hint="The services run an older configuration." />
    </>
  )

  it('leads where its href says, and says nothing of it', () => {
    const said = watchWarnings()
    render(links({ href: '/terms' }))
    for (const name of ['Terms', 'Peek', 'Restart needed']) expect(screen.getByRole('link', { name })).toHaveAttribute('href', '/terms')
    expect(said()).toEqual([])
  })

  it('still takes to, each says so once, and takes href over it', () => {
    const said = watchWarnings()
    const { rerender } = render(links({ to: '/terms' }))
    rerender(links({ to: '/terms' }))
    for (const name of ['Terms', 'Peek', 'Restart needed']) expect(screen.getByRole('link', { name })).toHaveAttribute('href', '/terms')
    expect(said()).toHaveLength(3)
    expect(said().join('\n')).toContain("(TextLink's to: href)")
    expect(said().join('\n')).toContain("(PeekLink's to: href)")
    expect(said().join('\n')).toContain("(StateChip's to: href)")

    rerender(links({ href: '/privacy', to: '/terms' }))
    for (const name of ['Terms', 'Peek', 'Restart needed']) expect(screen.getByRole('link', { name })).toHaveAttribute('href', '/privacy')
  })
})

describe('a link drawn as a button', () => {
  it('leads where its href says, a button that cannot be pressed with nowhere to go, and says nothing of it', () => {
    const said = watchWarnings()
    render(
      <>
        <ButtonLink href="/orders/new">New order</ButtonLink>
        <ButtonLink href={null}>Nowhere</ButtonLink>
        <ButtonLink href="/orders/7" variant="danger">
          Cancel order
        </ButtonLink>
      </>,
    )
    expect(screen.getByRole('link', { name: 'New order' })).toHaveAttribute('href', '/orders/new')
    expect(screen.getByRole('button', { name: 'Nowhere' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Cancel order' })).toHaveClass('text-negative')
    expect(said()).toEqual([])
  })

  it('is on its way while pending: a spinner, said busy, and a click that does nothing more', () => {
    const said = watchWarnings()
    const clicked = vi.fn()
    render(
      <>
        <ButtonLink href="/sign-in/gitea" reloadDocument pending onClick={clicked}>
          Gitea
        </ButtonLink>
        <ButtonLink href={null} pending>
          Nowhere
        </ButtonLink>
      </>,
    )
    const link = screen.getByRole('link', { name: 'Gitea' })
    expect(link).toHaveAttribute('aria-busy', 'true')
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link.querySelector('svg')).toHaveClass('motion-safe:animate-spin')
    // Cancelled: the browser is on its way already.
    expect(fireEvent.click(link)).toBe(false)
    expect(clicked).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Nowhere' })).toHaveAttribute('aria-busy', 'true')
    expect(said()).toEqual([])
  })

  it('still takes to, and says so once', () => {
    const said = watchWarnings()
    const buttons = (
      <>
        <ButtonLink to="/orders/new">New order</ButtonLink>
        <ButtonLink to={null}>Nowhere</ButtonLink>
      </>
    )
    const { rerender } = render(buttons)
    rerender(buttons)
    expect(screen.getByRole('link', { name: 'New order' })).toHaveAttribute('href', '/orders/new')
    expect(screen.getByRole('button', { name: 'Nowhere' })).toBeDisabled()
    expect(said()).toHaveLength(1)
    expect(said()[0]).toContain("(ButtonLink's to: href)")

    rerender(<ButtonLink href="/orders/7" to="/orders/new">Order 7</ButtonLink>)
    expect(screen.getByRole('link', { name: 'Order 7' })).toHaveAttribute('href', '/orders/7')
  })

  it('draws variant="destructive" as danger, and says so once as its own (not as the Button it draws with nowhere to go)', () => {
    const said = watchWarnings()
    const buttons = (
      <>
        <ButtonLink href="/orders/7/cancel" variant="destructive">
          Former
        </ButtonLink>
        <ButtonLink href={null} variant="destructive">
          Nothing to cancel
        </ButtonLink>
        <ButtonLink href="/orders/7/cancel" variant="danger">
          New
        </ButtonLink>
      </>
    )
    const { rerender } = render(buttons)
    rerender(buttons)
    expect(screen.getByRole('link', { name: 'Former' }).className).toBe(screen.getByRole('link', { name: 'New' }).className)
    expect(screen.getByRole('button', { name: 'Nothing to cancel' })).toHaveClass('text-negative')
    expect(said()).toHaveLength(1)
    expect(said()[0]).toContain(`(ButtonLink's variant="destructive": danger)`)
  })
})

describe('a compact layout', () => {
  const panelBody = () => screen.getByText('first row').parentElement

  it('takes density="compact", and says nothing of it', () => {
    const said = watchWarnings()
    const { unmount } = render(
      <Panel title="Latest" density="compact">
        <p>first row</p>
      </Panel>,
    )
    expect(panelBody()).toHaveClass('pt-2')
    unmount()

    render(
      <>
        <EmptyState density="compact" title="No run yet" />
        <AnimatedFileUpload density="compact" />
      </>,
    )
    expect(screen.getByRole('heading', { level: 3, name: 'No run yet' }).parentElement).toHaveClass('py-6')
    expect(screen.getByRole('button', { name: /Drop files here/ })).toHaveClass('min-h-[120px]')
    expect(said()).toEqual([])
  })

  it('still takes dense, compact and variant="compact", each said once, and density over them', () => {
    const said = watchWarnings()
    const formerly = (
      <>
        <Panel title="Latest" dense>
          <p>first row</p>
        </Panel>
        <EmptyState compact title="No run yet" />
        <AnimatedFileUpload variant="compact" />
      </>
    )
    const { rerender } = render(formerly)
    rerender(formerly)
    expect(panelBody()).toHaveClass('pt-2')
    expect(screen.getByRole('heading', { level: 3, name: 'No run yet' }).parentElement).toHaveClass('py-6')
    expect(screen.getByRole('button', { name: /Drop files here/ })).toHaveClass('min-h-[120px]')
    expect(said()).toHaveLength(3)
    expect(said().join('\n')).toContain(`(Panel's dense: density="compact")`)
    expect(said().join('\n')).toContain(`(EmptyState's compact: density="compact")`)
    expect(said().join('\n')).toContain(`(AnimatedFileUpload's variant="compact": density="compact")`)

    rerender(
      <>
        <Panel title="Latest" density="regular" dense>
          <p>first row</p>
        </Panel>
        <EmptyState density="regular" compact title="No run yet" />
        <AnimatedFileUpload density="regular" variant="compact" />
      </>,
    )
    expect(panelBody()).not.toHaveClass('pt-2')
    expect(screen.getByRole('heading', { level: 2, name: 'No run yet' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Drop files here/ })).toHaveClass('min-h-[180px]')
  })
})
