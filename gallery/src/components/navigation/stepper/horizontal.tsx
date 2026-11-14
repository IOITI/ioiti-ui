import { Button, StepPanels, Stepper } from 'ioiti-ui'
import { useState } from 'react'

const STEPS = [
  { title: 'Customer', description: 'Who it is for' },
  { title: 'Items', description: 'What is sent' },
  { title: 'Delivery', description: 'When and where' },
  { title: 'Review', description: 'Before it is sent' },
]

export default function StepperHorizontal() {
  const [current, setCurrent] = useState(1)
  return (
    <div className="w-full space-y-4">
      {/* onStepChange makes each step done a button: a click goes back to it. */}
      <Stepper steps={STEPS} current={current} onStepChange={setCurrent} />
      <StepPanels current={current} className="rounded-xl border border-border/70 p-4">
        {STEPS.map((step) => (
          <p key={step.title} className="text-sm text-muted-foreground">
            {step.title}: {step.description.toLowerCase()}.
          </p>
        ))}
      </StepPanels>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" disabled={current === 0} onClick={() => setCurrent((step) => step - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={current === STEPS.length - 1} onClick={() => setCurrent((step) => step + 1)}>
          Next
        </Button>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          Step {current + 1} of {STEPS.length}
        </span>
      </div>
    </div>
  )
}
