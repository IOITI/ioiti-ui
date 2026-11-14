import { Button, DescriptionList, StepPanels, Stepper, useToast } from 'ioiti-ui'
import { useState } from 'react'

const STEPS = [
  { title: 'Customer', description: 'Who it is for' },
  { title: 'Items', description: 'What is sent' },
  { title: 'Review', description: 'Before it is sent' },
]

export default function StepperReview() {
  const toast = useToast()
  const [current, setCurrent] = useState(2)
  const [sending, setSending] = useState(false)
  const send = () => {
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setCurrent(0)
      toast({ title: 'Quote sent to Atelier Brun', variant: 'success' })
    }, 900)
  }
  return (
    <div className="max-w-xl space-y-4">
      <Stepper steps={STEPS} current={current} onStepChange={setCurrent} />
      <StepPanels current={current}>
        <p className="text-sm text-muted-foreground">Atelier Brun, Lyon: their contact is Léa Brun.</p>
        <p className="text-sm text-muted-foreground">Two boxes of paper, a stapler and a box of pens.</p>
        <DescriptionList
          boxed
          items={[
            { term: 'Customer', details: 'Atelier Brun, Lyon' },
            { term: 'Items', details: '4 lines, 1,840.00 €' },
            { term: 'Delivery', details: 'By courier, before noon' },
          ]}
        />
      </StepPanels>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={current === 0 || sending} onClick={() => setCurrent((step) => step - 1)}>
          Back
        </Button>
        {current < STEPS.length - 1 ? (
          <Button size="sm" onClick={() => setCurrent((step) => step + 1)}>
            Next
          </Button>
        ) : (
          <Button size="sm" isLoading={sending} loadingText="Sending" onClick={send}>
            Send the quote
          </Button>
        )}
      </div>
    </div>
  )
}
