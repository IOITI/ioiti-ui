import { Button, VelocityToast } from 'ioiti-ui'
import type { VelocityToastPosition } from 'ioiti-ui'
import { useState } from 'react'

const POSITIONS: VelocityToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']

export default function VelocityToastPositions() {
  const [position, setPosition] = useState<VelocityToastPosition>('bottom-center')
  const [open, setOpen] = useState(false)
  return (
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
      <VelocityToast
        key={position}
        open={open}
        onDismiss={() => setOpen(false)}
        position={position}
        title="Label printed"
        description={`At the ${position} of the window.`}
        variant="success"
      />
    </div>
  )
}
