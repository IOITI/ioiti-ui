import {
  AnimatedTabs,
  Breadcrumb,
  Button,
  PageHeader,
  ScrollProgressNav,
  SelectionBasket,
  SmoothAccordion,
  StepPanels,
  Stepper,
  useMainScroll,
} from 'ioiti-ui'
import { GitCompare, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Demo } from '../parts'

const PARTS = [
  { id: 'tabs', label: 'Tabs', href: '#tabs' },
  { id: 'breadcrumb', label: 'Breadcrumb', href: '#breadcrumb' },
  { id: 'stepper', label: 'Stepper', href: '#stepper' },
  { id: 'accordion', label: 'Accordion', href: '#accordion' },
  { id: 'basket', label: 'Selection', href: '#basket' },
  { id: 'progress', label: 'Parts of a page', href: '#progress' },
]

const STEPS = [
  { title: 'Customer', description: 'Who it is for' },
  { title: 'Items', description: 'What is sent' },
  { title: 'Delivery', description: 'When and where' },
  { title: 'Review', description: 'Before it is sent' },
]

function Steps() {
  const [current, setCurrent] = useState(1)
  return (
    <div className="w-full space-y-4">
      <Stepper steps={STEPS} current={current} onStepChange={setCurrent} />
      <StepPanels current={current}>
        {STEPS.map((step) => (
          <p key={step.title} className="text-sm text-muted-foreground">
            {step.title}: {step.description.toLowerCase()}.
          </p>
        ))}
      </StepPanels>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={current === 0} onClick={() => setCurrent((step) => step - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={current === STEPS.length - 1} onClick={() => setCurrent((step) => step + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}

function Basket() {
  const [selected, setSelected] = useState(2)
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setSelected((count) => Math.min(count + 1, 12))}>
          Select one more
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setSelected(0)}>
          Clear
        </Button>
      </div>
      <SelectionBasket
        mode="inline"
        selectedCount={selected}
        totalCount={12}
        noun={['run', 'runs']}
        onClearSelection={() => setSelected(0)}
        onSelectAll={() => setSelected(12)}
        actions={[
          { id: 'compare', label: 'Compare', icon: <GitCompare className="size-3.5" />, href: '/components/data', disabled: selected < 2 || selected > 4, title: 'Two to four runs can be compared' },
          { id: 'remove', label: 'Remove', icon: <Trash2 className="size-3.5" />, variant: 'danger', onClick: () => setSelected(0) },
        ]}
      />
    </div>
  )
}

export function Navigation() {
  const main = useMainScroll()
  return (
    <>
      <PageHeader title="Navigation" description="Tabs, trails, steps: what has an address is a link, which a ⌘-click opens in another tab." />

      <ScrollProgressNav sections={PARTS} mode="sticky" containerRef={main ?? undefined} label="On this page" />

      <Demo
        id="tabs"
        title="AnimatedTabs"
        description="Views of one thing: a tablist, its panel named by the tab shown, one stop of the keyboard whose arrows, Home and End move and choose. A tab whose view has an address (?tab=) is a link; its background slides to the tab chosen."
        names={['AnimatedTabs']}
        className="flex flex-col items-start gap-4"
      >
        <AnimatedTabs
          label="Orders by state"
          tabs={[
            { id: 'open', label: 'Open', badge: 3, content: <p className="pt-3 text-sm text-muted-foreground">Three open orders.</p> },
            { id: 'sent', label: 'Sent', content: <p className="pt-3 text-sm text-muted-foreground">Sent this week.</p> },
            { id: 'all', label: 'All', content: <p className="pt-3 text-sm text-muted-foreground">Every order.</p> },
          ]}
          renderContent
        />
        <AnimatedTabs variant="pill" label="Period" tabs={[{ id: 'day', label: 'Day' }, { id: 'week', label: 'Week' }, { id: 'month', label: 'Month' }]} />
      </Demo>

      <Demo id="breadcrumb" title="Breadcrumb" description="Where a page is, from Home: the top bar has one on every page. Too many steps fold into '…'." names={['Breadcrumb']} className="flex flex-col items-start gap-3">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Components', href: '/components/actions' }, { label: 'Navigation' }]} />
        <Breadcrumb
          separator="slash"
          maxItems={3}
          items={[
            { label: 'Home', href: '/' },
            { label: 'Customers', href: '/components/data' },
            { label: 'Acme', href: '/components/data' },
            { label: 'Orders', href: '/components/data' },
            { label: '2026-0042' },
          ]}
        />
      </Demo>

      <Demo id="stepper" title="Stepper and StepPanels" description="A task in steps: a step done can be gone back to." names={['Stepper', 'StepPanels']}>
        <Steps />
      </Demo>

      <Demo
        id="accordion"
        title="SmoothAccordion"
        description="Questions and their answers, opened one at a time or several."
        names={['SmoothAccordion']}
        className="block w-full"
      >
        <SmoothAccordion
          defaultOpen={['returns']}
          items={[
            { id: 'returns', title: 'Can an order be returned?', content: 'Within 30 days, in its box.' },
            { id: 'invoice', title: 'Where is the invoice?', subtitle: 'In every order\'s page', content: 'Under Documents, as a PDF.' },
            { id: 'delivery', title: 'How long is a delivery?', content: 'Three to five working days.' },
          ]}
        />
      </Demo>

      <Demo
        id="basket"
        title="SelectionBasket"
        description="What a table's selection can do: the count, select all, clear, and the actions, a disabled one saying why. The data table shows it under itself."
        names={['SelectionBasket']}
      >
        <Basket />
      </Demo>

      <Demo
        id="progress"
        title="ScrollProgressNav"
        description="The bar of parts at the top of this page: it stays in view as the page scrolls, marks the part being read, and each part is a link to its place (written in the address without a step more to go back through)."
        names={['ScrollProgressNav']}
      >
        <p className="text-sm text-muted-foreground">On a phone, its parts are a menu under a pill.</p>
      </Demo>
    </>
  )
}
