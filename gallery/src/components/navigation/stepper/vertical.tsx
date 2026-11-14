import { Button, StepPanels, Stepper } from 'ioiti-ui'
import { useState } from 'react'

const STEPS = [
  { title: 'Connect the shop', description: 'The address of its catalogue' },
  { title: 'Choose the products', description: 'All of them, or a few categories' },
  { title: 'Set the prices', description: 'As they are, or with a margin' },
  { title: 'Publish', description: 'Now, or on a day to choose' },
]

const PANELS = [
  'Give the address of the shop’s catalogue: its products are read from there, every night.',
  'Every product is imported unless a category is left out: 1,284 products in 36 categories.',
  'The shop’s prices are kept, or raised by a margin for every product at once.',
  'The products appear on the site at once, or on the morning of the day chosen.',
]

export default function StepperVertical() {
  const [current, setCurrent] = useState(2)
  return (
    <div className="grid gap-6 sm:grid-cols-[16rem_1fr]">
      <Stepper steps={STEPS} current={current} onStepChange={setCurrent} orientation="vertical" />
      <div className="flex flex-col gap-4">
        <StepPanels current={current}>
          {PANELS.map((text, index) => (
            <div key={STEPS[index].title} className="space-y-1">
              <h3 className="text-sm font-semibold">{STEPS[index].title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
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
    </div>
  )
}
