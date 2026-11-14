import { Button, Switch, UndoToast } from 'ioiti-ui'
import type { UndoToastPosition } from 'ioiti-ui'
import { useState } from 'react'

const POSITIONS: UndoToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']

export default function UndoToastPositions() {
  const [position, setPosition] = useState<UndoToastPosition>('bottom-center')
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(true)
  return (
    <div className="flex flex-col items-start gap-4">
      <Switch label="Countdown bar" description="Without it, the time still runs out" checked={progress} onChange={setProgress} />
      <div className="grid max-w-md grid-cols-3 gap-2">
        {POSITIONS.map((each) => (
          <Button
            key={each}
            size="sm"
            variant={open && position === each ? 'secondary' : 'outline'}
            onClick={() => {
              setPosition(each)
              setOpen(true)
            }}
          >
            {each}
          </Button>
        ))}
      </div>
      {/* A new place, a new toast: its time starts again. */}
      <UndoToast
        key={position}
        open={open}
        position={position}
        showProgress={progress}
        title="Address removed"
        description={`At the ${position} of the window`}
        duration={6000}
        onDismiss={() => setOpen(false)}
      />
    </div>
  )
}
