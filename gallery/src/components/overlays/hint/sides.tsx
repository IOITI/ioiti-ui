import { Button, Hint } from 'ioiti-ui'

export default function HintSides() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Hint key={side} side={side} content={`On the ${side}, or the other side where there is no room`}>
          <Button size="sm" variant="outline">
            {side}
          </Button>
        </Hint>
      ))}
    </div>
  )
}
