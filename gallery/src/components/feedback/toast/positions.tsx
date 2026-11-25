import { Button, Toast } from 'ioiti-ui'
import type { ToastPosition } from 'ioiti-ui'
import { useState } from 'react'

const POSITIONS: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']

export default function ToastPositions() {
  const [position, setPosition] = useState<ToastPosition>('bottom-center')
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
      <Toast
        key={position}
        open={open}
        onDismiss={() => setOpen(false)}
        position={position}
        title="Label printed"
        description={`At the ${position} of the window.`}
        tone="success"
      />
    </div>
  )
}
