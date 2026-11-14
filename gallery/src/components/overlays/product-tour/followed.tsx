import { Button, ProductTour, ProgressBar } from 'ioiti-ui'
import type { TourCloseReason } from 'ioiti-ui'
import { useState } from 'react'

const STEPS = [
  { target: '#tour-delivery-address', title: 'Where it goes', body: 'The address the carrier reads: checked before the parcels leave.' },
  { target: '#tour-delivery-progress', title: 'How far it has come', body: 'Updated as the carrier scans each parcel.' },
  { target: '#tour-delivery-contact', title: 'Who to call', body: 'The driver’s number, from the morning it leaves.', placement: 'top' as const },
]

export default function ProductTourFollowed() {
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState(0)
  const [step, setStep] = useState<number | null>(null)
  const [ended, setEnded] = useState<TourCloseReason | null>(null)
  const take = (from: number) => {
    setStart(from)
    // onStepChange comes as the reader moves, not as it opens.
    setStep(from)
    setEnded(null)
    setOpen(true)
  }
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => take(0)}>
          From the start
        </Button>
        <Button size="sm" variant="outline" onClick={() => take(1)}>
          From its second step
        </Button>
        <span className="text-sm text-muted-foreground">
          {open && step !== null ? `Step ${step + 1} of ${STEPS.length}` : ended ? `Ended: ${ended}` : 'Not started'}
        </span>
      </div>
      <div className="grid w-full max-w-lg gap-3 rounded-2xl border border-border p-4 text-sm">
        <div id="tour-delivery-address">
          <p className="font-medium">Delivery DL-310</p>
          <p className="text-muted-foreground">12 rue des Tanneurs, 69002 Lyon</p>
        </div>
        <div id="tour-delivery-progress">
          <ProgressBar label="Parcels scanned" value={2} max={3} valueText="2 of 3" size="sm" />
        </div>
        <p id="tour-delivery-contact" className="text-muted-foreground">
          Driver: +33 4 00 00 00 00
        </p>
      </div>
      {/* A click on the dimmed page ends it too (closeOnOverlayClick): dismiss. */}
      <ProductTour
        open={open}
        startAt={start}
        closeOnOverlayClick
        onStepChange={setStep}
        onClose={(reason) => {
          setOpen(false)
          setStep(null)
          setEnded(reason)
        }}
        steps={STEPS}
      />
    </div>
  )
}
