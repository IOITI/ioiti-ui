import { AnimatedTabs, Breadcrumb, Panel, ScrollProgressNav, SelectionBasket, SmoothAccordion, Stepper } from 'ioiti-ui'
import { Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

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

function Preview() {
  // The page of the frame does not scroll: a box of its own does, and the bar follows it (containerRef).
  const page = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState(2)
  return (
    <div className="space-y-2 p-5">
      <div ref={page} className="relative h-80 space-y-4 overflow-y-auto rounded-2xl border border-border/70 p-4">
        <ScrollProgressNav sections={PARTS} mode="sticky" containerRef={page} label="On this page" />
        <Panel id="tabs" className="scroll-mt-16" title="AnimatedTabs" description="Views of one thing: a tablist, its panel named by the tab shown, one stop of the keyboard.">
          <AnimatedTabs variant="pill" renderContent={false} label="Period" tabs={[{ id: 'day', label: 'Day' }, { id: 'week', label: 'Week' }, { id: 'month', label: 'Month' }]} />
        </Panel>
        <Panel id="breadcrumb" className="scroll-mt-16" title="Breadcrumb" description="Where a page is, from Home: the top bar has one on every page.">
          <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Components', href: '#' }, { label: 'Navigation' }]} />
        </Panel>
        <Panel id="stepper" className="scroll-mt-16" title="Stepper and StepPanels" description="A task in steps: a step done can be gone back to.">
          <Stepper steps={STEPS} current={step} onStepChange={setStep} />
        </Panel>
        <Panel id="accordion" className="scroll-mt-16" title="SmoothAccordion" description="Questions and their answers, opened one at a time or several.">
          <SmoothAccordion
            items={[
              { id: 'returns', title: 'Can an order be returned?', content: 'Within 30 days, in its box.' },
              { id: 'delivery', title: 'How long is a delivery?', content: 'Three to five working days.' },
            ]}
          />
        </Panel>
        <Panel id="basket" className="scroll-mt-16" title="SelectionBasket" description="What a table's selection can do: the count, select all, clear, and the actions.">
          <SelectionBasket
            mode="inline"
            selectedCount={selected}
            totalCount={12}
            noun={['run', 'runs']}
            onClearSelection={() => setSelected(0)}
            onSelectAll={() => setSelected(12)}
            actions={[{ id: 'remove', label: 'Remove', icon: <Trash2 className="size-3.5" />, variant: 'danger', onClick: () => setSelected(0) }]}
          />
        </Panel>
        <Panel id="progress" className="scroll-mt-16" title="ScrollProgressNav" description="The bar of parts at the top of this page: it stays in view as the page scrolls, marks the part being read, and each part is a link to its place.">
          <p className="text-sm text-muted-foreground">On a phone, its parts are a menu under a pill.</p>
        </Panel>
        {/* Room under the last part, so that it too can reach the top of the box and be marked. */}
        <div aria-hidden className="h-28" />
      </div>
      <p className="text-xs text-muted-foreground">Scroll the box: the bar stays at its top, its line fills as the page goes down, and the part being read is marked. A part pressed is scrolled to.</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
