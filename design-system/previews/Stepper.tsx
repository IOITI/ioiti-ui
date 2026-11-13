import { Button, StepPanels, Stepper } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const STEPS = [
  { title: 'Customer', description: 'Who it is for' },
  { title: 'Items', description: 'What is sent' },
  { title: 'Delivery', description: 'When and where' },
  { title: 'Review', description: 'Before it is sent' },
]

function Preview() {
  const [current, setCurrent] = useState(1)
  return (
    <div className="w-full space-y-4 p-5">
      <Stepper steps={STEPS} current={current} onStepChange={setCurrent} />
      <StepPanels current={current}>
        {STEPS.map((step) => (
          <p key={step.title} className="text-sm text-muted-foreground">{step.title}: {step.description.toLowerCase()}.</p>
        ))}
      </StepPanels>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={current === 0} onClick={() => setCurrent((step) => step - 1)}>Back</Button>
        <Button size="sm" disabled={current === STEPS.length - 1} onClick={() => setCurrent((step) => step + 1)}>Next</Button>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
