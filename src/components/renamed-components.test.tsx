// The names of their roles that 0.31.0 gave EasyUI's copies, and their former names, each still exported until 1.0:
// drawn as the component of today, and said once in development. Each component is drawn by its name of today first: a
// warning is said once in a file, and the former name's would hide a second.
import { cleanup, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AirportMatrixClock, WorldClock } from './ui/airport-matrix-clock.js'
import { AnimatedFileUpload, FileUpload } from './ui/animated-file-upload.js'
import { AnimatedTabs, Tabs } from './ui/animated-tabs.js'
import { DirectionalTooltip, Tooltip } from './ui/directional-tooltip.js'
import { DynamicIsland, StatusIsland } from './ui/dynamic-island.js'
import {
  Flysheet,
  FlysheetBody,
  FlysheetClose,
  FlysheetContent,
  FlysheetDescription,
  FlysheetFooter,
  FlysheetHeader,
  FlysheetTitle,
  FlysheetTrigger,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/flysheet.js'
import { Switch } from './ui/form.js'
import type { SwitchProps } from './ui/form.js'
import { Dialog, SettleModal } from './ui/settle-modal.js'
import { ComparisonTable, SmartComparison } from './ui/smart-comparison.js'
import { Accordion, SmoothAccordion } from './ui/smooth-accordion.js'
import { SelectMenu, SpringSelect } from './ui/spring-select.js'
import { StretchSwitch } from './ui/stretch-switch.js'
import type { StretchSwitchProps } from './ui/stretch-switch.js'
import { Toast, VelocityToast } from './ui/velocity-toast.js'

const DEPRECATED = /^ioiti-ui: a name or a value the package deprecated/

/** From now on, what the package says of a deprecated name given. */
function watchWarnings(): () => string[] {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  return () => warn.mock.calls.map(([message]) => String(message)).filter((message) => DEPRECATED.test(message))
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

/** useId's ids, which count on from one render to the next: each written as the order it first comes in. */
function sameIds(html: string): string {
  const ids = new Map<string, string>()
  return html.replace(/_r_[0-9a-v]+_/g, (id) => {
    if (!ids.has(id)) ids.set(id, `id-${ids.size}`)
    return ids.get(id) as string
  })
}

/** What an element draws, with what it puts in the page's body (a dialog, a sheet), then gone. */
function drawn(element: ReactElement): string {
  render(element)
  const html = sameIds(document.body.innerHTML)
  cleanup()
  return html
}

/** The component of today drawn, then its former name twice: the same each time, said once. */
function expectRenamed(today: ReactElement, former: ReactElement, words: string) {
  const said = watchWarnings()
  const drawnToday = drawn(today)
  expect(drawnToday).toContain(words)
  expect(said()).toEqual([])
  expect(drawn(former)).toBe(drawnToday)
  expect(drawn(former)).toBe(drawnToday)
  return said()
}

const named = (Component: unknown) => (Component as { displayName?: string }).displayName

describe('a component under its former name', () => {
  it('SettleModal draws Dialog, and says so once', () => {
    const props = { open: true, title: 'Archive the project', description: 'Its runs stay readable.', children: <p>3 runs</p> }
    expect(expectRenamed(<Dialog {...props} />, <SettleModal {...props} />, 'Archive the project')).toEqual([
      expect.stringContaining('(SettleModal: Dialog)'),
    ])
    expect(named(SettleModal)).toBe('SettleModal')
  })

  it('Flysheet and its parts draw Sheet and its parts, and each says so once', () => {
    const today = (
      <Sheet defaultOpen>
        <SheetTrigger>Open the order</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Order 1042</SheetTitle>
            <SheetDescription>Placed on 26 October</SheetDescription>
          </SheetHeader>
          <SheetBody>
            <p>Four lines</p>
          </SheetBody>
          <SheetFooter>
            <SheetClose>Done</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
    const former = (
      <Flysheet defaultOpen>
        <FlysheetTrigger>Open the order</FlysheetTrigger>
        <FlysheetContent>
          <FlysheetHeader>
            <FlysheetTitle>Order 1042</FlysheetTitle>
            <FlysheetDescription>Placed on 26 October</FlysheetDescription>
          </FlysheetHeader>
          <FlysheetBody>
            <p>Four lines</p>
          </FlysheetBody>
          <FlysheetFooter>
            <FlysheetClose>Done</FlysheetClose>
          </FlysheetFooter>
        </FlysheetContent>
      </Flysheet>
    )
    const said = expectRenamed(today, former, 'Order 1042')
    const parts = ['', 'Trigger', 'Content', 'Header', 'Title', 'Description', 'Body', 'Footer', 'Close']
    for (const part of parts) expect(said.filter((message) => message.includes(`(Flysheet${part}: Sheet${part})`)), part).toHaveLength(1)
    expect(said).toHaveLength(parts.length)
    expect(named(FlysheetContent)).toBe('FlysheetContent')
  })

  it('SpringSelect draws SelectMenu, and says so once', () => {
    const props = {
      label: 'Plan',
      options: [
        { value: 'solo', label: 'Solo' },
        { value: 'team', label: 'Team' },
      ],
      defaultValue: 'team',
    }
    expect(expectRenamed(<SelectMenu {...props} />, <SpringSelect {...props} />, 'Team')).toEqual([
      expect.stringContaining('(SpringSelect: SelectMenu)'),
    ])
    expect(named(SpringSelect)).toBe('SpringSelect')
  })

  it('VelocityToast draws Toast, and says so once', () => {
    const props = { open: true, title: 'Export ready', description: '1,204 rows', action: { label: 'Open the export', href: '/exports/1' } }
    expect(expectRenamed(<Toast {...props} />, <VelocityToast {...props} />, 'Export ready')).toEqual([
      expect.stringContaining('(VelocityToast: Toast)'),
    ])
    expect(named(VelocityToast)).toBe('VelocityToast')
  })

  it('SmoothAccordion draws Accordion, and says so once', () => {
    const props = {
      items: [
        { id: 'returns', title: 'Returns', content: <p>Within 30 days</p> },
        { id: 'invoice', title: 'Invoice', content: <p>By email</p> },
      ],
      defaultValue: ['returns'],
    }
    expect(expectRenamed(<Accordion {...props} />, <SmoothAccordion {...props} />, 'Within 30 days')).toEqual([
      expect.stringContaining('(SmoothAccordion: Accordion)'),
    ])
    expect(named(SmoothAccordion)).toBe('SmoothAccordion')
  })

  it('DirectionalTooltip draws Tooltip, and says so once', () => {
    const props = { content: 'Copies the address', children: <button type="button">Copy</button> }
    expect(expectRenamed(<Tooltip {...props} />, <DirectionalTooltip {...props} />, 'Copy')).toEqual([
      expect.stringContaining('(DirectionalTooltip: Tooltip)'),
    ])
    expect(named(DirectionalTooltip)).toBe('DirectionalTooltip')
  })

  it('AnimatedTabs draws Tabs, and says so once', () => {
    const props = {
      label: 'Views of the order',
      tabs: [
        { id: 'lines', label: 'Lines', content: <p>Four lines</p> },
        { id: 'payments', label: 'Payments', content: <p>Paid by card</p> },
      ],
    }
    expect(expectRenamed(<Tabs {...props} />, <AnimatedTabs {...props} />, 'Four lines')).toEqual([
      expect.stringContaining('(AnimatedTabs: Tabs)'),
    ])
    expect(named(AnimatedTabs)).toBe('AnimatedTabs')
  })

  it('AnimatedFileUpload draws FileUpload, and says so once', () => {
    expect(expectRenamed(<FileUpload density="compact" />, <AnimatedFileUpload density="compact" />, 'Drop files here')).toEqual([
      expect.stringContaining('(AnimatedFileUpload: FileUpload)'),
    ])
    expect(named(AnimatedFileUpload)).toBe('AnimatedFileUpload')
  })

  it('AirportMatrixClock draws WorldClock, and says so once', () => {
    // The same moment for both: the clock reads it as it draws.
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-24T09:41:00Z'))
    const cities = [{ id: 'paris', name: 'Paris', timeZone: 'Europe/Paris' }]
    expect(expectRenamed(<WorldClock cities={cities} />, <AirportMatrixClock cities={cities} />, '10:41, Paris')).toEqual([
      expect.stringContaining('(AirportMatrixClock: WorldClock)'),
    ])
    expect(named(AirportMatrixClock)).toBe('AirportMatrixClock')
  })

  it('SmartComparison draws ComparisonTable, and says so once', () => {
    const props = {
      plans: [
        { id: 'solo', name: 'Solo', tagline: 'One user', price: '€9' },
        { id: 'team', name: 'Team', tagline: 'Up to ten', price: '€29' },
      ],
      categories: [{ id: 'use', title: 'Use', features: [{ id: 'users', name: 'Users', values: { solo: '1', team: '10' } }] }],
    }
    expect(expectRenamed(<ComparisonTable {...props} />, <SmartComparison {...props} />, 'Up to ten')).toEqual([
      expect.stringContaining('(SmartComparison: ComparisonTable)'),
    ])
    expect(named(SmartComparison)).toBe('SmartComparison')
  })

  it('DynamicIsland draws StatusIsland, and says so once', () => {
    const props = { label: 'Import', compact: <span>3 running</span>, children: <p>Products: 504 of 1,204</p> }
    expect(expectRenamed(<StatusIsland {...props} />, <DynamicIsland {...props} />, '3 running')).toEqual([
      expect.stringContaining('(DynamicIsland: StatusIsland)'),
    ])
    expect(named(DynamicIsland)).toBe('DynamicIsland')
  })
})

describe('StretchSwitch, deprecated for the form’s Switch', () => {
  it('takes the same props, is drawn as it was, and says once that Switch replaces it', () => {
    const said = watchWarnings()
    const props: StretchSwitchProps = { label: 'Weekly summary', description: 'Every Monday, by email', defaultChecked: true }
    const switchProps: SwitchProps = props
    render(<Switch {...switchProps} />)
    expect(said()).toEqual([])
    cleanup()

    const { rerender } = render(<StretchSwitch {...props} />)
    rerender(<StretchSwitch {...props} defaultChecked={false} />)
    expect(screen.getByRole('switch', { name: 'Weekly summary' })).toBeChecked()
    expect(screen.getByRole('switch', { name: 'Weekly summary' })).toHaveAccessibleDescription('Every Monday, by email')
    expect(said()).toEqual([expect.stringContaining("(StretchSwitch: Switch, the same props, drawn as the design's switch)")])
  })
})
